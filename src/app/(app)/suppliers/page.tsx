
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

export default function SuppliersPage() {
  // Placeholder data - in the future, this will come from Firestore
  const suppliers: any[] = [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Suppliers
          </h1>
          <p className="text-muted-foreground">
            Manage all your parts and service suppliers.
          </p>
        </div>
        <Button asChild>
          <Link href="/suppliers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
           <CardDescription>A list of all registered suppliers.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No suppliers found. Add one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></> // This will be mapped in the future
                  )}
                </TableBody>
              </Table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
