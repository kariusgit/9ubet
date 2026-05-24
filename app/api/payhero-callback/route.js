import { NextResponse } from 'next/server';
import { adminDb, FieldValue } from '@/lib/firebaseAdmin';

export async function POST(request) {
  const body = await request.json();

  const reference =
    body.external_reference ||
    body.externalReference ||
    body.reference ||
    body.data?.external_reference;

  const status = String(
    body.status ||
    body.transaction_status ||
    body.data?.status ||
    ''
  ).toLowerCase();

  if (!reference) {
    return NextResponse.json({ received: true, message: 'Missing reference.' });
  }

  const docRef = adminDb.collection('deposits').doc(reference);
  const snap = await docRef.get();

  if (!snap.exists) {
    return NextResponse.json({ received: true, message: 'Transaction not found.' });
  }

  const tx = snap.data();

  const paid =
    status.includes('success') ||
    status.includes('complete') ||
    status.includes('paid');

  if (!paid) {
    await docRef.update({
      status: 'failed',
      failureReason: body.message || body.error || 'PayHero payment failed.',
      callbackBody: body,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ received: true });
  }

  if (!tx.credited) {
    await adminDb.runTransaction(async (transaction) => {
      transaction.update(docRef, {
        status: 'completed',
        credited: true,
        callbackBody: body,
        updatedAt: new Date().toISOString(),
      });

      transaction.update(adminDb.collection('users').doc(tx.userId), {
        walletBalance: FieldValue.increment(tx.amount),
      });
    });
  }

  return NextResponse.json({ received: true });
}
