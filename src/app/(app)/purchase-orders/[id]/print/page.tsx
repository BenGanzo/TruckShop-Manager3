
'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown, Printer, Truck, Building } from 'lucide-react';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Placeholder data
const purchaseOrder = {
  id: 'PO-2024-001',
  companyName: 'Angulo Transportation LLC',
  companyAddress: '123 Main Street, City, State 12345',
  companyPhone: '(123) 456-7890',
  supplier: {
      name: 'Global Truck Parts Inc.',
      address: '456 Supplier Ave, Partsville, State 54321',
      phone: '(987) 654-3210'
  },
  issueDate: 'Aug 20, 2024',
  deliveryDate: 'Aug 27, 2024',
  items: [
    { name: 'Heavy Duty Alternator', sku: 'ALT-HD-001', qty: 5, cost: 150.00 },
    { name: 'Turbocharger Assembly', sku: 'TRB-ASM-004', qty: 2, cost: 850.00 },
    { name: 'King Pin Set', sku: 'KPS-FRD-012', qty: 10, cost: 85.00 },
  ],
  shippingCost: 50.00,
  taxRate: 8.25,
};

const itemsTotal = purchaseOrder.items.reduce((sum, item) => sum + item.qty * item.cost, 0);
const subtotal = itemsTotal + purchaseOrder.shippingCost;
const taxAmount = (itemsTotal) * (purchaseOrder.taxRate / 100); // Tax usually not on shipping
const grandTotal = subtotal + taxAmount;


export default function PrintPurchaseOrderPage() {
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
      pdf.save(`Purchase-Order-${params.id}.pdf`);
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
                        <h1 className="text-2xl font-bold font-headline">{purchaseOrder.companyName}</h1>
                        <p className="text-sm text-muted-foreground">{purchaseOrder.companyAddress}</p>
                        <p className="text-sm text-muted-foreground">{purchaseOrder.companyPhone}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-primary">PURCHASE ORDER</h2>
                    <p className="text-lg font-mono">{params.id}</p>
                </div>
            </div>

            {/* Supplier and Date Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 border rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <div className="font-semibold">
                        <p>{purchaseOrder.supplier.name}</p>
                        <p className="text-sm font-normal text-muted-foreground">{purchaseOrder.supplier.address}</p>
                    </div>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-semibold">{purchaseOrder.issueDate}</p>
                     <p className="text-sm text-muted-foreground mt-2">Expected Delivery</p>
                    <p className="font-semibold">{purchaseOrder.deliveryDate}</p>
                </div>
            </div>

            {/* Items */}
            <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Ordered Items</h3>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Description</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="w-16 text-center">Qty</TableHead>
                                <TableHead className="w-28 text-right">Unit Cost</TableHead>
                                <TableHead className="w-28 text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchaseOrder.items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell className="text-center">{item.qty}</TableCell>
                                    <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">${(item.qty * item.cost).toFixed(2)}</TableCell>
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
                        <span className="text-muted-foreground">Items Total:</span>
                        <span className="font-medium">${itemsTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-medium">${purchaseOrder.shippingCost.toFixed(2)}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax ({purchaseOrder.taxRate}%):</span>
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
                <p>Please include the PO number on all correspondence and invoices.</p>
                <div className="flex justify-around mt-16">
                    <div className="w-1/3 pt-2 border-t">
                        <p className="text-sm">Authorized Signature</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-4 flex justify-end gap-2 print:hidden">
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4"/>
                Print PO
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
