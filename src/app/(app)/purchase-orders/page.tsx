
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, orderBy, Timestamp } from 'firebase/firestore';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useCompanyId } from '@/hooks/useCompanyId';
import type { PurchaseOrder } from '@/lib/types';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function PurchaseOrdersPage() {
  const companyId = useCompanyId();
  const db = getFirestore(app);

  const poRef = useMemo(
      () => (companyId ? collection(db, 'mainCompanies', companyId, 'purchaseOrders') : undefined),
      [db, companyId]
  );
  const poQuery = useMemo(() => (poRef ? query(poRef, orderBy('createdAt', 'desc')) : undefined), [poRef]);
  const [poSnapshot, loading, error] = useCollection(poQuery);
  
  const purchaseOrders: (PurchaseOrder & { id: string })[] = useMemo(() => {
    if (!poSnapshot) return [];
    return poSnapshot.docs.map((s: QueryDocumentSnapshot<DocumentData>) => {
      const data = s.data();
      return {
          ...data,
          id: s.id,
          issueDate: data.issueDate instanceof Timestamp ? data.issueDate.toDate() : new Date(),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      } as (PurchaseOrder & { id: string });
    });
  }, [poSnapshot]);

  const isLoading = !companyId || loading;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ordered': return 'secondary';
      case 'completed': return 'active';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Purchase Orders</h1>
        <Button asChild>
          <Link href="/purchase-orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create PO
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">Manage your purchase orders here.</p>
       <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
           <CardDescription>A list of all purchase orders.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>PO #</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({length: 3}).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-destructive">Error: {error.message}</TableCell></TableRow>
                  ) : purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No purchase orders found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrders.map(po => (
                      <TableRow key={po.id}>
                         <TableCell className="font-medium">
                            <Button asChild variant="link" className="p-0 h-auto font-medium">
                              <Link href={`/purchase-orders/${po.id}/print`}>{po.id}</Link>
                            </Button>
                         </TableCell>
                         <TableCell>{po.supplierName}</TableCell>
                         <TableCell><Badge variant={getStatusVariant(po.status)}>{po.status}</Badge></TableCell>
                         <TableCell>{format(po.issueDate, 'MMM dd, yyyy')}</TableCell>
                         <TableCell className="text-right">${po.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
