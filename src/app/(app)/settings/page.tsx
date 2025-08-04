
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Company Settings</h1>
            <Button>
                <Save className="mr-2 h-4 w-4" />
                Save All
            </Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Preventive Maintenance Rules</CardTitle>
                <CardDescription>
                    Set default maintenance intervals for your fleet. These will be used to calculate next service dates when a corresponding labor item is added to a work order.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6">
                    <div>
                        <h4 className="font-semibold">Standard Oil Change</h4>
                        <p className="text-sm text-muted-foreground">Applies to most trucks and trailers.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="oil-change-miles">Interval (Miles)</Label>
                            <Input id="oil-change-miles" type="number" placeholder="e.g., 20000" defaultValue="20000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="oil-change-days">Interval (Days)</Label>
                            <Input id="oil-change-days" type="number" placeholder="e.g., 90" defaultValue="90"/>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div>
                        <h4 className="font-semibold">Tire Rotation</h4>
                        <p className="text-sm text-muted-foreground">Standard interval for tire rotation.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tire-rotation-miles">Interval (Miles)</Label>
                            <Input id="tire-rotation-miles" type="number" placeholder="e.g., 50000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="tire-rotation-days">Interval (Days)</Label>
                            <Input id="tire-rotation-days" type="number" placeholder="e.g., 180" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
