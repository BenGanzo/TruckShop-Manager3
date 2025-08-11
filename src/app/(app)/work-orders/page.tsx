'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, where, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useCompanyId } from '@/hooks/useCompanyId';
// ...tus imports de UI

export default function WorkOrdersPage() {
  const db = getFirestore(app);
  const companyId = useCompanyId();                 // ← claims

  const woRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'workOrders') : null),
    [db, companyId]
  );

  // ajusta el query a tu UI (ejemplos: orderBy, where, etc.)
  const woQuery = useMemo(
    () => (woRef ? query(woRef, orderBy('createdAt', 'desc')) : null),
    [woRef]
  );

  const [woSnap, loading, error] = useCollection(woQuery);
  const workOrders = woSnap?.docs.map(d => ({ id: d.id, ...d.data() })) ?? [];

  const isLoading = !companyId || loading;

  // ...tu JSX (usa `workOrders`)
}
