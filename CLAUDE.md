# CLAUDE.md - Semaphor Plugin SDK

This file provides guidance for Claude Code when working in this repository.

## Project Overview

This is the **Semaphor Plugin SDK** - a quickstart template for building custom visualizations and filters that integrate with Semaphor dashboards. Plugins follow the micro frontend pattern, allowing independent deployment without modifying Semaphor core.

## Tech Stack

- **React 18** - UI framework
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

### Component Props

**Visuals** receive:
```typescript
type SingleInputVisualProps = {
  data: Record<string, string | number | boolean>[];
  settings?: Record<string, string | number | boolean>;
  theme?: { colors: string[]; mode: 'light' | 'dark' | 'system' };
  inlineFilters?: ReactNode[];  // Pre-rendered inline filter components
  filters?: DashboardFilter[];  // Filter definitions (metadata)
  filterValues?: ActiveFilterValue[];  // Active filter selections
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

### Inline Filters

Render inline filters wherever appropriate:
```tsx
{inlineFilters.length > 0 && (
  <div className="flex gap-2 mb-4">{inlineFilters}</div>
)}
```

### Accessing Dashboard Filters

Visuals receive `filters` (definitions) and `filterValues` (active selections):

```typescript
type DashboardFilter = {
  id: string;
  title: string;      // Display name
  column: string;     // Column being filtered
  table: string;
  dataType: string;   // 'text', 'number', 'date', etc.
  operation: FilterOperation;  // '=', 'in', 'between', etc.
};

type ActiveFilterValue = {
  filterId: string;
  name: string;
  operation: FilterOperation;
  valueType: 'string' | 'number' | 'date' | 'boolean';
  values: (string | number | boolean)[];
  relativeDateMeta?: RelativeDateFilter;  // For "Last 7 days" etc.
};
```

Example - display active filters:
```tsx
export function MyChart({ data, filterValues = [] }: SingleInputVisualProps) {
  return (
    <div>
      {filterValues.length > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          Filters: {filterValues.map(f => `${f.name}: ${f.values.join(', ')}`).join(' | ')}
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

### Documentation in Config

Define docs inline in `components.config.ts`:
```typescript
{
  name: 'My Visual',
  component: 'MyVisual',  // Must match export name exactly
  componentType: 'chart',
  chartType: 'my-visual',
  docs: {
    description: 'What this visual does',
    dataSchema: '| Column | Type | Description |...',
    useCases: ['Use case 1', 'Use case 2'],
  },
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

| Section | Purpose |
|---------|---------|
| **Overview** | What the component does |
| **Architecture** | How it works internally (logic, data flow) |
| **Data Shape** | Expected data format with column types |
| **Sample Query** | Example SQL that produces the expected data |
| **Settings** | Available settings and their effects |
| **Usage Notes** | Edge cases, limitations, tips |

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
