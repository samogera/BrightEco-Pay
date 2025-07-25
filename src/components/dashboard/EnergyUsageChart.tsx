'use client';

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  {month: 'January', usage: 186},
  {month: 'February', usage: 305},
  {month: 'March', usage: 237},
  {month: 'April', usage: 273},
  {month: 'May', usage: 209},
  {month: 'June', usage: 214},
];

const chartConfig = {
  usage: {
    label: 'kWh',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function EnergyUsageChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={value => value.slice(0, 3)}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `${value} kWh`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
