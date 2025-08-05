
'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore, query, orderBy } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Supplier, CatalogPart } from '@/lib/types';
import { addPurchaseOrder } from '@/app/actions';

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

const poItemSchema = z.object({
  partId: z.string(),
  name: z.string(),
  quantity: z.coerce.number().min(1, 'Qty must be at least 1.'),
  cost: z.coerce.number().min(0, 'Cost cannot be negative.'),
});

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required.'),
  status: z.enum(['draft', 'ordered', 'completed', 'cancelled']).default('draft'),
  issueDate: z.date(),
  expectedDeliveryDate: z.date().optional(),
  items: z.array(poItemSchema).min(1, 'At least one item is required.'),
  shippingCost: z.coerce.number().default(0),
  taxRate: z.coerce.number().default(0),
});

type POFormData = z.infer<typeof purchaseOrderSchema>;

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, userLoading] = useAuthState(auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  // Data fetching
  const suppliersRef = companyId ? collection(db, 'mainCompanies', companyId, 'suppliers') : null;
  const [suppliersSnapshot, suppliersLoading] = useCollection(suppliersRef);
  const suppliers: Supplier[] = suppliersSnapshot?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier)) || [];
  
  const partsRef = companyId ? query(collection(db, 'mainCompanies', companyId, 'catalog'), where => where('type', '==', 'part')) : null;
  const [partsSnapshot, partsLoading] = useCollection(partsRef);
  const parts: CatalogPart[] = partsSnapshot?.docs.map(doc => doc.data() as CatalogPart) || [];

  const form = useForm<POFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      issueDate: new Date(),
      status: 'draft',
      items: [],
      shippingCost: 0,
      taxRate: 8.25, // Default tax rate
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [partToAdd, setPartToAdd] = React.useState('');

  const handleAddPart = () => {
    const part = parts.find(p => p.partId === partToAdd);
    if (part) {
      append({ partId: part.partId, name: part.name, quantity: 1, cost: part.cost });
      setPartToAdd('');
    }
  };

  const watchItems = form.watch('items');
  const watchShipping = form.watch('shippingCost');
  const watchTaxRate = form.watch('taxRate');

  const { subtotal, taxAmount, grandTotal } = React.useMemo(() => {
    const itemsTotal = watchItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
    const subtotal = itemsTotal + watchShipping;
    const taxAmount = itemsTotal * (watchTaxRate / 100);
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  }, [watchItems, watchShipping, watchTaxRate]);

  const onSubmit = async (data: POFormData) => {
    if (!companyId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company.' });
      return;
    }
    setIsLoading(true);
    
    const selectedSupplier = suppliers.find(s => s.id === data.supplierId);
    if (!selectedSupplier) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected supplier not found.' });
        setIsLoading(false);
        return;
    }

    const poDataForAction = {
      ...data,
      supplierName: selectedSupplier.name,
      total: grandTotal
    };

    const result = await addPurchaseOrder(companyId, poDataForAction);
    setIsLoading(false);
    if (result.success && result.purchaseOrderId) {
      toast({ title: 'Purchase Order Created!', description: `PO #${result.purchaseOrderId} has been saved.` });
      router.push('/purchase-orders');
    } else {
      toast({ variant: 'destructive', title: 'Save Failed', description: result.error });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/purchase-orders"><ArrowLeft className="h-4 w-4" /><span className="sr-only">Back</span></Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight font-headline">Create Purchase Order</h1>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Purchase Order
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="supplierId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={suppliersLoading}>
                        <FormControl><SelectTrigger>
                          <SelectValue placeholder={suppliersLoading ? "Loading suppliers..." : "Select a supplier"} />
                        </SelectTrigger></FormControl>
                        <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="issueDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Issue Date</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal',!field.value && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="expectedDeliveryDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Expected Delivery</FormLabel>
                      <Popover><PopoverTrigger asChild><FormControl>
                        <Button variant="outline" className={cn('w-full justify-start text-left font-normal',!field.value && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl></PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Items</CardTitle><CardDescription>Add parts from your catalog to this order.</CardDescription></CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Select onValueChange={setPartToAdd} value={partToAdd} disabled={partsLoading}>
                      <SelectTrigger><SelectValue placeholder={partsLoading ? "Loading parts..." : "Select a part to add"} /></SelectTrigger>
                      <SelectContent>{parts.map(p => <SelectItem key={p.partId} value={p.partId}>{p.name} ({p.partId})</SelectItem>)}</SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddPart} disabled={!partToAdd}><PlusCircle className="mr-2"/>Add</Button>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader><TableRow><TableHead>Part</TableHead><TableHead className="w-24">Qty</TableHead><TableHead className="w-32">Unit Cost</TableHead><TableHead className="w-32 text-right">Total</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                      <TableBody>
                        {fields.length === 0 ? (
                          <TableRow><TableCell colSpan={5} className="h-24 text-center">No items added.</TableCell></TableRow>
                        ) : (
                          fields.map((item, index) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell><Input type="number" value={item.quantity} onChange={e => update(index, {...item, quantity: parseInt(e.target.value) || 0})} className="h-8" /></TableCell>
                              <TableCell><Input type="number" value={item.cost} onChange={e => update(index, {...item, cost: parseFloat(e.target.value) || 0})} className="h-8" /></TableCell>
                              <TableCell className="text-right">${(item.quantity * item.cost).toFixed(2)}</TableCell>
                              <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {form.formState.errors.items && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.message}</p>}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${(watchItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0)).toFixed(2)}</span></div>
                    <div className="flex justify-between items-center">
                      <FormLabel>Shipping:</FormLabel>
                      <FormField control={form.control} name="shippingCost" render={({ field }) => (<Input type="number" className="h-8 w-24" {...field} />)} />
                    </div>
                    <div className="flex justify-between items-center">
                      <FormLabel>Tax (%):</FormLabel>
                      <FormField control={form.control} name="taxRate" render={({ field }) => (<Input type="number" step="0.01" className="h-8 w-24" {...field} />)} />
                    </div>
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between"><span>Tax Amount:</span><span>${taxAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span><span>${grandTotal.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
