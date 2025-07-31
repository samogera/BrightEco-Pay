
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Loader, CreditCard, Smartphone, Wallet, ChevronsRight, PlusCircle, Star } from 'lucide-react';

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
import { useBilling, PaymentMethod } from '@/hooks/use-billing';
import { sendStkPush } from '@/ai/flows/send-stk-push';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


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
  const { 
      balance, 
      dueDate, 
      makePayment, 
      addInvoice, 
      loading: billingLoading, 
      walletBalance, 
      addToWallet,
      paymentMethods,
      addPaymentMethod,
      setPreferredMethod,
   } = useBilling();
  const { addNotification } = useNotifications();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('1000');
  const [phone, setPhone] = useState('');
  const [processingMethod, setProcessingMethod] = useState<string | null>(null);
  
  // States for Add Card Dialog
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);


  useEffect(() => {
    if (user?.phoneNumber) {
      setPhone(user.phoneNumber);
    }
    if(user?.displayName){
      setNewCardHolder(user.displayName);
    }
  }, [user]);

  const getCardType = (cardNumber: string) => {
    if (/^4/.test(cardNumber.replace(/\s/g, ''))) return 'Visa';
    if (/^5[1-5]/.test(cardNumber.replace(/\s/g, ''))) return 'Mastercard';
    return 'Card';
  }
  
  const processPayment = async (amount: number, method: string, details: string) => {
    setProcessingMethod(method);
    try {
        const newInvoice = await addInvoice({
            amount,
            method,
            status: 'Paid',
            details,
        });
        await makePayment(amount);
         toast({
            title: 'Payment Successful',
            description: `Your ${method} payment of KES ${amount} has been processed.`,
        });
        await addNotification({
            type: 'payment',
            title: 'Payment Received',
            description: `Successfully processed KES ${amount.toFixed(2)} via ${method}. Invoice ID: ${newInvoice.id}`,
            link: `/dashboard/billing/history#${newInvoice.id}`,
        })
        setPaymentAmount('');
    } catch(err: any) {
        toast({
            title: 'Payment Failed',
            description: err.message,
            variant: 'destructive',
        });
    } finally {
        setProcessingMethod(null);
    }
  }
  
  const processTopUp = async (amount: number, method: string) => {
    setProcessingMethod('top-up');
    try {
        const newWalletBalance = await addToWallet(amount);
         toast({
            title: 'Wallet Top-Up Successful',
            description: `KES ${amount} has been added to your Solar Wallet via ${method}.`,
        });
        await addNotification({
            type: 'wallet',
            title: 'Wallet Top-Up',
            description: `KES ${amount.toFixed(2)} added. New balance is KES ${newWalletBalance.toFixed(2)}.`,
        });
    } catch(err: any) {
        toast({
            title: 'Top-Up Failed',
            description: err.message,
            variant: 'destructive',
        });
    } finally {
        setProcessingMethod(null);
    }
  }

  const handleMobileMoneyPayment = async () => {
    const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount to pay.', variant: 'destructive'});
      return;
    }
     if (!phone || !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      toast({ title: 'Invalid Phone Number', description: 'Please enter a valid phone number, e.g., +254712345678.', variant: 'destructive' });
      return;
    }

    setProcessingMethod('mpesa');
    try {
      const result = await sendStkPush({ phone, amount: numericAmount });
      if (result.success) {
        await processPayment(numericAmount, 'M-Pesa', `STK Push to ${phone}`);
        setPhone('');
      } else {
        toast({ title: 'M-Pesa Push Failed', description: result.message || 'Could not initiate payment. Please try again.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('STK Push Error:', error);
      toast({ title: 'An Error Occurred', description: 'Failed to send payment prompt. Please try again later.', variant: 'destructive' });
    } finally {
        setProcessingMethod(null);
    }
  };

  const handleCardPayment = async (method: PaymentMethod) => {
    const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    
    setProcessingMethod(`card-${method.id}`);
    // Simulate payment gateway processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    await processPayment(numericAmount, method.type, `Card ending in ${method.last4}`);
    setProcessingMethod(null);
  }
  
  const handlePayPalPayment = async () => {
     const numericAmount = Number(paymentAmount);
    if (!paymentAmount || isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    setProcessingMethod('paypal');
    
    toast({ title: 'Redirecting to PayPal...', description: 'You are being redirected to complete your payment securely.' });

    // Simulate redirection and callback from PayPal
    setTimeout(async () => {
        console.log("Simulating return from PayPal for payment of KES", numericAmount);
        await processPayment(numericAmount, 'PayPal', 'Transaction via PayPal');
        setProcessingMethod(null);
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

  const handleAddCard = async () => {
    if (newCardNumber.replace(/\s/g, '').length < 15 || newCardNumber.replace(/\s/g, '').length > 19) {
        toast({ title: 'Invalid Card Number', description: 'Please enter a valid card number.', variant: 'destructive' }); return;
    }
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(newCardExpiry)) {
        toast({ title: 'Invalid Expiry Date', description: 'Please use MM/YY format.', variant: 'destructive' }); return;
    }
     if (!/^\d{3,4}$/.test(newCardCvc)) {
        toast({ title: 'Invalid CVC', description: 'Please enter a valid CVC.', variant: 'destructive' }); return;
    }
    if (!newCardHolder) {
        toast({ title: 'Invalid Name', description: 'Please enter the cardholder\'s name.', variant: 'destructive' }); return;
    }

    setProcessingMethod('add-card');
    await addPaymentMethod({
      type: getCardType(newCardNumber),
      last4: newCardNumber.slice(-4),
      isPreferred: paymentMethods.length === 0,
    });
    setProcessingMethod(null);
    setIsAddCardDialogOpen(false);
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCvc('');
    toast({ title: 'Payment Method Added', description: 'Your new card has been saved.' });
  }

  const isLoading = !!processingMethod;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
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
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pay-bill">Pay Bill</TabsTrigger>
                <TabsTrigger value="top-up">Top Up Wallet</TabsTrigger>
                <TabsTrigger value="methods">My Cards</TabsTrigger>
            </TabsList>
            <TabsContent value="pay-bill" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                         <h3 className="text-lg font-medium">Payment Amount</h3>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount to Pay (KES)</Label>
                            <Input id="amount" type="number" placeholder="Enter amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} disabled={isLoading} className="max-w-xs" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium mt-4">Pay With</h3>
                             <div className="space-y-2">
                                <Label htmlFor="phone">M-Pesa</Label>
                                <div className="flex gap-2">
                                    <Input id="phone" type="tel" placeholder="+254712345678" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} />
                                    <Button onClick={handleMobileMoneyPayment} disabled={isLoading || !paymentAmount}>
                                        {processingMethod === 'mpesa' ? <Loader className="animate-spin" /> : 'Pay'}
                                    </Button>
                                </div>
                             </div>
                             {paymentMethods.filter(pm => pm.type !== 'M-Pesa').map(pm => (
                                <div key={pm.id} className="space-y-2">
                                    <Label>{pm.type} ending in {pm.last4}</Label>
                                     <Button className="w-full" onClick={() => handleCardPayment(pm)} disabled={isLoading || !paymentAmount}>
                                        {processingMethod === `card-${pm.id}` ? <Loader className="animate-spin" /> : <>Pay with this {pm.type}</>}
                                    </Button>
                                </div>
                             ))}
                             <div className="space-y-2">
                                 <Label>PayPal</Label>
                                 <Button variant="outline" className="w-full" onClick={handlePayPalPayment} disabled={isLoading || !paymentAmount}>
                                    {processingMethod === 'paypal' ? <Loader className="animate-spin" /> : <><PayPalIcon className="mr-2" /> Proceed to PayPal</>}
                                </Button>
                             </div>
                        </div>
                    </div>
                    <Card className="bg-muted/30">
                        <CardHeader><CardTitle>Pay with Solar Wallet</CardTitle><CardDescription>Get a 1.5% discount when you pay your full balance from your wallet.</CardDescription></CardHeader>
                        <CardContent>
                             <div className="space-y-2"><p className="text-sm text-muted-foreground">Current Balance</p><p className="font-bold">KES {balance.toFixed(2)}</p></div>
                             <div className="space-y-2 mt-2"><p className="text-sm text-muted-foreground">Discount (1.5%)</p><p className="font-bold text-primary">- KES {(balance * 0.015).toFixed(2)}</p></div>
                            <Separator className="my-3"/>
                            <div className="space-y-2"><p className="text-lg text-muted-foreground">Total to Pay</p><p className="text-2xl font-bold">KES {(balance * 0.985).toFixed(2)}</p></div>
                            <Button className="w-full mt-4" onClick={handleWalletPayment} disabled={isLoading || walletBalance < (balance * 0.985) || balance <= 0}>
                                {processingMethod === 'wallet' ? <Loader className="animate-spin" /> : 'Pay Now From Wallet'}
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
                        <Input id="top-up-amount" type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} disabled={isLoading} />
                    </div>
                     <Button className="w-full" disabled={isLoading || !topUpAmount || Number(topUpAmount) <= 0} onClick={() => processTopUp(Number(topUpAmount), 'M-Pesa/Card')}>
                        {processingMethod === 'top-up' ? <Loader className="animate-spin" /> : `Top Up KES ${topUpAmount}`}
                    </Button>
                </div>
            </TabsContent>
            <TabsContent value="methods" className="mt-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>My Payment Cards</CardTitle>
                            <CardDescription>Add, remove, or set your preferred card for payments.</CardDescription>
                        </div>
                        <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2" /> Add New Card</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader><DialogTitle>Add a new card</DialogTitle><DialogDescription>Your card information is stored securely.</DialogDescription></DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2"><Label htmlFor="card-holder">Cardholder Name</Label><Input id="card-holder" value={newCardHolder} onChange={e=>setNewCardHolder(e.target.value)} /></div>
                                    <div className="space-y-2"><Label htmlFor="new-card-number">Card Number</Label><Input id="new-card-number" value={newCardNumber} onChange={e=>setNewCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))} placeholder="0000 0000 0000 0000" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label htmlFor="new-card-expiry">Expiry (MM/YY)</Label><Input id="new-card-expiry" value={newCardExpiry} onChange={e=>setNewCardExpiry(e.target.value)} placeholder="MM/YY" /></div>
                                        <div className="space-y-2"><Label htmlFor="new-card-cvc">CVC</Label><Input id="new-card-cvc" value={newCardCvc} onChange={e=>setNewCardCvc(e.target.value)} placeholder="123" /></div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleAddCard} disabled={isLoading}>{processingMethod === 'add-card' ? <Loader className="animate-spin" /> : "Save Card"}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {paymentMethods.filter(m => m.type !== 'M-Pesa').length > 0 ? paymentMethods.map(method => (
                            <div key={method.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                <div className="flex items-center gap-4">
                                    {method.type.toLowerCase() === 'visa' && <Image src="https://placehold.co/40x25.png" width={40} height={25} alt="Visa" data-ai-hint="visa logo" />}
                                    {method.type.toLowerCase() === 'mastercard' && <Image src="https://placehold.co/40x25.png" width={40} height={25} alt="Mastercard" data-ai-hint="mastercard logo" />}
                                    {method.type.toLowerCase() === 'card' && <CreditCard className="h-6 w-6 text-muted-foreground" />}
                                    <div>
                                        <p className="font-semibold">{method.type} ending in •••• {method.last4}</p>
                                        {method.isPreferred && <Badge variant="default" className="mt-1">Preferred</Badge>}
                                    </div>
                                </div>
                                {!method.isPreferred && (
                                     <Button variant="outline" size="sm" onClick={() => setPreferredMethod(method.id!)}><Star className="mr-2 h-4 w-4" /> Set as Preferred</Button>
                                )}
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-center py-4">No cards saved.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
         </Tabs>

        <Separator className="my-8"/>
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
