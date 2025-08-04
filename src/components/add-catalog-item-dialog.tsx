
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusCircle } from 'lucide-react';

interface AddCatalogItemDialogProps {
  type: 'part' | 'labor';
}

export function AddCatalogItemDialog({ type }: AddCatalogItemDialogProps) {
  const isPart = type === 'part';

  const title = isPart ? 'Add New Part' : 'Add New Service';
  const description = isPart
    ? 'Enter the details for the new part.'
    : 'Enter the details for the new labor service.';
  const buttonText = isPart ? 'Add Part' : 'Add Service';

  // In a real app, you would have state and a submit handler here.
  // For now, this is just the UI structure.

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isPart ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="part-name" className="text-right">
                  Part Name
                </Label>
                <Input id="part-name" placeholder="e.g., Oil Filter" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="part-sku" className="text-right">
                  ID / SKU
                </Label>
                <Input id="part-sku" placeholder="e.g., FIL-001" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="part-quantity" className="text-right">
                  On Hand
                </Label>
                <Input id="part-quantity" type="number" placeholder="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="part-cost" className="text-right">
                  Cost
                </Label>
                <Input id="part-cost" type="number" placeholder="0.00" className="col-span-3" />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-desc" className="text-right">
                  Description
                </Label>
                <Input id="service-desc" placeholder="e.g., Standard Oil Change" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-hours" className="text-right">
                  Default Hours
                </Label>
                <Input id="service-hours" type="number" placeholder="0.0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-rate" className="text-right">
                  Default Rate
                </Label>
                <Input id="service-rate" type="number" placeholder="0.00" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pm-rule" className="text-right">
                  Has PM Rule?
                </Label>
                 <div className="col-span-3 flex items-center">
                    <Switch id="pm-rule" />
                 </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
