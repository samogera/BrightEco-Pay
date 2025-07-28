
'use client';

import { useState } from 'react';
import { Smartphone, BatteryFull, Zap, Sun, Bot, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getDeviceAdvice } from '@/ai/flows/get-device-advice';
import { useToast } from '@/hooks/use-toast';

const devices = [
  {
    id: 'DEV001',
    name: 'Solar Panel Array A',
    type: 'Solar Panel',
    status: 'Online',
    icon: Sun,
    metrics: { output: 2.1, efficiency: 18.5 },
  },
  {
    id: 'DEV002',
    name: 'Main Battery Bank',
    type: 'Battery',
    status: 'Online',
    icon: BatteryFull,
    metrics: { charge: 92, health: 99, runtime: 20.1 },
  },
  {
    id: 'DEV003',
    name: 'Primary Inverter',
    type: 'Inverter',
    status: 'Online',
    icon: Zap,
    metrics: { load: 1.2, temperature: 45 },
  },
    {
    id: 'DEV004',
    name: 'Solar Panel Array B',
    type: 'Solar Panel',
    status: 'Offline',
    icon: Sun,
    metrics: { output: 0, efficiency: 0 },
  },
];

const chartConfig = {
  output: { label: 'Output (kWh)', color: 'hsl(var(--chart-1))' },
  efficiency: { label: 'Efficiency (%)', color: 'hsl(var(--chart-2))' },
  charge: { label: 'Charge (%)', color: 'hsl(var(--chart-1))' },
  health: { label: 'Health (%)', color: 'hsl(var(--chart-2))' },
  load: { label: 'Load (kW)', color: 'hsl(var(--chart-1))' },
  temperature: { label: 'Temp (°C)', color: 'hsl(var(--chart-2))' },
};

export default function DevicesPage() {
    const { toast } = useToast();
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [advice, setAdvice] = useState<string | null>(null);

    const handleGetAdvice = async () => {
        setLoadingAdvice(true);
        setAdvice(null);
        try {
            const devicesForApi = devices.map(({ icon, ...rest }) => rest);
            const result = await getDeviceAdvice({ devices: devicesForApi });
            setAdvice(result.advice);
        } catch (error) {
            console.error('Error getting device advice:', error);
            toast({
                title: 'Error',
                description: 'Failed to get AI-powered advice. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoadingAdvice(false);
        }
    }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
              <CardHeader>
                  <CardTitle className="font-headline text-xl">Device Status</CardTitle>
                  <CardDescription>Live status of all your connected devices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {devices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                              <device.icon className="h-7 w-7 text-primary" />
                              <div>
                                  <p className="font-semibold">{device.name}</p>
                                  <p className="text-sm text-muted-foreground">{device.id}</p>
                              </div>
                          </div>
                          <Badge variant={device.status === 'Online' ? 'default' : 'destructive'}>{device.status}</Badge>
                      </div>
                  ))}
              </CardContent>
          </Card>
          <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Bot className="text-primary" /> AI Device Advisor
                    </CardTitle>
                    <CardDescription>
                        Get AI-powered recommendations for your system.
                    </CardDescription>
                </div>
                <Button onClick={handleGetAdvice} disabled={loadingAdvice}>
                    {loadingAdvice ? <Loader className="animate-spin" /> : 'Analyze System'}
                </Button>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  {loadingAdvice && (
                      <div className="flex items-center justify-center p-6">
                          <Loader className="h-8 w-8 animate-spin text-primary" />
                      </div>
                  )}
                  {advice ? (
                      <div
                          className="space-y-2"
                          dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />') }}
                      />
                  ) : (
                      !loadingAdvice && <p className="text-muted-foreground">Click "Analyze System" to get AI-powered advice on device maintenance, performance, and optimization.</p>
                  )}
              </CardContent>
          </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">Device Analytics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devices.filter(d => d.status === 'Online').map(device => (
                <Card key={device.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <device.icon className="h-6 w-6" /> {device.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="w-full h-[200px]">
                            <ResponsiveContainer>
                                <BarChart data={[device.metrics]} layout="vertical" margin={{ left: 10, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    {Object.keys(device.metrics).map((key, index) => (
                                        <Bar 
                                            key={key} 
                                            dataKey={key} 
                                            name={chartConfig[key as keyof typeof chartConfig]?.label}
                                            fill={chartConfig[key as keyof typeof chartConfig]?.color}
                                            radius={4}
                                            barSize={30}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
