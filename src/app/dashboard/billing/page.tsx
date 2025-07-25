
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function BillingPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');

  const handlePayment = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to pay.',
        variant: 'destructive',
      });
      return;
    }
     if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'STK Push Sent',
      description: `Payment prompt for KES ${amount} sent to ${phone}. Please enter your PIN to complete the transaction.`,
    });
    setAmount('');
    setPhone('');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          Manage your balance and make payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold">KES 2,550.00</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Next Due Date</p>
              <p className="text-3xl font-bold">July 30, 2024</p>
            </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
            <h3 className="text-lg font-medium">Make a Payment</h3>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+254712345678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount (KES)</Label>
                <Input 
                    id="amount" 
                    type="number" 
                    placeholder="Enter amount" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button className="w-full sm:w-auto" onClick={handlePayment}>Send Payment Prompt</Button>
                <Button variant="outline" className="w-full sm:w-auto">
                    View Payment History
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
