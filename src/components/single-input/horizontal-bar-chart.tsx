'use client';

// import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  // CartesianGrid,
  XAxis,
  YAxis,
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
} from '@/components/ui/chart';
import { ChartDataItem, generateChartConfig } from './chart-data-utils';

export const description = 'A stacked area chart';

type HorizontalBarChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
};

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
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
          <XAxis type="number" dataKey={keys?.[0]} />
          <YAxis
            dataKey={keys?.[1]}
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar
            dataKey={keys?.[2]}
            //   type={type as CurveType}
            fill={chartConfig[keys?.[2]]?.color}
            //   fillOpacity={0.4}
            //   stroke={chartConfig[key]?.color}
            //   stackId="a"
            radius={4}
          />

          {/* {keys?.slice(2).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              //   type={type as CurveType}
              fill={chartConfig[key]?.color}
              //   fillOpacity={0.4}
              //   stroke={chartConfig[key]?.color}
              //   stackId="a"
              radius={4}
            />
          ))} */}

          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    );
  }
  // console.log(chartData, 'chartData');

  return <>{renderChartContainer()}</>;
}
