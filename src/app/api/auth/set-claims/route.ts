// src/app/api/auth/set-claims/route.ts
import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // importante, no Edge

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = (decoded.email || '').toLowerCase();

    const db = getFirestore();
    const snap = await db.collectionGroup('users').where('id', '==', uid).limit(1).get();
    if (snap.empty) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });

    const userDoc = snap.docs[0];
    const companyId = userDoc.ref.parent.parent!.id; // mainCompanies/{companyId}
    const data = userDoc.data() as { role?: string; isActive?: boolean };

    if (!data.isActive) return NextResponse.json({ error: 'User is not active' }, { status: 403 });

    await admin.auth().setCustomUserClaims(uid, {
      companyId,
      role: data.role || 'user',
      isActive: true,
      email,
    });

    return NextResponse.json({ ok: true, companyId, role: data.role || 'user' });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
  
}
export async function GET() {
    return NextResponse.json({ ok: true });
  }
