// src/app/api/auth/set-claims/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    // Extract companyId and role from query parameters
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const role = searchParams.get('role');

    if (!companyId || !role) {
      return NextResponse.json({ error: 'Missing companyId or role query parameter' }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, {
      companyId: companyId,
      role: role,
      isActive: true, // Assuming the user should be active
    });

    return NextResponse.json({ ok: true, message: `Claims set for ${uid}: companyId=${companyId}, role=${role}` });

  } catch (e: any) {
    console.error('Error setting claims:', e);
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'API endpoint is active.' });
}
