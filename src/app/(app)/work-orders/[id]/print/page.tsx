
'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Printer, Truck } from 'lucide-react';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Placeholder data - In a real app, this would be fetched from Firestore based on the ID
const workOrder = {
  id: 'WO-1024',
  companyName: 'Angulo Transportation LLC',
  companyAddress: '123 Main Street, City, State 12345',
  companyPhone: '(123) 456-7890',
  vehicle: 'T-106',
  vin: '1A2B3C4D5E6F7G8H9',
  driver: 'Benjamin G.',
  problem: 'Truck is making a grinding noise when braking and pulling to the left. The check engine light is also on. Driver reports loss of power when going uphill.',
  arrivalDate: 'Aug 15, 2024',
  departureDate: 'Aug 17, 2024',
  mileage: '245,123 mi',
  parts: [
    { name: 'Front Brake Pad Set', qty: 1, cost: 75.99 },
    { name: 'Brake Rotor, Front', qty: 2, cost: 110.50 },
    { name: 'EGR Valve', qty: 1, cost: 235.00 },
    { name: 'Engine Oil Filter', qty: 1, cost: 25.00 },
  ],
  labor: [
    { description: 'Diagnose Check Engine Light', hours: 1, rate: 120.00 },
    { description: 'Replace Front Brake Pads and Rotors', hours: 2.5, rate: 120.00 },
    { description: 'Replace EGR Valve', hours: 1.5, rate: 120.00 },
  ],
  taxRate: 8.25,
};

const partsTotal = workOrder.parts.reduce((sum, part) => sum + part.qty * part.cost, 0);
const laborTotal = workOrder.labor.reduce((sum, item) => sum + item.hours * item.rate, 0);
const subtotal = partsTotal + laborTotal;
const taxAmount = subtotal * (workOrder.taxRate / 100);
const grandTotal = subtotal + taxAmount;


export default function PrintWorkOrderPage() {
  const params = useParams();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePdf = async () => {
    const input = invoiceRef.current;
    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Work-Order-${params.id}.pdf`);
    }
  };

  return (
    <div className="bg-background min-h-screen">
       <div className="p-4 md:p-8 print:p-0">
          <div ref={invoiceRef} className="max-w-4xl mx-auto p-8 bg-card text-card-foreground rounded-lg shadow-lg print:shadow-none print:rounded-none print:border-none print:p-2">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <Truck className="h-12 w-12 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold font-headline">{workOrder.companyName}</h1>
                        <p className="text-sm text-muted-foreground">{workOrder.companyAddress}</p>
                        <p className="text-sm text-muted-foreground">{workOrder.companyPhone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-primary">WORK ORDER</h2>
                    <p className="text-lg font-mono">{params.id}</p>
                </div>
            </div>

            {/* Vehicle and Date Info */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 border rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground">Vehicle ID</p>
                    <p className="font-semibold">{workOrder.vehicle}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-semibold">{workOrder.driver}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-semibold">{workOrder.mileage}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Arrival Date</p>
                    <p className="font-semibold">{workOrder.arrivalDate}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Departure Date</p>
                    <p className="font-semibold">{workOrder.departureDate}</p>
                </div>
            </div>

             {/* Problem Description */}
            <div className="mb-8">
                 <h3 className="font-semibold text-lg mb-2">Reported Problem</h3>
                 <p className="text-sm p-4 bg-muted rounded-lg">{workOrder.problem}</p>
            </div>

            {/* Parts */}
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Parts Used</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Part Name</TableHead>
                                <TableHead className="w-16 text-center">Qty</TableHead>
                                <TableHead className="w-28 text-right">Unit Cost</TableHead>
                                <TableHead className="w-28 text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workOrder.parts.map((part, i) => (
                                <TableRow key={i}>
                                    <TableCell>{part.name}</TableCell>
                                    <TableCell className="text-center">{part.qty}</TableCell>
                                    <TableCell className="text-right">${part.cost.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">${(part.qty * part.cost).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Labor */}
             <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Labor & Services</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-16 text-center">Hours</TableHead>
                                <TableHead className="w-28 text-right">Rate</TableHead>
                                <TableHead className="w-28 text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {workOrder.labor.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell className="text-center">{item.hours.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">${(item.hours * item.rate).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
                <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Parts Total:</span>
                        <span className="font-medium">${partsTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Labor Total:</span>
                        <span className="font-medium">${laborTotal.toFixed(2)}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ({workOrder.taxRate}%):</span>
                        <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Grand Total:</span>
                        <span>${grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Signature */}
            <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
                <p>Thank you for your business!</p>
                <div className="flex justify-around mt-16">
                    <div className="w-1/3 pt-2 border-t">
                        <p className="text-sm">Mechanic Signature</p>
                    </div>
                    <div className="w-1/3 pt-2 border-t">
                        <p className="text-sm">Driver Signature</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-4 flex justify-end gap-2 print:hidden">
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4"/>
                Print
              </Button>
               <Button variant="secondary" onClick={handleGeneratePdf}>
                <FileDown className="mr-2 h-4 w-4"/>
                Generate PDF
              </Button>
          </div>
       </div>
    </div>
  );
}
