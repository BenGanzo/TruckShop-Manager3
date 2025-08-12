'use client';

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function SetClaimsDebugPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [outputText, setOutputText] = useState('');
  const companyId = 'angulo-transportation';
  const role = 'Admin';

  const assignMe = async () => {
    setOutputText('');
    try {
      setStatus('loading');
      const auth = getAuth(app);
      const u = auth.currentUser;
      if (!u) {
        setStatus('error');
        setOutputText('No hay usuario autenticado. Inicia sesión primero.');
        return;
      }
      const token = await u.getIdToken();

      const res = await fetch(
        `/api/auth/set-claims?companyId=${encodeURIComponent(companyId)}&role=${encodeURIComponent(role)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resJson = await res.json();
      setOutputText(JSON.stringify(resJson, null, 2));


      if (!res.ok) {
        console.error('set-claims error:', resJson);
        setStatus('error');
        return;
      }

      await u.getIdToken(true);
      setStatus('ok');
    } catch (e: any) {
      console.error(e);
      setStatus('error');
      setOutputText(e?.message || 'Fallo inesperado');
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 720, margin: 'auto' }}>
      <h2>Grant claims (temporal)</h2>
      <p>Esta página asigna un company y un role al usuario actualmente autenticado.</p>

      <p>
        <button
          onClick={assignMe}
          disabled={status === 'loading'}
          style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer', border: '1px solid #ccc', background: '#f0f0f0' }}
        >
          {status === 'loading' ? 'Asignando...' : `Asignarme companyId=${companyId}, role=${role}`}
        </button>
      </p>

      <h3>Estado: {status}</h3>
      
      {outputText && (
         <pre style={{ background: '#eee', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {outputText}
        </pre>
      )}

      {status === 'ok' && (
         <p style={{ color: 'green', fontWeight: 'bold' }}>¡Claims asignados! Ya puedes recargar la página principal.</p>
      )}

      <p style={{marginTop: '1rem'}}>Luego recarga la página principal (dashboard) para que los cambios surtan efecto.</p>
    </div>
  );
}
