'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { app } from '@/lib/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { TruckIcon } from 'lucide-react';
import Link from 'next/link';

const auth = getAuth(app);
const db = getFirestore(app);

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Use a batch write to create the company and the user document atomically
      const batch = writeBatch(db);

      // 1. Create a document for the new company
      const companyRef = doc(collection(db, 'mainCompanies'));
      batch.set(companyRef, {
        companyName: companyName,
        adminUid: user.uid,
        createdAt: new Date(),
      });
      
      // 2. Create the first user (admin) in the users subcollection
      const userRef = doc(collection(companyRef, 'users'), user.uid);
      batch.set(userRef, {
        email: user.email,
        role: 'admin', // Assign the 'admin' role
        createdAt: new Date(),
      });
      
      // Commit the batch
      await batch.commit();
      
      toast({
        title: "Account Created!",
        description: "Your company account has been successfully created.",
      });

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


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
      <form onSubmit={handleSignUp}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              placeholder="e.g., Angulo Transportation" 
              required 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Your Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@yourcompany.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
         <div className="text-sm text-center">
            Already have an account?{' '}
            <Link href="/login" className="underline">
                Sign in
            </Link>
        </div>
        </CardFooter>
      </form>
    </Card>
  );
}
