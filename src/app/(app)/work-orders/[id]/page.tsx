
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function WorkOrderDetailsPage() {
    const params = useParams();
    const workOrderId = params.id;

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Work Order #{workOrderId}
                    </h1>
                    <p className="text-muted-foreground">
                        View details, update status, and print the work order.
                    </p>
                </div>
                <Button asChild>
                    <Link href={`/work-orders/${workOrderId}/print`}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Work Order Details</CardTitle>
                    <CardDescription>
                        This is where the full details of the work order will be displayed for editing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Work in progress. The full editable form will be built here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
