'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

const DEFAULT_COMPANY_ID = 'angulo-transportation';
const DEFAULT_ROLE = 'Admin';

export default function SetClaimsDebugPage() {
  const [status, setStatus] = useState<'idle'|'working'|'done'|'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const assignClaims = async () => {
    try {
      setStatus('working'); setMessage('Asignando claims…');
      const auth = getAuth(app);
      const u = auth.currentUser;
      if (!u) { setStatus('error'); setMessage('No hay usuario autenticado'); return; }

      const token = await u.getIdToken(); // sin refresh, para no forzar doble verificación
      const res = await fetch('/api/auth/set-claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ companyId: DEFAULT_COMPANY_ID, role: DEFAULT_ROLE }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      // fuerza refresh para traer los claims recién puestos
      await u.getIdToken(true);

      setStatus('done');
      setMessage('OK. Claims asignados. Cierra sesión y entra de nuevo, o simplemente recarga.');
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Error asignando claims');
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Grant claims (temporal)</h1>
      <p>Esta página asigna <code>companyId</code> y <code>role</code> al usuario logueado.</p>
      <p>
        <strong>Asignarme</strong> <code>companyId={DEFAULT_COMPANY_ID}</code>, <code>role={DEFAULT_ROLE}</code>
      </p>

      <button
        onClick={assignClaims}
        style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer' }}
      >
        Asignarme…
      </button>

      <div style={{ marginTop: 16, fontFamily: 'monospace' }}>
        <div>estado: <strong>{status}</strong></div>
        <div>{message}</div>
      </div>

      <p style={{ marginTop: 24 }}>
        Luego recarga la app o cierra sesión y vuelve a entrar.
      </p>
    </main>
  );
}
