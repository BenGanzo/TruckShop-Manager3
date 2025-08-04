
'use client';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

export default function WorkOrderPartsLaborForm() {
  // Placeholder data - in a real app, this would be managed with state
  const parts: any[] = [];
  const labor: any[] = [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Parts</CardTitle>
          <CardDescription>
            Scan a barcode or search for a part to add it to the work order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Scan or Search Part..." />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Unit Cost</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No parts added yet.
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

      <Card>
        <CardHeader>
          <CardTitle>Labor</CardTitle>
          <CardDescription>
            Select a standard service or add a custom labor line.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a labor item" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil-change">Standard Oil Change</SelectItem>
                <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end">
               <Button variant="outline">
                    <PlusCircle className="mr-2" />
                    Add Custom Labor
                </Button>
            </div>
          </div>
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Hours</TableHead>
                  <TableHead className="w-[120px]">Rate</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labor.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No labor added yet.
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
    </>
  );
}
