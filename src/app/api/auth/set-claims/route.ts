import { NextResponse } from 'next/server';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { admin } from '@/lib/firebase-admin'; // Usa tu helper existente para inicializar admin

export async function POST(req: Request) {
  try {
    // La inicialización ocurre cuando se importa el módulo `admin`
    const authHeader = req.headers.get('Authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
    }

    const { companyId, role } = await req.json();
    if (!companyId || !role) {
      return NextResponse.json({ error: 'companyId and role are required' }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    await getAdminAuth().setCustomUserClaims(decoded.uid, { companyId, role, isActive: true });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Error setting claims:', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
