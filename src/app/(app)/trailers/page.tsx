
'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import type { Trailer } from '@/lib/types';

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
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') {
      return 'angulo-transportation';
  }
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};


export default function TrailersPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const trailersCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'trailers') : null;
  const [trailersSnapshot, loading, error] = useCollection(trailersCollectionRef);

  const trailers = trailersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trailer)) || [];
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrailers = useMemo(() => {
    if (!searchQuery) return trailers;
    const query = searchQuery.toLowerCase();
    return trailers.filter(trailer => 
        trailer.id?.toLowerCase().includes(query) ||
        trailer.make?.toLowerCase().includes(query) ||
        trailer.model?.toLowerCase().includes(query) ||
        trailer.vin?.toLowerCase().includes(query)
    );
  }, [trailers, searchQuery]);

  const activeTrailersCount = useMemo(() => {
    return trailers.filter(t => t.isActive).length;
  }, [trailers]);


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
              Active count: {loading ? <Skeleton className="h-5 w-5 inline-block" /> : activeTrailersCount}
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trailers by ID, make, model, or VIN..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                {loading || userLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                     <TableRow key={`trailer-skel-${i}`}>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-destructive">
                            Error loading trailers: {error.message}
                        </TableCell>
                    </TableRow>
                ) : filteredTrailers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchQuery ? 'No trailers match your search.' : 'No trailers found. Add your first trailer to get started.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrailers.map((trailer) => (
                    <TableRow key={trailer.id}>
                      <TableCell className="font-medium">{trailer.id}</TableCell>
                      <TableCell>{trailer.trailerType || 'N/A'}</TableCell>
                      <TableCell>{trailer.make || 'N/A'}</TableCell>
                      <TableCell>{trailer.model || 'N/A'}</TableCell>
                      <TableCell>{trailer.makeYear || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trailer.isActive
                              ? 'active'
                              : 'destructive'
                          }
                        >
                          {trailer.isActive ? 'Active' : 'Inactive'}
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
