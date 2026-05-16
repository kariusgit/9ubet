import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nonce = searchParams.get('nonce') || 1;

  const serverSeed = process.env.GAME_SERVER_SEED || "jetpesa_default_hidden_production_seed_string_chain_2026";
  const clientSeed = "jetpesa_client_seed_prod_anchor";

  const hmac = crypto.createHmac('sha256', serverSeed);
  hmac.update(`${clientSeed}-${nonce}`);
  const hash = hmac.digest('hex');

  let parsedInt = parseInt(hash.substring(0, 13), 16);
  
  // Implements standard 3% pure house margin instant cuts
  if (parsedInt % 33 === 0) {
    const publicHash = crypto.createHash('sha256').update(serverSeed).digest('hex');
    return NextResponse.json({ hash: publicHash, crashPoint: 1.00 });
  }

  let multiplier = (100 * Math.pow(2, 52) - parsedInt) / (Math.pow(2, 52) - parsedInt) / 100;
  const finalCrashPoint = Math.max(1.00, parseFloat(multiplier.toFixed(2)));
  const publicHash = crypto.createHash('sha256').update(serverSeed).digest('hex');

  return NextResponse.json({ hash: publicHash, crashPoint: finalCrashPoint });
}
