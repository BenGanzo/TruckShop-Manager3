'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TruckIcon } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
         <div className="mb-4 flex justify-center">
            <TruckIcon className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Create your Company Account</CardTitle>
        <CardDescription>
          Enter your company details and create your admin account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="e.g., Angulo Transportation" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Your Email</Label>
          <Input id="email" type="email" placeholder="admin@yourcompany.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Create Account</Button>
         <div className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="underline">
                Sign in
            </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
