
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
import { PlusCircle, Trash2 } from 'lucide-react';
import type { UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';
import type { CatalogPart, CatalogLabor } from '@/lib/types';
import { useState } from 'react';

interface WorkOrderPartsLaborFormProps {
    parts: any[];
    labor: any[];
    appendPart: UseFieldArrayAppend<any, 'parts'>;
    removePart: UseFieldArrayRemove;
    updatePart: UseFieldArrayUpdate<any, 'parts'>;
    appendLabor: UseFieldArrayAppend<any, 'labor'>;
    removeLabor: UseFieldArrayRemove;
    updateLabor: UseFieldArrayUpdate<any, 'labor'>;
    catalogParts: CatalogPart[];
    catalogLabor: CatalogLabor[];
    isLoading: boolean;
}

export default function WorkOrderPartsLaborForm({
    parts, labor, appendPart, removePart, updatePart, appendLabor, removeLabor, updateLabor, catalogParts, catalogLabor, isLoading
}: WorkOrderPartsLaborFormProps) {
  const [partToAdd, setPartToAdd] = useState('');
  const [laborToAdd, setLaborToAdd] = useState('');

  const handleAddPart = () => {
    const part = catalogParts.find(p => p.partId === partToAdd);
    if (part) {
        appendPart({
            id: part.id,
            partId: part.partId,
            name: part.name,
            quantity: 1,
            cost: part.cost,
            isTaxable: part.isTaxable,
        });
        setPartToAdd('');
    }
  };

  const handleAddLabor = () => {
    const labor = catalogLabor.find(l => l.id === laborToAdd);
    if (labor) {
        appendLabor({
            id: labor.id,
            description: labor.description,
            hours: labor.defaultHours,
            rate: labor.defaultRate,
        });
        setLaborToAdd('');
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Parts</CardTitle>
          <CardDescription>
            Search for a part from your catalog to add it to the work order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select onValueChange={setPartToAdd} value={partToAdd} disabled={isLoading}>
                <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading catalog..." : "Select a part"} />
                </SelectTrigger>
                <SelectContent>
                    {catalogParts.map(part => (
                        <SelectItem key={part.partId} value={part.partId}>{part.name} ({part.partId})</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="button" onClick={handleAddPart} disabled={!partToAdd}>
                <PlusCircle className="mr-2" /> Add Part
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Name</TableHead>
                  <TableHead className="w-[100px]">Qty</TableHead>
                  <TableHead className="w-[120px]">Unit Cost</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-12"></TableHead>
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
                  parts.map((part, index) => (
                    <TableRow key={part.id}>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>
                            <Input type="number" value={part.quantity} onChange={(e) => updatePart(index, {...part, quantity: parseInt(e.target.value) || 0})} className="h-8"/>
                        </TableCell>
                         <TableCell>
                             <Input type="number" value={part.cost} onChange={(e) => updatePart(index, {...part, cost: parseFloat(e.target.value) || 0})} className="h-8"/>
                        </TableCell>
                        <TableCell className="text-right">${(part.quantity * part.cost).toFixed(2)}</TableCell>
                         <TableCell>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePart(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
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

      <Card>
        <CardHeader>
          <CardTitle>Labor</CardTitle>
          <CardDescription>
            Select a standard service from your catalog to add it.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center gap-2 mb-4">
            <Select onValueChange={setLaborToAdd} value={laborToAdd} disabled={isLoading}>
                <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Loading catalog..." : "Select a service"} />
                </SelectTrigger>
                <SelectContent>
                    {catalogLabor.map(labor => (
                        <SelectItem key={labor.id} value={labor.id}>{labor.description}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="button" onClick={handleAddLabor} disabled={!laborToAdd}>
                <PlusCircle className="mr-2" /> Add Labor
            </Button>
          </div>
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Hours</TableHead>
                  <TableHead className="w-[120px]">Rate</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                   <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labor.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No labor added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                   labor.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>
                            <Input type="number" value={item.hours} onChange={(e) => updateLabor(index, {...item, hours: parseFloat(e.target.value) || 0})} className="h-8"/>
                        </TableCell>
                         <TableCell>
                             <Input type="number" value={item.rate} onChange={(e) => updateLabor(index, {...item, rate: parseFloat(e.target.value) || 0})} className="h-8"/>
                        </TableCell>
                        <TableCell className="text-right">${(item.hours * item.rate).toFixed(2)}</TableCell>
                        <TableCell>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLabor(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
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
    </>
  );
}
