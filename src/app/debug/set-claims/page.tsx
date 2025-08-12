// src/app/debug/set-claims/page.tsx
'use client';

import { useState } from 'react';
import { auth, app } from '@/lib/firebase';

const DEFAULT_COMPANY_ID = 'angulo-transportation';
const DEFAULT_ROLE = 'Admin';

export default function SetClaimsDebugPage() {
  const [status, setStatus] = useState<'idle'|'working'|'done'|'error'>('idle');
  const [message, setMessage] = useState('');

  const assignClaims = async () => {
    try {
      setStatus('working'); setMessage('Asignando claims…');

      console.log('apps ok? app.name =', app.name); // debe imprimir "[DEFAULT]"

      const u = auth.currentUser;
      if (!u) { setStatus('error'); setMessage('No hay usuario autenticado'); return; }

      const token = await u.getIdToken(); // sin refresh, luego refrescamos
      const res = await fetch('/api/auth/set-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId: DEFAULT_COMPANY_ID, role: DEFAULT_ROLE }),
      });

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) throw new Error(data?.error || text || `HTTP ${res.status}`);

      await u.getIdToken(true); // refresca para traer los claims
      setStatus('done');
      setMessage('OK. Claims asignados. Recarga la app o cierra sesión y vuelve a entrar.');
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Error asignando claims');
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Grant claims (temporal)</h1>
      <p>Asigna <code>companyId</code> y <code>role</code> al usuario logueado.</p>

      <p><strong>Asignarme</strong> <code>companyId=angulo-transportation</code>, <code>role=Admin</code></p>

      <button onClick={assignClaims} style={{ padding: '8px 14px', border: '1px solid #ccc', borderRadius: 8 }}>
        Asignarme…
      </button>

      <div style={{ marginTop: 16, fontFamily: 'monospace' }}>
        <div>estado: <strong>{status}</strong></div>
        <div>{message}</div>
      </div>
    </main>
  );
}
