

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Building, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { updateCompany } from '@/app/actions';
import Link from 'next/link';

const db = getFirestore(app);

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const companyId = params.id as string;

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone1, setPhone1] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyData = async () => {
      setIsFetching(true);
      const companyDocRef = doc(db, 'mainCompanies', companyId);
      const companyDocSnap = await getDoc(companyDocRef);

      if (companyDocSnap.exists()) {
        const data = companyDocSnap.data();
        setCompanyName(data.companyName || '');
        setWebsite(data.website || '');
        setContactName(data.contactName || '');
        setAddress(data.address || '');
        setZip(data.zip || '');
        setState(data.state || '');
        setCity(data.city || '');
        setPhone1(data.phone1 || '');
      } else {
        toast({
          variant: 'destructive',
          title: 'Not Found',
          description: 'Company data could not be found.',
        });
        router.push('/admin/companies');
      }
      setIsFetching(false);
    };

    fetchCompanyData();
  }, [companyId, router, toast]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const companyData = {
        companyName,
        website,
        contactName,
        address,
        zip,
        state,
        city,
        phone1,
    };

    const result = await updateCompany(companyId, companyData);

    if (result.success) {
      toast({
        title: 'Company Updated!',
        description: 'The company details have been saved successfully.',
      });
      router.push('/admin/companies');
    } else {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.error || 'An unknown error occurred.',
      });
    }

    setIsLoading(false);
  };

  if (isFetching) {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
            </div>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/companies">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Companies</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Edit Company
                </h1>
            </div>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Building className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                        <CardTitle className="text-2xl font-headline">Company Information</CardTitle>
                        <CardDescription>
                            Update the details for this company. The Company ID cannot be changed.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSaveChanges}>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="text-lg font-semibold">Company ID: <span className="font-mono text-base bg-muted px-2 py-1 rounded">{companyId}</span></Label>
                        <Separator className="mt-2 mb-4"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="company-name">Company Name</Label>
                                <Input id="company-name" placeholder="e.g., Angulo Transportation Services, LLC" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="contact-name">Contact Name</Label>
                                <Input id="contact-name" required value={contactName} onChange={(e) => setContactName(e.target.value)} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip">Zip Code</Label>
                                    <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone1">Primary Phone</Label>
                                <Input id="phone1" type="tel" value={phone1} onChange={(e) => setPhone1(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" placeholder="https://example.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    </div>
  );
}
