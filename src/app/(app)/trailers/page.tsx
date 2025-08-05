
'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import type { Trailer } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Building, ChevronRight, XCircle, Trash2, Copy, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { assignTrailersToOwner } from '@/app/actions';
import { cn } from '@/lib/utils';

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
  const { toast } = useToast();
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const trailersCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'trailers') : null;
  const [trailersSnapshot, loading] = useCollection(trailersCollectionRef);
  
  const ownersCollectionRef = companyId ? collection(db, 'mainCompanies', companyId, 'owners') : null;
  const [ownersSnapshot, ownersLoading] = useCollection(ownersCollectionRef);

  const [selectedTrailers, setSelectedTrailers] = useState<Set<string>>(new Set());
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const trailers = trailersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trailer)) || [];
  const owners = ownersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() as { ownerName: string } })) || [];

  const filteredTrailers = useMemo(() => {
    let trailersByGroup = trailers;
    if (selectedGroup) {
      trailersByGroup = trailers.filter(t => t.ownerId === selectedGroup);
    }
    
    if (!searchQuery) return trailersByGroup;

    const query = searchQuery.toLowerCase();
    return trailersByGroup.filter(trailer => 
        trailer.id?.toLowerCase().includes(query) ||
        trailer.make?.toLowerCase().includes(query) ||
        trailer.model?.toLowerCase().includes(query) ||
        trailer.vin?.toLowerCase().includes(query)
    );
  }, [trailers, searchQuery, selectedGroup]);

  const activeTrailersCount = useMemo(() => trailers.filter(t => t.isActive).length, [trailers]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedTrailers(checked ? new Set(filteredTrailers.map(t => t.id)) : new Set());
  };

  const handleSelectTrailer = (trailerId: string, checked: boolean) => {
    const newSelection = new Set(selectedTrailers);
    if (checked) newSelection.add(trailerId);
    else newSelection.delete(trailerId);
    setSelectedTrailers(newSelection);
  };

  const handleAssign = async () => {
    if (selectedTrailers.size === 0 || !selectedOwner || !companyId) {
        toast({
            variant: 'destructive',
            title: 'Assignment Failed',
            description: 'Please select at least one trailer and an owner.'
        });
        return;
    }
    const result = await assignTrailersToOwner(companyId, Array.from(selectedTrailers), selectedOwner);
    if (result.success) {
        toast({
            title: 'Success!',
            description: `${selectedTrailers.size} trailer(s) have been assigned.`
        });
        setSelectedTrailers(new Set());
        setSelectedOwner('');
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const GroupButton = ({ id, name, icon, count, selected, onClick }: any) => (
    <div className={cn("flex items-start justify-between pl-2 pr-1 rounded-md", selected ? 'bg-green-500/20' : 'hover:bg-muted')}>
        <Button variant="ghost" className={cn("justify-start items-start gap-2 px-0 flex-1 h-auto min-h-9 py-1.5 text-left", selected && 'font-semibold')} onClick={onClick}>
            <span className="mt-0.5">{icon}</span>
            <span className="flex-1">{name} ({count})</span>
        </Button>
    </div>
  );

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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:col-start-1">
          <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">
            Groups
          </h2>
          <div className="flex flex-col gap-1">
            <GroupButton
              id={null}
              name="All Trailers"
              icon={<ChevronRight className="h-4 w-4" />}
              count={trailers.length}
              selected={selectedGroup === null}
              onClick={() => setSelectedGroup(null)}
            />
            {ownersLoading ? <Skeleton className="h-8 w-full" /> : 
              owners.map((owner: any) => (
                 <GroupButton
                    key={owner.id}
                    id={owner.id}
                    name={owner.ownerName}
                    icon={<Building className="h-4 w-4" />}
                    count={trailers.filter((t: any) => t.ownerId === owner.id).length}
                    selected={selectedGroup === owner.id}
                    onClick={() => setSelectedGroup(owner.id)}
                 />
              ))
            }
          </div>
        </div>

        <div className="lg:col-start-2">
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
              <div className="p-4 border-t border-b bg-muted/50 flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedTrailers(new Set())} disabled={selectedTrailers.size === 0}>
                  <XCircle className="mr-2"/>
                  Clear selection ({selectedTrailers.size})
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Label>Assign to owner:</Label>
                  <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Select Owner" /></SelectTrigger>
                    <SelectContent>
                      {owners.map((owner: any) => (
                         <SelectItem key={owner.id} value={owner.id}>{owner.ownerName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAssign} disabled={selectedTrailers.size === 0 || !selectedOwner}>
                      <Copy className="mr-2"/>
                      Assign
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
                          checked={selectedTrailers.size === filteredTrailers.length && filteredTrailers.length > 0}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading || userLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                         <TableRow key={`trailer-skel-${i}`}>
                            <TableCell><Checkbox disabled /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredTrailers.map((trailer) => (
                        <TableRow key={trailer.id} data-state={selectedTrailers.has(trailer.id) && "selected"}>
                          <TableCell><Checkbox onCheckedChange={(checked) => handleSelectTrailer(trailer.id, Boolean(checked))} checked={selectedTrailers.has(trailer.id)} /></TableCell>
                          <TableCell className="font-medium">
                             <Button variant="link" asChild className="p-0 h-auto font-medium"><Link href={`/trailers/${trailer.id}`}>{trailer.id}</Link></Button>
                          </TableCell>
                          <TableCell>{trailer.trailerType || 'N/A'}</TableCell>
                          <TableCell>{trailer.make || 'N/A'}</TableCell>
                          <TableCell>{owners.find(o => o.id === trailer.ownerId)?.ownerName || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={trailer.isActive ? 'active' : 'destructive'}>
                              {trailer.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/trailers/${trailer.id}`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Trailer</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {(loading || userLoading || filteredTrailers.length > 0) ? null : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {searchQuery ? 'No trailers match your search.' : (selectedGroup ? 'No trailers in this group.' : 'No trailers found.')}
                        </TableCell>
                      </TableRow>
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
