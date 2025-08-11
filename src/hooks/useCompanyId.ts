
'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';

async function refreshAndGetClaims(user: User) {
  try {
    const response = await fetch('/api/auth/set-claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    if (!response.ok) throw new Error('Failed to set claims on backend.');
    
    // Force refresh the token on the client to get the new claims
    await user.getIdToken(true); 
    const idTokenResult = await user.getIdTokenResult();
    return (idTokenResult.claims.companyId as string) || null;
  } catch (error) {
    console.error('Error refreshing and getting claims:', error);
    return null;
  }
}

export function useCompanyId(): string | null {
  const [user, loading] = useAuthState(auth);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isClaimsLoading, setIsClaimsLoading] = useState(true);

  useEffect(() => {
    const getCompany = async (currentUser: User) => {
      setIsClaimsLoading(true);
      const idTokenResult = await currentUser.getIdTokenResult();
      const currentCompanyId = (idTokenResult.claims.companyId as string) || null;

      if (currentCompanyId) {
        setCompanyId(currentCompanyId);
      } else {
        // If claims are not set, try to refresh them from the backend
        const newCompanyId = await refreshAndGetClaims(currentUser);
        setCompanyId(newCompanyId);
      }
      setIsClaimsLoading(false);
    };

    if (user) {
      getCompany(user);
    } else if (!loading) {
      // No user, not loading
      setCompanyId(null);
      setIsClaimsLoading(false);
    }
  }, [user, loading]);

  // While firebase auth is loading OR we are actively fetching claims, we return null.
  return loading || isClaimsLoading ? null : companyId;
}
