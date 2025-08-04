
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon, Lock } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createWorkOrder } from '@/app/actions';

import WorkOrderForm from '@/components/work-order-form';
import WorkOrderPartsLaborForm from '@/components/work-order-parts-labor-form';
import { useRouter } from 'next/navigation';

const workOrderSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required.'),
  mechanicId: z.string().min(1, 'Mechanic is required.'),
  problemDescription: z.string().min(1, 'Problem description is required.'),
  arrivalDate: z.date().optional(),
  departureDate: z.date().optional(),
  nextServiceDate: z.date().optional(),
  currentMileage: z.number().optional(),
  nextServiceMiles: z.number().optional(),
  status: z.string().default('open'),
  parts: z.array(z.any()).default([]), // Placeholder for parts
  labor: z.array(z.any()).default([]), // Placeholder for labor
  taxRate: z.number().default(8.25),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;


export default function CreateWorkOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      status: 'open',
      problemDescription: '',
      parts: [],
      labor: [],
      taxRate: 8.25,
    },
  });

  const { control, handleSubmit, setValue } = form;

  const handleSave = async (data: WorkOrderFormData) => {
      setIsLoading(true);
      try {
        const result = await createWorkOrder(data);
        if (result.success && result.workOrderId) {
            toast({
                title: 'Work Order Created!',
                description: `Work Order #${result.workOrderId} has been saved successfully.`
            });
            // Redirect to the new work order page
            router.push(`/work-orders/${result.workOrderId}`);
        } else {
             throw new Error(result.error || 'Failed to create work order.');
        }
      } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Error Saving Work Order',
            description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/work-orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Work Orders</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Create New Work Order
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Work Order'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Order Details</CardTitle>
              <CardDescription>
                Select a vehicle and describe the reported issue.
                <span className="block text-right font-mono text-sm text-muted-foreground">WO-1</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                 <Controller
                    name="vehicleId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="vehicle">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="truck-1">T-101</SelectItem>
                            <SelectItem value="truck-2">T-102</SelectItem>
                          </SelectContent>
                        </Select>
                    )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mechanic">Assigned Mechanic</Label>
                 <Controller
                    name="mechanicId"
                    control={control}
                    render={({ field }) => (
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger id="mechanic">
                            <SelectValue placeholder="Select a mechanic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mech-1">Benjamin G.</SelectItem>
                            <SelectItem value="mech-2">John Doe</SelectItem>
                          </SelectContent>
                        </Select>
                    )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="problem-description">Problem Description</Label>
                 <Controller
                    name="problemDescription"
                    control={control}
                    render={({ field }) => (
                         <Textarea
                          id="problem-description"
                          placeholder="e.g., Vehicle pulling to the right, grinding noise from front wheels..."
                          rows={3}
                          {...field}
                        />
                    )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Metrics & Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Arrival Date</Label>
                   <Controller
                      name="arrivalDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Controller
                        name="currentMileage"
                        control={control}
                        render={({ field }) => <Input id="mileage" type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />}
                    />
                </div>
                <div className="space-y-2">
                  <Label>Next Service (Date)</Label>
                    <Controller
                      name="nextServiceDate"
                      control={control}
                      render={({ field }) => (
                         <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="next-service-miles">Next Service (Miles)</Label>
                     <Controller
                        name="nextServiceMiles"
                        control={control}
                        render={({ field }) => <Input id="next-service-miles" type="number" placeholder="0" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} />}
                    />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label>Departure Date</Label>
                    <Controller
                      name="departureDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                       )}
                    />
                </div>
            </CardContent>
          </Card>
          
          <WorkOrderForm
            problemDescription={form.watch('problemDescription')}
            onDescriptionChange={(value) => setValue('problemDescription', value, { shouldValidate: true })}
          />
          <WorkOrderPartsLaborForm />

        </div>

        <div className="lg:col-span-1">
            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="on-hold">On Hold</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between">
                            <span>Parts Total:</span>
                            <span>$0.00</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Labor Total:</span>
                            <span>$0.00</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span>Tax:</span>
                            <div className="flex items-center gap-2">
                                <Controller
                                    name="taxRate"
                                    control={control}
                                    render={({ field }) => <Input type="number" {...field} className="w-20 h-8 text-right" onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />}
                                />
                                <span>%</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Grand Total:</span>
                            <span>$0.00</span>
                        </div>
                    </div>
                </CardContent>
                <CardContent className="flex flex-col gap-2">
                    <Button size="lg" className="w-full" type="submit" disabled={isLoading}>
                         {isLoading ? 'Saving...' : 'Save Work Order'}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full" type="button" onClick={handleSubmit((data) => {
                        // This would have different logic, e.g., redirecting after saving
                        handleSave(data);
                    })} disabled={isLoading}>
                        <Lock className="mr-2 h-4 w-4" />
                        Save and Go to WO
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </form>
  );
}
