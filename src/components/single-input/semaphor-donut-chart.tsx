'use client';

import {
  Label,
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
  generateChartConfigForPieChartWithCustomColors,
  getKeys,
} from '../../utils/chart-data-utils';
import { useMemo } from 'react';

type SemaphorDonutChartProps = {
  data?: ChartDataItem[];
  settings?: Record<string, string | number | boolean>;
  theme?: {
    colors: string[];
  };
};

export function SemaphorDonutChart({
  data,
  settings,
  theme,
}: SemaphorDonutChartProps) {
  const keys = getKeys(data || []);
  const total = useMemo(() => {
    const totalKey = keys?.[1];
    console.log(totalKey, 'totalKey');

    return data?.reduce(
      (acc, curr) => acc + (curr?.[totalKey as keyof typeof curr] as number),
      0
    );
  }, [data, keys]);
  if (!data || data?.length === 0) return null;

  const label = settings?.label || 'Total';

  const { chartConfig } = generateChartConfigForPieChartWithCustomColors(
    data,
    theme?.colors || []
  );
  //   console.log(chartConfig, 'chartConfig');

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
        className=" aspect-square max-h-full m-0 p-0 h-full w-full [&_.recharts-pie-label-text]:fill-foreground"
        config={chartConfig}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={dataWithFill}
            // label={true}
            dataKey={keys?.[1]}
            nameKey={keys?.[0]}
            innerRadius={60}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {total?.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {label}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
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
