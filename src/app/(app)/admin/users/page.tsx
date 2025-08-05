
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '@/lib/firebase';
import type { User } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
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

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

export default function AdminUsersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const usersRef = companyId ? collection(db, 'mainCompanies', companyId, 'users') : null;
  const [usersSnapshot, loading, error] = useCollection(usersRef);

  const users = usersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)) || [];

  const isLoading = userLoading || loading;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Users</h1>
            <p className="mt-2 text-muted-foreground">Manage application users and their roles.</p>
        </div>
        <Button asChild>
            <Link href="/admin/users/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
           <CardDescription>A list of all users with access to the account.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="rounded-md border-t">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`sklton-${i}`}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-destructive">
                            Error loading users: {error.message}
                        </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found. Add one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                         <TableRow key={user.id}>
                            <TableCell className="font-medium">{`${user.firstName || ''} ${user.lastName || ''}`.trim()}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Badge variant={user.isActive ? 'active' : 'destructive'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                             <TableCell>
                                <Button asChild variant="ghost" size="icon" disabled>
                                    <Link href={`/admin/users/${user.id}`}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit User</span>
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
