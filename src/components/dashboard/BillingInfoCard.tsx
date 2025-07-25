
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

export function BillingInfoCard() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to pay.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Payment Successful',
      description: `Successfully paid KES ${amount}.`,
    });
    setAmount('');
  };

  return (
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
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold">KES 2,550.00</p>
        </div>
        <div className="space-y-4">
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
                <Button className="w-full sm:w-auto" onClick={handlePayment}>Make Payment</Button>
                <Button variant="outline" className="w-full sm:w-auto">
                    View History
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
