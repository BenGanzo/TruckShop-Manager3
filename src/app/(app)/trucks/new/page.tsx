
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
import { ArrowLeft, CalendarIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { addTruck } from '@/app/actions';
import {
  Form,
  FormControl,
  FormDescription,
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

const truckFormSchema = z.object({
  id: z.string().min(1, 'Truck ID is required.'),
  status: z.string().min(1, 'Status is required.'),
  make: z.string().optional(),
  model: z.string().optional(),
  engineMake: z.string().optional(),
  engineModel: z.string().optional(),
  engineSerial: z.string().optional(),
  type: z.string().optional(),
  vin: z.string().optional(),
  year: z.coerce.number().optional(),
  titleNumber: z.string().optional(),
  plateNumber: z.string().optional(),
  state: z.string().optional(),
  inServiceOn: z.date().optional(),
  tagExpireOn: z.date().optional(),
  inspectionDueOn: z.date().optional(),
  purchasePrice: z.coerce.number().optional(),
  ownedBy: z.string().optional(),
  lessor: z.string().optional(),
  insuranceCoverage: z.boolean().default(false),
  transmission: z.string().optional(),
  color: z.string().optional(),
  speedLimit: z.coerce.number().optional(),
  frontTireSize: z.string().optional(),
  rearTireSize: z.string().optional(),
  height: z.string().optional(),
  emptyWeight: z.coerce.number().optional(),
  grossWeight: z.coerce.number().optional(),
  tankCapacity: z.coerce.number().optional(),
  initialMileage: z.coerce.number().optional(),
  averageMpg: z.coerce.number().optional(),
  axles: z.coerce.number().optional(),
  dashCamera: z.boolean().default(false),
  apu: z.boolean().default(false),
  pedalCoach: z.boolean().default(false),
  laneDeparture: z.boolean().default(false),
  tireChains: z.boolean().default(false),
  vSpoilers: z.boolean().default(false),
  adaptiveCruise: z.boolean().default(false),
  inverter: z.boolean().default(false),
  hasPets: z.boolean().default(false),
  flowBelow: z.boolean().default(false),
  refrigerator: z.boolean().default(false),
  bunkHeater: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type TruckFormData = z.infer<typeof truckFormSchema>;

export default function AddTruckPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const companyId = React.useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);

  const form = useForm<TruckFormData>({
    resolver: zodResolver(truckFormSchema),
    defaultValues: {
      status: 'active',
      isActive: true,
      insuranceCoverage: false,
      dashCamera: false,
      apu: false,
      pedalCoach: false,
      laneDeparture: false,
      tireChains: false,
      vSpoilers: false,
      adaptiveCruise: false,
      inverter: false,
      hasPets: false,
      flowBelow: false,
      refrigerator: false,
      bunkHeater: false,
    },
  });

  const onSubmit = async (data: TruckFormData) => {
    if (!companyId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company.' });
        return;
    }
    setIsLoading(true);
    try {
        const result = await addTruck(companyId, data);
        if (result.success) {
            toast({ title: 'Truck Added!', description: 'The new truck has been saved successfully.' });
            router.push('/trucks');
        } else {
            throw new Error(result.error);
        }
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Save Failed', description: error.message || 'An unknown error occurred.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/trucks">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Trucks</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Add Truck
            </h1>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Truck'}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Details</CardTitle>
              <CardDescription>
                Enter the primary identification and status information for the
                truck.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Truck ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., T-106" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="out-of-service">Out of Service</SelectItem>
                        <SelectItem value="in-shop">In Shop</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="make" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl><Input placeholder="e.g., Freightliner" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="model" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl><Input placeholder="e.g., Cascadia" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="engineMake" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Make</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="engineModel" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Model</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="engineSerial" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Serial</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl><Input placeholder="e.g., Sleeper" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="vin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIN</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="year" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="titleNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="plateNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Plate</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Important Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="inServiceOn" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>In Service On</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="tagExpireOn" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tags Expire On</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="inspectionDueOn" render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Inspection On</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ownership &amp; Financials</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="ownedBy" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owned By</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select an owner" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="company">Company Owned</SelectItem>
                        <SelectItem value="leased">Leased</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="lessor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lessor</FormLabel>
                    <FormControl><Input placeholder="Leasing company name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField control={form.control} name="insuranceCoverage" render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 pt-6">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Covered by reporting insurance company</FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vehicle Options / Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                 <FormField control={form.control} name="transmission" render={({ field }) => (<FormItem><FormLabel>Transmission</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="color" render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="speedLimit" render={({ field }) => (<FormItem><FormLabel>Speed Limit</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="frontTireSize" render={({ field }) => (<FormItem><FormLabel>Front Tire Size</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="rearTireSize" render={({ field }) => (<FormItem><FormLabel>Rear Tire Size</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="emptyWeight" render={({ field }) => (<FormItem><FormLabel>Empty Weight</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="grossWeight" render={({ field }) => (<FormItem><FormLabel>Gross Weight</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="tankCapacity" render={({ field }) => (<FormItem><FormLabel>Tank Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="initialMileage" render={({ field }) => (<FormItem><FormLabel>Initial Mileage</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="averageMpg" render={({ field }) => (<FormItem><FormLabel>Average MPG</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="axles" render={({ field }) => (<FormItem><FormLabel>Axles</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { name: 'dashCamera', label: 'Dash Camera' },
                    { name: 'apu', label: 'APU' },
                    { name: 'pedalCoach', label: 'Pedal Coach' },
                    { name: 'laneDeparture', label: 'Lane Departure' },
                    { name: 'tireChains', label: 'Tire Chains' },
                    { name: 'vSpoilers', label: 'V-Spoilers' },
                    { name: 'adaptiveCruise', label: 'Adaptive Cruise' },
                    { name: 'inverter', label: 'Inverter' },
                    { name: 'hasPets', label: 'Has Pets' },
                    { name: 'flowBelow', label: 'Flow Below' },
                    { name: 'refrigerator', label: 'Refrigerator' },
                    { name: 'bunkHeater', label: 'Bunk Heater' },
                  ].map(item => (
                    <FormField key={item.name} control={form.control} name={item.name as keyof TruckFormData} render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl><Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel>{item.label}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
