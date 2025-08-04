
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, collection, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
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
import { Building, Terminal, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const auth = getAuth(app);
const db = getFirestore(app);

// Helper to generate a URL-friendly slug from a string
const generateCompanyId = (name: string) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};


export default function CreateCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State for form fields
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [phone1, setPhone1] = useState('');
  
  // Admin credentials state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Control state
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCompanyId, setGeneratedCompanyId] = useState('');

  const companyId = useMemo(() => generateCompanyId(companyName), [companyName]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!companyId) {
      toast({
        variant: 'destructive',
        title: 'Invalid Company Name',
        description: 'Please enter a valid company name to generate an ID.',
      });
      setIsLoading(false);
      return;
    }

    const companyDocRef = doc(db, 'mainCompanies', companyId);
    const companyDocSnap = await getDoc(companyDocRef);
    if (companyDocSnap.exists()) {
       toast({
        variant: 'destructive',
        title: 'Company ID Exists',
        description: 'This company ID is already taken. Please choose a different company name.',
      });
      setIsLoading(false);
      return;
    }

    try {
      const batch = writeBatch(db);
      let adminUid: string | null = null;
      let userEmail: string | null = null;

      // Create user only if email and password are provided
      if (email && password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        adminUid = user.uid;
        userEmail = user.email;

        const userDocRef = doc(collection(companyDocRef, 'users'), adminUid);
        batch.set(userDocRef, {
          email: userEmail,
          role: 'admin',
          firstName: contactFirstName,
          lastName: contactLastName,
          createdAt: serverTimestamp(),
        });
      }
      
      // Create the company document regardless
      const companyData: any = {
        companyId: companyId,
        companyName: companyName,
        website: website,
        contactName: `${contactFirstName} ${contactLastName}`.trim(),
        address: address,
        zip: zip,
        state: state,
        city: city,
        phone1: phone1,
        createdAt: serverTimestamp(),
      };

      if (adminUid) {
        companyData.adminUid = adminUid;
      }
      
      batch.set(companyDocRef, companyData);
      
      await batch.commit();

      setGeneratedCompanyId(companyId);
      
      toast({
        title: "Company Account Created!",
        description: "The new company has been successfully created.",
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateAnother = () => {
    setCompanyName('');
    setWebsite('');
    setContactFirstName('');
    setContactLastName('');
    setAddress('');
    setZip('');
    setState('');
    setCity('');
    setPhone1('');
    setEmail('');
    setPassword('');
    setGeneratedCompanyId('');
    setIsLoading(false);
  }

  if (generatedCompanyId) {
    return (
       <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <Building className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Company Created!</CardTitle>
            <CardDescription>
                Provide the new administrator with the Company ID and their credentials if they were created.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>New Company ID</AlertTitle>
                <AlertDescription>
                   <p className="mb-2">The new company administrator will need this ID to log in.</p>
                   <p className="text-center font-bold text-lg bg-muted p-2 rounded-md">
                        {generatedCompanyId}
                   </p>
                </AlertDescription>
            </Alert>
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={handleCreateAnother}>
              Create Another Company
            </Button>
        </CardFooter>
      </Card>
    )
  }


  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
             <Building className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
                <CardTitle className="text-2xl font-headline">Create a New Company</CardTitle>
                <CardDescription>
                  Enter the new company's details. You can optionally create an admin account now or do it later.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSignUp}>
        <CardContent className="space-y-6">
            <div>
                <Label className="text-lg font-semibold">Company Information</Label>
                <Separator className="mt-2 mb-4"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" placeholder="e.g., Angulo Transportation Services, LLC" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                         {companyId && (
                            <p className="text-sm text-muted-foreground">Generated ID: <span className="font-mono bg-muted px-2 py-1 rounded">{companyId}</span></p>
                        )}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-first-name">Contact First Name</Label>
                        <Input id="contact-first-name" required value={contactFirstName} onChange={(e) => setContactFirstName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-last-name">Contact Last Name</Label>
                        <Input id="contact-last-name" required value={contactLastName} onChange={(e) => setContactLastName(e.target.value)} />
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

            <div>
                 <Label className="text-lg font-semibold flex items-center gap-2"><UserPlus/> Admin Account (Optional)</Label>
                <Separator className="mt-2 mb-4"/>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Admin's Email</Label>
                        <Input id="email" type="email" placeholder="admin@theircompany.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Company'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
