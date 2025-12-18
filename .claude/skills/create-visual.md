# Create Custom Visual

This skill creates a new custom visual component for the Semaphor plugin.

## Instructions

When the user wants to create a new custom visual, follow these steps:

### Step 1: Gather Requirements

Ask the user:
1. **Component name**: What should it be called? (e.g., "Revenue Chart", "Sales Table")
2. **Brief description**: What does it visualize?
3. **Column approach**:
   - **Positional (Recommended)** - Columns read by position (1st, 2nd, 3rd...). Works with any SQL query.
   - **Named** - Columns read by exact name. SQL must use matching column names/aliases.

Convert the name to:
- **PascalCase** for component name (e.g., `RevenueChart`)
- **kebab-case** for folder/file name (e.g., `revenue-chart`)

### Step 2: Create Component Files

Create folder and files at:
```
src/components/semaphor-components/{kebab-case-name}/
├── {kebab-case-name}.tsx      # React component
├── {kebab-case-name}.data.ts  # Sample data for Showcase
└── {kebab-case-name}.md       # Component documentation
```

---

## Positional Columns (Recommended)

Use this approach when you want the visual to work with any SQL query - users just need to order their SELECT columns correctly.

### Component Template (Positional)

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

### Sample Data Template (Positional)

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

### Documentation Template (Positional)

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

### Config Entry (Positional)

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

## Named Columns

Use this approach when you want explicit column names that users must match in their SQL.

### Component Template (Named)

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

### Sample Data Template (Named)

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

### Documentation Template (Named)

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

### Config Entry (Named)

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

## Final Steps (Both Approaches)

### Step 3: Export the Component

Edit `src/components/index.ts`:
```typescript
export { {PascalCaseName} } from './semaphor-components/{kebab-case-name}/{kebab-case-name}';
```

### Step 4: Register Sample Data

Edit `src/showcase/sample-data-registry.ts`:
```typescript
import * as {camelCaseName}Data from '../components/semaphor-components/{kebab-case-name}/{kebab-case-name}.data';

// Add to registry
{PascalCaseName}: {camelCaseName}Data,
```

### Step 5: Verify

Tell the user:
1. Run `npm run dev` to start the Showcase
2. Check that the component appears and renders correctly
3. Verify documentation displays properly

## Critical Naming Rules

The component name must match EXACTLY across:
- `export function {Name}` in `.tsx`
- `export { {Name} }` in `index.ts`
- `component: '{Name}'` in `components.config.ts`
- `{Name}: data` in `sample-data-registry.ts`

## Available Icons

Common Lucide icons: `BarChart`, `LineChart`, `PieChart`, `Table`, `LayoutDashboard`, `TrendingUp`, `Activity`
