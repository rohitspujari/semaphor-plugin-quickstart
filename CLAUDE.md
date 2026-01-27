# CLAUDE.md - Semaphor Plugin SDK

This file provides guidance for Claude Code when working in this repository.

## Project Overview

This is the **Semaphor Plugin SDK** - a quickstart template for building custom visualizations and filters that integrate with Semaphor dashboards. Plugins follow the micro frontend pattern, allowing independent deployment without modifying Semaphor core.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Charting library (optional)

## Commands

```bash
npm run dev      # Start Showcase gallery at localhost:5173
npm run build    # Build plugin bundle to dist/
npm run publish  # Build and publish to Semaphor (requires semaphor init)
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── components.config.ts       # Plugin manifest - register components here
│   ├── config-types.ts            # TypeScript types for props
│   ├── index.ts                   # Component exports (MUST match config)
│   │
│   ├── semaphor-components/       # Custom components
│   │   ├── my-table/
│   │   │   ├── my-table.tsx       # Component implementation
│   │   │   ├── my-table.data.ts   # Sample data for Showcase
│   │   │   └── my-table.md        # Component documentation
│   │   ├── summary-table/
│   │   └── chip-filter/
│   │
│   └── ui/                        # Shared UI components
│
├── showcase/                      # Local dev gallery
│   ├── showcase.tsx               # Gallery UI
│   ├── component-card.tsx         # Component preview
│   ├── doc-panel.tsx              # Documentation panel
│   └── sample-data-registry.ts    # Maps components to sample data
│
└── lib/
    └── utils.ts                   # Utilities (cn function)
```

## Creating a New Visual

Use the skill: `/create-visual` or follow these steps:

1. **Create folder**: `src/components/semaphor-components/{name}/`
2. **Create component**: `{name}.tsx` using `SingleInputVisualProps`
3. **Create sample data**: `{name}.data.ts` with `sampleData`, `sampleSettings`, `sampleTheme`
4. **Create documentation**: `{name}.md` with overview, architecture, data shape, sample query, settings
5. **Register in config**: Add to `components.config.ts` visuals array with inline docs
6. **Export**: Add to `index.ts`
7. **Register sample data**: Add to `sample-data-registry.ts`
8. **Test**: Run `npm run dev` and check Showcase

## Creating a New Filter

Use the skill: `/create-filter` or follow these steps:

1. **Create folder**: `src/components/semaphor-components/{name}/`
2. **Create component**: `{name}.tsx` using `CustomFilterProps`
3. **Create sample data**: `{name}.data.ts` with `sampleOptions`, `sampleSelectedValues`
4. **Create documentation**: `{name}.md` with overview, architecture, usage notes
5. **Register in config**: Add to `components.config.ts` filters array
6. **Export**: Add to `index.ts`
7. **Register sample data**: Add to `sample-data-registry.ts`

## Key Patterns

### Column Approaches

When creating visuals, choose one of two approaches for reading data columns:

**Positional Columns (Recommended)**

- Columns read by position: 1st, 2nd, 3rd...
- Works with any SQL query - just order SELECT columns correctly
- More flexible, no column name matching required

```typescript
const keys = Object.keys(data[0]);
const labelKey = keys[0]; // 1st column
const valueKey = keys[1]; // 2nd column
data.map((row) => row[labelKey]);
```

**Named Columns**

- Columns read by exact name: `row.label`, `row.value`
- SQL must use matching column names or aliases
- More explicit, but less flexible

```typescript
data.map((row) => row.label); // Must have column named "label"
```

### Component Props

**Single-Input Visuals** receive:

```typescript
type SingleInputVisualProps = {
  data: Record<string, string | number | boolean>[];
  settings?: Record<string, string | number | boolean>;
  cardMetadata?: CardMetadata;  // Card context (title, description, kpiConfig)
  theme?: { colors: string[]; mode: 'light' | 'dark' | 'system' };
  inlineFilters?: ReactNode[]; // Pre-rendered inline filter components
  filters?: DashboardFilter[]; // Filter definitions (metadata)
  filterValues?: ActiveFilterValue[]; // Active filter selections
};

type CardMetadata = {
  cardType: string;       // 'kpi', 'bar', 'line', etc.
  title: string;          // Card title
  description?: string;   // Card description
  kpiConfig?: {           // KPI-specific (only for KPI cards)
    comparisonMetadata?: Record<string, any>;
    options?: { lowerIsBetter?: boolean; showTrendline?: boolean; showComparison?: boolean };
    formatNumber?: Record<string, any>;
  };
  formatConfig?: CustomVisualFormatConfig; // Normalized formatting info
};

type CustomVisualFormatConfig = {
  kpi?: { primary?: FormatOptions; comparison?: FormatOptions; colorRanges?: any[] };
  axes?: { xAxis?: FormatOptions; yAxis?: FormatOptions; secondaryYAxis?: FormatOptions };
  dataLabels?: FormatOptions;
  tables?: {
    columns?: Array<{ id?: string; label?: string; position?: number; numberFormat?: any }>;
    columnMap?: Record<string, { numberFormat?: any }>;
    comparison?: FormatOptions;
    defaultNumberFormat?: FormatOptions;
  };
  legacy?: { formatNumber?: Record<string, any>; numberAxisFormat?: Record<string, any> };
};
```

**Multi-Input Visuals** receive:

```typescript
type MultiInputVisualProps = {
  data: Record<string, string | number | boolean>[][];  // Array per slot
  settings?: Record<string, string | number | boolean>; // Global settings
  slotSettings?: Array<Record<string, string | number | boolean> | undefined>; // Per-slot settings
  cardMetadata?: CardMetadata[];  // Card context per slot
  tabMetadata?: { titles: string[]; cardTypes: string[]; cardIds: string[] };
  theme?: { colors: string[]; mode: 'light' | 'dark' | 'system' };
  inlineFilters?: ReactNode[];
  filters?: DashboardFilter[];
  filterValues?: ActiveFilterValue[];
};
```

**Filters** receive:

```typescript
type CustomFilterProps = {
  options: TSelectedRecord[];
  selectedValues: TSelectedRecord[];
  onChange: (records: TSelectedRecord[]) => void;
  onClear: () => void;
  isLoading: boolean;
  settings?: Record<string, string | number | boolean>;
  theme?: CustomCardTheme;
  isSingleSelect?: boolean;
};
```

### Settings System

Plugins control their settings via the manifest. Multi-input visuals support two types:

| Type | Purpose | Manifest Field | Prop Received |
|------|---------|----------------|---------------|
| **Global** | Entire visual | `settings` | `settings` |
| **Per-slot** | Individual tabs | `slotSettings` | `slotSettings[]` |

**Convention-based defaults**: Settings named `title` or `description` auto-fill from card values. Use the complete fallback pattern:

```typescript
// Manifest
slotSettings: {
  title: { title: 'Title', defaultValue: '', ui: 'input' }
}

// Component - complete fallback pattern (4 levels):
// 1. slotSettings  - user-configured per-slot
// 2. cardMetadata  - card context from Semaphor
// 3. tabMetadata   - tab names
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

**UI-only defaults (not persisted)**:
- Auto-filled title/description values are shown in the settings UI but **not saved** unless the user edits them.
- If the card title changes later, the UI reflects the new title unless the user has overridden it.

**UI Experience**:
- Tab 0 shows: "Global Settings" + "Slot 0 Settings"
- Tab 1+ shows: "Slot N Settings" only

### Inline Filters

Render inline filters wherever appropriate:

```tsx
{
  inlineFilters.length > 0 && (
    <div className="flex gap-2 mb-4">{inlineFilters}</div>
  );
}
```

### Print State Protocol (PDF Export Support)

When creating components with expandable sections (accordions, collapsible panels, expandable rows), follow this protocol so the expanded state is captured correctly in PDF exports.

**Required attributes on toggle elements:**

```tsx
<button
  data-spr-expand-id={uniqueStableId} // Unique ID based on data (not random)
  aria-expanded={isExpanded} // Standard accessibility attribute
  onClick={toggleExpand}
>
  Toggle Section
</button>
```

**ID naming conventions:**

```tsx
// Good: Stable IDs based on data
data-spr-expand-id={`category-${row.categoryId}`}
data-spr-expand-id={`row-${rowIndex}-details`}

// Bad: Unstable IDs
data-spr-expand-id={Math.random()}
```

**For async expansion (loading data on expand):**

```tsx
<button
  data-spr-expand-id={id}
  aria-expanded={isExpanded}
  data-transitioning={isLoading}  // Signals async operation in progress
  onClick={handleToggle}
>
```

**IMPORTANT:** When generating components with expandable sections:

1. Always add `data-spr-expand-id` with a stable, data-derived ID
2. Always add `aria-expanded` (also good for accessibility)
3. Ensure the element responds to `.click()` events
4. For nested expandables, use hierarchical IDs: `"parent-id/child-id"`

### Accessing Dashboard Filters

Visuals receive `filters` (definitions) and `filterValues` (active selections):

```typescript
type DashboardFilter = {
  id: string;
  title: string; // Display name
  column: string; // Column being filtered
  table: string;
  dataType: string; // 'text', 'number', 'date', etc.
  operation: FilterOperation; // '=', 'in', 'between', etc.
};

type ActiveFilterValue = {
  filterId: string;
  name: string;
  operation: FilterOperation;
  valueType: 'string' | 'number' | 'date' | 'boolean';
  values: (string | number | boolean)[];
  relativeDateMeta?: RelativeDateFilter; // For "Last 7 days" etc.
};
```

Example - display active filters:

```tsx
export function MyChart({ data, filterValues = [] }: SingleInputVisualProps) {
  return (
    <div>
      {filterValues.length > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          Filters:{' '}
          {filterValues
            .map((f) => `${f.name}: ${f.values.join(', ')}`)
            .join(' | ')}
        </div>
      )}
      <Chart data={data} />
    </div>
  );
}
```

### Settings

Settings values are always strings. Parse as needed:

```typescript
const title = (settings?.title as string) || 'Default';
const count = Number(settings?.count) || 10;
const enabled = settings?.enabled !== 'false';
```

### Number Formatting

Custom visuals receive formatting configuration via `cardMetadata.formatConfig`. This normalized structure provides consistent access to number formatting across all card types.

#### When to Use Which Formatter

| Card Type | Primary Source | Fallback |
|-----------|---------------|----------|
| KPI | `formatConfig.kpi.primary` | `kpiConfig.formatNumber` |
| KPI Comparison | `formatConfig.kpi.comparison` | - |
| Chart Data Labels | `formatConfig.dataLabels` | `formatConfig.axes.yAxis` |
| Chart Y-Axis | `formatConfig.axes.yAxis` | `formatConfig.legacy.formatNumber` |
| Chart X-Axis | `formatConfig.axes.xAxis` | - |
| Combo Secondary Axis | `formatConfig.axes.secondaryYAxis` | - |
| Table Columns | `formatConfig.tables.columns[n].numberFormat` | `formatConfig.tables.defaultNumberFormat` |

#### Complete Fallback Patterns

**KPI Values:**
```typescript
const primaryFormat = cardMetadata?.formatConfig?.kpi?.primary
  ?? cardMetadata?.kpiConfig?.formatNumber;
const comparisonFormat = cardMetadata?.formatConfig?.kpi?.comparison;
```

**Chart Values:**
```typescript
// Data labels
const labelFormat = cardMetadata?.formatConfig?.dataLabels
  ?? cardMetadata?.formatConfig?.axes?.yAxis;

// Y-axis ticks
const yAxisFormat = cardMetadata?.formatConfig?.axes?.yAxis
  ?? cardMetadata?.formatConfig?.legacy?.formatNumber;
```

**Table Values:**
```typescript
// By column index
const colFormat = cardMetadata?.formatConfig?.tables?.columns?.[colIndex]?.numberFormat;

// By column id (if available)
const colFormat = cardMetadata?.formatConfig?.tables?.columnMap?.[columnId]?.numberFormat;

// Fallback to default
const format = colFormat ?? cardMetadata?.formatConfig?.tables?.defaultNumberFormat;
```

#### Formatting Values

Use the format config to format values:

```typescript
function formatValue(value: number, format?: FormatOptions): string {
  if (!format) return value.toLocaleString();

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: format.decimalPlaces,
    maximumFractionDigits: format.decimalPlaces,
  };

  if (format.type === 'currency' && format.currency) {
    options.style = 'currency';
    options.currency = format.currency;
  } else if (format.type === 'percent') {
    options.style = 'percent';
  }

  let result = new Intl.NumberFormat(format.locale || 'en-US', options).format(value);

  if (format.prefix) result = format.prefix + result;
  if (format.suffix) result = result + format.suffix;

  return result;
}
```

### Critical: Styling for Embedded Plugins

**These plugins render inside Semaphor (a parent application).** CSS variables don't work reliably due to scoping:

```tsx
// DON'T - CSS variables fail when embedded
<Area stroke={`var(--color-${key})`} />

// DO - Use direct color values
const colors = theme?.colors || ['#3b82f6', '#10b981'];
<Area stroke={colors[index % colors.length]} />
```

**Safe to use:**
- Tailwind classes (`bg-primary`, `text-muted-foreground`)
- Direct color values (`#3b82f6`, `colors[0]`)
- `ChartContainer`/`ChartTooltip` for tooltip styling

**Avoid for SVG elements:**
- `var(--color-*)` CSS variables
- Any dynamically generated CSS custom properties

### Documentation in Config

Define docs inline in `components.config.ts`:

```typescript
// Single-input visual
{
  name: 'My Visual',
  component: 'MyVisual',  // Must match export name exactly
  componentType: 'chart',
  chartType: 'my-visual',
  settings: {
    title: { title: 'Title', defaultValue: '', ui: 'input' },
  },
  docs: {
    description: 'What this visual does',
    dataSchema: '| Column | Type | Description |...',
    useCases: ['Use case 1', 'Use case 2'],
  },
}

// Multi-input visual
{
  name: 'Multi KPI Grid',
  component: 'MultiKpiGrid',
  componentType: 'chart',
  chartType: 'multi-kpi-grid',
  visualType: 'multiple',
  minInputs: 1,
  maxInputs: 12,
  settings: {  // Global settings (shown on Tab 0)
    showGrid: { title: 'Show Grid', defaultValue: 'true', ui: 'select', options: [...] },
  },
  slotSettings: {  // Per-slot settings (shown on each tab)
    title: { title: 'Title', defaultValue: '', ui: 'input' },  // Auto-fills from card
    lineColor: { title: 'Color', defaultValue: 'blue', ui: 'input' },
  },
  docs: { ... },
}
```

### Component Documentation Files

Each component should have a colocated `.md` file for detailed documentation. This helps both developers and AI agents understand the component quickly.

**Structure:**

```
my-table/
├── my-table.tsx        # Component implementation
├── my-table.data.ts    # Sample data for Showcase
└── my-table.md         # Component documentation
```

**Required sections in `{name}.md`:**

| Section          | Purpose                                     |
| ---------------- | ------------------------------------------- |
| **Overview**     | What the component does                     |
| **Architecture** | How it works internally (logic, data flow)  |
| **Data Shape**   | Expected data format with column types      |
| **Sample Query** | Example SQL that produces the expected data |
| **Settings**     | Available settings and their effects        |
| **Usage Notes**  | Edge cases, limitations, tips               |

See existing components for examples: `my-table.md`, `chip-filter.md`.

## Naming Convention

- **Files**: kebab-case (`revenue-chart.tsx`)
- **Components**: PascalCase (`RevenueChart`)
- **Folders**: kebab-case (`revenue-chart/`)

## Common Error

**"Element type is invalid. Received a promise that resolves to: undefined"**

This means component names don't match. Verify:

1. `export function {Name}` in `.tsx` file
2. `export { {Name} }` in `index.ts`
3. `component: '{Name}'` in `components.config.ts`
4. `{Name}: data` in `sample-data-registry.ts`

## Publishing

```bash
# First time setup
npm install -g semaphor-cli
semaphor init  # Enter project ID and secret

# Publish
npm run build
semaphor publish
```

## Reference

See `README.md` for complete documentation including:

- Detailed props reference
- Theming guide
- Multi-input visuals
- API reference
- Troubleshooting guide
