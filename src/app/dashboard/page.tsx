
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EnergyUsageChart } from '@/components/dashboard/EnergyUsageChart';
import { Button } from '@/components/ui/button';
import { useBilling } from '@/hooks/use-billing';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BillingInfoCard } from '@/components/dashboard/BillingInfoCard';

function DeviceStatusCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function GracePeriodAlert() {
  const { balance, dueDate } = useBilling();
  const daysRemaining = differenceInDays(dueDate, new Date());

  if (daysRemaining > 10 || balance <= 0) {
    return null;
  }

  const alertVariant = daysRemaining <= 5 ? 'destructive' : 'warning';
  const alertTitle = daysRemaining <= 0 ? 'Service Interruption: Payment Overdue' : (daysRemaining <= 5 ? 'Critical: Service Interruption Soon' : 'Payment Reminder');
  const alertMessage = daysRemaining <= 0 ? `Your payment is overdue. Please pay now to restore service.` : `Your service is due on ${format(dueDate, 'MMMM dd, yyyy')}. To avoid interruption, please make a payment.`;

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
  return (
    <div className="space-y-6">
      <GracePeriodAlert />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DeviceStatusCard
          title="Solar Panel Output"
          icon={Sun}
          value="4.2 kWh"
          description="Live energy generation"
        />
        <DeviceStatusCard
          title="Battery Charge"
          icon={BatteryFull}
          value="92%"
          description="20.1 hours of backup"
        />
        <DeviceStatusCard
          title="Home Power Usage"
          icon={Zap}
          value="1.2 kWh"
          description="Current consumption"
        />
        <DeviceStatusCard
          title="System Status"
          icon={Zap}
          value="Online"
          description="Functioning optimally"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Energy Usage
            </CardTitle>
            <CardDescription>
              Your household consumption over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="pl-2">
                <EnergyUsageChart />
            </div>
          </CardContent>
        </Card>
        <div className="col-span-full lg:col-span-3">
            <BillingInfoCard />
        </div>
      </div>
    </div>
  );
}
