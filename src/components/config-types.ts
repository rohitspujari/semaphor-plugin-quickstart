import { ReactNode } from 'react';

// Types
export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'radial'
  | 'funnel'
  | 'range'
  | 'tornado'
  | 'stacked'
  | 'combo'
  | 'table';

export type Data = Record<string, string | number | boolean>[];

export type DataArray = Data[];

export type CustomCardTheme = {
  colors?: string[];
  mode?: 'light' | 'dark' | 'system';
};

export type SingleInputVisualProps = {
  data: Data;
  settings?: Record<string, string | number | boolean>;
  cardMetadata?: CardMetadata;
  theme?: CustomCardTheme;
  /**
   * Pre-rendered inline filter components from the host application.
   * Render these wherever you want in your component layout.
   * Always an array (empty if no inline filters configured).
   *
   * @example
   * ```tsx
   * export function MyChart({ data, inlineFilters = [] }: SingleInputVisualProps) {
   *   return (
   *     <div>
   *       {inlineFilters.length > 0 && (
   *         <div className="flex gap-2 mb-4">{inlineFilters}</div>
   *       )}
   *       <ChartVisualization data={data} />
   *     </div>
   *   );
   * }
   * ```
   */
  inlineFilters?: ReactNode[];

  /**
   * Dashboard filter definitions that apply to this card.
   * Contains metadata about each filter (title, column, operation).
   */
  filters?: DashboardFilter[];

  /**
   * Active filter values - the current selections for each filter.
   * Use this to display what filters are currently applied.
   *
   * @example
   * ```tsx
   * export function MyChart({ data, filterValues = [] }: SingleInputVisualProps) {
   *   return (
   *     <div>
   *       {filterValues.length > 0 && (
   *         <div className="text-sm text-muted-foreground mb-2">
   *           Filtered by: {filterValues.map(f => f.name).join(', ')}
   *         </div>
   *       )}
   *       <ChartVisualization data={data} />
   *     </div>
   *   );
   * }
   * ```
   */
  filterValues?: ActiveFilterValue[];
};

export type TabMetadata = {
  titles: string[];
  cardTypes: string[];
  cardIds: string[];
};

export type ComparisonMetadataEntry = {
  type: 'previous_period' | 'same_period_last_year' | 'start_vs_end' | 'target';
  displayName?: string;
  displayLabel?: string;
  currentPeriod?: { start: string; end: string };
  comparisonPeriod?: { start: string; end: string };
};

export type ComparisonMetadataMap = Record<string, ComparisonMetadataEntry>;

export type CardMetadata = {
  cardType: string;
  title: string;
  description?: string;
  kpiConfig?: {
    comparisonMetadata?: ComparisonMetadataMap;
    options?: {
      lowerIsBetter?: boolean;
      showTrendline?: boolean;
      showComparison?: boolean;
    };
    formatNumber?: LegacyFormatNumber;
  };
  formatConfig?: CustomVisualFormatConfig;
};

export type FormatOptions = {
  type?: 'auto' | 'number' | 'currency' | 'percent' | 'scientific' | 'date';
  decimalPlaces?: number;
  currency?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  useSuffix?: boolean;
  negativeInParentheses?: boolean;
  multiplyBy?: number;
  dateFormat?: string;
};

export type ColumnNumberFormat = {
  style: 'decimal' | 'currency' | 'percent';
  currency: string;
  locale: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  showDataBar: boolean;
  dataBarColor: string;
  dataBarMinValue?: number;
  dataBarMaxValue?: number;
};

export type LegacyFormatNumber = {
  decimalPlaces?: number;
  currency?: string;
  locale?: string;
  suffix?: string;
  enabled?: boolean | string;
  colorRanges?: Array<{ start: number; end: number; color: string }>;
  [key: string]: unknown;
};

export type CustomVisualFormatConfig = {
  kpi?: {
    primary?: FormatOptions;
    comparison?: FormatOptions;
    colorRanges?: Array<{ start: number; end: number; color: string }>;
  };
  axes?: {
    xAxis?: FormatOptions;
    yAxis?: FormatOptions;
    secondaryYAxis?: FormatOptions;
  };
  dataLabels?: FormatOptions;
  tables?: {
    columns?: Array<{
      id?: string;
      label?: string;
      position?: number;
      numberFormat?: ColumnNumberFormat | FormatOptions;
    }>;
    columnMap?: Record<string, { numberFormat?: ColumnNumberFormat | FormatOptions }>;
    comparison?: FormatOptions;
    defaultNumberFormat?: FormatOptions;
  };
  legacy?: {
    formatNumber?: LegacyFormatNumber;
    numberAxisFormat?: {
      decimalPlaces?: number;
      suffix?: string;
      currency?: string;
      locale?: string;
    };
  };
};

export type MultiInputVisualProps = {
  data: DataArray;
  settings?: Record<string, string | number | boolean>;
  slotSettings?: Array<Record<string, string | number | boolean> | undefined>;
  theme?: CustomCardTheme;
  /**
   * Pre-rendered inline filter components from the host application.
   * Render these wherever you want in your component layout.
   * Always an array (empty if no inline filters configured).
   */
  inlineFilters?: ReactNode[];

  /**
   * Dashboard filter definitions that apply to this card.
   * Contains metadata about each filter (title, column, operation).
   */
  filters?: DashboardFilter[];

  /**
   * Active filter values - the current selections for each filter.
   * Use this to display what filters are currently applied.
   */
  filterValues?: ActiveFilterValue[];
  tabMetadata?: TabMetadata;
  cardMetadata?: CardMetadata[];
};

// ============================================
// Filter Types
// ============================================

/**
 * A selected record in a filter (value from the filter options)
 */
export type TSelectedRecord = {
  value: string | number | boolean;
  label?: string;
};

/**
 * Date range type for date filters
 */
export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

/**
 * Relative date filter metadata
 */
export type RelativeDateFilter = {
  mode: 'last' | 'this' | 'previous' | 'between';
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  n?: number;
  complete?: boolean;
  toDate?: boolean;
  from?: number;
  to?: number;
};

// ============================================
// Dashboard Filter Types (Simplified)
// ============================================

/**
 * Filter operation types
 */
export type FilterOperation =
  | '='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'in'
  | 'not in'
  | 'like'
  | 'not like'
  | 'between'
  | 'not between';

/**
 * Simplified filter definition - metadata about a dashboard filter.
 * Use this to understand what filters are configured on the dashboard.
 */
export type DashboardFilter = {
  id: string;
  title: string; // Display name of the filter
  column: string; // Column being filtered
  table: string; // Table containing the column
  dataType: string; // 'text', 'number', 'date', etc.
  operation: FilterOperation;
};

/**
 * Simplified active filter value - the current selection for a filter.
 * Use this to display or react to active filter selections.
 */
export type ActiveFilterValue = {
  filterId: string; // References DashboardFilter.id
  name: string; // Display name
  operation: FilterOperation;
  valueType: 'string' | 'number' | 'date' | 'boolean';
  values: (string | number | boolean)[]; // Selected values
  // For date filters with relative dates (e.g., "Last 7 days")
  relativeDateMeta?: RelativeDateFilter;
};

/**
 * Props passed to custom filter components for text/select filters.
 * Custom filters are purely presentational - all logic uses existing hooks.
 */
export type CustomFilterProps = {
  // Available options (from filter query)
  options: TSelectedRecord[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;

  // Current selection state
  selectedValues: TSelectedRecord[];

  // Callbacks (all filter logic handled by host application)
  onChange: (records: TSelectedRecord[]) => void;
  onClear: () => void;
  onSelectAll?: (checked: boolean) => void;

  // Search support
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSearching?: boolean;

  // Styling
  theme?: CustomCardTheme;

  // Plugin settings from manifest configuration
  settings?: Record<string, string | number | boolean>;

  // Single vs multi-select
  isSingleSelect?: boolean;
  allSelected?: boolean;
};

/**
 * Props passed to custom filter components for date filters.
 * Custom filters are purely presentational - all logic uses existing hooks.
 */
export type CustomDateFilterProps = {
  // Date ranges
  dateRange: DateRange | undefined;
  initialDateRange: DateRange | undefined;

  // State
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;

  // Callbacks (all filter logic handled by host application)
  onDateChange: (range: DateRange | undefined) => void;
  onRelativeDateChange?: (
    range: DateRange | undefined,
    meta: RelativeDateFilter
  ) => void;
  onClear: () => void;
  onReset?: () => void;

  // Styling
  theme?: CustomCardTheme;

  // Plugin settings from manifest configuration
  settings?: Record<string, string | number | boolean>;
};

// ============================================
// Config Types
// ============================================

// Documentation for individual settings
export type SettingDocumentation = {
  description?: string; // What this setting controls
};

// Documentation for visuals
export type VisualDocumentation = {
  description: string; // What this visual does
  dataSchema: string; // Markdown describing expected data format
  useCases?: string[]; // When to use this visual
  thumbnail?: string; // Base64 or URL for preview image (optional)
};

// Documentation for filters
export type FilterDocumentation = {
  description: string; // What this filter does
  useCases?: string[]; // When to use this filter
};

// Settings config with optional docs
export type SettingConfig = {
  title: string;
  defaultValue: string;
  ui: 'input' | 'select';
  options?: { label: string; value: string }[];
  docs?: SettingDocumentation;
};

export type ComponentsConfig = {
  visuals: {
    name: string; // display name as it appears in the dropdown. Must be unique.
    chartType?: ChartType | string; // this must be unique. Can be a predefined ChartType or a custom string for plugin visuals.
    component: string;
    componentType: 'chart';
    icon?: string; // name of the icon (React Component) from lucide
    dataInputs?: string[];
    visualType?: 'single' | 'multiple';
    minInputs?: number;
    maxInputs?: number;
    slots?: Array<{
      position: number | string;
      label: string;
      description?: string;
      expectedType?: string | string[];
      required?: boolean;
    }>;
    settings?: Record<string, SettingConfig>;
    slotSettings?: Record<string, SettingConfig>;
    docs?: VisualDocumentation;
  }[];
  filters?: {
    name: string; // display name, must be unique
    component: string; // React component export name
    filterType?: string; // unique filter type identifier
    icon?: string; // name of the icon from lucide-react
    supportedDataTypes?: string[]; // e.g., ['text', 'varchar', 'string'] - if empty, works with all types
    settings?: Record<string, SettingConfig>;
    docs?: FilterDocumentation;
  }[];
};
