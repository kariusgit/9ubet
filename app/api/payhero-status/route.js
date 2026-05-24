import { NextResponse } from 'next/server';
import { adminDb, FieldValue } from '../../../lib/firebaseAdmin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ success: false, message: 'Missing reference.' }, { status: 400 });
  }

  const snap = await adminDb.collection('deposits').doc(reference).get();

  if (!snap.exists) {
    return NextResponse.json({ success: false, message: 'Transaction not found.' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    ...snap.data(),
  });
}
