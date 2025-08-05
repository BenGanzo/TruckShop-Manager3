
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, app } from '@/lib/firebase';
import { updateTrailer } from '@/app/actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore';
import type { Trailer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

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

const trailerFormSchema = z.object({
  id: z.string().min(1, 'Trailer ID is required.'),
  isActive: z.boolean().default(true),
  trailerType: z.string().optional(),
  make: z.string().optional(),
  makeYear: z.string().optional(),
  model: z.string().optional(),
  vin: z.string().optional(),
  plateNumber: z.string().optional(),
  state: z.string().optional(),
  ownerId: z.string().optional(),
  purchasedOn: z.date().optional(),
  tagExpireOn: z.date().optional(),
  inspectionDueOn: z.date().optional(),
});

type TrailerFormData = z.infer<typeof trailerFormSchema>;

export default function EditTrailerPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);

  const trailerId = params.id as string;
  const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);

  const form = useForm<TrailerFormData>({
    resolver: zodResolver(trailerFormSchema),
    defaultValues: {},
  });

  React.useEffect(() => {
    if (!trailerId || !companyId) return;

    const fetchTrailerData = async () => {
      setIsFetching(true);
      const trailerDocRef = doc(db, 'mainCompanies', companyId, 'trailers', trailerId);
      const trailerDocSnap = await getDoc(trailerDocRef);

      if (trailerDocSnap.exists()) {
        const data = trailerDocSnap.data() as Trailer;
        const formData = {
          ...data,
          purchasedOn: data.purchasedOn instanceof Timestamp ? data.purchasedOn.toDate() : undefined,
          tagExpireOn: data.tagExpireOn instanceof Timestamp ? data.tagExpireOn.toDate() : undefined,
          inspectionDueOn: data.inspectionDueOn instanceof Timestamp ? data.inspectionDueOn.toDate() : undefined,
        };
        form.reset(formData);
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: 'Trailer could not be found.',
        });
        router.push('/trailers');
      }
      setIsFetching(false);
    };

    fetchTrailerData();
  }, [trailerId, companyId, db, form, router, toast]);

  const onSubmit = async (data: TrailerFormData) => {
    if (!companyId || !trailerId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company or the trailer.' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await updateTrailer(companyId, trailerId, data);
      if (result.success) {
        toast({ title: 'Trailer Updated!', description: 'The trailer details have been saved successfully.' });
        router.push('/trailers');
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Save Failed', description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Card>
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/trailers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Trailers</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Edit Trailer
            </h1>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isLoading ? 'Saving...' : 'Save Trailer'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Main Details</CardTitle>
            <CardDescription>
              Update the primary identification and status information for the trailer.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 pt-6">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Is Active?</FormLabel>
                  </FormItem>
                )}
              />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trailer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField control={form.control} name="trailerType" render={({ field }) => (<FormItem><FormLabel>Trailer Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="make" render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="makeYear" render={({ field }) => (<FormItem><FormLabel>Make Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="vin" render={({ field }) => (<FormItem><FormLabel>VIN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="plateNumber" render={({ field }) => (<FormItem><FormLabel>Plate Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
