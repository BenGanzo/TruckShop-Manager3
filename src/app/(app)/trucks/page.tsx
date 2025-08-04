
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building, PlusCircle, Search, Truck } from "lucide-react";

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
        <Card className="lg:col-start-1">
          <CardHeader>
            <CardTitle>Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Button
                variant="ghost"
                className="justify-start gap-2 px-2 bg-muted"
              >
                <Truck className="h-4 w-4" />
                All Trucks (0)
              </Button>
              <Button variant="ghost" className="justify-start gap-2 px-2">
                <Building className="h-4 w-4" />
                Company Owned (0)
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-start-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>All Trucks</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A list of all trucks in your fleet.
                  </p>
                </div>
                <div className="mt-2 text-sm font-medium text-right md:mt-0">
                  Active count: 0
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trucks by ID, make, model, or VIN..."
                  className="pl-8 w-full"
                />
              </div>

              <div className="mt-4 rounded-md border">
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
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
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
