
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Printer } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseOrdersPage() {
  const purchaseOrders: any[] = [];
  
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Purchase Orders</h1>
        <div>
          {/* A placeholder ID is used here. This should be dynamic in a real app. */}
          <Button asChild variant="outline" className="mr-2">
            <Link href="/purchase-orders/PO-2024-001/print">
              <Printer className="mr-2 h-4 w-4" />
              Print PO
            </Link>
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        </div>
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
                      <TableHead>Created Date</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No purchase orders found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                       <TableCell>PO-1</TableCell>
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
