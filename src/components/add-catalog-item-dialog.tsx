
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { addCatalogPart, addCatalogLabor } from '@/app/actions';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const partSchema = z.object({
  name: z.string().min(1, 'Part Name is required.'),
  partId: z.string().min(1, 'Part ID/SKU is required.'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
  cost: z.coerce.number().min(0, 'Cost cannot be negative.'),
  isTaxable: z.boolean().default(false),
});

const laborSchema = z.object({
  description: z.string().min(1, 'Service Description is required.'),
  defaultHours: z.coerce.number().min(0, 'Hours must be a positive number.'),
  defaultRate: z.coerce.number().min(0, 'Rate must be a positive number.'),
  hasPmRule: z.boolean().default(false),
  pmIntervalMiles: z.coerce.number().optional(),
  pmIntervalDays: z.coerce.number().optional(),
  kit: z.array(z.object({
    partId: z.string().min(1),
    quantity: z.coerce.number().min(1),
  })).optional(),
});

interface AddCatalogItemDialogProps {
  type: 'part' | 'labor';
}

const getCompanyIdFromEmail = (email: string | null | undefined) => {
    if (!email) return '';
    if (email === 'ganzobenjamin1301@gmail.com') return 'angulo-transportation';
    const domain = email.split('@')[1];
    return domain ? domain.split('.')[0] : '';
};

export function AddCatalogItemDialog({ type }: AddCatalogItemDialogProps) {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  
  const isPart = type === 'part';
  
  const db = getFirestore(app);
  const catalogRef = companyId ? collection(db, 'mainCompanies', companyId, 'catalog') : null;
  const [catalogSnapshot, catalogLoading] = useCollection(catalogRef);
  const allParts = useMemo(() => catalogSnapshot?.docs.filter(doc => doc.data().type === 'part').map(doc => ({ id: doc.id, ...doc.data() })) || [], [catalogSnapshot]);

  const partForm = useForm<z.infer<typeof partSchema>>({
    resolver: zodResolver(partSchema),
    defaultValues: { name: '', partId: '', quantity: 0, cost: 0, isTaxable: true },
  });

  const laborForm = useForm<z.infer<typeof laborSchema>>({
    resolver: zodResolver(laborSchema),
    defaultValues: { description: '', defaultHours: 0, defaultRate: 0, hasPmRule: false, kit: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: laborForm.control,
    name: 'kit',
  });
  
  const [kitPart, setKitPart] = useState('');
  const [kitQty, setKitQty] = useState(1);

  const onPartSubmit = async (data: z.infer<typeof partSchema>) => {
    if (!companyId) return;
    setIsLoading(true);
    const result = await addCatalogPart(companyId, data);
    if (result.success) {
      toast({ title: 'Part Added!', description: 'The new part has been saved to the catalog.' });
      setIsOpen(false);
      partForm.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };

  const onLaborSubmit = async (data: z.infer<typeof laborSchema>) => {
    if (!companyId) return;
    setIsLoading(true);
    const result = await addCatalogLabor(companyId, data);
    if (result.success) {
      toast({ title: 'Service Added!', description: 'The new service has been saved to the catalog.' });
      setIsOpen(false);
      laborForm.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };

  const form = isPart ? partForm : laborForm;
  const onSubmit = isPart ? form.handleSubmit(onPartSubmit) : form.handleSubmit(onLaborSubmit);

  const title = isPart ? 'Add New Part' : 'Add New Service';
  const description = isPart ? 'Enter the details for the new part.' : 'Enter the details for the new labor service.';
  const buttonText = isPart ? 'Add Part' : 'Add Service';

  const handleAddPartToKit = () => {
    if (!kitPart || kitQty <= 0) return;
    append({ partId: kitPart, quantity: kitQty });
    setKitPart('');
    setKitQty(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 py-4">
            {isPart ? (
              <>
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Part Name</FormLabel> <FormControl><Input placeholder="e.g., Oil Filter" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="partId" render={({ field }) => ( <FormItem> <FormLabel>Part ID / SKU</FormLabel> <FormControl><Input placeholder="e.g., FIL-001" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem> <FormLabel>On Hand</FormLabel> <FormControl><Input type="number" placeholder="0" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="cost" render={({ field }) => ( <FormItem> <FormLabel>Cost</FormLabel> <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                 <FormField control={partForm.control} name="isTaxable" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"> <div className="space-y-0.5"> <FormLabel>Taxable?</FormLabel> </div> <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl> </FormItem> )} />
              </>
            ) : (
              <>
                <FormField control={laborForm.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Input placeholder="e.g., Standard Oil Change" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={laborForm.control} name="defaultHours" render={({ field }) => ( <FormItem> <FormLabel>Default Hours</FormLabel> <FormControl><Input type="number" placeholder="0.0" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={laborForm.control} name="defaultRate" render={({ field }) => ( <FormItem> <FormLabel>Default Rate</FormLabel> <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={laborForm.control} name="hasPmRule" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"> <div className="space-y-0.5"> <FormLabel>Has PM Rule?</FormLabel> </div> <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl> </FormItem> )} />
                
                {laborForm.watch('hasPmRule') && (
                  <div className="space-y-4 rounded-md border p-4">
                    <FormField control={laborForm.control} name="pmIntervalMiles" render={({ field }) => ( <FormItem> <FormLabel>Interval (Miles)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 20000" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={laborForm.control} name="pmIntervalDays" render={({ field }) => ( <FormItem> <FormLabel>Interval (Days)</FormLabel> <FormControl><Input type="number" placeholder="e.g., 90" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                )}
                
                <Separator className="my-4" />
                <h4 className="font-medium text-center">Part Kit (Optional)</h4>
                <div className="grid grid-cols-6 gap-2 items-end">
                    <div className="col-span-4">
                        <Label>Part</Label>
                         <Select onValueChange={setKitPart} value={kitPart} disabled={catalogLoading}>
                            <SelectTrigger><SelectValue placeholder={catalogLoading ? "Loading..." : "Select a part"} /></SelectTrigger>
                            <SelectContent>
                                {allParts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="col-span-1">
                        <Label>Qty</Label>
                        <Input type="number" value={kitQty} onChange={(e) => setKitQty(parseInt(e.target.value))} />
                    </div>
                    <div><Button type="button" size="icon" variant="outline" className="w-full" onClick={handleAddPartToKit}><PlusCircle className="h-4 w-4" /></Button></div>
                </div>
                 <div className="rounded-md border mt-2">
                    <Table><TableHeader><TableRow><TableHead>Part Name</TableHead><TableHead className="w-16">Qty</TableHead><TableHead className="w-12 p-0"></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {fields.length === 0 ? (
                                <TableRow><TableCell colSpan={3} className="h-16 text-center text-muted-foreground">No parts in kit.</TableCell></TableRow>
                            ) : (
                                fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>{allParts.find(p => p.id === field.partId)?.name || field.partId}</TableCell>
                                        <TableCell>{field.quantity}</TableCell>
                                        <TableCell><Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
              </>
            )}
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
