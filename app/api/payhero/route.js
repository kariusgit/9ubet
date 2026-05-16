import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, phone, username } = await request.json();

    const usernamePH = process.env.PAYHERO_API_USERNAME;
    const passwordPH = process.env.PAYHERO_API_PASSWORD;
    const channelIdPH = process.env.PAYHERO_CHANNEL_ID;

    if (!usernamePH || !passwordPH || !channelIdPH) {
      return NextResponse.json({ success: false, message: "Missing system credentials inside Vercel Dashboard variables." }, { status: 500 });
    }

    // Generate accurate programmatic Basic Auth Header
    const authString = Buffer.from(`${usernamePH}:${passwordPH}`).toString('base64');

    const response = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`
      },
      body: JSON.stringify({
        amount: Math.floor(amount),
        phone_number: phone,
        channel_id: parseInt(channelIdPH),
        provider: "m-pesa",
        external_reference: `JP-WAGER-${username}-${Date.now()}`
      })
    });

    const data = await response.json();

    if (response.status === 201 || data.success) {
      return NextResponse.json({ success: true, reference: data.reference || "QUEUED" });
    }

    return NextResponse.json({ success: false, message: data.message || "PayHero processing exception error." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
