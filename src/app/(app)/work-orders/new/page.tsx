
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
import WorkOrderForm from '@/components/work-order-form';
import WorkOrderPartsLaborForm from '@/components/work-order-parts-labor-form';

export default function CreateWorkOrderPage() {
  const [arrivalDate, setArrivalDate] = React.useState<Date | undefined>();
  const [departureDate, setDepartureDate] = React.useState<Date | undefined>();
  const [nextServiceDate, setNextServiceDate] = React.useState<Date | undefined>();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
           <Button variant="outline">
            <Lock className="mr-2 h-4 w-4" />
            Save and Go
          </Button>
          <Button>Save Work Order</Button>
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
                <Select>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck-1">T-101</SelectItem>
                    <SelectItem value="truck-2">T-102</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mechanic">Assigned Mechanic</Label>
                <Select>
                  <SelectTrigger id="mechanic">
                    <SelectValue placeholder="Select a mechanic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mech-1">Benjamin G.</SelectItem>
                    <SelectItem value="mech-2">John Doe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="problem-description">Problem Description</Label>
                <Textarea
                  id="problem-description"
                  placeholder="e.g., Vehicle pulling to the right, grinding noise from front wheels..."
                  rows={3}
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
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input id="mileage" placeholder="0" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="next-service-miles">Next Service (Miles)</Label>
                    <Input id="next-service-miles" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Arrival Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !arrivalDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {arrivalDate ? (
                          format(arrivalDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={arrivalDate}
                        onSelect={setArrivalDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Departure Date</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !departureDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? (
                          format(departureDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Next Service (Date)</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !nextServiceDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextServiceDate ? (
                          format(nextServiceDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={nextServiceDate}
                        onSelect={setNextServiceDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
            </CardContent>
          </Card>
          
          <WorkOrderForm />
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
                        <Select defaultValue="open">
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
                                <Input type="number" defaultValue="8.25" className="w-20 h-8 text-right" />
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
                    <Button size="lg" className="w-full">Save Work Order</Button>
                    <Button size="lg" variant="outline" className="w-full">
                        <Lock className="mr-2 h-4 w-4" />
                        Save and Go to WO
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
