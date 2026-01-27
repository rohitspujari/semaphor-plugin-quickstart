# Create Custom Visual

This skill creates a new custom visual component for the Semaphor plugin.

## Instructions

### Step 1: Determine Visual Type

Ask the user which type of visual they want to create:

**Single-Input Visual**
- Displays data from **one card tab**
- The visual receives a single dataset from one query
- Example: A bar chart showing sales by region from one data source

**Multi-Input Visual**
- Combines data from **multiple card tabs** into one view
- Each tab contributes its own dataset to the visual
- Example: A KPI grid where each tab provides one metric, or a comparison view showing Current vs Previous vs Target from separate tabs

### Step 2: Gather Requirements

Ask the user:
1. **Component name**: What should it be called? (e.g., "Revenue Chart", "Multi-KPI Grid")
2. **Brief description**: What does it visualize?

**For Single-Input Visuals**, also ask:
3. **Column approach**:
   - **Positional (Recommended)** - Columns read by position (1st, 2nd, 3rd...). Works with any SQL query.
   - **Named** - Columns read by exact name. SQL must use matching column names/aliases.

**For Multi-Input Visuals**, also ask:
3. **Slot configuration mode**: (Show the 4 modes)
   - **Fully Dynamic** - All tabs treated equally, no slot guidance
   - **Repeating Pattern** - All tabs same type, uniform guidance
   - **Fixed + Dynamic** - Specific first tab(s), then unlimited
   - **Fully Structured** - Exact positions with specific meanings
4. **Does it use KPI data?** - If yes, will use the `segment` column convention (see KPI Data Structure section)

Convert the name to:
- **PascalCase** for component name (e.g., `RevenueChart`)
- **kebab-case** for folder/file name (e.g., `revenue-chart`)

### Step 3: Create Component Files

Create folder and files at:
```
src/components/semaphor-components/{kebab-case-name}/
├── {kebab-case-name}.tsx      # React component
├── {kebab-case-name}.data.ts  # Sample data for Showcase
└── {kebab-case-name}.md       # Component documentation
```

---

## Understanding Multi-Input Visuals

This section explains HOW multi-input visuals work from the end-user's perspective in Semaphor. Understanding this helps you build components that match user expectations.

### How Multi-Input Works in Semaphor

When a user configures a multi-input visual in Semaphor's dashboard editor:

1. **Select the visual**: User picks your custom visual from the chart type selector
2. **Semaphor detects it's multi-input**: Based on `visualType: 'multiple'` in your config
3. **Tabs appear**: The editor shows tabs at the top (Config tab = Slot 0, plus Slot 1, Slot 2, etc.)
4. **Configure each tab**: Each tab has its own:
   - Data source selection
   - SQL query or table selection
   - Per-slot settings (from `manifest.slotSettings`)
5. **Config tab (Slot 0)**: Also shows global settings (from `manifest.settings`)
6. **Preview button**: User clicks Preview to see all tabs' data combined
7. **Save**: All tab configurations are saved together as one card

### The Data Your Component Receives

```
Config tab (Slot 0) query runs → data[0]
Slot 1 query runs → data[1]
Slot 2 query runs → data[2]
...
```

Your component receives:
- `data`: Array of arrays - `data[0]` is Slot 0 (config tab), `data[1]` is Slot 1, etc.
- `settings`: Global settings (applies to entire visual, configured on Slot 0)
- `slotSettings`: Per-slot settings array - `slotSettings[0]` for Slot 0, `slotSettings[1]` for Slot 1, etc.
- `tabMetadata.titles`: Array of tab titles the user entered
- `tabMetadata.cardIds`: Unique IDs for React keys
- `cardMetadata`: Rich metadata about each tab's configuration (see reference below)

### What Users See vs What You Build

| User Action | What Your Component Receives |
|-------------|------------------------------|
| Adds Slot 2 | `data` array grows to length 3 |
| Names Slot 1 "Revenue" | `tabMetadata.titles[1]` = "Revenue" |
| Configures Slot 2 as KPI | `cardMetadata[2].cardType` = "kpi" |
| Sets "lower is better" | `cardMetadata[n].kpiConfig.options.lowerIsBetter` = true |

---

## Single-Input Visual Templates

### Positional Columns (Recommended)

Use this approach when you want the visual to work with any SQL query - users just need to order their SELECT columns correctly.

#### Component Template (Positional)

```tsx
import { SingleInputVisualProps } from '../../config-types';

/**
 * {Component Name}
 *
 * {Description from user}
 *
 * Column mapping (positional):
 * - 1st column: {purpose}
 * - 2nd column: {purpose}
 * - etc.
 */
export function {PascalCaseName}({
  data,
  settings,
  cardMetadata,
  theme,
  inlineFilters = [],
}: SingleInputVisualProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  // Position-based column detection
  const keys = Object.keys(data[0]);
  const labelKey = keys[0];  // 1st column
  const valueKey = keys[1];  // 2nd column
  // Add more as needed: const detailsKey = keys[2];

  // Settings (user-configurable via manifest)
  // Note: 'title' and 'description' settings auto-default to card values
  const title = (settings?.title as string) || cardMetadata?.title || '{Default Title}';
  const description = cardMetadata?.description;

  // Theme colors
  const primaryColor = theme?.colors?.[0] || '#3b82f6';

  return (
    <div className="flex flex-col h-full p-4">
      {/* Inline filters */}
      {inlineFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg border">
          {inlineFilters}
        </div>
      )}

      {/* Header - uses cardMetadata for context */}
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {/* Content */}
      <div className="flex-1">
        {data.map((row, index) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <span>{row[labelKey]}</span>
            <span>{row[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Sample Data Template (Positional)

```typescript
// Position-based columns - ORDER MATTERS
// 1st column = label, 2nd column = value
export const sampleData = [
  { label: 'Item A', value: 100 },
  { label: 'Item B', value: 200 },
  { label: 'Item C', value: 150 },
];

export const sampleSettings = {
  title: '{Default Title}',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  mode: 'light' as const,
};
```

#### Documentation Template (Positional)

```markdown
# {Component Name}

## Overview
{Brief description}

## Position-Based Column Mapping

| Position | Purpose | Required |
|----------|---------|----------|
| 1st column | Label/category | Yes |
| 2nd column | Value | Yes |

## Sample Query
\`\`\`sql
SELECT category_name, SUM(amount) as total
FROM sales
GROUP BY category_name
\`\`\`

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| title | string | "{Default Title}" | Header title |

## Usage Notes
- Column order matters - the component reads by position, not name
- Any column names work as long as order is correct
```

#### Config Entry (Positional)

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: '{LucideIconName}',
  settings: {
    title: {
      title: 'Title',
      defaultValue: '{Default Title}',
      ui: 'input',
      docs: { description: 'Header title' },
    },
  },
  docs: {
    description: '{Description}',
    dataSchema: `
### Position-Based Columns

| Position | Purpose |
|----------|---------|
| 1st | Label |
| 2nd | Value |

### Example Query
\`\`\`sql
SELECT name, amount FROM table
\`\`\`
    `.trim(),
    useCases: ['{Use case 1}', '{Use case 2}'],
  },
},
```

---

### Named Columns

Use this approach when you want explicit column names that users must match in their SQL.

#### Component Template (Named)

```tsx
import { SingleInputVisualProps } from '../../config-types';

/**
 * {Component Name}
 *
 * {Description from user}
 *
 * Required columns: label, value
 */
export function {PascalCaseName}({
  data,
  settings,
  cardMetadata,
  theme,
  inlineFilters = [],
}: SingleInputVisualProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  // Settings (user-configurable via manifest)
  // Note: 'title' and 'description' settings auto-default to card values
  const title = (settings?.title as string) || cardMetadata?.title || '{Default Title}';
  const description = cardMetadata?.description;

  // Theme colors
  const primaryColor = theme?.colors?.[0] || '#3b82f6';

  return (
    <div className="flex flex-col h-full p-4">
      {/* Inline filters */}
      {inlineFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg border">
          {inlineFilters}
        </div>
      )}

      {/* Header - uses cardMetadata for context */}
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {/* Content */}
      <div className="flex-1">
        {data.map((row, index) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Sample Data Template (Named)

```typescript
// Named columns - must use exact column names: label, value
export const sampleData = [
  { label: 'Item A', value: 100 },
  { label: 'Item B', value: 200 },
  { label: 'Item C', value: 150 },
];

export const sampleSettings = {
  title: '{Default Title}',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  mode: 'light' as const,
};
```

#### Documentation Template (Named)

```markdown
# {Component Name}

## Overview
{Brief description}

## Required Columns

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| label | text | Yes | Display label |
| value | number | Yes | Numeric value |

## Sample Query
\`\`\`sql
SELECT category_name AS label, SUM(amount) AS value
FROM sales
GROUP BY category_name
\`\`\`

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| title | string | "{Default Title}" | Header title |

## Usage Notes
- SQL must return columns named exactly: label, value
- Use AS aliases if your source columns have different names
```

#### Config Entry (Named)

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: '{LucideIconName}',
  settings: {
    title: {
      title: 'Title',
      defaultValue: '{Default Title}',
      ui: 'input',
      docs: { description: 'Header title' },
    },
  },
  docs: {
    description: '{Description}',
    dataSchema: `
### Required Columns

| Column | Type | Description |
|--------|------|-------------|
| label | text | Display label |
| value | number | Numeric value |

### Example Query
\`\`\`sql
SELECT name AS label, amount AS value FROM table
\`\`\`
    `.trim(),
    useCases: ['{Use case 1}', '{Use case 2}'],
  },
},
```

---

## Settings System

### Overview

Plugins control their own settings via the manifest. There are two types:

| Type | Purpose | Manifest Field | Prop Received |
|------|---------|----------------|---------------|
| **Global settings** | Apply to entire visual | `settings` | `settings` |
| **Per-slot settings** | Apply to individual tabs/slots | `slotSettings` | `slotSettings[]` |

### Single-Input Visuals

Single-input visuals only use `settings` (no slots):

```typescript
// Manifest
{
  settings: {
    title: { title: 'Title', defaultValue: '', ui: 'input' },
    showTrend: { title: 'Show Trend', defaultValue: 'true', ui: 'select', options: [...] }
  }
}

// Component receives
settings?.title      // User-configured (or auto-filled from card)
settings?.showTrend  // User-configured
```

### Multi-Input Visuals

Multi-input visuals can use both `settings` (global) and `slotSettings` (per-slot):

```typescript
// Manifest
{
  settings: {
    showGrid: { title: 'Show Grid', defaultValue: 'true', ui: 'select', options: [...] },
    colorScheme: { title: 'Color Scheme', defaultValue: 'default', ui: 'select', options: [...] }
  },
  slotSettings: {
    title: { title: 'Title', defaultValue: '', ui: 'input' },
    lineColor: { title: 'Line Color', defaultValue: 'blue', ui: 'input' }
  }
}

// Component receives
settings?.showGrid           // Global - applies to all slots
settings?.colorScheme        // Global - applies to all slots
slotSettings?.[0]?.title     // Per-slot - for slot 0
slotSettings?.[0]?.lineColor // Per-slot - for slot 0
slotSettings?.[1]?.title     // Per-slot - for slot 1
```

### Title/Description Convention

**Important**: For settings named `title` or `description`, Semaphor automatically pre-fills values from the card. Use the complete fallback pattern:

```typescript
// Settings fallback pattern (priority order):
// 1. slotSettings  - user-configured per-slot settings
// 2. cardMetadata  - card context from Semaphor (title, description, kpiConfig)
// 3. tabMetadata   - tab names from user configuration
// 4. Default       - hardcoded fallback

const title =
  slotSettings?.[index]?.title ||
  cardMetadata?.[index]?.title ||
  tabMetadata?.titles?.[index] ||
  'Default';
const description =
  slotSettings?.[index]?.description ||
  cardMetadata?.[index]?.description;
```

**Why all four levels?**
- `slotSettings` may be undefined if user didn't override the auto-filled value
- `cardMetadata` provides the card's configured title/description
- `tabMetadata.titles` is the tab name the user entered
- Default ensures something always displays

This ensures consistency - the visual title matches the card title by default.

### UI Experience

- **Tab 0 (Config Tab)**: Shows both "Global Settings" AND "Slot 0 Settings"
- **Tab 1+ (Input Tabs)**: Shows only "Slot N Settings"

---

## Multi-Input Visual Templates

Use these templates when the user wants to create a visual that combines data from multiple tabs.

### Understanding KPI Data Structure

Semaphor's built-in KPI system returns data with a special `segment` column. If your multi-input visual works with KPI data, you should understand this convention:

```
| segment     | value  |
|-------------|--------|
| current     | 28494  |
| comparison  | 45624  |
| trendline   | 25000  |  (multiple rows for trend)
| trendline   | 27000  |
| trendline   | 28494  |
```

**Segment values:**
- `current` - The main KPI value for the current period
- `comparison` - The comparison period value (e.g., last month, last year)
- `trendline` - Historical data points (if trendline is enabled)

**When to use this structure:**
- Your visual displays KPI-style metrics with comparisons
- You want to leverage `cardMetadata.formatConfig.kpi` (preferred) or `cardMetadata.kpiConfig` (legacy) for formatting and comparison labels

**When NOT to use this structure:**
- Your visual uses custom data shapes
- Each tab returns different column structures
- You're not showing KPI-style comparisons

Use `parseKPIData(tabData)` from `kpi-utils.ts` to easily extract current/comparison values.

### Full CardMetadata Reference

CardMetadata provides rich context about each card. Both single-input and multi-input visuals receive the same structure:

| Visual Type | cardMetadata Shape | Access Pattern |
|-------------|-------------------|----------------|
| Single-input | `CardMetadata` (single object) | `cardMetadata?.title` |
| Multi-input | `CardMetadata[]` (array) | `cardMetadata?.[index]?.title` |

```typescript
// Full CardMetadata structure
type CardMetadata = {
  // Basic info
  cardType: 'kpi' | 'bar' | 'line' | 'table' | string;
  title: string;           // Card title (tabTitle || title)
  description?: string;    // Card description (if set)

  // KPI-specific configuration (only present for KPI card types)
  kpiConfig?: {
    // Comparison metadata from the backend
    comparisonMetadata?: {
      'comparison-id': {
        type: 'previous_period' | 'same_period_last_year' | 'target' | 'start_vs_end';
        displayLabel: string;  // e.g., 'vs Last Month'
        displayName: string;
        currentPeriod?: { start: string; end: string };
        comparisonPeriod?: { start: string; end: string };
      }
    };

    // User-configured options
    options?: {
      lowerIsBetter?: boolean;    // If true, decreases are shown as positive
      showComparison?: boolean;   // Whether to show comparison value
      showTrendline?: boolean;    // Whether trendline data is included
    };

    // Number formatting preferences
    formatNumber?: {
      decimalPlaces?: number;
      suffix?: string;         // e.g., '%', 'K', 'M'
      locale?: string;
      currency?: string;       // If set, uses currency formatting
    };
  };

  // Normalized formatting (preferred)
  formatConfig?: {
    kpi?: { primary?: any; comparison?: any; colorRanges?: any[] };
    axes?: { xAxis?: any; yAxis?: any; secondaryYAxis?: any };
    dataLabels?: any;
    tables?: {
      columns?: Array<{ id?: string; label?: string; position?: number; numberFormat?: any }>;
      columnMap?: Record<string, { numberFormat?: any }>;
      comparison?: any;
      defaultNumberFormat?: any;
    };
    legacy?: { formatNumber?: any; numberAxisFormat?: any };
  };
};
```

**Accessing comparison metadata:**
```typescript
// Get the first (usually only) comparison entry
const comparisonMeta = cardMetadata?.[index]?.kpiConfig?.comparisonMetadata
  ? Object.values(cardMetadata[index].kpiConfig.comparisonMetadata)[0]
  : undefined;

// Now you can access:
comparisonMeta?.type           // 'previous_period', 'same_period_last_year', etc.
comparisonMeta?.displayLabel   // 'vs Last Month'
comparisonMeta?.comparisonPeriod?.start  // '2024-01-01'
comparisonMeta?.comparisonPeriod?.end    // '2024-01-31'
```

### Number Formatting in Custom Visuals

Custom visuals receive `formatConfig` in `cardMetadata` for consistent number formatting across all card types.

#### KPI Formatting Example

```typescript
// In your multi-input component
data.map((tabData, index) => {
  const meta = cardMetadata?.[index];
  const { currentValue, comparisonValue } = parseKPIData(tabData);

  // Get format config with fallback to legacy
  const primaryFormat = meta?.formatConfig?.kpi?.primary
    ?? meta?.kpiConfig?.formatNumber;
  const comparisonFormat = meta?.formatConfig?.kpi?.comparison;

  // Format values
  const formattedValue = formatKPIValue(Number(currentValue ?? 0), primaryFormat);
  const formattedComparison = comparisonFormat
    ? formatKPIValue(Number(comparisonValue ?? 0), comparisonFormat)
    : null;
});
```

#### Chart Formatting Example

```typescript
// For chart data labels or axis values
const meta = cardMetadata;

// Data labels format
const dataLabelFormat = meta?.formatConfig?.dataLabels;

// Y-axis format (with fallback)
const yAxisFormat = meta?.formatConfig?.axes?.yAxis
  ?? meta?.formatConfig?.legacy?.formatNumber;

// Format a value for display
const formatAxisValue = (value: number) => {
  if (!yAxisFormat) return value.toLocaleString();
  return formatKPIValue(value, yAxisFormat);
};
```

#### Table Column Formatting Example

```typescript
// For table-based visuals
const meta = cardMetadata;
const columns = meta?.formatConfig?.tables?.columns ?? [];
const columnMap = meta?.formatConfig?.tables?.columnMap ?? {};
const defaultFormat = meta?.formatConfig?.tables?.defaultNumberFormat;

// Format by position
const formatByPosition = (value: number, colIndex: number) => {
  const format = columns[colIndex]?.numberFormat ?? defaultFormat;
  return format ? formatKPIValue(value, format) : value.toLocaleString();
};

// Format by column id
const formatById = (value: number, columnId: string) => {
  const format = columnMap[columnId]?.numberFormat ?? defaultFormat;
  return format ? formatKPIValue(value, format) : value.toLocaleString();
};
```

### Component Template (Multi-Input)

```tsx
import { MultiInputVisualProps } from '../../config-types';
import { formatKPIValue } from '../../kpi-utils';

/**
 * {Component Name}
 *
 * {Description}
 *
 * Multi-input visual: Receives data from all tabs in the frame.
 * - data[0] = first tab's records
 * - data[1] = second tab's records
 * - settings = global settings (applies to entire visual)
 * - slotSettings[n] = per-slot settings for tab n
 * - tabMetadata.titles[n] = tab n's title
 * - cardMetadata[n] = rich metadata for tab n (KPI config, formatting, etc.)
 *
 * The `editing` prop is true when shown in the editor's Preview modal.
 * Use it to show helpful context like "Preview Mode" or tab count.
 */
export function {PascalCaseName}({
  data = [],
  settings,
  slotSettings,
  theme,
  tabMetadata,
  cardMetadata,
  editing = false,
}: MultiInputVisualProps) {
  // ==========================================
  // EMPTY STATE HANDLING
  // ==========================================
  // Handle no data at all
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>Add tabs with data to see the visualization</p>
      </div>
    );
  }

  // ==========================================
  // GLOBAL SETTINGS (from manifest.settings)
  // ==========================================
  // These apply to the entire visual, configured on Tab 0
  const showGrid = settings?.showGrid ?? true;
  const colorScheme = settings?.colorScheme ?? 'default';

  // Theme colors - use these for consistent styling
  const colors = theme?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="flex flex-col h-full p-4">
      {/* Editor mode indicator - helps users understand they're in preview */}
      {editing && (
        <div className="text-xs text-muted-foreground mb-2 px-2 py-1 bg-muted rounded">
          Preview Mode - {data.length} tab(s) configured
        </div>
      )}

      {/* Render data from each tab */}
      <div className="grid grid-cols-4 gap-4">
        {data.map((tabData, index) => {
          // ==========================================
          // PER-SLOT SETTINGS (from manifest.slotSettings)
          // ==========================================
          // These are specific to each tab/slot
          const slotSetting = slotSettings?.[index];
          const lineColor = slotSetting?.lineColor ?? colors[index % colors.length];
          // Note: 'title' and 'description' in slotSettings auto-default to card values
          const slotTitle = slotSetting?.title;

          // Get metadata for this tab (read-only context from Semaphor)
          const meta = cardMetadata?.[index];

          // Settings fallback pattern: slotSettings → cardMetadata → tabMetadata → default
          const title =
            slotTitle ||
            meta?.title ||
            tabMetadata?.titles?.[index] ||
            `Tab ${index + 1}`;
          const description =
            (slotSetting?.description as string) ||
            meta?.description;

          // Handle empty tab data gracefully
          if (!tabData || tabData.length === 0) {
            return (
              <div
                key={tabMetadata?.cardIds?.[index] ?? index}
                className="p-4 rounded-lg border border-dashed text-muted-foreground text-sm"
              >
                {title}: No data
              </div>
            );
          }

          // Extract first value (customize based on your data shape)
          const firstRow = tabData[0] || {};
          const value = Object.values(firstRow)[0];

          // Number formatting - prefer formatConfig, fallback to legacy
          const valueFormat = meta?.formatConfig?.kpi?.primary
            ?? meta?.kpiConfig?.formatNumber;

          // Format the value for display (use formatKPIValue from kpi-utils.ts)
          const formattedValue = valueFormat
            ? formatKPIValue(Number(value), valueFormat)
            : String(value);

          return (
            <div
              key={tabMetadata?.cardIds?.[index] ?? index}
              className="p-4 rounded-lg border"
              style={{ borderColor: lineColor }}
            >
              <div className="text-sm text-muted-foreground">{title}</div>
              {description && <div className="text-xs text-muted-foreground">{description}</div>}
              <div className="text-2xl font-bold">{formattedValue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Sample Data Template (Multi-Input)

```typescript
// Multi-input sample data - array of data arrays
// Each inner array represents one tab's query results
export const sampleData = [
  // Tab 0 data - uses KPI segment convention
  [{ segment: 'current', value: 28494 }, { segment: 'comparison', value: 45624 }],
  // Tab 1 data
  [{ segment: 'current', value: 73.8 }, { segment: 'comparison', value: 72.0 }],
  // Tab 2 data
  [{ segment: 'current', value: 38630 }, { segment: 'comparison', value: 61620 }],
  // Tab 3 data
  [{ segment: 'current', value: 0 }, { segment: 'comparison', value: 10 }],
];

// Tab metadata - matches what Semaphor passes from tab configuration
export const sampleTabMetadata = {
  titles: ['Labour Gross', 'Lbr Grs %', 'Labour Sale', 'Discounts'],
  cardTypes: ['kpi', 'kpi', 'kpi', 'kpi'],
  cardIds: ['card-1', 'card-2', 'card-3', 'card-4'],  // Use for React keys
};

// Card metadata - rich context for each tab
// Includes formatConfig (preferred) and kpiConfig (legacy fallback)
export const sampleCardMetadata = [
  {
    cardType: 'kpi',
    title: 'Labour Gross',
    formatConfig: {
      kpi: {
        primary: { type: 'currency', currency: 'USD', decimalPlaces: 0 },
        comparison: { type: 'currency', currency: 'USD', decimalPlaces: 0 },
      },
    },
    kpiConfig: {
      options: { lowerIsBetter: false, showComparison: true },
      comparisonMetadata: {
        'cmp-1': {
          type: 'previous_period',
          displayLabel: 'vs Last Month',
        }
      },
      formatNumber: { currency: 'USD', decimalPlaces: 0 }  // Legacy fallback
    }
  },
  {
    cardType: 'kpi',
    title: 'Lbr Grs %',
    formatConfig: {
      kpi: {
        primary: { type: 'percent', decimalPlaces: 1 },
        comparison: { type: 'percent', decimalPlaces: 1 },
      },
    },
    kpiConfig: {
      options: { lowerIsBetter: false, showComparison: true },
      formatNumber: { suffix: '%', decimalPlaces: 1 }  // Legacy fallback
    }
  },
  {
    cardType: 'kpi',
    title: 'Labour Sale',
    formatConfig: {
      kpi: {
        primary: { type: 'currency', currency: 'USD', decimalPlaces: 0 },
      },
    },
    kpiConfig: { options: { lowerIsBetter: true, showComparison: true } }
  },
  {
    cardType: 'kpi',
    title: 'Discounts',
    formatConfig: {
      kpi: {
        primary: { type: 'number', decimalPlaces: 0 },
      },
    },
    kpiConfig: { options: { lowerIsBetter: true, showComparison: true } }
  },
];

export const sampleSettings = {};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  mode: 'light' as const,
};
```

### Config Entry Templates (Multi-Input)

#### Mode 1: Fully Dynamic (No Slots)

Use when all tabs are treated equally with no specific structure.

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: 'LayoutGrid',
  visualType: 'multiple',
  minInputs: 1,
  maxInputs: 20,
  // No slots array - fully dynamic, any number of tabs
  docs: {
    description: '{Description}. Add as many tabs as needed.',
    dataSchema: `### Flexible Multi-Input\nEach tab renders as an equal item.`,
    useCases: ['{Use case 1}'],
  },
},
```

#### Mode 2: Repeating Pattern

Use when all tabs should be the same type (e.g., all KPIs).

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: 'LayoutGrid',
  visualType: 'multiple',
  minInputs: 1,
  maxInputs: 12,
  slots: [
    {
      position: '0+',       // Applies to ALL positions (0, 1, 2, ...)
      label: 'KPI',
      description: 'Each tab renders as a KPI card.',
      expectedType: 'kpi',  // Hint to users about expected card type
    },
  ],
  // Global settings (applies to entire visual)
  settings: {
    showGrid: {
      title: 'Show Grid',
      defaultValue: 'true',
      ui: 'select',
      options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }],
    },
  },
  // Per-slot settings (configured on each tab)
  slotSettings: {
    title: {
      title: 'Display Title',
      defaultValue: '',  // Auto-fills from card title
      ui: 'input',
    },
    lineColor: {
      title: 'Line Color',
      defaultValue: 'blue',
      ui: 'input',
    },
  },
  docs: { /* ... */ },
},
```

#### Mode 3: Fixed + Dynamic

Use when you have specific first slot(s) with meaning, then unlimited additional slots.

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: 'LayoutDashboard',
  visualType: 'multiple',
  minInputs: 2,
  maxInputs: 12,
  slots: [
    {
      position: 0,
      label: 'Hero',
      description: 'Primary metric displayed prominently.',
      expectedType: 'kpi',
      required: true,
    },
    {
      position: '1+',        // Applies to positions 1, 2, 3, ...
      label: 'Supporting',
      description: 'Additional metrics in grid.',
      expectedType: 'kpi',
    },
  ],
  docs: { /* ... */ },
},
```

#### Mode 4: Fully Structured

Use when you need exact positions with specific meanings.

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: 'GitCompare',
  visualType: 'multiple',
  minInputs: 3,
  maxInputs: 3,             // Exact number required
  slots: [
    { position: 0, label: 'Current', description: 'Current period value', required: true },
    { position: 1, label: 'Previous', description: 'Previous period value', required: true },
    { position: 2, label: 'Target', description: 'Target/goal value', required: true },
  ],
  docs: { /* ... */ },
},
```

### KPI Utilities (Multi-Input)

For KPI-specific multi-input visuals, use the helper utilities from `kpi-utils.ts`:

```typescript
import {
  parseKPIData,
  getPercentChange,
  formatKPIValue,
  getComparisonLabel,
  formatDateRange,
  formatDateShort,
} from '../../kpi-utils';

// Inside your component, for each tab:
data.map((tabData, index) => {
  const meta = cardMetadata?.[index];

  // Parse KPI data - extracts current/comparison from segment column
  const { currentValue, comparisonValue, trendlineData } = parseKPIData(tabData);

  // Calculate change with lowerIsBetter support
  const change = getPercentChange(
    Number(currentValue ?? 0),
    Number(comparisonValue ?? 0),
    meta?.kpiConfig?.options?.lowerIsBetter
  );
  // Returns: { value: -37.5, isPositive: false, isBetter: true, isNeutral: false }

  // Format value with currency/locale/suffix from card preferences
  const formatted = formatKPIValue(
    Number(currentValue ?? 0),
    meta?.formatConfig?.kpi?.primary ?? meta?.kpiConfig?.formatNumber
  );
  // Returns: "$28,494" or "73.8%" depending on config

  // Get comparison label from metadata
  const comparisonMeta = meta?.kpiConfig?.comparisonMetadata
    ? Object.values(meta.kpiConfig.comparisonMetadata)[0]
    : undefined;
  const comparisonLabel = getComparisonLabel(comparisonMeta);
  // Returns: "vs Last Month" or "vs Same Period Last Year"

  // Format comparison date range (always UTC to preserve logical dates)
  if (comparisonMeta?.comparisonPeriod) {
    const dateRange = formatDateShort(
      comparisonMeta.comparisonPeriod.start,
      comparisonMeta.comparisonPeriod.end
    );
    // Returns: "Jan 1 - Jan 31, 2024"
  }
});
```

**Why UTC for dates?** KPI comparison dates are logical calendar dates resolved on the backend. Formatting in UTC prevents browser timezone shifting (e.g., "Jan 14" becoming "Jan 13" in PST).

### Edge Case Handling

Your multi-input component should handle these scenarios gracefully:

```typescript
export function MyMultiInputVisual({
  data = [],
  tabMetadata,
  cardMetadata,
}: MultiInputVisualProps) {

  // 1. No data at all
  if (!data || data.length === 0) {
    return <EmptyState message="Add tabs to see visualization" />;
  }

  // 2. Fewer tabs than expected (for structured visuals)
  const expectedTabs = 3; // If your visual expects exactly 3
  if (data.length < expectedTabs) {
    return (
      <EmptyState
        message={`This visual requires ${expectedTabs} tabs. Currently ${data.length} configured.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((tabData, index) => {
        // 3. Individual empty tab
        if (!tabData || tabData.length === 0) {
          return (
            <div key={tabMetadata?.cardIds?.[index] ?? index} className="empty-tab">
              {tabMetadata?.titles?.[index] || `Tab ${index + 1}`}: No data
            </div>
          );
        }

        // 4. Missing metadata (defensive access)
        const title = tabMetadata?.titles?.[index] ?? `Tab ${index + 1}`;
        const meta = cardMetadata?.[index];
        const lowerIsBetter = meta?.kpiConfig?.options?.lowerIsBetter ?? false;

        return (
          <div key={tabMetadata?.cardIds?.[index] ?? index}>
            {/* Render tab content */}
          </div>
        );
      })}
    </div>
  );
}
```

### Practical Example: Current vs Previous vs Target

Here's a complete example of building a structured 3-slot comparison visual:

**User request:** "Create a visual that shows Current value, Previous period, and Target side by side"

**1. Config entry (Mode 4: Fully Structured):**

```typescript
{
  name: 'Comparison Card',
  component: 'ComparisonCard',
  componentType: 'chart',
  chartType: 'comparison-card',
  icon: 'GitCompare',
  visualType: 'multiple',
  minInputs: 3,
  maxInputs: 3,
  slots: [
    { position: 0, label: 'Current', description: 'Current period value', required: true },
    { position: 1, label: 'Previous', description: 'Previous period for comparison', required: true },
    { position: 2, label: 'Target', description: 'Target/goal value', required: true },
  ],
  docs: {
    description: 'Compare current performance against previous period and target.',
    dataSchema: `Each tab should return a single numeric value.`,
    useCases: ['KPI comparison', 'Goal tracking'],
  },
},
```

**2. Component:**

```tsx
import { MultiInputVisualProps } from '../../config-types';
import { parseKPIData, formatKPIValue, getPercentChange } from '../../kpi-utils';

export function ComparisonCard({
  data = [],
  tabMetadata,
  cardMetadata,
  theme,
}: MultiInputVisualProps) {
  // Require exactly 3 tabs
  if (data.length < 3) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Configure all 3 tabs: Current, Previous, and Target
      </div>
    );
  }

  // Extract values from each tab
  const { currentValue } = parseKPIData(data[0]);    // Tab 0 = Current
  const { currentValue: prevValue } = parseKPIData(data[1]);   // Tab 1 = Previous
  const { currentValue: targetValue } = parseKPIData(data[2]); // Tab 2 = Target

  const current = Number(currentValue ?? 0);
  const previous = Number(prevValue ?? 0);
  const target = Number(targetValue ?? 0);

  const vsPrev = getPercentChange(current, previous);
  const vsTarget = getPercentChange(current, target);

  const formatConfig = cardMetadata?.[0]?.formatConfig?.kpi?.primary
    ?? cardMetadata?.[0]?.kpiConfig?.formatNumber;

  return (
    <div className="p-6 space-y-4">
      <div className="text-3xl font-bold">
        {formatKPIValue(current, formatConfig)}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className={vsPrev.isBetter ? 'text-green-600' : 'text-red-600'}>
            {vsPrev.isPositive ? '↑' : '↓'} {Math.abs(vsPrev.value ?? 0).toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-2">vs Previous</span>
        </div>
        <div>
          <span className={vsTarget.isBetter ? 'text-green-600' : 'text-red-600'}>
            {vsTarget.isPositive ? '↑' : '↓'} {Math.abs(vsTarget.value ?? 0).toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-2">vs Target</span>
        </div>
      </div>
    </div>
  );
}
```

**3. How users configure this in Semaphor:**

1. Select "Comparison Card" from chart picker
2. Editor shows 3 required tabs: "Current", "Previous", "Target"
3. For Tab 1 (Current): Configure query for current period value
4. For Tab 2 (Previous): Configure query for previous period value
5. For Tab 3 (Target): Configure query for target value
6. Click Preview to see combined result
7. Save

---

## Final Steps (Both Types)

### Step 4: Export the Component

Edit `src/components/index.ts`:
```typescript
export { {PascalCaseName} } from './semaphor-components/{kebab-case-name}/{kebab-case-name}';
```

### Step 5: Register Sample Data

Edit `src/showcase/sample-data-registry.ts`:

**For Single-Input Visual:**
```typescript
import * as {camelCaseName}Data from '../components/semaphor-components/{kebab-case-name}/{kebab-case-name}.data';

// Add to registry
{PascalCaseName}: {camelCaseName}Data,
```

**For Multi-Input Visual:**
```typescript
import * as {camelCaseName}Data from '../components/semaphor-components/{kebab-case-name}/{kebab-case-name}.data';

// Add to registry (includes sampleTabMetadata and sampleCardMetadata)
{PascalCaseName}: {camelCaseName}Data,
```

### Step 6: Verify

Tell the user:
1. Run `npm run dev` to start the Showcase
2. Find your component in the sidebar
3. Check that it renders correctly with sample data
4. For multi-input: Verify all "tabs" display correctly (the Showcase passes `sampleTabMetadata` and `sampleCardMetadata` automatically)
5. Verify documentation displays properly in the Doc panel

---

## Reference

### Critical Naming Rules

The component name must match EXACTLY across:
- `export function {Name}` in `.tsx`
- `export { {Name} }` in `index.ts`
- `component: '{Name}'` in `components.config.ts`
- `{Name}: data` in `sample-data-registry.ts`

### Available Icons

Common Lucide icons: `BarChart`, `LineChart`, `PieChart`, `Table`, `LayoutDashboard`, `TrendingUp`, `Activity`, `LayoutGrid`, `GitCompare`, `TableProperties`, `GitBranch`

### Single-Input vs Multi-Input Differences

| Aspect | Single-Input | Multi-Input |
|--------|--------------|-------------|
| Props type | `SingleInputVisualProps` | `MultiInputVisualProps` |
| Data shape | `data: Data` (single array) | `data: DataArray` (array of arrays) |
| Config | No `visualType` needed | `visualType: 'multiple'` required |
| Settings | `settings` only | `settings` (global) + `slotSettings[]` (per-slot) |
| Slots | N/A | Optional `slots` array for guidance |
| Sample data | Single data array | Array of data arrays + `sampleTabMetadata` + `sampleCardMetadata` |
| Key prop | Use `index` | Use `tabMetadata?.cardIds?.[index] ?? index` |
| cardMetadata | `CardMetadata` (single object) | `CardMetadata[]` (array per slot) |
| Manifest | `settings: {...}` | `settings: {...}` + `slotSettings: {...}` |

### Reference Examples

- **Single-Input**: See `my-table` component for a complete working example
- **Multi-Input**: See `multi-kpi-grid` component for a complete working example with KPI utilities

---

## Embedded Plugin Constraints

These plugins are rendered inside a parent application (Semaphor). This creates CSS scoping issues:

### DO NOT use CSS variables for colors

**BAD - Will not work when embedded:**
```tsx
// ChartContainer generates CSS variables that won't be accessible
<Area stroke={`var(--color-${key})`} />
<stop stopColor={`var(--color-revenue)`} />
```

**GOOD - Use direct color values:**
```tsx
const colors = theme?.colors || ['#3b82f6', '#10b981', '#f59e0b'];

<Area stroke={colors[index % colors.length]} />
<stop stopColor={colors[0]} />
```

### ChartContainer and ChartTooltip

You CAN use `ChartContainer`, `ChartTooltip`, and `ChartTooltipContent` from `ui/chart.tsx` for nice tooltips - just don't rely on the CSS variables for SVG colors:

```tsx
// This works - ChartContainer for tooltips, but direct colors for chart elements
<ChartContainer config={chartConfig} className="h-full w-full">
  <AreaChart data={data}>
    <Area
      stroke={colors[index]}           // Direct color ✓
      fill={`url(#${gradientId})`}     // Reference gradient by ID ✓
    />
    <defs>
      <linearGradient id={gradientId}>
        <stop stopColor={colors[index]} />  // Direct color ✓
      </linearGradient>
    </defs>
    <ChartTooltip content={<ChartTooltipContent />} />  // Tooltips work ✓
  </AreaChart>
</ChartContainer>
```

### Why this happens

The `ChartContainer` component generates CSS like:
```css
[data-chart=chart-abc123] {
  --color-revenue: #3b82f6;
}
```

But when embedded in Semaphor, the parent app's CSS isolation prevents these selectors from matching, so `var(--color-revenue)` resolves to nothing.
