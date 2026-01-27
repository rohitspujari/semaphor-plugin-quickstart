import { useMemo } from 'react';
import { MultiInputVisualProps } from '../../config-types';
import {
  formatKPIValue,
  getComparisonLabel,
  getPercentChange,
  parseKPIData,
} from '../../kpi-utils';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../ui/chart';

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

/**
 * KPI Area Chart
 *
 * A multi-input visual combining a KPI header with a multi-series area chart.
 *
 * Slots:
 * - Slot 0 (KPI): KPI data with segment column (current, comparison)
 * - Slot 1 (Trend): Time series data (1st col = label, remaining cols = series values)
 */
export function KpiAreaChart({
  data = [],
  slotSettings,
  tabMetadata,
  cardMetadata,
  theme,
}: MultiInputVisualProps) {
  const colors = useMemo(() => theme?.colors ?? DEFAULT_COLORS, [theme?.colors]);

  const kpiData = data[0] || [];
  // Parse KPI data from slot 0
  const { currentValue, comparisonValue } = parseKPIData(kpiData);
  const meta = cardMetadata?.[0];

  // Format config: prefer formatConfig.kpi.primary, fallback to legacy kpiConfig.formatNumber
  const primaryFormat = meta?.formatConfig?.kpi?.primary ?? meta?.kpiConfig?.formatNumber;

  const currentNumber =
    currentValue === null || currentValue === undefined
      ? undefined
      : Number(currentValue);
  const comparisonNumber =
    comparisonValue === null || comparisonValue === undefined
      ? undefined
      : Number(comparisonValue);

  const change = getPercentChange(
    currentNumber,
    comparisonNumber,
    meta?.kpiConfig?.options?.lowerIsBetter
  );

  const showComparison = meta?.kpiConfig?.options?.showComparison !== false;

  // Comparison label: slotSettings → cardMetadata → default
  const comparisonLabel =
    (slotSettings?.[0]?.comparisonLabel as string) ||
    getComparisonLabel(
      meta?.kpiConfig?.comparisonMetadata
        ? Object.values(meta.kpiConfig.comparisonMetadata)[0]
        : undefined
    );

  // Get title following the settings fallback pattern:
  // 1. slotSettings (user-configured per-slot)
  // 2. cardMetadata (card context from Semaphor)
  // 3. tabMetadata (tab names)
  // 4. Default
  const title =
    (slotSettings?.[0]?.title as string) ||
    meta?.title ||
    tabMetadata?.titles?.[0] ||
    'KPI';

  // Detect series columns (all columns after the first one)
  const { chartData, seriesKeys, labelKey } = useMemo(() => {
    const trendData = data[1] || [];
    if (!trendData || trendData.length === 0) {
      return { chartData: [], seriesKeys: [], labelKey: '' };
    }

    const keys = Object.keys(trendData[0]);
    const label = keys[0]; // First column is the label (e.g., month)
    const series = keys.slice(1); // Remaining columns are series

    const processed = trendData.map((row) => {
      const result: Record<string, string | number> = {
        [label]: row[label] as string,
      };
      series.forEach((key) => {
        result[key] = Number(row[key]) || 0;
      });
      return result;
    });

    return { chartData: processed, seriesKeys: series, labelKey: label };
  }, [data]);

  // Generate unique gradient IDs for each series
  const gradientIds = useMemo(() => {
    const baseId = Math.random().toString(36).slice(2, 9);
    return seriesKeys.map((_, i) => `kpi-area-gradient-${baseId}-${i}`);
  }, [seriesKeys]);

  // Build chart config for shadcn tooltips
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    seriesKeys.forEach((key, index) => {
      config[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
        color: colors[index % colors.length],
      };
    });
    return config;
  }, [seriesKeys, colors]);

  // Handle empty state (after hooks to keep hook order stable)
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>Configure both KPI and Trend tabs to see the visualization</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* KPI Header */}
      <div className="mb-4">
        <div className="text-sm text-muted-foreground font-medium">
          {title}
        </div>
        <div className="text-3xl font-bold mt-1">
          {formatKPIValue(currentNumber, primaryFormat)}
        </div>
        {showComparison &&
          comparisonValue !== undefined &&
          change.value !== null && (
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span
                className={
                  change.isNeutral
                    ? 'text-muted-foreground'
                    : change.isBetter
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                }
              >
                {change.isNeutral ? '—' : change.isPositive ? '↑' : '↓'}{' '}
                {Math.abs(change.value).toFixed(1)}%
              </span>
              {comparisonLabel && (
                <span className="text-muted-foreground">{comparisonLabel}</span>
              )}
            </div>
          )}
      </div>

      {/* Area Chart */}
      <div className="flex-1 min-h-[120px]">
        {chartData.length > 0 && seriesKeys.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                {seriesKeys.map((_, index) => (
                  <linearGradient
                    key={gradientIds[index]}
                    id={gradientIds[index]}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                dataKey={labelKey}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    className="min-w-[180px] gap-3"
                  />
                }
              />
              {seriesKeys.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
              {seriesKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  fill={`url(#${gradientIds[index]})`}
                />
              ))}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No trend data available
          </div>
        )}
      </div>
    </div>
  );
}
