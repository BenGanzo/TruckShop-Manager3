
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
import { ArrowLeft, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AddOwnerPage() {
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, this would be a proper form submission
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Placeholder for save logic
        console.log('Saving owner...');
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
                <Link href="/owners">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Owners</span>
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Add New Owner
            </h1>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Owner"}
            </Button>
      </div>
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                    <CardTitle className="text-2xl font-headline">Owner Information</CardTitle>
                    <CardDescription>
                    Enter the details for the new owner.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="owner-name">Owner Name</Label>
                        <Input id="owner-name" placeholder="e.g., Angulo Transportation" required />
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
                        <Input id="email" type="email" placeholder="contact@owner.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" />
                    </div>
                </div>
            </CardContent>
        </form>
        </Card>
     </div>
  );
}
