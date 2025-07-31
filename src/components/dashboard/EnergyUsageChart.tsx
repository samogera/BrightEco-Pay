
'use client';

import {Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  usage: {
    label: 'Usage',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface EnergyUsageChartProps {
    data: any[];
    dataKey: string;
    unit: string;
}

export function EnergyUsageChart({ data, dataKey, unit }: EnergyUsageChartProps) {
  const customizedChartConfig = {
    ...chartConfig,
    usage: {
        ...chartConfig.usage,
        label: `Usage (${unit})`
    }
  }

  return (
    <ChartContainer config={customizedChartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey={dataKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value, index) => {
                if (data.length > 12 && index % 3 !== 0) return '';
                return value;
            }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${value} ${unit}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
