
'use client';

import {Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
    { time: "12am", usage: 10 }, { time: "1am", usage: 8 }, { time: "2am", usage: 7 },
    { time: "3am", usage: 7 }, { time: "4am", usage: 9 }, { time: "5am", usage: 15 },
    { time: "6am", usage: 45 }, { time: "7am", usage: 80 }, { time: "8am", usage: 60 },
    { time: "9am", usage: 50 }, { time: "10am", usage: 45 }, { time: "11am", usage: 40 },
    { time: "12pm", usage: 38 }, { time: "1pm", usage: 35 }, { time: "2pm", usage: 32 },
    { time: "3pm", usage: 30 }, { time: "4pm", usage: 35 }, { time: "5pm", usage: 50 },
    { time: "6pm", usage: 110 }, { time: "7pm", usage: 150 }, { time: "8pm", usage: 140 },
    { time: "9pm", usage: 100 }, { time: "10pm", usage: 70 }, { time: "11pm", usage: 40 },
];


const chartConfig = {
  usage: {
    label: 'Usage (Wh)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function EnergyUsageChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value, index) => index % 3 === 0 ? value : ''}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={value => `${value} Wh`}
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
