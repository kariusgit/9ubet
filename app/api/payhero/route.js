import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { amount, phone, username } = await request.json();

        // 1. Fire STK Push to PayHero Engine securely from the server-side
        const payheroRes = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${process.env.PAYHERO_API_KEY}`).toString('base64')
            },
            body: JSON.stringify({
                amount: Math.floor(amount),
                phone_number: phone,
                channel_id: parseInt(process.env.PAYHERO_CHANNEL_ID),
                provider: "m-pesa",
                external_reference: `JP-${username}-${Date.now()}`
            })
        });

        const data = await payheroRes.json();

        if (data.success) {
            // 2. Optional: If using Vercel KV, credit the user database here directly:
            // await kv.hincrby(`user:${username}`, 'balance', amount);
            return NextResponse.json({ success: true, message: "STK Prompt Dispatched" });
        }

        return NextResponse.json({ success: false, message: data.message || "Gateway rejection" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
