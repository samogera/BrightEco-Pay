
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Loader, CreditCard, Smartphone, Wallet, ChevronsRight } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useBilling } from '@/hooks/use-billing';
import { sendStkPush } from '@/ai/flows/send-stk-push';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

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
  const { user } = useAuth();
  const { balance, dueDate, makePayment, addInvoice, loading: billingLoading, walletBalance, addToWallet } = useBilling();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('1000');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardType, setCardType] = useState('');

  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user.phoneNumber);
    }
  }, [user]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\s/g, '');
    setCardNumber(e.target.value);
    if (/^4/.test(number)) {
        setCardType('visa');
    } else if (/^5[1-5]/.test(number)) {
        setCardType('mastercard');
    } else {
        setCardType('');
    }
  }

  const processPayment = async (amount: number, method: string, details: string) => {
    setLoading(true);
    try {
        await makePayment(amount);
        await addInvoice({
            amount,
            method,
            status: 'Paid',
            details,
        });
         toast({
            title: 'Payment Successful',
            description: `Your ${method} payment of KES ${amount} has been processed.`,
        });
        setPaymentAmount('');
    } catch(err: any) {
        toast({
            title: 'Payment Failed',
            description: err.message,
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  }
  
  const processTopUp = async (amount: number, method: string) => {
    setLoading(true);
    try {
        await addToWallet(amount);
         toast({
            title: 'Wallet Top-Up Successful',
            description: `KES ${amount} has been added to your Solar Wallet via ${method}.`,
        });
    } catch(err: any) {
        toast({
            title: 'Top-Up Failed',
            description: err.message,
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  }

  const handleMobileMoneyPayment = async () => {
    const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
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
        // In a real app, you'd wait for a webhook from the payment provider
        // For this simulation, we'll process the payment immediately after the push is initiated
        await processPayment(numericAmount, 'M-Pesa', `STK Push to ${phone}`);
        setPhone('');
      } else {
        toast({
          title: 'M-Pesa Push Failed',
          description: result.message || 'Could not initiate payment. Please try again.',
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

  const handleCardPayment = async () => {
    const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 15 || cardNumber.replace(/\s/g, '').length > 16) {
        toast({ title: 'Invalid Card Number', description: 'Please enter a valid card number.', variant: 'destructive' });
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast({ title: 'Invalid Expiry Date', description: 'Please use MM/YY format.', variant: 'destructive' });
        return;
    }
     if (!/^\d{3,4}$/.test(cvc)) {
        toast({ title: 'Invalid CVC', description: 'Please enter a valid CVC.', variant: 'destructive' });
        return;
    }
    
    setLoading(true);
    // Simulate payment gateway processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const last4 = cardNumber.slice(-4);
    await processPayment(numericAmount, 'Card', `Card ending in ${last4}`);
    
    // Clear card fields after successful payment
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setCardType('');
    setLoading(false);
  }
  
  const handlePayPalPayment = async () => {
     const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    
    toast({
        title: 'Redirecting to PayPal...',
        description: 'You are being redirected to complete your payment securely.'
    });

    // Simulate redirection and callback from PayPal
    setTimeout(async () => {
        console.log("Simulating return from PayPal for payment of KES", numericAmount);
        await processPayment(numericAmount, 'PayPal', 'Transaction via PayPal');
        setLoading(false);
    }, 2500)
  }

  const handleWalletPayment = async () => {
    if (balance <= 0) {
      toast({ title: 'No outstanding balance', description: 'Your account is all paid up!', variant: 'default' });
      return;
    }
    const discount = 0.015; // 1.5%
    const discountedAmount = balance * (1 - discount);
    
    if (walletBalance < discountedAmount) {
        toast({ title: 'Insufficient Wallet Balance', description: 'Please top up your wallet to pay.', variant: 'destructive' });
        return;
    }
    await processPayment(balance, 'Solar Wallet', `Discounted payment from wallet.`);
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
        {billingLoading ? (
            <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-primary" />
            </div>
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
                <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-3xl font-bold">KES {balance.toFixed(2)}</p>
                </div>
                <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Next Due Date</p>
                  <p className="text-3xl font-bold">{dueDate ? format(dueDate, 'MMMM dd, yyyy') : 'N/A'}</p>
                </div>
            </div>
             <Card className="bg-primary/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2"><Wallet className="text-primary"/> Solar Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-primary">KES {walletBalance.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Pay with your wallet for a 1.5% discount.</p>
                </CardContent>
            </Card>
        </div>
        
        <Separator />

         <Tabs defaultValue="pay-bill" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pay-bill">Pay Bill</TabsTrigger>
                <TabsTrigger value="top-up">Top Up Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="pay-bill">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div className="space-y-4">
                         <h3 className="text-lg font-medium">Payment Amount</h3>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount to Pay (KES)</Label>
                            <Input 
                                id="amount" 
                                type="number" 
                                placeholder="Enter amount" 
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                disabled={loading}
                                className="max-w-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium mt-4">Payment Methods</h3>
                            <Tabs defaultValue="mpesa" className="w-full max-w-sm">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="mpesa"><Smartphone /></TabsTrigger>
                                    <TabsTrigger value="card"><CreditCard /></TabsTrigger>
                                    <TabsTrigger value="paypal"><PayPalIcon /></TabsTrigger>
                                </TabsList>
                                <TabsContent value="mpesa" className="mt-4 space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="phone">M-Pesa Number</Label>
                                        <Input id="phone" type="tel" placeholder="+254712345678" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
                                     </div>
                                     <Button className="w-full" onClick={handleMobileMoneyPayment} disabled={loading || !paymentAmount}>
                                        {loading ? <Loader className="animate-spin" /> : 'Pay with M-Pesa'}
                                    </Button>
                                </TabsContent>
                                <TabsContent value="card" className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <div className="relative">
                                            <Input id="card-number" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} disabled={loading} className="pr-24"/>
                                            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                                                <Image src="https://placehold.co/32x20.png" width={32} height={20} alt="Visa" data-ai-hint="visa logo" className={cn(cardType === 'visa' ? 'opacity-100' : 'opacity-25')} />
                                                <Image src="https://placehold.co/32x20.png" width={32} height={20} alt="Mastercard" data-ai-hint="mastercard logo" className={cn(cardType === 'mastercard' ? 'opacity-100' : 'opacity-25')} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry-date">Expiry (MM/YY)</Label>
                                            <Input id="expiry-date" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} disabled={loading}/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvc">CVC</Label>
                                            <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} disabled={loading}/>
                                        </div>
                                    </div>
                                     <Button className="w-full" onClick={handleCardPayment} disabled={loading || !paymentAmount}>
                                        {loading ? <Loader className="animate-spin" /> : 'Pay with Card'}
                                    </Button>
                                </TabsContent>
                                <TabsContent value="paypal" className="mt-4 space-y-4">
                                    <p className="text-sm text-muted-foreground text-center">You will be redirected to PayPal to complete your payment securely.</p>
                                     <Button className="w-full" onClick={handlePayPalPayment} disabled={loading || !paymentAmount}>
                                        {loading ? <Loader className="animate-spin" /> : <><PayPalIcon className="mr-2" /> Proceed to PayPal</>}
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Pay with Solar Wallet</CardTitle>
                            <CardDescription>Get a 1.5% discount when you pay your full balance from your wallet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className="font-bold">KES {balance.toFixed(2)}</p>
                            </div>
                             <div className="space-y-2 mt-2">
                                <p className="text-sm text-muted-foreground">Discount (1.5%)</p>
                                <p className="font-bold text-primary">- KES {(balance * 0.015).toFixed(2)}</p>
                            </div>
                            <Separator className="my-3"/>
                            <div className="space-y-2">
                                <p className="text-lg text-muted-foreground">Total to Pay</p>
                                <p className="text-2xl font-bold">KES {(balance * 0.985).toFixed(2)}</p>
                            </div>
                            <Button className="w-full mt-4" onClick={handleWalletPayment} disabled={loading || walletBalance < (balance * 0.985) || balance <= 0}>
                                {loading ? <Loader className="animate-spin" /> : 'Pay Now From Wallet'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="top-up" className="mt-6">
                <div className="max-w-md mx-auto text-center space-y-4">
                     <h3 className="text-lg font-medium">Top Up Your Solar Wallet</h3>
                     <p className="text-muted-foreground">Add funds to your wallet using any payment method. You can use your wallet balance to pay for your bills with a discount.</p>
                     <div className="space-y-2 text-left">
                        <Label htmlFor="top-up-amount">Amount to Add (KES)</Label>
                        <Input 
                            id="top-up-amount" 
                            type="number" 
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                     <Button className="w-full" disabled={loading || !topUpAmount || Number(topUpAmount) <= 0} onClick={() => processTopUp(Number(topUpAmount), 'M-Pesa/Card')}>
                        {loading ? <Loader className="animate-spin" /> : `Top Up KES ${topUpAmount}`}
                    </Button>
                </div>
            </TabsContent>
         </Tabs>

        <Separator className="mt-8"/>
         <div className="flex justify-end">
             <Button variant="outline" asChild>
              <Link href="/dashboard/billing/history">View Payment History</Link>
            </Button>
         </div>
         </>
        )}
      </CardContent>
    </Card>
    </div>
  );
}
