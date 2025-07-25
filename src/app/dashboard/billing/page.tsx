
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
import { sendStkPush } from '@/ai/flows/send-stk-push';
import { Loader, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function PayPalIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
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
        {...props}
      >
        <path d="M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -2 -1.9 -3.2 -4.2 -3.2h-5.4l-1.9 12.3c0 0.1 0 0.2 0 0.3c0 0.6 0.4 1 1 1h2.1c0.5 0 0.9 -0.3 1 -0.8l0.4 -2.5l2.5 0c2.5 0 5 -2.5 5 -5c0 -2.1 -1.7 -3.8 -3.9 -4" />
      </svg>
    )
  }

export default function BillingPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileMoneyPayment = async () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
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
        description: 'Please enter a valid phone number, e.g., +254712345678.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await sendStkPush({ phone, amount: numericAmount });
      if (result.success) {
        toast({
          title: 'STK Push Sent',
          description: result.message,
        });
        setAmount('');
        setPhone('');
      } else {
        toast({
          title: 'Payment Failed',
          description: result.message || 'Could not initiate payment.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('STK Push Error:', error);
      toast({
          title: 'An Error Occurred',
          description: 'Failed to send payment prompt. Please try again later.',
          variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };

  const handleCardPayment = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        toast({
            title: 'Payment Successful',
            description: 'Your card payment has been processed.',
        });
        setLoading(false);
    }, 1500)
  }
  
  const handlePayPalPayment = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        toast({
            title: 'Redirecting to PayPal',
            description: 'You are being redirected to PayPal to complete your payment.',
        });
        setLoading(false);
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          Manage your balance and make payments using your preferred method.
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

        <Tabs defaultValue="mobile-money" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mobile-money"><Smartphone className="mr-2" /> M-Pesa/Airtel</TabsTrigger>
            <TabsTrigger value="card"><CreditCard className="mr-2" /> Card</TabsTrigger>
            <TabsTrigger value="paypal"><PayPalIcon className="mr-2" /> PayPal</TabsTrigger>
          </TabsList>
          <TabsContent value="mobile-money" className="mt-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Mobile Money Payment</h3>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+254712345678" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="w-full sm:w-auto" onClick={handleMobileMoneyPayment} disabled={loading}>
                        {loading ? <Loader className="animate-spin" /> : 'Send Payment Prompt'}
                    </Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="card" className="mt-6">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Credit/Debit Card Payment</h3>
                <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="0000 0000 0000 0000" disabled={loading} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" disabled={loading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" disabled={loading} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="card-amount">Amount (KES)</Label>
                    <Input id="card-amount" type="number" placeholder="Enter amount" disabled={loading} />
                </div>
                <Button className="w-full sm:w-auto" onClick={handleCardPayment} disabled={loading}>
                     {loading ? <Loader className="animate-spin" /> : 'Pay Now'}
                </Button>
            </div>
          </TabsContent>
          <TabsContent value="paypal" className="mt-6">
             <div className="space-y-4 text-center">
                <h3 className="text-lg font-medium">Pay with PayPal</h3>
                <p className="text-muted-foreground">You will be redirected to PayPal to complete your payment securely.</p>
                <div className="space-y-2">
                    <Label htmlFor="paypal-amount">Amount (KES)</Label>
                    <Input id="paypal-amount" type="number" placeholder="Enter amount" className="max-w-xs mx-auto" disabled={loading} />
                </div>
                <Button className="w-full sm:w-auto" onClick={handlePayPalPayment} disabled={loading}>
                    {loading ? <Loader className="animate-spin" /> : <><PayPalIcon className="mr-2"/> Proceed to PayPal</>}
                </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />
         <div className="flex justify-end">
            <Button variant="outline">
                View Payment History
            </Button>
         </div>
      </CardContent>
    </Card>
    </div>
  );
}

