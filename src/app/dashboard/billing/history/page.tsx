
'use client';

import { useBilling, Invoice } from '@/hooks/use-billing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function BillingHistoryPage() {
    const { invoices } = useBilling();
    const { toast } = useToast();

    const generateInvoiceText = (invoice: Invoice) => {
        return `
            INVOICE - BrightEco Pay
            -------------------------
            Invoice ID: ${invoice.id}
            Date: ${format(invoice.date, 'PPP')}
            
            Amount Paid: KES ${invoice.amount.toFixed(2)}
            Payment Method: ${invoice.method}
            Payment Details: ${invoice.details}
            Status: ${invoice.status}
            -------------------------
            Thank you for your payment!
        `;
    }

    const handleDownload = (invoice: Invoice) => {
        const text = generateInvoiceText(invoice);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    const handleShare = async (invoice: Invoice) => {
        const text = generateInvoiceText(invoice);
        if(navigator.share) {
            try {
                await navigator.share({
                    title: `BrightEco Pay Invoice ${invoice.id}`,
                    text: text,
                })
            } catch (error) {
                console.error("Failed to share:", error);
                toast({title: "Sharing failed", description: "Could not share invoice.", variant: "destructive"})
            }
        } else {
             navigator.clipboard.writeText(text);
             toast({title: "Copied to clipboard", description: "Invoice details copied to your clipboard."})
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>A record of all your past payments and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length > 0 ? (
                            invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>KES {invoice.amount.toFixed(2)}</TableCell>
                                    <TableCell>{invoice.method}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'}>{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleDownload(invoice)}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                         <Button variant="outline" size="icon" onClick={() => handleShare(invoice)}>
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">No invoices found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
