import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const HOUSE_EDGE = 0.03;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmacSha256(secret, message) {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

function normalizeNonce(value) {
  const nonce = Number(value);

  if (!Number.isInteger(nonce) || nonce < 1) {
    throw new Error('Invalid nonce. Nonce must be a positive integer.');
  }

  return nonce;
}

function calculateCrashPoint(hash) {
  // First 52 bits from hash.
  const hex52 = hash.slice(0, 13);
  const h = BigInt(`0x${hex52}`);
  const e = 2n ** 52n;

  // 3% instant crash house edge.
  if (h % 33n === 0n) {
    return 1.0;
  }

  const numerator = 100n * e - h;
  const denominator = e - h;

  const result = Number(numerator / denominator) / 100;

  return Math.max(1.0, Math.floor(result * 100) / 100);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const nonce = normalizeNonce(searchParams.get('nonce') || '1');

    const serverSeed = process.env.GAME_SERVER_SEED;
    const clientSeed =
      searchParams.get('clientSeed') ||
      process.env.GAME_CLIENT_SEED ||
      'jetpesa_client_seed_prod_anchor';

    if (!serverSeed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing GAME_SERVER_SEED environment variable.',
        },
        { status: 500 }
      );
    }

    const serverSeedHash = sha256(serverSeed);
    const roundInput = `${clientSeed}:${nonce}`;
    const roundHash = hmacSha256(serverSeed, roundInput);
    const crashPoint = calculateCrashPoint(roundHash);

    return NextResponse.json({
      success: true,
      nonce,
      clientSeed,
      serverSeedHash,
      roundHash,
      crashPoint,
      algorithm: 'HMAC_SHA256',
      houseEdge: HOUSE_EDGE,
      verifyInput: roundInput,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
