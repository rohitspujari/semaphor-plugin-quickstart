import { MultiInputVisualProps } from '../../config-types';
import {
  formatKPIValue,
  getComparisonLabel,
  getPercentChange,
  parseKPIData,
} from '../../kpi-utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Info } from 'lucide-react';

/**
 * Multi KPI Grid
 *
 * A multi-input visual with a hero KPI at the top and child KPIs below.
 *
 * Layout:
 * - Slot 0: Hero KPI (large, top-left)
 * - Slot 1+: Child KPIs (smaller, row below)
 * - Info tooltip in top-right corner (global setting)
 */
export function MultiKpiGrid({
  data = [],
  settings,
  slotSettings,
  tabMetadata,
  cardMetadata,
}: MultiInputVisualProps) {
  const infoTooltip = settings?.infoTooltip as string;

  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>Add KPI tabs to see the visualization</p>
      </div>
    );
  }

  // Hero KPI (Slot 0)
  const heroData = data[0];
  const heroMeta = cardMetadata?.[0];
  const { currentValue: heroCurrentValue, comparisonValue: heroComparisonValue } =
    parseKPIData(heroData);
  const heroCurrentNumber =
    heroCurrentValue === null || heroCurrentValue === undefined
      ? undefined
      : Number(heroCurrentValue);
  const heroComparisonNumber =
    heroComparisonValue === null || heroComparisonValue === undefined
      ? undefined
      : Number(heroComparisonValue);
  const heroChange = getPercentChange(
    heroCurrentNumber,
    heroComparisonNumber,
    heroMeta?.kpiConfig?.options?.lowerIsBetter
  );
  const heroShowComparison = heroMeta?.kpiConfig?.options?.showComparison !== false;
  const heroComparisonLabel =
    (slotSettings?.[0]?.comparisonLabel as string) ||
    getComparisonLabel(
      heroMeta?.kpiConfig?.comparisonMetadata
        ? Object.values(heroMeta.kpiConfig.comparisonMetadata)[0]
        : undefined
    );
  const heroTitle =
    (slotSettings?.[0]?.title as string) ||
    heroMeta?.title ||
    tabMetadata?.titles?.[0] ||
    'KPI';

  // Child KPIs (Slot 1+)
  const childData = data.slice(1);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Hero Row */}
      <div className="flex items-start justify-between mb-4">
        {/* Hero KPI */}
        <div className="flex-1">
          <div className="text-sm text-muted-foreground font-medium">
            {heroTitle}
          </div>
          <div className="text-3xl font-bold mt-1">
            {formatKPIValue(heroCurrentNumber, heroMeta?.kpiConfig?.formatNumber)}
          </div>
          {heroShowComparison &&
            heroComparisonValue !== undefined &&
            heroChange.value !== null && (
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span
                  className={
                    heroChange.isNeutral
                      ? 'text-muted-foreground'
                      : heroChange.isBetter
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                  }
                >
                  {heroChange.isNeutral ? '—' : heroChange.isPositive ? '↑' : '↓'}{' '}
                  {formatKPIValue(
                    Math.abs(heroCurrentNumber! - heroComparisonNumber!),
                    heroMeta?.kpiConfig?.formatNumber
                  )}
                </span>
                {heroComparisonLabel && (
                  <span className="text-muted-foreground">{heroComparisonLabel}</span>
                )}
              </div>
            )}
        </div>

        {/* Info Tooltip */}
        {infoTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-full hover:bg-muted/50 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[250px]">
                <p className="text-sm">{infoTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Child KPIs Row */}
      {childData.length > 0 && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(childData.length, 4)}, 1fr)`,
          }}
        >
          {childData.map((tabData, idx) => {
            const index = idx + 1; // Offset by 1 since we sliced
            const meta = cardMetadata?.[index];
            const { currentValue, comparisonValue } = parseKPIData(tabData);
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
            const comparisonLabel =
              (slotSettings?.[index]?.comparisonLabel as string) ||
              getComparisonLabel(
                meta?.kpiConfig?.comparisonMetadata
                  ? Object.values(meta.kpiConfig.comparisonMetadata)[0]
                  : undefined
              );
            const title =
              (slotSettings?.[index]?.title as string) ||
              meta?.title ||
              tabMetadata?.titles?.[index] ||
              `KPI ${index + 1}`;

            return (
              <div
                key={tabMetadata?.cardIds?.[index] ?? index}
                className="min-w-0"
              >
                <div className="text-xs text-muted-foreground truncate">
                  {title}
                </div>
                <div className="text-lg font-semibold mt-0.5">
                  {formatKPIValue(currentNumber, meta?.kpiConfig?.formatNumber)}
                </div>
                {showComparison &&
                  comparisonValue !== undefined &&
                  change.value !== null && (
                    <div className="flex items-center gap-1 mt-0.5 text-xs">
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
                        <span className="text-muted-foreground truncate">
                          {comparisonLabel}
                        </span>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
