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
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // Don't show skeleton for auth pages, just the page content
    if (pathname === '/login' || pathname === '/signup') {
       return <>{children}</>;
    }
    // Show a loading skeleton for protected app pages
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // If user is authenticated, but trying to access login/signup, redirect to dashboard
  if (pathname === '/login' || pathname === '/signup') {
    router.replace('/dashboard');
    return null; // Return null to prevent flicker
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
