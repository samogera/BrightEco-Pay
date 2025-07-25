
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

export function BillingInfoCard() {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          View your current balance and make payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold">KES 2,550.00</p>
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
