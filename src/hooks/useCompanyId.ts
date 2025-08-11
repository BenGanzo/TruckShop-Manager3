'use client';
import { useEffect, useState } from 'react';
import { getAuth, onIdTokenChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) { 
        setCompanyId(null); 
        return; 
      }
      // It's not strictly necessary to force refresh here on every change,
      // as onIdTokenChanged fires when it does change.
      // But for ensuring claims are fresh after login, it can be useful.
      const res = await user.getIdTokenResult(true); 
      setCompanyId((res.claims as any)?.companyId ?? null);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return companyId;
}
