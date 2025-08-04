import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building,
  ChevronRight,
  PlusCircle,
  Search,
  Truck,
} from 'lucide-react';

const trucks = [
  {
    id: 'A01',
    make: 'Kenworth',
    model: 'T680',
    licensePlate: 'R369185',
    vin: 'TXXYD49X3FJ429090',
    status: 'Out of Service',
    tagsExpire: '2025-03-31',
    nextInspection: '2026-02-28',
  },
  {
    id: 'A02',
    make: 'Freightliner',
    model: 'Cascadia',
    licensePlate: 'R674333',
    vin: '3ALXGF0D0KDL4344',
    status: 'Active',
    tagsExpire: '2025-03-31',
    nextInspection: '2026-05-31',
  },
  {
    id: 'A03',
    make: 'Peterbilt',
    model: '579',
    licensePlate: 'R696741',
    vin: 'TKPBD49X2JD465631',
    status: 'Active',
    tagsExpire: '2025-03-31',
    nextInspection: '2026-08-30',
  },
  {
    id: 'A04',
    make: 'INTERNATIONAL',
    model: '625',
    licensePlate: 'R759157',
    vin: '3HSDZAPR5FN798472',
    status: 'Active',
    tagsExpire: '2025-10-31',
    nextInspection: '2025-10-31',
  },
  {
    id: 'A05',
    make: 'INTERNATIONAL',
    model: '625',
    licensePlate: 'R759158',
    vin: '3HSDZAPR5FN798471',
    status: 'Active',
    tagsExpire: '2025-10-31',
    nextInspection: '2025-10-31',
  },
  {
    id: 'A06',
    make: 'INTERNATIONAL',
    model: '625',
    licensePlate: 'R759159',
    vin: '3HSDZAPR5FN798470',
    status: 'Active',
    tagsExpire: '2025-10-31',
    nextInspection: '2025-10-31',
  },
  {
    id: 'A07',
    make: 'INTERNATIONAL',
    model: 'LT',
    licensePlate: 'R765557',
    vin: '3HSDZAPR7FN798466',
    status: 'Active',
    tagsExpire: '2025-11-30',
    nextInspection: '2025-11-30',
  },
  {
    id: 'A08',
    make: 'INTERNATIONAL',
    model: 'LT',
    licensePlate: 'R765558',
    vin: '3HSDZAPR7SN798468',
    status: 'Active',
    tagsExpire: '2025-11-30',
    nextInspection: '2025-11-30',
  },
  {
    id: 'A09',
    make: 'Volvo',
    model: 'VNL860',
    licensePlate: 'R489050',
    vin: '4V4NC9EH8MN272194',
    status: 'Active',
    tagsExpire: '2026-05-31',
    nextInspection: '2026-05-31',
  },
  {
    id: 'A10',
    make: 'INTERNATIONAL',
    model: 'R765559',
    licensePlate: 'R765559',
    vin: '3HSDZAPR2SN798469',
    status: 'Active',
    tagsExpire: 'N/A',
    nextInspection: '2025-11-30',
  },
  {
    id: 'A11',
    make: 'Volvo',
    model: 'VNL860',
    licensePlate: 'R489052',
    vin: '4V4NC9EHOMN272206',
    status: 'Out of Service',
    tagsExpire: '2024-03-31',
    nextInspection: '2025-05-31',
  },
  {
    id: 'A12',
    make: 'Kenworth',
    model: 'T680',
    licensePlate: 'R720283',
    vin: 'TXXYD49X3MJ469772',
    status: 'Active',
    tagsExpire: '2025-03-31',
    nextInspection: '2026-01-31',
  },
];

export default function TrucksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Trucks
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Truck
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="lg:col-start-1">
          <h2 className="text-xl font-semibold tracking-tight font-headline mb-4">
            Groups
          </h2>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-2 px-2 bg-muted font-semibold"
            >
              <ChevronRight className="h-4 w-4" />
              All Trucks ({trucks.length})
            </Button>
            <Button variant="ghost" className="justify-start gap-2 px-2">
              <Building className="h-4 w-4" />
              Company Owned ({trucks.length})
            </Button>
            <Button variant="ghost" className="justify-start gap-2 px-2">
              <Truck className="h-4 w-4" />
              Impex IOI
            </Button>
          </div>
        </div>

        <div className="lg:col-start-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle>All Trucks</CardTitle>
                  <CardDescription className="mt-1">
                    A list of all trucks in your fleet.
                  </CardDescription>
                </div>
                <div className="mt-2 text-sm font-medium text-right md:mt-0">
                  Active count: {trucks.filter(t => t.status === 'Active').length}
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trucks by ID, make, model, or VIN..."
                  className="pl-8 w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>VIN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags Expire</TableHead>
                      <TableHead>Next Inspection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trucks.map((truck) => (
                      <TableRow key={truck.id}>
                        <TableCell className="font-medium">{truck.id}</TableCell>
                        <TableCell>{truck.make}</TableCell>
                        <TableCell>{truck.model}</TableCell>
                        <TableCell>{truck.licensePlate}</TableCell>
                        <TableCell>{truck.vin}</TableCell>
                        <TableCell>
                           <Badge
                            variant={
                              truck.status === 'Active'
                                ? 'active'
                                : 'destructive'
                            }
                          >
                            {truck.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{truck.tagsExpire}</TableCell>
                        <TableCell>{truck.nextInspection}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
