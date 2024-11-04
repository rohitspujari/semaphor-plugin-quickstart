'use client';

// import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
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
import {
  ChartDataItem,
  generateChartConfigWithCustomColors,
} from '../../utils/chart-data-utils';
import { CurveType } from 'recharts/types/shape/Curve';

export const description = 'A stacked area chart';

type SemaphorLineChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
  theme?: {
    colors: string[];
  };
};

export function SemaphorLineChart({
  data,
  settings,
  theme,
}: SemaphorLineChartProps) {
  if (!data || data?.length === 0) return null;

  const type = settings?.type || 'natural';

  console.log(data, 'data');

  // const { chartConfig, keys } = generateChartConfig(data, [0]);
  const { chartConfig, keys } = generateChartConfigWithCustomColors(
    data,
    [0],
    theme?.colors || []
  );

  // console.log(data, 'data');

  function renderChartContainer() {
    return (
      <ChartContainer config={chartConfig}>
        <LineChart
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
            <Line
              key={key}
              dataKey={key}
              type={type as CurveType}
              fill={chartConfig[key]?.color}
              //   fillOpacity={0.4}
              stroke={chartConfig[key]?.color}
              //   stackId="a"
              strokeWidth={2}
              dot={false}
              radius={4}
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    );
  }

  return <>{renderChartContainer()}</>;
}
