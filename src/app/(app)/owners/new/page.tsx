
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
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { addOwner } from '@/app/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) {
    return 'angulo-transportation';
  }
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

const ownerFormSchema = z.object({
  ownerName: z.string().min(1, 'Owner Name is required.'),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type OwnerFormData = z.infer<typeof ownerFormSchema>;

export default function AddOwnerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
    
    const form = useForm<OwnerFormData>({
        resolver: zodResolver(ownerFormSchema),
        defaultValues: {
            ownerName: '',
            contactFirstName: '',
            contactLastName: '',
            email: '',
            phone: '',
            address: '',
        },
    });

    const onSubmit = async (data: OwnerFormData) => {
        if (!companyId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company.' });
            return;
        }
        setIsLoading(true);
        try {
            const result = await addOwner(companyId, data);
            if (result.success) {
                toast({ title: 'Owner Added!', description: 'The new owner has been saved successfully.' });
                router.push('/owners');
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Save Failed', description: error.message || 'An unknown error occurred.' });
        } finally {
            setIsLoading(false);
        }
    }

  return (
     <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/owners">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Owners</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Add New Owner
                </h1>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Saving..." : "Save Owner"}
            </Button>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Owner Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new owner.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ownerName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Owner Name</FormLabel>
                                        <FormControl><Input placeholder="e.g., Angulo Transportation" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactFirstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact First Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactLastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Last Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="contact@owner.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input type="tel" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
     </div>
  );
}
