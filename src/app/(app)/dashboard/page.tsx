
'use client';

import { useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getFirestore, query, where } from 'firebase/firestore';
import { app, auth } from '@/lib/firebase';
import type { CatalogPart, Truck, WorkOrder } from '@/lib/types';
import { setInitialAdminClaims } from '@/app/actions';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Archive,
  CheckCircle,
  DollarSign,
  Truck as TruckIcon,
  Wrench,
} from 'lucide-react';
import { DashboardCharts } from '@/components/dashboard-charts';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_EMAILS = ['ganzobenjamin1301@gmail.com', 'davidtariosmg@gmail.com'];

const getCompanyIdFromEmail = (email: string | null | undefined) => {
  if (!email) return '';
  if (ADMIN_EMAILS.includes(email)) return 'angulo-transportation';
  const domain = email.split('@')[1];
  return domain ? domain.split('.')[0] : '';
};

const StatCard = ({ title, value, subtext, icon: Icon, isLoading }: { title: string, value: string, subtext?: string, icon: React.ElementType, isLoading: boolean }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <>
                <Skeleton className="h-8 w-1/2" />
                {subtext && <Skeleton className="h-4 w-2/3 mt-1" />}
            </>
        ) : (
            <>
                <div className="text-2xl font-bold">{value}</div>
                {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
            </>
        )}
      </CardContent>
    </Card>
);


export default function DashboardPage() {
  const [user, userLoading] = useAuthState(auth);
  const companyId = useMemo(() => getCompanyIdFromEmail(user?.email), [user?.email]);
  const db = getFirestore(app);
  const DEFAULT_TAX_RATE = 8.25 / 100; // 8.25%

  // Data Hooks
  const [trucksSnapshot, trucksLoading] = useCollection(companyId ? collection(db, 'mainCompanies', companyId, 'trucks') : null);
  const [trailersSnapshot, trailersLoading] = useCollection(companyId ? collection(db, 'mainCompanies', companyId, 'trailers') : null);
  const [workOrdersSnapshot, workOrdersLoading] = useCollection(companyId ? collection(db, 'mainCompanies', companyId, 'workOrders') : null);
  const [catalogSnapshot, catalogLoading] = useCollection(companyId ? query(collection(db, 'mainCompanies', companyId, 'catalog'), where('type', '==', 'part')) : null);
  
  const isLoading = userLoading || trucksLoading || trailersLoading || workOrdersLoading || catalogLoading;

  const metrics = useMemo(() => {
    const activeTrucks = trucksSnapshot?.docs.filter(doc => (doc.data() as Truck).isActive).length || 0;
    const activeTrailers = trailersSnapshot?.docs.filter(doc => (doc.data() as any).isActive).length || 0;
    
    const workOrders = workOrdersSnapshot?.docs.map(doc => doc.data() as WorkOrder) || [];
    const openWorkOrders = workOrders.filter(wo => wo.status?.toLowerCase() !== 'completed' && wo.status?.toLowerCase() !== 'closed').length;
    const completedRepairs = workOrders.length - openWorkOrders;

    const inventoryValue = catalogSnapshot?.docs.reduce((sum, doc) => {
        const part = doc.data() as CatalogPart;
        const cost = part.cost * part.quantity;
        const tax = part.isTaxable ? cost * DEFAULT_TAX_RATE : 0;
        return sum + cost + tax;
    }, 0) || 0;

    return {
        activeVehicles: activeTrucks + activeTrailers,
        openWorkOrders,
        completedRepairs,
        inventoryValue
    };
  }, [trucksSnapshot, trailersSnapshot, workOrdersSnapshot, catalogSnapshot]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Dashboard
      </h1>
      {/* --- CÓDIGO DEL BOTÓN --- */}
<button
  onClick={async () => {
    alert("Intentando asignar tus permisos de administrador...");
    const result = await setInitialAdminClaims(); // Llama a la herramienta que acabamos de añadir
    if (result.success) {
      alert("¡Éxito! Tus permisos han sido asignados. Por favor, CIERRA SESIÓN Y VUELVE A INICIAR SESIÓN inmediatamente.");
    } else {
      alert(`Error: ${result.error}`);
    }
  }}
  className="bg-red-500 text-white p-2 rounded-md my-4"
>
  Asignar Mis Permisos de Admin (USAR UNA SOLA VEZ)
</button>
{/* ------------------------- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard 
            title="Total Revenue"
            value="$45,231.89"
            subtext="+20.1% from last month"
            icon={DollarSign}
            isLoading={isLoading}
        />
        <StatCard 
            title="Active Vehicles"
            value={String(metrics.activeVehicles)}
            subtext="Trucks & Trailers"
            icon={TruckIcon}
            isLoading={isLoading}
        />
        <StatCard 
            title="Open Work Orders"
            value={String(metrics.openWorkOrders)}
            subtext="Currently in shop or pending"
            icon={Wrench}
            isLoading={isLoading}
        />
         <StatCard 
            title="Completed Repairs"
            value={String(metrics.completedRepairs)}
            subtext="This month"
            icon={CheckCircle}
            isLoading={isLoading}
        />
        <StatCard 
            title="Inventory Value"
            value={`$${metrics.inventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtext="Value of all parts including tax"
            icon={Archive}
            isLoading={isLoading}
        />
      </div>
      <DashboardCharts />
    </div>
  );
}
