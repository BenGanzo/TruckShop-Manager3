
'use client';

import { useMemo, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '@/lib/firebase';
import type { CatalogPart } from '@/lib/types';

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
import { AddCatalogItemDialog } from '@/components/add-catalog-item-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Boxes, Search } from 'lucide-react';

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

export default function InventoryPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);
  const [searchQuery, setSearchQuery] = useState('');

  const catalogRef = companyId ? collection(db, 'mainCompanies', companyId, 'catalog') : null;
  const partsQuery = catalogRef ? query(catalogRef, where('type', '==', 'part')) : null;
  const [partsSnapshot, loading, error] = useCollection(partsQuery);

  const parts = useMemo(() => {
    return partsSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as CatalogPart)) || [];
  }, [partsSnapshot]);
  
  const filteredParts = useMemo(() => {
    if (!searchQuery) return parts;
    const query = searchQuery.toLowerCase();
    return parts.filter(part => 
      part.name.toLowerCase().includes(query) || 
      part.partId.toLowerCase().includes(query)
    );
  }, [parts, searchQuery]);

  const totalInventoryValue = useMemo(() => {
      return parts.reduce((total, part) => total + (part.cost * part.quantity), 0);
  }, [parts]);

  const isLoading = userLoading || loading;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                <Boxes />
                Inventory Management
            </h1>
            <p className="mt-2 text-muted-foreground">
                Track and manage your parts inventory.
            </p>
        </div>
        <AddCatalogItemDialog type="part" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>All Parts</CardTitle>
              <CardDescription className="mt-1">
                A list of all parts in your inventory.
              </CardDescription>
            </div>
            <div className="mt-2 text-sm font-medium text-right md:mt-0">
              Total Inventory Value: <span className="font-bold text-primary">${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
           <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by part name or SKU..."
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
                  <TableHead>Part Name</TableHead>
                  <TableHead>Part ID/SKU</TableHead>
                  <TableHead className="w-[120px]">On Hand</TableHead>
                  <TableHead className="w-[120px]">Cost</TableHead>
                  <TableHead className="w-[150px] text-right">Inventory Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`part-skel-${i}`}>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-destructive">Error loading inventory.</TableCell></TableRow>
                ) : filteredParts.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery ? 'No parts match your search.' : 'No parts in inventory. Add one to get started.'}
                  </TableCell></TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id}>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>{part.partId}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>${part.cost.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${(part.cost * part.quantity).toFixed(2)}</TableCell>
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
