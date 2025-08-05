
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore, query, orderBy, Timestamp } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { WorkOrder } from '@/lib/types';


// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') {
    return 'angulo-transportation';
  }
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};


export default function WorkOrdersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const workOrdersRef = companyId ? collection(db, 'mainCompanies', companyId, 'workOrders') : null;
  const workOrdersQuery = workOrdersRef ? query(workOrdersRef, orderBy('createdAt', 'desc')) : null;
  
  const [workOrdersSnapshot, loading, error] = useCollection(workOrdersQuery);

  const workOrders: WorkOrder[] = useMemo(() => {
    return workOrdersSnapshot?.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as WorkOrder;
    }) || [];
  }, [workOrdersSnapshot]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'closed':
            return 'active';
        case 'in-progress':
            return 'secondary';
        case 'on-hold':
            return 'destructive';
        default: // open
            return 'outline';
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Work Orders
          </h1>
          <p className="text-muted-foreground">
            Create and manage all work orders for your fleet.
          </p>
        </div>
        <Button asChild>
          <Link href="/work-orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Link>
        </Button>
      </div>

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
                      <TableHead>Problem</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {loading || userLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`wo-skel-${i}`}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-destructive">
                            Error loading work orders: {error.message}
                        </TableCell>
                    </TableRow>
                  ) : workOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No work orders found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workOrders.map((wo) => (
                      <TableRow key={wo.id}>
                        <TableCell className="font-medium">
                           <Button variant="link" asChild className="p-0 h-auto">
                              <Link href={`/work-orders/${wo.id}`}>{wo.id}</Link>
                           </Button>
                        </TableCell>
                        <TableCell>{wo.vehicleId}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(wo.status)}>
                                {wo.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{wo.problemDescription}</TableCell>
                        <TableCell>{formatDate(wo.createdAt)}</TableCell>
                        <TableCell className="text-right">${(wo.total || 0).toFixed(2)}</TableCell>
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
