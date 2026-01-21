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

  // Settings
  const title = (settings?.title as string) || '{Default Title}';

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

      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

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

  // Settings
  const title = (settings?.title as string) || '{Default Title}';

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

      {/* Header */}
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

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

## Multi-Input Visual Templates

Use these templates when the user wants to create a visual that combines data from multiple tabs.

### Component Template (Multi-Input)

```tsx
import { MultiInputVisualProps } from '../../config-types';

/**
 * {Component Name}
 *
 * {Description}
 *
 * Multi-input visual: Receives data from all tabs in the frame.
 * - data[0] = first tab's records
 * - data[1] = second tab's records
 * - tabMetadata.titles[n] = tab n's title
 */
export function {PascalCaseName}({
  data,
  settings,
  theme,
  tabMetadata,
  cardMetadata,
  editing = false,
}: MultiInputVisualProps) {
  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>Add tabs with data to see the visualization</p>
      </div>
    );
  }

  // Theme colors
  const colors = theme?.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="flex flex-col h-full p-4">
      {/* Editor mode indicator */}
      {editing && (
        <div className="text-xs text-muted-foreground mb-2">
          Preview Mode - {data.length} tab(s) configured
        </div>
      )}

      {/* Render data from each tab */}
      <div className="grid grid-cols-4 gap-4">
        {data.map((tabData, index) => {
          const title = tabMetadata?.titles?.[index] || `Tab ${index + 1}`;
          const meta = cardMetadata?.[index];
          const firstRow = tabData[0] || {};
          const value = Object.values(firstRow)[0];

          return (
            <div
              key={tabMetadata?.cardIds?.[index] ?? index}
              className="p-4 rounded-lg border"
              style={{ borderColor: colors[index % colors.length] }}
            >
              <div className="text-sm text-muted-foreground">
                {meta?.title || title}
              </div>
              <div className="text-2xl font-bold">{String(value)}</div>
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
export const sampleData = [
  // Tab 0 data
  [{ segment: 'current', value: 28494 }, { segment: 'comparison', value: 45624 }],
  // Tab 1 data
  [{ segment: 'current', value: 73.8 }, { segment: 'comparison', value: 72.0 }],
  // Tab 2 data
  [{ segment: 'current', value: 38630 }, { segment: 'comparison', value: 61620 }],
  // Tab 3 data
  [{ segment: 'current', value: 0 }, { segment: 'comparison', value: 10 }],
];

export const sampleTabMetadata = {
  titles: ['Labour Gross', 'Lbr Grs %', 'Labour Sale', 'Discounts'],
  cardTypes: ['kpi', 'kpi', 'kpi', 'kpi'],
  cardIds: ['card-1', 'card-2', 'card-3', 'card-4'],
};

export const sampleCardMetadata = [
  { cardType: 'kpi', title: 'Labour Gross', kpiConfig: { options: { lowerIsBetter: false } } },
  { cardType: 'kpi', title: 'Lbr Grs %', kpiConfig: { options: { lowerIsBetter: false } } },
  { cardType: 'kpi', title: 'Labour Sale', kpiConfig: { options: { lowerIsBetter: true } } },
  { cardType: 'kpi', title: 'Discounts', kpiConfig: { options: { lowerIsBetter: true } } },
];

export const sampleSettings = {};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  mode: 'light' as const,
};
```

### Config Entry Templates (Multi-Input)

#### Mode 1: Fully Dynamic (No Slots)

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
  // No slots array - fully dynamic
  docs: {
    description: '{Description}. Add as many tabs as needed.',
    dataSchema: `### Flexible Multi-Input\nEach tab renders as an equal item.`,
    useCases: ['{Use case 1}'],
  },
},
```

#### Mode 2: Repeating Pattern

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
      position: '0+',
      label: 'KPI',
      description: 'Each tab renders as a KPI card.',
      expectedType: 'kpi',
    },
  ],
  docs: { /* ... */ },
},
```

#### Mode 3: Fixed + Dynamic

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
      position: '1+',
      label: 'Supporting',
      description: 'Additional metrics in grid.',
      expectedType: 'kpi',
    },
  ],
  docs: { /* ... */ },
},
```

#### Mode 4: Fully Structured

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: 'GitCompare',
  visualType: 'multiple',
  minInputs: 3,
  maxInputs: 3,
  slots: [
    { position: 0, label: 'Current', required: true },
    { position: 1, label: 'Previous', required: true },
    { position: 2, label: 'Target', required: true },
  ],
  docs: { /* ... */ },
},
```

### KPI Utilities (Multi-Input)

For KPI-specific multi-input visuals, use the helper utilities:

```typescript
import {
  parseKPIData,
  getPercentChange,
  formatKPIValue,
  getComparisonLabel,
} from '../../kpi-utils';

// Parse KPI data from each tab
const { currentValue, comparisonValue } = parseKPIData(tabData);

// Calculate change with lowerIsBetter support
const change = getPercentChange(
  Number(currentValue ?? 0),
  Number(comparisonValue ?? 0),
  meta?.kpiConfig?.options?.lowerIsBetter
);

// Format value with currency/locale
const formatted = formatKPIValue(Number(currentValue ?? 0), meta?.kpiConfig?.formatNumber);

// Get comparison label from metadata
const comparisonLabel = getComparisonLabel(
  meta?.kpiConfig?.comparisonMetadata
    ? Object.values(meta.kpiConfig.comparisonMetadata)[0]
    : undefined
);
```

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
2. Check that the component appears and renders correctly
3. Verify documentation displays properly

---

## Reference

### Critical Naming Rules

The component name must match EXACTLY across:
- `export function {Name}` in `.tsx`
- `export { {Name} }` in `index.ts`
- `component: '{Name}'` in `components.config.ts`
- `{Name}: data` in `sample-data-registry.ts`

### Available Icons

Common Lucide icons: `BarChart`, `LineChart`, `PieChart`, `Table`, `LayoutDashboard`, `TrendingUp`, `Activity`, `LayoutGrid`, `GitCompare`

### Single-Input vs Multi-Input Differences

| Aspect | Single-Input | Multi-Input |
|--------|--------------|-------------|
| Props type | `SingleInputVisualProps` | `MultiInputVisualProps` |
| Data shape | `data: Data` (single array) | `data: DataArray` (array of arrays) |
| Config | No `visualType` needed | `visualType: 'multiple'` required |
| Slots | N/A | Optional `slots` array |
| Sample data | Single data array | Array of data arrays + `sampleTabMetadata` + `sampleCardMetadata` |
| Key prop | Use `index` | Use `tabMetadata?.cardIds?.[index] ?? index` |

### Reference Examples

- **Single-Input**: See `my-table` component for a complete working example
- **Multi-Input**: See `multi-kpi-grid` component for a complete working example
