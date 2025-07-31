
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
  FileSpreadsheet,
  Loader
} from 'lucide-react';
import Link from 'next/link';
import { DateRange } from "react-day-picker"
import { addDays, format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';


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
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useState, useMemo, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { getDeviceAdvice } from '@/ai/flows/get-device-advice';
import { useToast } from '@/hooks/use-toast';
import { LoadingLogo } from '@/components/shared/LoadingLogo';


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


// --- DYNAMIC MOCK DATA GENERATION ---
const generateChartData = (range: DateRange | undefined) => {
    if (!range?.from) {
        return { data: [], dataKey: 'time', unit: 'Wh' };
    }

    const from = range.from;
    const to = range.to || range.from;
    const days = differenceInDays(to, from);

    if (days === 0) { // Hourly view
        const data = Array.from({ length: 24 }, (_, i) => ({ 
            time: `${i}:00`, 
            usage: Math.floor(Math.random() * (i > 5 && i < 22 ? 150 : 30)) + 10 
        }));
        return { data, dataKey: 'time', unit: 'Wh' };
    }

    if (days > 0 && days <= 14) { // Daily view
        const data = eachDayOfInterval({ start: from, end: to }).map(day => ({
            day: format(day, 'MMM d'),
            usage: Math.floor(Math.random() * 8) + 4
        }));
        return { data, dataKey: 'day', unit: 'kWh' };
    }

    if (days > 14 && days <= 90) { // Weekly view
        const data = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 }).map((week, i) => ({
            week: `Week ${i + 1}`,
            usage: Math.floor(Math.random() * 50) + 25
        }));
        return { data, dataKey: 'week', unit: 'kWh' };
    }

    // Monthly view
    const data = eachMonthOfInterval({ start: from, end: to }).map(month => ({
        month: format(month, 'MMM yyyy'),
        usage: Math.floor(Math.random() * 300) + 150
    }));
    return { data, dataKey: 'month', unit: 'kWh' };
};


type TimeRangePreset = 'Day' | 'Week' | 'Month' | 'Year';

export default function DashboardPage() {
  const { balance, dueDate } = useBilling();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activePreset, setActivePreset] = useState<TimeRangePreset>('Day');
  const [reportLoading, setReportLoading] = useState(false);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: chartData, dataKey, unit } = useMemo(() => generateChartData(date), [date]);

  useEffect(() => {
    // When a preset is clicked, update the date range
    let newDate: DateRange | undefined;
    const today = new Date();
    switch (activePreset) {
        case 'Day':
            newDate = { from: today, to: today };
            break;
        case 'Week':
            newDate = { from: startOfWeek(today), to: endOfWeek(today) };
            break;
        case 'Month':
            newDate = { from: startOfMonth(today), to: endOfMonth(today) };
            break;
        case 'Year':
            newDate = { from: startOfYear(today), to: endOfYear(today) };
            break;
    }
    setDate(newDate);
  }, [activePreset]);

  const displayedDate = useMemo(() => {
    if (!date?.from) {
      return 'Select a date range';
    }
     if (!date.to || format(date.from, 'PPP') === format(date.to, 'PPP')) {
      return format(date.from, 'MMMM dd, yyyy');
    }
    return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
  }, [date]);


  const handleDownload = async (formatType: 'pdf' | 'csv') => {
    setReportLoading(true);
    toast({ title: 'Generating Report...', description: 'Please wait while we generate your usage report.'});

    let aiAdvice = 'Could not generate AI advice at this time.';
    try {
        const adviceResult = await getDeviceAdvice({ devices: [] }); // Sending empty for general advice
        aiAdvice = adviceResult.advice;
    } catch (e) {
        console.error("Failed to get AI advice for report", e);
    }

    const totalUsage = chartData.reduce((acc, item) => acc + item.usage, 0);
    
    // In a real app, this would be a more sophisticated report
    let reportContent = '';
    const headers = [dataKey.charAt(0).toUpperCase() + dataKey.slice(1), `Usage (${unit})`];
    const rows = chartData.map(item => [item[dataKey], item.usage]);

    if (formatType === 'pdf') {
        reportContent = `
========================================
      BrightEco Energy Usage Report
========================================

--- User Details ---
Name: ${user?.displayName || 'N/A'}
Email: ${user?.email || 'N/A'}
Phone: ${user?.phoneNumber || 'N/A'}

--- Report Details ---
Date Range: ${displayedDate}
Generated On: ${format(new Date(), 'MMMM dd, yyyy, hh:mm a')}

--- Usage Metrics ---
Total Energy Consumed: ${totalUsage.toFixed(2)} ${unit}
Peak Usage Time: 1:00 PM (Simulated)
Energy Credit Balance: KES ${balance.toFixed(2)}

--- AI Efficiency Analysis ---
${aiAdvice}

========================================
        `;
    } else { // CSV
      reportContent += `Date Range,"${displayedDate}"\n`;
      reportContent += `Generated On,"${format(new Date(), 'MMMM dd, yyyy, hh:mm a')}"\n\n`;
      reportContent += headers.join(',') + '\n';
      rows.forEach(row => {
        reportContent += row.join(',') + '\n';
      });
    }

    const blob = new Blob([reportContent], { type: formatType === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brighteco-usage-report-${format(new Date(), 'yyyy-MM-dd')}.${formatType === 'csv' ? 'csv' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setReportLoading(false);
  };
  
  const handleDateNav = (direction: 'prev' | 'next') => {
    if(!date?.from || !date?.to) return;
    const d = direction === 'prev' ? -1 : 1;
    const diff = differenceInDays(date.to, date.from);

    let newFrom, newTo;

    if (diff === 0) { // Day
        newFrom = addDays(date.from, d);
        newTo = newFrom;
    } else if (diff <= 7) { // Week
        newFrom = addDays(date.from, d * 7);
        newTo = addDays(date.to, d * 7);
    } else if (diff <= 31) { // Month
        newFrom = addDays(date.from, d * 30);
        newTo = addDays(date.to, d * 30);
    } else { // Year
         newFrom = addDays(date.from, d * 365);
         newTo = addDays(date.to, d * 365);
    }
    setDate({ from: newFrom, to: newTo });
  }
  
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
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">Daily Total</p>
                            <p className="text-xl font-bold">6.40 kWh</p>
                            <p className="text-xs text-muted-foreground">KES 75</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">Weekly Total</p>
                            <p className="text-xl font-bold">45 kWh</p>
                            <p className="text-xs text-muted-foreground">KES 520</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">Monthly Total</p>
                            <p className="text-xl font-bold">180 kWh</p>
                             <p className="text-xs text-muted-foreground">KES 2,100</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm text-muted-foreground">Yearly Total</p>
                            <p className="text-xl font-bold">2,190 kWh</p>
                             <p className="text-xs text-muted-foreground">KES 25,550</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                            {(['Day', 'Week', 'Month', 'Year'] as TimeRangePreset[]).map(range => (
                                <Button 
                                    key={range} 
                                    variant={activePreset === range ? 'default' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setActivePreset(range)}
                                    className="h-8 px-3"
                                >
                                    {range}
                                </Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleDateNav('prev')}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant="outline" className="h-9 w-[240px] justify-start text-left font-normal">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    <span className="truncate">{displayedDate}</span>
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                                </PopoverContent>
                            </Popover>
                             <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleDateNav('next')}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="h-[250px] w-full">
                        <EnergyUsageChart 
                            data={chartData} 
                            dataKey={dataKey} 
                            unit={unit}
                        />
                    </div>

                    <div className="flex justify-end">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={reportLoading}>
                              {reportLoading ? <LoadingLogo /> : <Download className="mr-2 h-4 w-4" />} 
                              Download Report
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

    
