# Create Custom Visual

This skill creates a new custom visual component for the Semaphor plugin.

## Instructions

When the user wants to create a new custom visual, follow these steps:

### Step 1: Gather Requirements

Ask the user:
1. **Component name**: What should it be called? (e.g., "Revenue Chart", "Sales Table")
2. **Brief description**: What does it visualize?

Convert the name to:
- **PascalCase** for component name (e.g., `RevenueChart`)
- **kebab-case** for folder/file name (e.g., `revenue-chart`)

### Step 2: Create Component Files

Create folder and files at:
```
src/components/semaphor-components/{kebab-case-name}/
├── {kebab-case-name}.tsx      # React component
└── {kebab-case-name}.data.ts  # Sample data for Showcase
```

#### Component Template (`{name}.tsx`):

```tsx
import { SingleInputVisualProps } from '../../config-types';

/**
 * {Component Name}
 *
 * {Description from user}
 */
export function {PascalCaseName}({
  data,
  settings,
  theme,
  inlineFilters = [],
}: SingleInputVisualProps) {
  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>No data available</p>
      </div>
    );
  }

  // Read settings with defaults
  const title = (settings?.title as string) || '{Default Title}';

  // Use theme colors
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

      {/* Content - implement visualization here */}
      <div className="flex-1">
        {/* TODO: Add visualization */}
        <pre className="text-xs overflow-auto">
          {JSON.stringify(data.slice(0, 3), null, 2)}
        </pre>
      </div>
    </div>
  );
}
```

#### Sample Data Template (`{name}.data.ts`):

```typescript
import { Data } from '../../config-types';

export const sampleData: Data = [
  // Add sample data matching expected format
  { label: 'Item 1', value: 100 },
  { label: 'Item 2', value: 200 },
  { label: 'Item 3', value: 150 },
];

export const sampleSettings = {
  title: '{Default Title}',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  mode: 'light' as const,
};
```

### Step 3: Register in Configuration

Edit `src/components/components.config.ts` - add to the `visuals` array:

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  componentType: 'chart',
  chartType: '{kebab-case-name}',
  icon: '{LucideIconName}',  // e.g., 'BarChart', 'Table', 'PieChart'
  settings: {
    title: {
      title: 'Title',
      defaultValue: '{Default Title}',
      ui: 'input',
      docs: { description: 'The heading displayed at the top' },
    },
  },
  docs: {
    description: '{Description}',
    dataSchema: `
### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| label | text | Yes | Label for each item |
| value | number | Yes | Numeric value |

### Example Query
\`\`\`sql
SELECT label, SUM(value) as value
FROM table
GROUP BY label
\`\`\`
    `.trim(),
    useCases: ['{Use case 1}', '{Use case 2}'],
  },
},
```

### Step 4: Export the Component

Edit `src/components/index.ts`:

```typescript
// Visuals
export { {PascalCaseName} } from './semaphor-components/{kebab-case-name}/{kebab-case-name}';
```

### Step 5: Register Sample Data

Edit `src/showcase/sample-data-registry.ts`:

```typescript
import * as {camelCaseName}Data from '../components/semaphor-components/{kebab-case-name}/{kebab-case-name}.data';

// Add to the registry object
{PascalCaseName}: {camelCaseName}Data,
```

### Step 6: Verify

Tell the user:
1. Run `npm run dev` to start the Showcase
2. Check that the component appears in the Visuals tab
3. Verify it renders correctly with sample data
4. Check documentation displays properly

## Critical Naming Rules

The component name must match EXACTLY across these files:
- `export function {Name}` in the `.tsx` file
- `export { {Name} }` in `index.ts`
- `component: '{Name}'` in `components.config.ts`
- `{Name}: data` key in `sample-data-registry.ts`

**Mismatch causes runtime error:**
```
Element type is invalid. Received a promise that resolves to: undefined.
```

## Available Icons

Common Lucide icons for visuals:
- `BarChart`, `BarChart3`, `LineChart`, `PieChart`, `AreaChart`
- `Table`, `Table2`, `LayoutGrid`, `LayoutDashboard`
- `TrendingUp`, `Activity`, `Gauge`
