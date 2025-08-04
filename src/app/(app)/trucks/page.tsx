
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
import Link from 'next/link';

const trucks: any[] = [];

export default function TrucksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Trucks
        </h1>
        <Button asChild>
          <Link href="/trucks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Truck
          </Link>
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
              Company Owned ({trucks.filter(t => t.owner === 'Company').length})
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
                    A list of all of your trucks in your fleet.
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
                    {trucks.length === 0 ? (
                       <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    ) : (
                      trucks.map((truck) => (
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
                      ))
                    )}
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
