
'use client';

import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Wallet, TrendingUp } from 'lucide-react';

const complianceData = [
  { name: 'Compliant', value: 450, fill: 'hsl(var(--chart-1))' },
  { name: 'Non-Compliant', value: 50, fill: 'hsl(var(--destructive))' },
];

const customerData = [
    { month: 'Jan', revenue: 4000, signups: 20 },
    { month: 'Feb', revenue: 3000, signups: 15 },
    { month: 'Mar', revenue: 5000, signups: 30 },
    { month: 'Apr', revenue: 4500, signups: 25 },
    { month: 'May', revenue: 6000, signups: 35 },
    { month: 'Jun', revenue: 5500, signups: 32 },
]

const chartConfig = {
    revenue: {
      label: "Revenue (KES)",
      color: "hsl(var(--chart-1))",
    },
    signups: {
      label: "New Signups",
      color: "hsl(var(--chart-2))",
    },
};

export function CustomerAnalytics() {
  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="font-headline text-3xl font-bold">Customer Analytics</h2>
            <p className="text-muted-foreground mt-2">
                Analyze customer payment behavior and revenue trends.
            </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">500</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">480</div>
                    <p className="text-xs text-muted-foreground">96% of total customers</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ARPU (Monthly)</CardTitle>
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">KES 5,250</div>
                    <p className="text-xs text-muted-foreground">Average Revenue Per User</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Payment Compliance</CardTitle>
                    <CardDescription>Breakdown of customers by payment status.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                    <ChartContainer config={{}} className="w-full h-[250px]">
                        <ResponsiveContainer>
                            <PieChart>
                                <ChartTooltip
                                    cursor={true}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie 
                                    data={complianceData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60}
                                    outerRadius={100}
                                    strokeWidth={2}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                        return (
                                            <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                                                {`${name} (${(percent * 100).toFixed(0)}%)`}
                                            </text>
                                        );
                                    }}
                                    labelLine={false}
                                >
                                    {complianceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Monthly Growth</CardTitle>
                    <CardDescription>Revenue and new signups over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="w-full h-[250px]">
                        <ResponsiveContainer>
                            <BarChart data={customerData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis yAxisId="left" width={60} tickFormatter={(value) => `K${value / 1000}`} />
                                <YAxis yAxisId="right" orientation="right" width={40} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} name="Revenue" />
                                <Bar yAxisId="right" dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} name="Signups" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
