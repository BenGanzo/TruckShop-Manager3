
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { addSupplier } from '@/app/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') {
    return 'angulo-transportation';
  }
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier Name is required.'),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  website: z.string().url('Invalid URL.').optional().or(z.literal('')),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function AddSupplierPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contactFirstName: '',
      contactLastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      website: '',
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    if (!companyId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company.' });
      return;
    }
    setIsLoading(true);
    const result = await addSupplier(companyId, data);
    setIsLoading(false);
    if (result.success) {
      toast({ title: 'Supplier Added!', description: 'The new supplier has been saved successfully.' });
      router.push('/suppliers');
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
                <Link href="/suppliers">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Suppliers</span>
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight font-headline">
                Add New Supplier
              </h1>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Supplier'}
            </Button>
          </div>
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="text-2xl font-headline">Supplier Information</CardTitle>
                  <CardDescription>Enter the details for the new supplier.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Supplier Name</FormLabel> <FormControl><Input placeholder="e.g., Global Truck Parts Inc." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="contactFirstName" render={({ field }) => ( <FormItem> <FormLabel>Contact First Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="contactLastName" render={({ field }) => ( <FormItem> <FormLabel>Contact Last Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" placeholder="contact@supplier.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Phone</FormLabel> <FormControl><Input type="tel" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Address</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                <div className="grid grid-cols-2 gap-2">
                  <FormField control={form.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem> <FormLabel>Zip Code</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </div>
                <FormField control={form.control} name="website" render={({ field }) => ( <FormItem className="md:col-span-2"> <FormLabel>Website</FormLabel> <FormControl><Input placeholder="https://supplier.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
