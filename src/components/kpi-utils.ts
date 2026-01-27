import type { CardMetadata, Data, FormatOptions, LegacyFormatNumber } from './config-types';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type KpiFormatNumber = NonNullable<CardMetadata['kpiConfig']>['formatNumber'];
type KpiFormatConfig = KpiFormatNumber | FormatOptions | undefined;

export function parseKPIData(data: Data) {
  const current = data.find((row) => row.segment === 'current');
  const comparison = data.find((row) => row.segment === 'comparison');
  const trendline = data.filter((row) => row.segment === 'trendline');

  const valueKey = Object.keys(current || {}).find((key) => key !== 'segment');

  return {
    currentValue: valueKey ? current?.[valueKey] : undefined,
    comparisonValue: valueKey ? comparison?.[valueKey] : undefined,
    trendlineData: trendline,
    valueKey,
  };
}

export function getPercentChange(
  current: number | undefined,
  comparison: number | undefined,
  isLowerBetter = false,
): { value: number | null; isPositive: boolean; isBetter: boolean; isNeutral: boolean } {
  if (current === undefined || comparison === undefined || comparison === 0) {
    return { value: null, isPositive: true, isBetter: true, isNeutral: true };
  }

  const change = ((current - comparison) / comparison) * 100;
  const isNeutral = change === 0;
  const isPositive = change > 0;
  const isBetter = isNeutral ? true : (isLowerBetter ? !isPositive : isPositive);

  return { value: change, isPositive, isBetter, isNeutral };
}

export function formatKPIValue(
  value: number | undefined,
  formatConfig?: KpiFormatConfig,
): string {
  if (value === undefined || Number.isNaN(value)) return '';

  const config: FormatOptions & LegacyFormatNumber = formatConfig ?? {};
  const locale = config.locale || 'en-US';
  const decimalPlaces = typeof config.decimalPlaces === 'number' ? config.decimalPlaces : 0;
  const prefix = config.prefix || '';
  const suffix = config.suffix || '';
  const currency = config.currency;
  const type = config.type;
  const multiplyBy =
    typeof config.multiplyBy === 'number' ? config.multiplyBy : undefined;

  const numberValue = multiplyBy !== undefined ? value * multiplyBy : value;

  let style: Intl.NumberFormatOptions['style'] = 'decimal';
  if (type === 'currency' || currency) {
    style = currency ? 'currency' : 'decimal';
  } else if (type === 'percent') {
    style = 'percent';
  }

  const formatted = new Intl.NumberFormat(locale, {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(numberValue);

  return `${prefix}${formatted}${suffix}`;
}

export function getComparisonLabel(metadata?: { type?: string; displayLabel?: string }) {
  if (!metadata) return '';
  if (metadata.displayLabel) return metadata.displayLabel;

  switch (metadata.type) {
    case 'previous_period':
      return 'vs Previous Period';
    case 'same_period_last_year':
      return 'vs Same Period Last Year';
    case 'start_vs_end':
      return 'Change Over Period';
    case 'target':
      return 'vs Target';
    default:
      return '';
  }
}

function parseDateAsUtc(dateString: string) {
  const trimmed = dateString.trim();
  const hasTime = /[T ]\d{2}:\d{2}/.test(trimmed);
  const hasZone = /([zZ]|[+-]\d{2}(:?\d{2})?)$/.test(trimmed);

  if (!hasTime) {
    return parseISO(`${trimmed}T00:00:00Z`);
  }

  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
  if (!hasZone) {
    return parseISO(`${normalized}Z`);
  }

  return parseISO(normalized);
}

/**
 * Formats a KPI comparison date range.
 *
 * IMPORTANT: KPI comparison dates are logical calendar dates already
 * resolved with CalendarContext on the backend. Always format in UTC
 * to prevent browser timezone shifting (e.g., "2024-01-14" -> "Jan 13").
 */
export function formatDateRange(
  start: string,
  end: string,
  _displayTimezone?: string,
): string {
  void _displayTimezone;
  try {
    const startDate = parseDateAsUtc(start);
    const endDate = parseDateAsUtc(end);
    return `${formatInTimeZone(startDate, 'UTC', 'MMM d, yyyy')} - ${formatInTimeZone(endDate, 'UTC', 'MMM d, yyyy')}`;
  } catch {
    return `${start} - ${end}`;
  }
}

/**
 * Short-form date range with year de-duplication.
 */
export function formatDateShort(
  start: string,
  end: string,
  _displayTimezone?: string,
): string {
  void _displayTimezone;
  try {
    const startDate = parseDateAsUtc(start);
    const endDate = parseDateAsUtc(end);

    if (startDate.getUTCFullYear() === endDate.getUTCFullYear()) {
      return `${formatInTimeZone(startDate, 'UTC', 'MMM d')} - ${formatInTimeZone(endDate, 'UTC', 'MMM d, yyyy')}`;
    }
    return formatDateRange(start, end);
  } catch {
    return `${start} - ${end}`;
  }
}

export function getComparisonPeriodLabel(metadata?: {
  type?: string;
  displayLabel?: string;
  comparisonPeriod?: { start: string; end: string };
}) {
  if (!metadata) return '';
  const label = getComparisonLabel(metadata);
  if (metadata.comparisonPeriod) {
    return `${label} (${formatDateShort(
      metadata.comparisonPeriod.start,
      metadata.comparisonPeriod.end,
    )})`;
  }
  return label;
}
