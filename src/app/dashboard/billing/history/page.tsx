
'use client';

import { useBilling, Invoice } from '@/hooks/use-billing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2 } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function BillingHistoryPage() {
    const { invoices, balance } = useBilling();
    const { user, userData } = useAuth();
    const { toast } = useToast();

    const generateInvoiceText = (invoice: Invoice) => {
        const billingPeriodStart = format(subMonths(invoice.date, 1), 'MMMM d, yyyy');
        const billingPeriodEnd = format(invoice.date, 'MMMM d, yyyy');
        const daysRemaining = 8; 

        return `
========================================
       BrightEco Energy Invoice
========================================

--- Customer Details ---
Name: ${user?.displayName || 'N/A'}
Email: ${user?.email || 'N/A'}
Phone: ${user?.phoneNumber || 'N/A'}
Address: ${userData?.address || 'Not Provided'}

--- Invoice Details ---
Invoice ID: ${invoice.id}
Invoice Date: ${format(new Date(), 'MMMM dd, yyyy, hh:mm a')}
Billing Period: ${billingPeriodStart} - ${billingPeriodEnd}

--- Charges ---
Total Energy Consumed: ${(invoice.amount / 11.7).toFixed(2)} kWh
Cost: KES ${invoice.amount.toFixed(2)}

--- Payment Details ---
Payment Method: ${invoice.method}
Transaction ID: ${(Math.random() * 1e16).toString(36).toUpperCase()}
Status: ${invoice.status}

--- Balance ---
Outstanding Balance: KES ${balance.toFixed(2)}
Grace Period Status: ${daysRemaining} days remaining.

----------------------------------------
Thank you for your payment!
For support, contact support@brighteco.com
========================================
        `;
    }

    const handleDownload = (invoice: Invoice) => {
        const text = generateInvoiceText(invoice);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.id}.pdf`;
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
                                    <TableCell className="font-medium">{invoice.id.substring(0, 8)}...</TableCell>
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
