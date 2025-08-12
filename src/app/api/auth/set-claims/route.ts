import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const role = searchParams.get('role');

    if (!companyId || !role) {
      return new NextResponse('Missing companyId or role', { status: 400 });
    }

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return new NextResponse('Missing Authorization header', { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    await admin.auth().setCustomUserClaims(decoded.uid, {
      companyId,
      role,
      isActive: true, // Default to active when setting claims
    });

    return NextResponse.json({ ok: true, uid: decoded.uid, companyId, role });
  } catch (e: any) {
    console.error('set-claims failed:', e);
    return new NextResponse(JSON.stringify({ ok: false, error: e?.message || 'Internal error' }), { status: 500 });
  }
}
