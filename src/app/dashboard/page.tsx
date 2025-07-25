import {
  ArrowUpRight,
  BatteryFull,
  Sun,
  Zap,
} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {EnergyUsageChart} from '@/components/dashboard/EnergyUsageChart';

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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BillingInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Billing & Payments
        </CardTitle>
        <CardDescription>
          Manage your balance and view payment history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold">$25.50</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto">Make Payment</Button>
          <Button variant="outline" className="w-full sm:w-auto">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
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
          description="20.1 hours of backup remaining"
        />
        <DeviceStatusCard
          title="Inverter Status"
          icon={Zap}
          value="Online"
          description="System functioning normally"
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grace Period</CardTitle>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 days</div>
            <p className="text-xs text-muted-foreground">
              Remaining until auto-cutoff
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Energy Usage
            </CardTitle>
            <CardDescription>Your consumption over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <EnergyUsageChart />
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3">
          <BillingInfoCard />
        </div>
      </div>
    </div>
  );
}
