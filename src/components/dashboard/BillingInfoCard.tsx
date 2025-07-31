
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          View your school's current balance and make termly payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Term Balance</p>
          <p className="text-3xl font-bold">KES 12,550.00</p>
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
