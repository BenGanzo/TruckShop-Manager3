
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, getFirestore, doc } from 'firebase/firestore';
import { auth, app } from '@/lib/firebase';
import * as React from 'react';

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
  Copy,
  PlusCircle,
  Search,
  Trash2,
  XCircle,
  Pencil,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { assignTrucksToOwner } from '@/app/actions';
import { Label } from '@/components/ui/label';


// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') {
      return 'angulo-transportation';
  }
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};


export default function TrucksPage() {
  const [user, userLoading] = useAuthState(auth);
  const { toast } = useToast();
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const trucksCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'trucks') : null;
  const [trucksSnapshot, loading, error] = useCollection(trucksCollectionRef);
  
  const ownersCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'owners') : null;
  const [ownersSnapshot, ownersLoading] = useCollection(ownersCollectionRef);

  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set());
  const [selectedOwner, setSelectedOwner] = useState<string>('');

  const trucks = trucksSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
  const owners = ownersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
  const activeTrucks = trucks.filter((truck: any) => truck.isActive);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allTruckIds = new Set(trucks.map(t => t.id));
      setSelectedTrucks(allTruckIds);
    } else {
      setSelectedTrucks(new Set());
    }
  };

  const handleSelectTruck = (truckId: string, checked: boolean) => {
    const newSelection = new Set(selectedTrucks);
    if (checked) {
      newSelection.add(truckId);
    } else {
      newSelection.delete(truckId);
    }
    setSelectedTrucks(newSelection);
  };
  
  const handleAssign = async () => {
    if (selectedTrucks.size === 0 || !selectedOwner || !companyId) {
        toast({
            variant: 'destructive',
            title: 'Assignment Failed',
            description: 'Please select at least one truck and an owner to assign them to.'
        });
        return;
    }

    const result = await assignTrucksToOwner(companyId, Array.from(selectedTrucks), selectedOwner);

    if (result.success) {
        toast({
            title: 'Success!',
            description: `${selectedTrucks.size} truck(s) have been assigned to the owner.`
        });
        setSelectedTrucks(new Set());
        setSelectedOwner('');
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error || 'An unknown error occurred.'
        });
    }
  };

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
            {ownersLoading ? <Skeleton className="h-8 w-full" /> : 
                owners.map((owner: any) => (
                    <div key={owner.id} className="flex items-center justify-between pl-2 pr-1 rounded-md hover:bg-muted">
                        <Button variant="ghost" className="justify-start gap-2 px-0 flex-1">
                            <Building className="h-4 w-4" />
                            <span className="truncate">{owner.ownerName} ({trucks.filter((t: any) => t.ownerId === owner.id).length})</span>
                        </Button>
                         <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    </div>
                ))
            }
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
               <div className="p-4 border-t border-b bg-muted/50 flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTrucks(new Set())} disabled={selectedTrucks.size === 0}>
                    <XCircle className="mr-2"/>
                    Clear all ({selectedTrucks.size})
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Trash2 className="mr-2"/>
                    Delete selected
                  </Button>
                  <div className="flex items-center gap-2 ml-auto">
                    <Label>Copy selected to:</Label>
                    <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Select Owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map((owner: any) => (
                           <SelectItem key={owner.id} value={owner.id}>{owner.ownerName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleAssign} disabled={selectedTrucks.size === 0 || !selectedOwner}>
                        <Copy className="mr-2"/>
                        Copy
                    </Button>
                  </div>
               </div>
              <div className="rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                         <Checkbox 
                            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                            checked={selectedTrucks.size === trucks.length && trucks.length > 0}
                            aria-label="Select all"
                         />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Loading trucks...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-destructive">
                          Error loading trucks: {error.message}
                        </TableCell>
                      </TableRow>
                    ) : trucks.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No trucks found. Add your first truck to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      trucks.map((truck: any) => (
                        <TableRow key={truck.id} data-state={selectedTrucks.has(truck.id) && "selected"}>
                          <TableCell>
                            <Checkbox 
                                onCheckedChange={(checked) => handleSelectTruck(truck.id, Boolean(checked))}
                                checked={selectedTrucks.has(truck.id)}
                                aria-label={`Select truck ${truck.id}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{truck.id}</TableCell>
                          <TableCell>{truck.make}</TableCell>
                          <TableCell>{truck.model}</TableCell>
                          <TableCell>{owners.find(o => o.id === truck.ownerId)?.ownerName || 'N/A'}</TableCell>
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
