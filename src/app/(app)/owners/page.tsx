
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
import { PlusCircle, User, Users } from 'lucide-react';
import Link from 'next/link';

export default function OwnersPage() {
  // Placeholder data - in the future, this will come from Firestore
  const owners: any[] = [];

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
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No owners found. Add one to get started.
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
