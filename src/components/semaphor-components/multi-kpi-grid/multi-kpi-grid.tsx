import { MultiInputVisualProps } from '../../config-types';
import {
  formatKPIValue,
  getComparisonLabel,
  getPercentChange,
  parseKPIData,
} from '../../kpi-utils';

export function MultiKpiGrid({
  data = [],
  tabMetadata,
  cardMetadata,
  theme,
}: MultiInputVisualProps) {
  const colors = theme?.colors || ['#2f80ed', '#27ae60', '#f2994a', '#eb5757'];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((tabData, index) => {
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
          meta?.kpiConfig?.options?.lowerIsBetter,
        );
        const showComparison =
          meta?.kpiConfig?.options?.showComparison !== false;
        const comparisonLabel = getComparisonLabel(
          meta?.kpiConfig?.comparisonMetadata
            ? Object.values(meta.kpiConfig.comparisonMetadata)[0]
            : undefined,
        );

        return (
          <div
            key={tabMetadata?.cardIds?.[index] ?? index}
            className="rounded-lg border border-border bg-background p-4"
            style={{ borderColor: colors[index % colors.length] }}
          >
            <div className="text-xs text-muted-foreground">
              {meta?.title || tabMetadata?.titles?.[index] || `KPI ${index + 1}`}
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {formatKPIValue(currentNumber, meta?.kpiConfig?.formatNumber)}
            </div>
            {showComparison &&
              comparisonValue !== undefined &&
              comparisonLabel &&
              change.value !== null && (
              <div className="mt-2 text-xs text-muted-foreground">
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
                <span className="ml-2">{comparisonLabel}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
