// src/app/debug/set-claims/page.tsx
'use client';

import { useState } from 'react';
import { auth, app } from '@/lib/firebase';
import type { IdTokenResult } from 'firebase/auth';

const DEFAULT_COMPANY_ID = 'angulo-transportation';
const DEFAULT_ROLE = 'Admin';

// Nuevo componente para ver los claims
function ViewClaimsButton() {
  const [out, setOut] = useState('Haz clic para ver los claims actuales...');

  const viewClaims = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setOut('No hay usuario autenticado.');
        return;
      }

      // El 'true' fuerza el refresco del token para obtener los claims más recientes del servidor
      const res: IdTokenResult = await user.getIdTokenResult(true);
      const claims = res.claims;
      
      console.log('claims', claims);

      const { companyId, role, ...otherClaims } = claims;
      
      const claimsToShow = {
        companyId,
        role,
        ...otherClaims,
      }
      
      setOut(JSON.stringify(claimsToShow, null, 2));

    } catch (e: any) {
      console.error(e);
      setOut('Error: ' + (e?.message || String(e)));
    }
  };

  return (
    <div style={{ marginTop: 24, borderTop: '1px solid #ccc', paddingTop: 24 }}>
      <button 
        onClick={viewClaims}
        style={{ padding: '8px 14px', border: '1px solid #ccc', borderRadius: 8, cursor: 'pointer' }}
      >
        Ver mis claims
      </button>
      <pre style={{ marginTop: 16, whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
        {out}
      </pre>
    </div>
  );
}


export default function SetClaimsDebugPage() {
  const [status, setStatus] = useState<'idle'|'working'|'done'|'error'>('idle');
  const [message, setMessage] = useState('');

  const assignClaims = async () => {
    try {
      setStatus('working'); setMessage('Asignando claims…');
      console.log('apps ok? app.name =', app.name);

      const u = auth.currentUser;
      if (!u) { setStatus('error'); setMessage('No hay usuario autenticado'); return; }

      const token = await u.getIdToken(); // sin refresh
      const res = await fetch('/api/auth/set-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ companyId: DEFAULT_COMPANY_ID, role: DEFAULT_ROLE }),
      });

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch {}
      if (!res.ok) throw new Error(data?.error || text || `HTTP ${res.status}`);

      await u.getIdToken(true); // refrescar claims
      setStatus('done');
      setMessage('OK. Claims asignados. Ahora puedes verificarlos con el botón de abajo.');
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

      <ViewClaimsButton />
    </main>
  );
}
