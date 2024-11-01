'use client';

// import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  // CartesianGrid,
  XAxis,
} from 'recharts';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import {
  // ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui-globals/semaphor-chart';
import { ChartDataItem, generateChartConfig } from './chart-data-utils';

export const description = 'A stacked area chart';

type SemaphorBarChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
};

export function SemaphorBarChart({ data }: SemaphorBarChartProps) {
  if (!data || data?.length === 0) return null;

  //   const type = settings?.type || 'natural';

  console.log(data, 'data');

  const { chartConfig, keys } = generateChartConfig(data, [0]);

  // console.log(data, 'data');

  function renderChartContainer() {
    return (
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={keys?.[0]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          {keys?.slice(1).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={chartConfig[key]?.color}
              //   fillOpacity={0.4}
              //   stroke={chartConfig[key]?.color}
              //   stackId="a"
              radius={4}
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    );
  }

  return <>{renderChartContainer()}</>;
}
