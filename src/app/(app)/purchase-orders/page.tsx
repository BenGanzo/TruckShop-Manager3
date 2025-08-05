
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore, query, orderBy, Timestamp } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import type { PurchaseOrder } from '@/lib/types';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Printer } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

export default function PurchaseOrdersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const poRef = companyId ? collection(db, 'mainCompanies', companyId, 'purchaseOrders') : null;
  const poQuery = poRef ? query(poRef, orderBy('createdAt', 'desc')) : null;
  const [poSnapshot, loading, error] = useCollection(poQuery);
  
  const purchaseOrders: PurchaseOrder[] = poSnapshot?.docs.map(doc => {
      const data = doc.data();
      return {
          ...data,
          id: doc.id,
          issueDate: data.issueDate instanceof Timestamp ? data.issueDate.toDate() : new Date(),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      } as PurchaseOrder;
  }) || [];

  const isLoading = userLoading || loading;

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
