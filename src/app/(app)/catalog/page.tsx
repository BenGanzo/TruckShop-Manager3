
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

export default function CatalogPage() {
  // Placeholder data - in the future, this will come from Firestore
  const parts: any[] = [];
  const labor: any[] = [];

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
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Part
              </Button>
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
                    {parts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No parts found. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
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
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service
              </Button>
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
                    {labor.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No labor items found. Add one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <></>
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
