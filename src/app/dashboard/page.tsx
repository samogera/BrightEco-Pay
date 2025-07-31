import {
  AlertTriangle,
  BatteryFull,
  Sun,
  Zap,
  BookOpen,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {EnergyUsageChart} from '@/components/dashboard/EnergyUsageChart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div className="flex-1">
                <CardTitle>Grace Period Alert</CardTitle>
                <CardDescription className="text-destructive-foreground/80">
                    Your account is currently in a grace period. To avoid service interruption, please make a payment before the period ends in <strong>2 days</strong>.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
             <Button asChild variant="destructive">
                <Link href="/dashboard/billing">Pay Now</Link>
            </Button>
        </CardContent>
      </Card>
      
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
          title="Classroom Lighting"
          icon={BookOpen}
          value="8 Hours"
          description="Total lighting provided today"
        />
        <DeviceStatusCard
          title="System Status"
          icon={Zap}
          value="Online"
          description="Functioning optimally"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Energy Usage
            </CardTitle>
            <CardDescription>Your school's consumption over the last 6 months.</CardDescription>
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
