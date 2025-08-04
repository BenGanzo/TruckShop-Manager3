'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Wrench,
  Truck,
  Boxes,
  Book,
  ShoppingCart,
  Users,
  DollarSign,
  User,
  Building,
  Upload,
  UserCircle,
  TruckIcon,
} from 'lucide-react';

import {
  SidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const RectangleHorizontal = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-rectangle-horizontal"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
  </svg>
);


export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <TruckIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold font-headline text-sidebar-foreground">
            TruckShop
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Assets</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard')}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutGrid />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/work-orders')}
                tooltip="Work Orders"
              >
                <Link href="/work-orders">
                  <Wrench />
                  <span>Work Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/trucks')} tooltip="Trucks">
                <Link href="/trucks">
                  <Truck />
                  <span>Trucks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/trailers')}
                tooltip="Trailers"
              >
                <Link href="/trailers">
                  <RectangleHorizontal />
                  <span>Trailers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/inventory')}
                tooltip="Inventory"
              >
                <Link href="/inventory">
                  <Boxes />
                  <span>Inventory</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/catalog')}
                tooltip="Parts & Labor Catalog"
              >
                <Link href="/catalog">
                  <Book />
                  <span>Parts & Labor Catalog</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/purchase-orders')}
                tooltip="Purchase Orders"
              >
                <Link href="/purchase-orders">
                  <ShoppingCart />
                  <span>Purchase Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/suppliers')}
                tooltip="Suppliers"
              >
                <Link href="/suppliers">
                  <Users />
                  <span>Suppliers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/finance')}
                tooltip="Finance"
              >
                <Link href="/finance">
                  <DollarSign />
                  <span>Finance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin/users')} tooltip="Users">
                <Link href="/admin/users">
                  <User />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/admin/owners')} tooltip="Owners">
                <Link href="/admin/owners">
                  <Building />
                  <span>Owners</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <SidebarMenuButton asChild isActive={isActive('/admin/import')} tooltip="Import Data">
                <Link href="/admin/import">
                  <Upload />
                  <span>Import Data</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2 bg-sidebar-border" />
        <div className="p-4">
          <div className="flex items-center gap-3">
            <UserCircle className="w-10 h-10 text-sidebar-foreground" />
            <div className="overflow-hidden">
              <p className="font-semibold truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">admin@truckshop.com</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
