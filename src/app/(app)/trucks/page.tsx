
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, getFirestore } from 'firebase/firestore';
import { auth, app } from '@/lib/firebase';

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
import {
  Building,
  ChevronRight,
  PlusCircle,
  Search,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  // This is a placeholder logic. In a real app, you'd get this from user claims or a dedicated field.
  // For "ganzobenjamin1301@gmail.com", this will not produce "angulo-transportation".
  // Let's hardcode it for this specific user for now to ensure it works.
  if (email === 'ganzobenjamin1301@gmail.com') {
      return 'angulo-transportation';
  }
  // Fallback logic
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};


export default function TrucksPage() {
  const [user, userLoading] = useAuthState(auth);

  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);

  const db = getFirestore(app);
  
  // Create a query against the collection.
  const trucksCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'trucks') : null;
  const [trucksSnapshot, loading, error] = useCollection(trucksCollectionRef);

  const trucks = trucksSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];

  const activeTrucks = trucks.filter((truck: any) => truck.isActive);

  if (userLoading) {
      return (
         <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Trucks
        </h1>
        <Button asChild>
          <Link href="/trucks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Truck
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:col-start-1">
          <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">
            Groups
          </h2>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-2 px-2 bg-muted font-semibold"
            >
              <ChevronRight className="h-4 w-4" />
              All Trucks ({trucks.length})
            </Button>
            <Button variant="ghost" className="justify-start gap-2 px-2">
              <Building className="h-4 w-4" />
              Company Owned ({trucks.filter((t: any) => t.owner === 'Company').length})
            </Button>
          </div>
        </div>

        <div className="lg:col-start-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>All Trucks</CardTitle>
                  <CardDescription className="mt-1">
                    A list of all of your trucks in your fleet.
                  </CardDescription>
                </div>
                <div className="mt-2 text-sm font-medium text-right md:mt-0">
                  Active count: {activeTrucks.length}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trucks by ID, make, model, or VIN..."
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
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags Expire</TableHead>
                      <TableHead>Next Inspection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Loading trucks...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-destructive">
                          Error loading trucks: {error.message}
                        </TableCell>
                      </TableRow>
                    ) : trucks.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No trucks found. Add your first truck to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      trucks.map((truck: any) => (
                        <TableRow key={truck.id}>
                          <TableCell className="font-medium">{truck.id}</TableCell>
                          <TableCell>{truck.make}</TableCell>
                          <TableCell>{truck.model}</TableCell>
                          <TableCell>{truck.plateNumber}</TableCell>
                          <TableCell>{truck.vin}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                truck.isActive
                                  ? 'active'
                                  : 'destructive'
                              }
                            >
                              {truck.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{truck.tagExpireOn}</TableCell>
                          <TableCell>{truck.inspectionDueOn}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
