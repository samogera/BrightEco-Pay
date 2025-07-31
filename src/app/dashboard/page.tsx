
'use client';

import {
  AlertTriangle,
  BatteryFull,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sun,
  Zap,
  Download,
  FileText,
  FileSpreadsheet
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
import { Separator } from '@/components/ui/separator';
import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


function GracePeriodAlert() {
  const { balance, dueDate } = useBilling();
  
  if (!dueDate || balance <= 0) return null;

  const daysRemaining = differenceInDays(dueDate, new Date());

  if (daysRemaining > 10) {
    return (
         <Alert variant="default" className="bg-primary/10 border-primary/20 text-primary-foreground">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">All Systems Green!</AlertTitle>
            <AlertDescription className="flex items-center justify-between text-primary/80">
                <span>Your account is in good standing. Your next payment is due on {format(dueDate, 'MMMM dd, yyyy')}.</span>
            </AlertDescription>
        </Alert>
    );
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

const usageStats = [
    { title: 'Daily Total', value: '6.40 kWh', estimate: 'KES 75' },
    { title: 'Weekly Total', value: '45 kWh', estimate: 'KES 520' },
    { title: 'Monthly Total', value: '180 kWh', estimate: 'KES 2,100' },
    { title: 'Yearly Total', value: '2,190 kWh', estimate: 'KES 25,550' },
]

type TimeRange = 'Day' | 'Week' | 'Month' | 'Year';

export default function DashboardPage() {
  const { balance, dueDate } = useBilling();
  const [activeRange, setActiveRange] = useState<TimeRange>('Day');
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const displayedDate = useMemo(() => {
    if (activeRange === 'Day') return format(date || new Date(), 'MMMM dd, yyyy');
    if (activeRange === 'Week') return `Week of ${format(date || new Date(), 'MMMM dd')}`;
    if (activeRange === 'Month') return format(date || new Date(), 'MMMM yyyy');
    if (activeRange === 'Year') return format(date || new Date(), 'yyyy');
    return format(date || new Date(), 'PPP');
  }, [date, activeRange]);


  const handleDownload = (format: 'pdf' | 'csv') => {
    const reportContent = `BrightEco Usage Report\nDate: ${displayedDate}\nFormat: ${format.toUpperCase()}\n\n---\nThis is a sample report. In a real application, this would contain detailed usage data.`;
    const blob = new Blob([reportContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usage-report-${displayedDate}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <GracePeriodAlert />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card className="h-full">
                 <CardHeader>
                    <CardTitle className="font-headline text-xl">
                      Usage
                    </CardTitle>
                    <CardDescription>
                      Your household energy consumption.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {usageStats.map(stat => (
                            <div key={stat.title} className="p-4 rounded-lg bg-muted/50">
                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.estimate}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                            {(['Day', 'Week', 'Month', 'Year'] as TimeRange[]).map(range => (
                                <Button 
                                    key={range} 
                                    variant={activeRange === range ? 'default' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setActiveRange(range)}
                                    className="h-8 px-3"
                                >
                                    {range}
                                </Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" className="h-9 w-[200px] justify-start text-left font-normal">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    <span>{displayedDate}</span>
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                             <Button variant="outline" size="icon" className="h-9 w-9">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="h-[250px] w-full">
                        <EnergyUsageChart />
                    </div>

                    <div className="flex justify-end">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                              <Download className="mr-2 h-4 w-4" /> Download Report
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                                <FileText className="mr-2 h-4 w-4" />
                                Download as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload('csv')}>
                               <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Download as CSV
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">Energy Credit Balance</CardTitle>
                    <Zap className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">KES {balance.toFixed(2)}</div>
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

