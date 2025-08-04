
'use client';

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
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Placeholder data - in the future, this will come from Firestore
const users = [
    {
        id: 'user-1',
        name: 'Benjamin G.',
        email: 'benjamin.g@example.com',
        role: 'Admin',
        status: 'Active'
    },
    {
        id: 'user-2',
        name: 'John Doe',
        email: 'john.d@example.com',
        role: 'Mechanic',
        status: 'Active'
    },
    {
        id: 'user-3',
        name: 'Jane Smith',
        email: 'jane.s@example.com',
        role: 'Mechanic',
        status: 'Inactive'
    }
];


export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Users</h1>
            <p className="mt-2 text-muted-foreground">Manage application users and their roles.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                         <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Badge variant={user.status === 'Active' ? 'active' : 'destructive'}>
                                    {user.status}
                                </Badge>
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
