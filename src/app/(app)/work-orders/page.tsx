
'use client';

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
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function WorkOrdersPage() {
  // Placeholder data - in the future, this will come from Firestore
  const workOrders: any[] = [];

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
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No work orders found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    // This part will be used when we have data
                    <TableRow>
                       <TableCell>WO-1</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
