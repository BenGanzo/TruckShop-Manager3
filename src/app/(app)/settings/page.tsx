
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
import { Separator } from '@/components/ui/separator';
import { Cog } from 'lucide-react';

export default function SettingsPage() {
  // Placeholder values. In the future, this will come from and save to Firestore.
  const settings = {
    oilChangeMileage: 20000,
    oilChangeDays: 90,
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Company Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your company-wide settings and maintenance rules.
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>
      <Separator />

      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5" />
              Preventive Maintenance Rules
            </CardTitle>
            <CardDescription>
              These rules apply to all vehicles in your fleet unless overridden
              on a specific vehicle. The system will use whichever threshold
              (miles or days) is met first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-lg">Oil Change</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="oil-change-mileage">
                  Mileage Interval (miles)
                </Label>
                <Input
                  id="oil-change-mileage"
                  type="number"
                  defaultValue={settings.oilChangeMileage}
                  placeholder="e.g., 20000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oil-change-days">Time Interval (days)</Label>
                <Input
                  id="oil-change-days"
                  type="number"
                  defaultValue={settings.oilChangeDays}
                  placeholder="e.g., 90"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Example: If set to 20,000 miles and 90 days, a service reminder
              will be triggered for a vehicle that has traveled 20,000 miles
              since the last service OR if 90 days have passed, whichever comes
              first.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
