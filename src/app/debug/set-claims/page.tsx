'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function SetClaimsDebug() {
  const [out, setOut] = useState('idle');

  const run = async () => {
    setOut('Running...');
    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      if (!user) {
        setOut('No user (inicia sesión primero).');
        return;
      }
      const idToken = await user.getIdToken(true); // fuerza refresh
      
      const res = await fetch(
        '/api/auth/set-claims?companyId=angulo-transportation&role=Admin',
        { 
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` } 
        }
      );

      const text = await res.text();
      setOut(`${res.status}: ${text}`);
      
      if (res.ok) {
        // refresca claims en el cliente
        await user.getIdToken(true);
        setOut(prev => prev + '\n\nClaims refreshed on client. Please reload the app.');
      }

    } catch (e: any) {
      setOut('Error: ' + (e?.message ?? String(e)));
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Grant claims (temporal)</h1>
      <p>This page assigns a company and role to your currently logged-in user.</p>
      <button 
        onClick={run} 
        style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer', marginTop: '12px' }}
      >
        Asignarme companyId=angulo-transportation, role=Admin
      </button>
      <pre style={{ marginTop: '12px', background: '#f0f0f0', padding: '16px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {out}
      </pre>
      <p style={{marginTop:12}}>Luego recarga la página principal o cierra sesión y vuelve a entrar.</p>
    </div>
  );
}
