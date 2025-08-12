// src/app/api/auth/set-claims/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';          // Fuerza runtime Node (Admin SDK)
export const dynamic = 'force-dynamic';   // Evita caching en Studio/dev

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
    }

    const { companyId, role } = await req.json();
    if (!companyId || !role) {
      return NextResponse.json({ error: 'companyId and role are required' }, { status: 400 });
    }

    // ✅ Garantiza que el Admin App esté inicializado
    const adminApp = getAdminApp();

    // ✅ Usa el auth ligado al app explícito (no depende del "default")
    const adminAuth = getAuth(adminApp);

    const decoded = await adminAuth.verifyIdToken(idToken);
    await adminAuth.setCustomUserClaims(decoded.uid, { companyId, role, isActive: true });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Error setting claims:', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
