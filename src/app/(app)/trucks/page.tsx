'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { useCompanyId } from '@/hooks/useCompanyId';
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
import { assignTrucksToOwner } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function TrucksPage() {
  const router = useRouter();
  const { toast } = useToast();
  const db = getFirestore(app);
  const companyId = useCompanyId();                               // ← claims

  // No crear refs si aún no hay companyId
  const trucksRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'trucks') : null),
    [db, companyId]
  );
  const ownersRef = useMemo(
    () => (companyId ? collection(db, 'mainCompanies', companyId, 'owners') : null),
    [db, companyId]
  );

  const [trucksSnap, trucksLoading, trucksErr] = useCollection(trucksRef);
  const [ownersSnap, ownersLoading] = useCollection(ownersRef);

  const [selectedTrucks, setSelectedTrucks] = useState<Set<string>>(new Set());
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const trucks = trucksSnap?.docs?.map(d => ({ id: d.id, ...d.data() as any })) || [];
  const owners = ownersSnap?.docs?.map(d => ({ id: d.id, ...d.data() as { ownerName: string } })) || [];

  const filteredTrucks = useMemo(() => {
    let list = trucks;
    if (selectedGroup) list = list.filter((t: any) => t.ownerId === selectedGroup);
    if (!searchQuery) return list;

    const q = searchQuery.toLowerCase();
    const starts = list.filter((t: any) => t.id?.toLowerCase().startsWith(q));
    if (starts.length) return starts;

    return list.filter((t: any) =>
      t.id?.toLowerCase().includes(q) ||
      t.make?.toLowerCase().includes(q) ||
      t.model?.toLowerCase().includes(q) ||
      t.vin?.toLowerCase().includes(q)
    );
  }, [trucks, selectedGroup, searchQuery]);

  const activeTrucksCount = useMemo(() => trucks.filter((t: any) => t.isActive).length, [trucks]);

  const handleSelectAll = (checked: boolean) =>
    setSelectedTrucks(checked ? new Set(filteredTrucks.map((t: any) => t.id)) : new Set());

  const handleSelectTruck = (id: string, checked: boolean) => {
    const s = new Set(selectedTrucks);
    checked ? s.add(id) : s.delete(id);
    setSelectedTrucks(s);
  };

  const handleAssign = async () => {
    if (selectedTrucks.size === 0 || !selectedOwner || !companyId) {
      toast({ variant: 'destructive', title: 'Assignment Failed', description: 'Select trucks and an owner.' });
      return;
    }
    const res = await assignTrucksToOwner(companyId, Array.from(selectedTrucks), selectedOwner);
    if (res.success) {
      toast({ title: 'Success!', description: `${selectedTrucks.size} truck(s) assigned.` });
      setSelectedTrucks(new Set()); setSelectedOwner('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.error || 'Unknown error' });
    }
  };

  const handleRowDoubleClick = (id: string) => router.push(`/trucks/${id}`);

  const GroupButton = ({ id, name, icon, count, selected, onClick }: any) => (
    <div className={cn('flex items-start justify-between pl-2 pr-1 rounded-md', selected ? 'bg-green-500/20' : 'hover:bg-muted')}>
      <Button variant="ghost" className={cn('justify-start items-start gap-2 px-0 flex-1 h-auto min-h-9 py-1.5 text-left', selected && 'font-semibold')} onClick={onClick}>
        <span className="mt-0.5">{icon}</span>
        <span className="flex-1">{name} ({count})</span>
      </Button>
    </div>
  );

  const isLoading = !companyId || trucksLoading || ownersLoading;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Trucks</h1>
        <Button asChild><Link href="/trucks/new"><PlusCircle className="mr-2 h-4 w-4" />Add Truck</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:col-start-1">
          <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">Groups</h2>
          <div className="flex flex-col gap-1">
            <GroupButton id={null} name="All Trucks" icon={<ChevronRight className="h-4 w-4" />} count={trucks.length} selected={selectedGroup === null} onClick={() => setSelectedGroup(null)} />
            {ownersLoading ? <Skeleton className="h-8 w-full" /> :
              owners.map((o: any) => (
                <GroupButton
                  key={o.id}
                  id={o.id}
                  name={o.ownerName}
                  icon={<Building className="h-4 w-4" />}
                  count={trucks.filter((t: any) => t.ownerId === o.id).length}
                  selected={selectedGroup === o.id}
                  onClick={() => setSelectedGroup(o.id)}
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
                  <CardTitle>All Trucks</CardTitle>
                  <CardDescription className="mt-1">A list of all of your trucks in your fleet.</CardDescription>
                </div>
                <div className="mt-2 text-sm font-medium text-right md:mt-0">
                  Active count: {isLoading ? <Skeleton className="h-5 w-5 inline-block" /> : activeTrucksCount}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search trucks by ID, make, model, or VIN..." className="pl-8 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-t border-b bg-muted/50 flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setSelectedTrucks(new Set())} disabled={selectedTrucks.size === 0}>
                  <XCircle className="mr-2" />
                  Clear selection ({selectedTrucks.size})
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Trash2 className="mr-2" />
                  Delete selected
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Label>Assign to owner:</Label>
                  <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Select Owner" /></SelectTrigger>
                    <SelectContent>
                      {owners.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.ownerName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAssign} disabled={selectedTrucks.size === 0 || !selectedOwner}>
                    <Copy className="mr-2" />Assign
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
                          checked={selectedTrucks.size === filteredTrucks.length && filteredTrucks.length > 0}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={7} className="h-24 text-center">Loading trucks...</TableCell></TableRow>
                    ) : trucksErr ? (
                      <TableRow><TableCell colSpan={7} className="h-24 text-center text-destructive">Error: {trucksErr.message}</TableCell></TableRow>
                    ) : filteredTrucks.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="h-24 text-center">
                        {searchQuery ? 'No trucks match your search.' : (selectedGroup ? 'No trucks found in this group.' : 'No trucks found. Add your first truck to get started.')}
                      </TableCell></TableRow>
                    ) : (
                      filteredTrucks.map((t: any) => (
                        <TableRow
                          key={t.id}
                          data-state={selectedTrucks.has(t.id) && 'selected'}
                          onDoubleClick={() => handleRowDoubleClick(t.id)}
                          className="cursor-pointer"
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              onCheckedChange={(checked) => handleSelectTruck(t.id, Boolean(checked))}
                              checked={selectedTrucks.has(t.id)}
                              aria-label={`Select truck ${t.id}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{t.id}</TableCell>
                          <TableCell>{t.make}</TableCell>
                          <TableCell>{t.model}</TableCell>
                          <TableCell>{owners.find(o => o.id === t.ownerId)?.ownerName || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={t.isActive ? 'active' : 'destructive'}>
                              {t.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/trucks/${t.id}`} onClick={(e) => e.stopPropagation()}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit Truck</span>
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
      </div>
    </div>
  );
}
