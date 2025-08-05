
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app, auth } from '@/lib/firebase';
import type { CatalogPart, CatalogLabor } from '@/lib/types';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddCatalogItemDialog } from '@/components/add-catalog-item-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';


const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};


export default function CatalogPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const catalogRef = companyId ? collection(db, 'mainCompanies', companyId, 'catalog') : null;
  const catalogQuery = catalogRef ? query(catalogRef, orderBy('createdAt', 'desc')) : null;
  const [catalogSnapshot, loading, error] = useCollection(catalogQuery);

  const { parts, labor } = useMemo(() => {
    const allItems = catalogSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || [];
    return {
      parts: allItems.filter(item => item.type === 'part') as CatalogPart[],
      labor: allItems.filter(item => item.type === 'labor') as CatalogLabor[],
    };
  }, [catalogSnapshot]);

  const isLoading = userLoading || loading;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Parts & Labor Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your parts and labor catalog here.
        </p>
      </div>

      <Tabs defaultValue="parts">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="parts">Parts</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
        </TabsList>

        <TabsContent value="parts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Parts Catalog</CardTitle>
                <CardDescription>
                  A list of all parts available.
                </CardDescription>
              </div>
              <AddCatalogItemDialog type="part" />
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`part-skel-${i}`}>
                          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center text-destructive">Error loading parts.</TableCell></TableRow>
                    ) : parts.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center">No parts found. Add one to get started.</TableCell></TableRow>
                    ) : (
                      parts.map((part) => (
                        <TableRow key={part.id}>
                            <TableCell className="font-medium">{part.name}</TableCell>
                            <TableCell>{part.partId}</TableCell>
                            <TableCell>{part.quantity}</TableCell>
                            <TableCell>${part.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Labor Catalog</CardTitle>
                <CardDescription>
                  A list of all standard services offered.
                </CardDescription>
              </div>
              <AddCatalogItemDialog type="labor" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Description</TableHead>
                      <TableHead>Default Hours</TableHead>
                      <TableHead>Default Rate</TableHead>
                      <TableHead>Has PM Rule?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={`labor-skel-${i}`}>
                          <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-12 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                       <TableRow><TableCell colSpan={4} className="h-24 text-center text-destructive">Error loading labor items.</TableCell></TableRow>
                    ) : labor.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center">No labor items found. Add one to get started.</TableCell></TableRow>
                    ) : (
                       labor.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.defaultHours}</TableCell>
                            <TableCell>${item.defaultRate.toFixed(2)}</TableCell>
                            <TableCell><Badge variant={item.hasPmRule ? 'active' : 'secondary'}>{item.hasPmRule ? 'Yes' : 'No'}</Badge></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
