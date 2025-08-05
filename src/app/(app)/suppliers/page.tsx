
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '@/lib/firebase';
import type { Supplier } from '@/lib/types';

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
import { PlusCircle, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

export default function SuppliersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const suppliersRef = companyId ? collection(db, 'mainCompanies', companyId, 'suppliers') : null;
  const suppliersQuery = suppliersRef ? query(suppliersRef, orderBy('createdAt', 'desc')) : null;
  const [suppliersSnapshot, loading, error] = useCollection(suppliersQuery);

  const suppliers: Supplier[] = suppliersSnapshot?.docs.map(doc => ({ ...doc.data() } as Supplier)) || [];
  const isLoading = userLoading || loading;

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
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`sklton-${i}`}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                     <TableRow><TableCell colSpan={5} className="h-24 text-center text-destructive">Error: {error.message}</TableCell></TableRow>
                  ) : suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No suppliers found. Add one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{`${supplier.contactFirstName || ''} ${supplier.contactLastName || ''}`.trim() || 'N/A'}</TableCell>
                        <TableCell>{supplier.phone || 'N/A'}</TableCell>
                        <TableCell>{supplier.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Button asChild variant="ghost" size="icon" disabled>
                            <Link href={`/suppliers/${supplier.id}`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit Supplier</span>
                            </Link>
                          </Button>
                        </TableCell>
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
