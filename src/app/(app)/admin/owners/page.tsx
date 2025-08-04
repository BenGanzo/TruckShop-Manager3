

'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

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
import { Pencil, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function AdminCompaniesPage() {
  const db = getFirestore(app);
  const [companiesSnapshot, loading, error] = useCollection(collection(db, 'mainCompanies'));

  const companies = companiesSnapshot?.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to JavaScript Date
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null;
    return {
      id: doc.id,
      ...data,
      createdAt,
    };
  }) || [];

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Companies</h1>
          <p className="mt-2 text-muted-foreground">Manage all company accounts using the software.</p>
        </div>
        <Button asChild>
          <Link href="/admin/create-company">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>A list of all registered company accounts.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Company ID</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={`sklton-${i}`}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                       <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                   <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-destructive">
                      Error loading companies: {error.message}
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No companies found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.companyName || 'N/A'}</TableCell>
                      <TableCell className="font-mono text-xs">{company.companyId || 'N/A'}</TableCell>
                      <TableCell>{company.contactName || 'N/A'}</TableCell>
                      <TableCell>{company.phone1 || 'N/A'}</TableCell>
                      <TableCell>{formatDate(company.createdAt)}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="icon">
                           <Link href={`/admin/owners/${company.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Company</span>
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

