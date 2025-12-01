# Create Custom Filter

This skill creates a new custom filter component for the Semaphor plugin.

## Instructions

When the user wants to create a new custom filter, follow these steps:

### Step 1: Gather Requirements

Ask the user:
1. **Component name**: What should it be called? (e.g., "Chip Select", "Date Slider")
2. **Brief description**: What filtering interaction does it provide?

Convert the name to:
- **PascalCase** for component name (e.g., `ChipSelect`)
- **kebab-case** for folder/file name (e.g., `chip-select`)

### Step 2: Create Component Files

Create folder and files at:
```
src/components/semaphor-components/{kebab-case-name}/
├── {kebab-case-name}.tsx      # React component
└── {kebab-case-name}.data.ts  # Sample data for Showcase
```

#### Component Template (`{name}.tsx`):

```tsx
import { CustomFilterProps, TSelectedRecord } from '../../config-types';

/**
 * {Component Name}
 *
 * {Description from user}
 */
export function {PascalCaseName}({
  options,
  selectedValues,
  onChange,
  onClear,
  isLoading,
  settings,
  theme,
  isSingleSelect,
}: CustomFilterProps) {
  const handleSelect = (option: TSelectedRecord) => {
    const isSelected = selectedValues.some((v) => v.value === option.value);

    if (isSingleSelect) {
      onChange(isSelected ? [] : [option]);
    } else {
      if (isSelected) {
        onChange(selectedValues.filter((v) => v.value !== option.value));
      } else {
        onChange([...selectedValues, option]);
      }
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedValues.some((v) => v.value === option.value);
        return (
          <button
            key={String(option.value)}
            onClick={() => handleSelect(option)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {option.label || String(option.value)}
          </button>
        );
      })}

      {selectedValues.length > 0 && (
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      )}
    </div>
  );
}
```

#### Sample Data Template (`{name}.data.ts`):

```typescript
import { TSelectedRecord } from '../../config-types';

export const sampleOptions: TSelectedRecord[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

export const sampleSelectedValues: TSelectedRecord[] = [
  { value: 'option1', label: 'Option 1' },
];

export const sampleSettings = {};

export const sampleTheme = {
  colors: ['#3b82f6'],
  mode: 'light' as const,
};
```

### Step 3: Register in Configuration

Edit `src/components/components.config.ts` - add to the `filters` array:

```typescript
{
  name: '{Display Name}',
  component: '{PascalCaseName}',
  filterType: '{kebab-case-name}',
  icon: '{LucideIconName}',  // e.g., 'Filter', 'Layers', 'Tags'
  supportedDataTypes: [],  // Empty = all types supported
  settings: {},
  docs: {
    description: '{Description}',
    useCases: ['{Use case 1}', '{Use case 2}'],
  },
},
```

### Step 4: Export the Component

Edit `src/components/index.ts`:

```typescript
// Filters
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
2. Check that the component appears in the Filters tab
3. Verify selection/deselection works correctly
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

## Filter Props Reference

Filters receive these props from the host application:

```typescript
type CustomFilterProps = {
  // Data
  options: TSelectedRecord[];           // Available filter options
  selectedValues: TSelectedRecord[];    // Currently selected values

  // Callbacks
  onChange: (records: TSelectedRecord[]) => void;  // Update selection
  onClear: () => void;                             // Clear all selections

  // State
  isLoading: boolean;
  isSingleSelect?: boolean;  // true = radio, false = multi-select

  // Customization
  settings?: Record<string, string | number | boolean>;
  theme?: { colors: string[]; mode: 'light' | 'dark' };
};
```

## Available Icons

Common Lucide icons for filters:
- `Filter`, `Layers`, `Tags`, `Sliders`
- `Calendar`, `CalendarRange`
- `Search`, `ListFilter`, `SlidersHorizontal`
