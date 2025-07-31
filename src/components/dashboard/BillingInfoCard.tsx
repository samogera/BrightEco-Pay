
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useBilling } from '@/hooks/use-billing';
import { format } from 'date-fns';

export function BillingInfoCard() {
  const { balance, dueDate } = useBilling();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          View your current balance and make payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold">KES {balance.toFixed(2)}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Payment Due</p>
              <p className="text-xl font-semibold">{format(dueDate, 'MMMM dd, yyyy')}</p>
            </div>
        </div>
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Button className="w-full" asChild>
                    <Link href="/dashboard/billing">Make Payment</Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/dashboard/billing">View History</Link>
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
