'use client';

import {
  //   LabelList,
  Pie,
  PieChart,
  // CartesianGrid,
  //   XAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui-globals/semaphor-chart';
import {
  ChartDataItem,
  generateChartConfigForPieChart,
} from './chart-data-utils';

type SemaphorPieChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
};

export function SemaphorPieChart({ data }: SemaphorPieChartProps) {
  if (!data || data?.length === 0) return null;

  const { chartConfig, keys } = generateChartConfigForPieChart(data);
  console.log(chartConfig, 'chartConfig');

  // add fill property to data
  const dataWithFill = data.map((item, i) => {
    // round robin colors from chartConfig object
    const color = Object.values(chartConfig).at(
      i % Object.values(chartConfig).length
    )?.color;
    return {
      ...item,
      fill: color,
    };
  });

  // console.log(data, 'data');

  function renderChartContainer() {
    return (
      <ChartContainer
        className="mx-auto aspect-square max-h-full pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        config={chartConfig}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={dataWithFill}
            // label={true}
            dataKey={keys?.[1]}
            nameKey={keys?.[0]}
          >
            {/* <LabelList
              dataKey={keys?.[0]}
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            /> */}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey={keys?.[0]} />}
            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    );
  }

  return <>{renderChartContainer()}</>;
}
