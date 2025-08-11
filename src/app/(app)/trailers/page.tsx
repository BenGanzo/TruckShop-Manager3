'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { Trailer } from '@/lib/types';
import { useCompanyId } from '@/hooks/useCompanyId';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Search, Building, ChevronRight, XCircle, Copy, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { assignTrailersToOwner } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TrailersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const companyId = useCompanyId(); // ← RESUELTO POR CLAIMS

  // No crear refs si aún no hay companyId
  const trailersRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'trailers') : null),
    [db, companyId]
  );
  const ownersRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'owners') : null),
    [db, companyId]
  );

  const [trailersSnap, trailersLoading, trailersErr] = useCollection(trailersRef);
  const [ownersSnap, ownersLoading] = useCollection(ownersRef);

  const [selectedTrailers, setSelectedTrailers] = useState<Set<string>>(new Set());
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const trailers: Trailer[] =
    trailersSnap?.docs?.map(d => ({ id: d.id, ...(d.data() as Trailer) })) || [];
  const owners =
    ownersSnap?.docs?.map(d => ({ id: d.id, ...(d.data() as { ownerName: string }) })) || [];

  const filteredTrailers = useMemo(() => {
    let list = trailers;
    if (selectedGroup) list = trailers.filter(t => t.ownerId === selectedGroup);
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    const starts = list.filter(t => t.id?.toLowerCase().startsWith(q));
    return starts.length ? starts :
      list.filter(t =>
        t.id?.toLowerCase().includes(q) ||
        t.make?.toLowerCase().includes(q) ||
        t.model?.toLowerCase().includes(q) ||
        t.vin?.toLowerCase().includes(q)
      );
  }, [trailers, selectedGroup, searchQuery]);

  const activeCount = useMemo(() => trailers.filter(t => t.isActive).length, [trailers]);

  const handleSelectAll = (checked: boolean) =>
    setSelectedTrailers(checked ? new Set(filteredTrailers.map(t => t.id)) : new Set());

  const handleSelectTrailer = (id: string, checked: boolean) => {
    const s = new Set(selectedTrailers);
    checked ? s.add(id) : s.delete(id);
    setSelectedTrailers(s);
  };

  const handleAssign = async () => {
    if (selectedTrailers.size === 0 || !selectedOwner || !companyId) {
      toast({ variant: 'destructive', title: 'Assignment Failed', description: 'Select trailers and an owner.' });
      return;
    }
    const res = await assignTrailersToOwner(companyId, Array.from(selectedTrailers), selectedOwner);
    if (res.success) {
      toast({ title: 'Success!', description: `${selectedTrailers.size} trailer(s) assigned.` });
      setSelectedTrailers(new Set()); setSelectedOwner('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.error });
    }
  };

  const handleRowDoubleClick = (id: string) => router.push(`/trailers/${id}`);

  const GroupButton = ({ id, name, icon, count, selected, onClick }: any) => (
    <div className={cn('flex items-start justify-between pl-2 pr-1 rounded-md', selected ? 'bg-green-500/20' : 'hover:bg-muted')}>
      <Button variant="ghost" className={cn('justify-start items-start gap-2 px-0 flex-1 h-auto min-h-9 py-1.5 text-left', selected && 'font-semibold')} onClick={onClick}>
        <span className="mt-0.5">{icon}</span>
        <span className="flex-1">{name} ({count})</span>
      </Button>
    </div>
  );

  const isLoading = !companyId || trailersLoading || ownersLoading;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Trailers</h1>
        <Button asChild><Link href="/trailers/new"><PlusCircle className="mr-2 h-4 w-4" />Add Trailer</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:col-start-1">
          <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">Groups</h2>
          <div className="flex flex-col gap-1">
            <GroupButton id={null} name="All Trailers" icon={<ChevronRight className="h-4 w-4" />} count={trailers.length} selected={selectedGroup === null} onClick={() => setSelectedGroup(null)} />
            {ownersLoading ? <Skeleton className="h-8 w-full" /> :
              owners.map((owner: any) => (
                <GroupButton key={owner.id} id={owner.id} name={owner.ownerName} icon={<Building className="h-4 w-4" />} count={trailers.filter(t => t.ownerId === owner.id).length} selected={selectedGroup === owner.id} onClick={() => setSelectedGroup(owner.id)} />
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
                  <CardDescription className="mt-1">A list of all of your trailers in your fleet.</CardDescription>
                </div>
                <div className="mt-2 text-sm font-medium text-right md:mt-0">
                  Active count: {isLoading ? <Skeleton className="h-5 w-5 inline-block" /> : activeCount}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search trailers by ID, make, model, or VIN..." className="pl-8 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-t border-b bg-muted/50 flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedTrailers(new Set())} disabled={selectedTrailers.size === 0}>
                  <XCircle className="mr-2" />Clear selection ({selectedTrailers.size})
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Label>Assign to owner:</Label>
                  <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Select Owner" /></SelectTrigger>
                    <SelectContent>
                      {owners.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.ownerName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAssign} disabled={selectedTrailers.size === 0 || !selectedOwner}><Copy className="mr-2" />Assign</Button>
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
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`trailer-skel-${i}`}>
                          <TableCell><Checkbox disabled /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredTrailers.map((t) => (
                        <TableRow key={t.id} data-state={selectedTrailers.has(t.id) && 'selected'} onDoubleClick={() => handleRowDoubleClick(t.id)} className="cursor-pointer">
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox onCheckedChange={(checked) => handleSelectTrailer(t.id, Boolean(checked))} checked={selectedTrailers.has(t.id)} />
                          </TableCell>
                          <TableCell className="font-medium">
                            <Button variant="link" asChild className="p-0 h-auto font-medium"><Link href={`/trailers/${t.id}`}>{t.id}</Link></Button>
                          </TableCell>
                          <TableCell>{t.trailerType || 'N/A'}</TableCell>
                          <TableCell>{t.make || 'N/A'}</TableCell>
                          <TableCell>{owners.find(o => o.id === t.ownerId)?.ownerName || 'N/A'}</TableCell>
                          <TableCell><Badge variant={t.isActive ? 'active' : 'destructive'}>{t.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/trailers/${t.id}`}><Pencil className="h-4 w-4" /><span className="sr-only">Edit Trailer</span></Link>
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
      </div>
    </div>
  );
}
