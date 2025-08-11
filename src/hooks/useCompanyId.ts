'use client';
import { useEffect, useState } from 'react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onIdTokenChanged(auth, async (user) => {
      if (!user) { setCompanyId(null); return; }
      const res = await user.getIdTokenResult(true);
      console.log('claims', res.claims);
      setCompanyId((res.claims as any)?.companyId ?? null);
    });
    return () => unsub();
  }, []);
  return companyId;
}
