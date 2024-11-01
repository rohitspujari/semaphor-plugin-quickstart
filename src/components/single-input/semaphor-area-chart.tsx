'use client';

// import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
import { CurveType } from 'recharts/types/shape/Curve';

export const description = 'A stacked area chart';

type SemaphorAreaChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
};

export function SemaphorAreaChart({ data, settings }: SemaphorAreaChartProps) {
  if (!data || data?.length === 0) return null;

  const type = settings?.type || 'natural';

  console.log(data, 'data');

  const { chartConfig, keys } = generateChartConfig(data, [0]);

  // console.log(data, 'data');

  function renderChartContainer() {
    return (
      <ChartContainer config={chartConfig}>
        <AreaChart
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
          {keys.slice(1).map((key) => (
            <Area
              key={key}
              dataKey={key}
              type={type as CurveType}
              fill={chartConfig[key]?.color}
              fillOpacity={0.4}
              stroke={chartConfig[key]?.color}
              stackId="a"
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    );
  }
  // console.log(chartData, 'chartData');

  return (
    <>{renderChartContainer()}</>
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Area Chart - Stacked</CardTitle>
    //     <CardDescription>
    //       Showing total visitors for the last 6 months
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>{renderChartContainer()}</CardContent>
    //   <CardFooter>
    //     <div className="flex w-full items-start gap-2 text-sm">
    //       <div className="grid gap-2">
    //         <div className="flex items-center gap-2 font-medium leading-none">
    //           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //         </div>
    //         <div className="flex items-center gap-2 leading-none text-muted-foreground">
    //           January - June 2024
    //         </div>
    //       </div>
    //     </div>
    //   </CardFooter>
    // </Card>
  );
}
