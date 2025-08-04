
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';

// Placeholder data - in the future, this will come from Firestore
const trailers = [
  {
    id: 'A133',
    type: 'Reefer',
    make: 'UTILITY',
    model: 'REEFER',
    year: '2018',
    status: 'Active',
  },
  {
    id: 'D201',
    type: 'Dry Van',
    make: 'VANGUARD',
    model: 'DRYLINER',
    year: '2020',
    status: 'Inactive',
  },
];

export default function TrailersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Trailers
        </h1>
        <Button asChild>
          <Link href="/trailers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Trailer
          </Link>
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">Manage your trailer fleet here.</p>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>All Trailers</CardTitle>
              <CardDescription className="mt-1">
                A list of all of your trailers in your fleet.
              </CardDescription>
            </div>
            <div className="mt-2 text-sm font-medium text-right md:mt-0">
              Active count: {trailers.filter((t) => t.status === 'Active').length}
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trailers by ID, make, model, or VIN..."
              className="pl-8 w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trailers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No trailers found. Add your first trailer to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  trailers.map((trailer) => (
                    <TableRow key={trailer.id}>
                      <TableCell className="font-medium">{trailer.id}</TableCell>
                      <TableCell>{trailer.type}</TableCell>
                      <TableCell>{trailer.make}</TableCell>
                      <TableCell>{trailer.model}</TableCell>
                      <TableCell>{trailer.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trailer.status === 'Active'
                              ? 'active'
                              : 'destructive'
                          }
                        >
                          {trailer.status}
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
