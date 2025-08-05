
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
import { Pencil, PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '@/lib/firebase';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) {
      return 'angulo-transportation';
  }
  const domain = email.split('@[1]');
  return domain ? domain.split('.')[0] : '';
};

export default function OwnersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const ownersCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'owners') : null;
  const [ownersSnapshot, loading, error] = useCollection(ownersCollectionRef);

  const owners = ownersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Users />
            Owners
          </h1>
          <p className="text-muted-foreground">
            Manage all fleet owners.
          </p>
        </div>
        <Button asChild>
          <Link href="/owners/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Owner
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Owners</CardTitle>
           <CardDescription>A list of all registered owners.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>Contact Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {loading || userLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={`sklton-${i}`}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
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
                    owners.map((owner: any) => (
                      <TableRow key={owner.id}>
                        <TableCell className="font-medium">{owner.ownerName}</TableCell>
                        <TableCell>{`${owner.contactFirstName || ''} ${owner.contactLastName || ''}`.trim() || 'N/A'}</TableCell>
                        <TableCell>{owner.phone || 'N/A'}</TableCell>
                        <TableCell>{owner.email || 'N/A'}</TableCell>
                        <TableCell>
                           <Button asChild variant="ghost" size="icon">
                               <Link href={`/owners/${owner.id}`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Owner</span>
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
