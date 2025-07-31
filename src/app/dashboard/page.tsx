
'use client';

import {
  AlertTriangle,
  BatteryFull,
  Sun,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EnergyUsageChart } from '@/components/dashboard/EnergyUsageChart';
import { Button } from '@/components/ui/button';
import { useBilling } from '@/hooks/use-billing';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';


function GracePeriodAlert() {
  const { balance, dueDate } = useBilling();
  
  if (!dueDate) return null;

  const daysRemaining = differenceInDays(dueDate, new Date());

  if (daysRemaining > 10 || balance <= 0) {
    return null;
  }

  const alertVariant = daysRemaining <= 5 ? 'destructive' : 'warning';
  const alertTitle = daysRemaining <= 0 ? 'Service Interruption: Payment Overdue' : (daysRemaining <= 5 ? 'Critical: Service Interruption Soon' : 'Payment Reminder');
  const alertMessage = daysRemaining <= 0 ? `Your payment is overdue. Please pay now to restore service.` : `Your service is due for renewal on ${format(dueDate, 'MMMM dd, yyyy')}. To avoid interruption, please make a payment.`;

  return (
    <Alert variant={alertVariant} className={cn(
        alertVariant === 'warning' && 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-600'
    )}>
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{alertMessage}</span>
        <Button asChild className={cn(
            alertVariant === 'destructive' && 'bg-destructive hover:bg-destructive/90',
            alertVariant === 'warning' && 'bg-amber-600 hover:bg-amber-700 text-white'
        )}>
          <Link href="/dashboard/billing">Pay Now</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default function DashboardPage() {
  const { balance, dueDate } = useBilling();
  
  return (
    <div className="space-y-6">
      <GracePeriodAlert />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Usage Section */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-golden">
                    Your Energy Dashboard
                    </CardTitle>
                    <CardDescription>
                    Real-time insights into your energy consumption.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EnergyUsageChart />
                </CardContent>
            </Card>
        </div>

        {/* Side Cards for Key Metrics */}
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Energy Credit Balance</CardTitle>
                    <Zap className="h-5 w-5 text-golden" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-golden">KES {balance.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        {dueDate ? `Next payment due on ${format(dueDate, 'MMM dd, yyyy')}` : 'No upcoming payment'}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">System Status</CardTitle>
                    <Sun className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Online</div>
                    <p className="text-xs text-muted-foreground">
                        System is operating optimally.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Battery Level</CardTitle>
                    <BatteryFull className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">
                        Approx. 20.1 hours of backup remaining.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
