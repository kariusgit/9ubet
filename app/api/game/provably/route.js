import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const nonce = searchParams.get('nonce') || 1;

    // Generate server-hidden random salt chain string
    const serverSeed = process.env.GAME_SERVER_SEED || crypto.randomBytes(32).toString('hex');
    const clientSeed = "jetpesa_client_seed_prod_2026";

    // Standard Cryptographic Hmac-SHA256 Math
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}-${nonce}`);
    const hash = hmac.digest('hex');

    // Parse bytes to match Spribe calculations
    let parsedInt = parseInt(hash.substring(0, 13), 16);
    if (parsedInt % 33 === 0) {
        return NextResponse.json({ hash: crypto.createHash('sha256').update(serverSeed).digest('hex'), crashPoint: 1.00 });
    }

    let multiplier = (100 * Math.pow(2, 52) - parsedInt) / (Math.pow(2, 52) - parsedInt) / 100;
    const finalCrashPoint = Math.max(1.00, parseFloat(multiplier.toFixed(2)));

    // Send the obscured secure public hash hash to the client frame
    const publicHash = crypto.createHash('sha256').update(serverSeed).digest('hex');

    return NextResponse.json({
        hash: publicHash,
        crashPoint: finalCrashPoint
    });
}
