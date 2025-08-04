
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { AppSidebar } from '@/components/layout/sidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  // If user is authenticated, but trying to access login/signup, redirect to dashboard
  useEffect(() => {
    if (user && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/dashboard');
    }
  }, [user, pathname, router]);


  if (loading || !user) {
    // This allows the login/signup pages (which are not part of this layout) to render themselves
    // For all other pages that are part of this layout, it shows a skeleton
     if (pathname === '/login' || pathname === '/signup') {
       return null; 
    }
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-full max-w-lg space-y-4 p-4">
          <div className="flex gap-4">
             <Skeleton className="h-screen w-16" />
             <div className="flex-1 space-y-4 pt-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  // This case should ideally be handled by the useEffect above, but as a fallback
  if (pathname === '/login' || pathname === '/signup') {
    return null; // Return null to prevent flicker while redirecting
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar user={user} />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
