
'use client';

import * as React from 'react';
import {
  ArrowLeft,
  CalendarIcon,
  Pencil,
  RefreshCw,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function AddTrailerPage() {
  const [purchaseDate, setPurchaseDate] = React.useState<Date | undefined>();
  const [saleDate, setSaleDate] = React.useState<Date | undefined>();
  const [inServiceDate, setInServiceDate] = React.useState<Date | undefined>();
  const [tagsExpireDate, setTagsExpireDate] = React.useState<Date | undefined>();
  const [nextInspectionDate, setNextInspectionDate] = React.useState<Date | undefined>();
  const [subscriptionStartDate, setSubscriptionStartDate] = React.useState<Date | undefined>();
  const [carbExpireDate, setCarbExpireDate] = React.useState<Date | undefined>();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/trailers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Trailers</span>
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              Add Trailer
            </h1>
            <div className="flex items-center gap-2">
              <Input id="trailer-id" placeholder="A133" className="w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="status-active" defaultChecked />
              <Label htmlFor="status-active">Active</Label>
            </div>
          </div>
        </div>
        <Button>Save Trailer</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Column 1 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Reefer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reefer">Reefer</SelectItem>
                      <SelectItem value="dry-van">Dry Van</SelectItem>
                      <SelectItem value="flatbed">Flatbed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" placeholder="UTILITY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="make-year">Make year</Label>
                  <Input id="make-year" placeholder="2018" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="REEFER" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input id="vin" placeholder="3UTV52530J8031410" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title-number">Title number</Label>
                  <Input id="title-number" />
                </div>
                <div className="grid grid-cols-[1fr_80px] gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="license-plate">License plate</Label>
                    <Input id="license-plate" placeholder="22-6294D" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="ME" />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <div className="space-y-2">
                    <Label>Purchase date / price</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn('w-full justify-start text-left font-normal', !purchaseDate && 'text-muted-foreground')}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {purchaseDate ? format(purchaseDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                   <div className="space-y-2">
                    <Label>&nbsp;</Label>
                     <Input type="number" placeholder="Price" />
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_120px] gap-2">
                   <div className="space-y-2">
                    <Label>Sale date / price</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn('w-full justify-start text-left font-normal', !saleDate && 'text-muted-foreground')}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {saleDate ? format(saleDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={saleDate} onSelect={setSaleDate} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                   <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Input type="number" placeholder="Price" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financed-by">Financed by</Label>
                  <Input id="financed-by" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="leasing-company">Leasing company</Label>
                  <Input id="leasing-company" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="lease-reference">Lease reference</Label>
                  <Input id="lease-reference" />
                </div>
                 <div className="space-y-2">
                  <Label>In service on</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !inServiceDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {inServiceDate ? format(inServiceDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={inServiceDate} onSelect={setInServiceDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                  <Label>Tags expire on</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !tagsExpireDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tagsExpireDate ? format(tagsExpireDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tagsExpireDate} onSelect={setTagsExpireDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                  <Label>Next inspection on</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !nextInspectionDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {nextInspectionDate ? format(nextInspectionDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={nextInspectionDate} onSelect={setNextInspectionDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ownership</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="owned-by">Owned by</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Company owned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company owned</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessor">Lessor</Label>
                <div className="flex gap-2">
                  <Input id="lessor" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:col-span-2 pt-4">
                <Checkbox id="insurance-coverage" />
                <Label htmlFor="insurance-coverage">
                  Covered by reporting insurance company
                </Label>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking-type">Tracking type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Unspecified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gps">GPS</SelectItem>
                      <SelectItem value="rfid">RFID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-serial">Unit serial number</Label>
                  <Input id="unit-serial" />
                </div>
                <div className="space-y-2">
                  <Label>Subscription start date</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !subscriptionStartDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {subscriptionStartDate ? format(subscriptionStartDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={subscriptionStartDate} onSelect={setSubscriptionStartDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking-device">Tracking device</Label>
                  <div className="flex gap-2">
                    <Input id="tracking-device" />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfid-tag">RFID Tag</Label>
                  <Input id="rfid-tag" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reefer unit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reefer-brand">Brand</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Unspecified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carrier">Carrier</SelectItem>
                      <SelectItem value="thermo-king">Thermo King</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="reefer-model">Model</Label>
                  <Input id="reefer-model" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="reefer-year">Year</Label>
                  <Input id="reefer-year" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reefer-type">Type</Label>
                   <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Unspecified" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="single-temp">Single-Temp</SelectItem>
                       <SelectItem value="multi-temp">Multi-Temp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="reefer-serial">Serial number</Label>
                  <Input id="reefer-serial" />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="carb-compliant" />
                    <Label htmlFor="carb-compliant">CARB compliant</Label>
                </div>
                 <div className="space-y-2">
                  <Label>CARB expire</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn('w-full justify-start text-left font-normal', !carbExpireDate && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {carbExpireDate ? format(carbExpireDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={carbExpireDate} onSelect={setCarbExpireDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="carb-number">CARB number</Label>
                  <Input id="carb-number" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="reefer-details">Details</Label>
                  <Textarea id="reefer-details" rows={2}/>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Trailer options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input id="color" placeholder="WHITE" />
              </div>

              {['Roof material', 'Wall material', 'Floor material', 'Wheel types', 'Wheel seal type', 'Inflation system', 'Tire size', 'Wheel mount type', 'Door type', 'Slider type', 'Suspension type', 'Lights type'].map(label => (
                <div className="space-y-2" key={label}>
                  <Label>{label}</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Unspecified" /></SelectTrigger>
                    <SelectContent><SelectItem value="unspecified">Unspecified</SelectItem></SelectContent>
                  </Select>
                </div>
              ))}
              
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input id="length" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="internal-width">Internal width</Label>
                <Input id="internal-width" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="dry-weight">Dry weight</Label>
                <Input id="dry-weight" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                      {id: "e-tracks", label: "E-Tracks"},
                      {id: "tire-rack", label: "Tire rack"},
                      {id: "side-skirts", label: "Side skirts"},
                      {id: "logistical-posts", label: "Logistical posts"},
                      {id: "registration-holder", label: "Registration holder"},
                      {id: "rail-road-ready", label: "Rail road ready"},
                      {id: "tails", label: "Tails"},
                      {id: "onboard-scale", label: "Onboard scale"},
                      {id: "manifest-holder", label: "Manifest holder"},
                      {id: "has-decals", label: "Has decals"},
                  ].map(item => (
                    <div className="flex items-center space-x-2" key={item.id}>
                        <Checkbox id={item.id} />
                        <Label htmlFor={item.id}>{item.label}</Label>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
