'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useCompanyId } from '@/hooks/useCompanyId';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { WorkOrder } from '@/lib/types';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkOrdersPage() {
  const db = getFirestore(app);
  const companyId = useCompanyId();

  const woRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'workOrders') : undefined),
    [db, companyId]
  );

  const woQuery = useMemo(
    () => (woRef ? query(woRef, orderBy('createdAt', 'desc')) : undefined),
    [woRef]
  );

  const [woSnap, loading, error] = useCollection(woQuery);
  
  const workOrders: (WorkOrder & { id: string })[] = useMemo(() => {
    if (!woSnap) return [];
    return woSnap.docs.map((s: QueryDocumentSnapshot<DocumentData>) => {
      const data = s.data();
      return {
          ...data,
          id: s.id,
          arrivalDate: data.arrivalDate instanceof Timestamp ? data.arrivalDate.toDate() : new Date(),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      } as (WorkOrder & { id: string });
    });
  }, [woSnap]);

  const isLoading = !companyId || loading;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'in-progress': return 'secondary';
      case 'completed': return 'active';
      case 'closed': return 'active';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Work Orders</h1>
        <Button asChild>
          <Link href="/work-orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">Manage all your work orders here.</p>
       <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
           <CardDescription>A list of all work orders.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>WO #</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Arrival Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({length: 3}).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-destructive">Error: {error.message}</TableCell></TableRow>
                  ) : workOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No work orders found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workOrders.map(wo => (
                      <TableRow key={wo.id}>
                         <TableCell className="font-medium">
                            <Button asChild variant="link" className="p-0 h-auto font-medium">
                              <Link href={`/work-orders/${wo.id}`}>{wo.id}</Link>
                            </Button>
                         </TableCell>
                         <TableCell>{wo.vehicleId}</TableCell>
                         <TableCell><Badge variant={getStatusVariant(wo.status)}>{wo.status}</Badge></TableCell>
                         <TableCell>{wo.arrivalDate ? format(wo.arrivalDate, 'MMM dd, yyyy') : 'N/A'}</TableCell>
                         <TableCell className="text-right">${wo.total?.toFixed(2) ?? '0.00'}</TableCell>
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
