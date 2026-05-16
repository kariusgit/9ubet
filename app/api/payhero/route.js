import { NextResponse } from 'next/server';

// Helper to get Safaricom Daraja OAuth Access Token
async function getDarajaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) return null;

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  try {
    const res = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { "Authorization": `Basic ${auth}` }
    });
    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const { amount, phone, username } = await request.json();
    
    // 1. Dynamic Domain Resolution for Callbacks
    const { headers } = request;
    const host = headers.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // 2. Phone Number Normalization (Format: 254XXXXXXXXX)
    let cleanPhone = phone.trim().replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '254' + cleanPhone.substring(1);
    if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);

    // Load Primary Gateway (PayHero) Credentials
    const usernamePH = process.env.PAYHERO_API_USERNAME;
    const passwordPH = process.env.PAYHERO_API_PASSWORD;
    const channelIdPH = process.env.PAYHERO_CHANNEL_ID;

    let payheroSuccess = false;
    let fallbackTriggered = false;
    let reference = `JP-${Date.now()}`;

    // --- STRATEGY A: PRIMARY PAYHERO GATEWAY RUN ---
    if (usernamePH && passwordPH && channelIdPH) {
      const authString = Buffer.from(`${usernamePH}:${passwordPH}`).toString('base64');
      try {
        const phResponse = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${authString}`
          },
          body: JSON.stringify({
            amount: Math.floor(amount),
            phone_number: cleanPhone,
            channel_id: parseInt(channelIdPH),
            provider: "m-pesa",
            external_reference: reference,
            callback_url: `${baseUrl}/api/payhero-callback` // Dynamic fallback assignment
          })
        });
        const phData = await phResponse.json();
        if (phResponse.status === 201 || phData.success) {
          payheroSuccess = true;
          reference = phData.reference || reference;
        }
      } catch (e) {
        payheroSuccess = false;
      }
    }

    // --- STRATEGY B: DARAJA BUSINESS TILL DIRECT FAILSAFE RUN ---
    if (!payheroSuccess) {
      fallbackTriggered = true;
      const token = await getDarajaToken();
      
      if (token) {
        const timeStamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        
        // Target localized business environment credentials
        const storeNumber = process.env.MPESA_STORE_NUMBER; // Business ShortCode (Store Number)
        const tillNumber = process.env.MPESA_TILL_NUMBER;   // Party B (The actual Till receiving cash)
        const passKey = process.env.MPESA_PASSKEY;
        
        if (storeNumber && tillNumber && passKey) {
          // Password generation logic uses the Store Number as the BusinessShortCode
          const password = Buffer.from(`${storeNumber}${passKey}${timeStamp}`).toString('base64');
          
          const darajaRes = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              BusinessShortCode: storeNumber, // For Buy Goods Tills, use Store Number here
              Password: password,
              Timestamp: timeStamp,
              TransactionType: "CustomerBuyGoodsOnline", // Mandatory transaction context for Tills
              Amount: Math.floor(amount),
              PartyA: cleanPhone,
              PartyB: tillNumber, // For Buy Goods Tills, your Till Number goes here
              PhoneNumber: cleanPhone,
              CallBackURL: `${baseUrl}/api/daraja-callback`, // Dynamic path alignment
              AccountReference: `JetPesa-${username.substring(0, 5)}`,
              TransactionDesc: "Wager Wallet TopUp"
            })
          });
          
          const darajaData = await darajaRes.json();
          if (darajaData.ResponseCode === "0") {
            payheroSuccess = true;
            reference = darajaData.CheckoutRequestID;
          }
        }
      }
    }

    if (payheroSuccess) {
      return NextResponse.json({ 
        success: true, 
        reference, 
        fallback: fallbackTriggered,
        resolvedCallbackDomain: baseUrl 
      });
    }

    return NextResponse.json({ 
      success: false, 
      message: "Both Primary Gateway and Business Till Daraja paths returned integration exceptions." 
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
