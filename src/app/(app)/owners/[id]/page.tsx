
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
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Loader2, Users, Save } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '@/lib/firebase';
import { updateOwner } from '@/app/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

// Helper function to derive companyId from email
const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (email === 'ganzobenjamin1301@gmail.com') {
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

export default function EditOwnerPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [user] = useAuthState(auth);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(true);

    const ownerId = params.id as string;
    const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
    const db = getFirestore(app);
    
    const form = useForm<OwnerFormData>({
        resolver: zodResolver(ownerFormSchema),
        defaultValues: {},
    });

    React.useEffect(() => {
        if (!ownerId || !companyId) return;

        const fetchOwnerData = async () => {
            setIsFetching(true);
            const ownerDocRef = doc(db, 'mainCompanies', companyId, 'owners', ownerId);
            const ownerDocSnap = await getDoc(ownerDocRef);

            if (ownerDocSnap.exists()) {
                const data = ownerDocSnap.data() as OwnerFormData;
                form.reset(data);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Not Found',
                    description: 'Owner could not be found.',
                });
                router.push('/owners');
            }
            setIsFetching(false);
        };

        fetchOwnerData();
    }, [ownerId, companyId, db, form, router, toast]);

    const onSubmit = async (data: OwnerFormData) => {
        if (!companyId || !ownerId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company or the owner.' });
            return;
        }
        setIsLoading(true);
        try {
            const result = await updateOwner(companyId, ownerId, data);
            if (result.success) {
                toast({ title: 'Owner Updated!', description: 'The owner details have been saved successfully.' });
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

  if (isFetching) {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
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
                    Edit Owner
                </h1>
            </div>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Owner Information</CardTitle>
                        <CardDescription>
                            Update the details for this owner.
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
