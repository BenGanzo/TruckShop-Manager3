
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
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function AdminOwnersPage() {
  const db = getFirestore(app);
  const [ownersSnapshot, loading, error] = useCollection(collection(db, 'mainCompanies'));

  const owners = ownersSnapshot?.docs.map(doc => {
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
          <h1 className="text-3xl font-bold tracking-tight font-headline">Owners</h1>
          <p className="mt-2 text-muted-foreground">Manage all company/owner accounts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/create-company">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Owner
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Owners</CardTitle>
          <CardDescription>A list of all registered owner accounts.</CardDescription>
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
                    </TableRow>
                  ))
                ) : error ? (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-destructive">
                      Error loading owners: {error.message}
                    </TableCell>
                  </TableRow>
                ) : owners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No owners found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  owners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.companyName || 'N/A'}</TableCell>
                      <TableCell className="font-mono text-xs">{owner.companyId || 'N/A'}</TableCell>
                      <TableCell>{owner.contactName || 'N/A'}</TableCell>
                      <TableCell>{owner.phone1 || 'N/A'}</TableCell>
                      <TableCell>{formatDate(owner.createdAt)}</TableCell>
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
