
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addUser } from '@/app/actions';
import Link from 'next/link';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const companyId = useCompanyId();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not identify your company. Please wait and try again.' });
      return;
    }
    if (!role) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please select a role for the user.' });
      return;
    }
    setIsLoading(true);

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    const result = await addUser(companyId, userData);

    setIsLoading(false);
    if (result.success) {
      toast({
        title: 'User Created!',
        description: 'The new user has been added successfully.',
      });
      router.push('/admin/users');
    } else {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: result.error,
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Users</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Add New User
          </h1>
        </div>
        <Button onClick={handleAddUser} disabled={isLoading || !companyId}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Saving...' : 'Save User'}
        </Button>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <UserPlus className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-2xl font-headline">User Information</CardTitle>
              <CardDescription>
                Enter the details for the new user. They will be invited to the
                platform.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleAddUser}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
