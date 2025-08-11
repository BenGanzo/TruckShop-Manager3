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
      // Force refresh of the token to get the latest claims
      await user.getIdToken(true);
      const res = await user.getIdTokenResult();
      setCompanyId((res.claims as any)?.companyId ?? null);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return companyId;
}
