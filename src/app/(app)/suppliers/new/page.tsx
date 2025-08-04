
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
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AddSupplierPage() {
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, this would be a proper form submission
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Placeholder for save logic
        console.log('Saving supplier...');
        setTimeout(() => {
            setIsLoading(false);
            // In a real app, you'd probably show a toast and redirect
        }, 1000);
    }

  return (
     <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/suppliers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Suppliers</span>
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Add New Supplier
            </h1>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Supplier"}
            </Button>
      </div>
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                    <CardTitle className="text-2xl font-headline">Supplier Information</CardTitle>
                    <CardDescription>
                    Enter the details for the new supplier.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="supplier-name">Supplier Name</Label>
                        <Input id="supplier-name" placeholder="e.g., Global Truck Parts Inc." required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-first-name">Contact First Name</Label>
                        <Input id="contact-first-name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-last-name">Contact Last Name</Label>
                        <Input id="contact-last-name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="contact@supplier.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" placeholder="https://supplier.com" />
                    </div>
                </div>
            </CardContent>
        </form>
        </Card>
     </div>
  );
}
