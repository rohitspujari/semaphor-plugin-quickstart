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
};

export type MultiInputVisualProps = {
  data: DataArray;
  settings?: Record<string, string | number | boolean>[];
  /**
   * Pre-rendered inline filter components from the host application.
   * Render these wherever you want in your component layout.
   * Always an array (empty if no inline filters configured).
   */
  inlineFilters?: ReactNode[];
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
    settings?: Record<string, SettingConfig>;
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
