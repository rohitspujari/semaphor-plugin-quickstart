# Semaphor Custom Components Plugin

## Overview
This is a Semaphor plugin template for creating custom visualization components for embedded analytics dashboards. It provides a framework for building React-based components that integrate seamlessly with the Semaphor platform.

## Architecture

### Component Props Interface
Every custom component receives standardized props through `SingleInputVisualProps`:

```typescript
{
  data: Record<string, string | number | boolean>[];      // Query results
  settings?: Record<string, string | number | boolean>;    // User-configurable options
  theme?: {
    colors?: string[];                                     // Theme color palette
    mode?: 'light' | 'dark' | 'system';                   // Current theme mode
  };
}
```

### Project Structure

```
src/
├── components/
│   ├── semaphor-components/     # Custom component implementations
│   ├── components.config.ts     # Component registry and settings
│   ├── config-types.ts          # TypeScript type definitions
│   └── index.ts                 # Component exports
```

## Creating a Custom Component

### 1. Component Implementation
Create your component in `src/components/semaphor-components/`:
- Accept `SingleInputVisualProps` as props
- Handle empty/null data gracefully
- Use settings for customization
- Apply theme for consistent styling

### 2. Export Component
Add named export in `src/components/index.ts`:
```typescript
export { YourComponent } from './semaphor-components/your-component';
```

### 3. Configure Component
Register in `src/components/components.config.ts`:
```typescript
{
  name: 'Display Name',           // Shown in Semaphor dashboard
  component: 'YourComponent',     // Must match export name
  componentType: 'chart',
  chartType: 'table',             // Optional: specific chart type
  icon: 'Table2',                 // Optional: Lucide icon name
  settings: {                     // User-configurable options
    label: {
      title: 'Label',
      defaultValue: 'Default',
      ui: 'input'                 // 'input' or 'select'
    }
  }
}
```

## Configuration Options

### Component Types
- `chart`: Data visualization components

### Chart Types
Available types: `line`, `bar`, `area`, `pie`, `donut`, `radar`, `radial`, `funnel`, `range`, `tornado`, `stacked`, `combo`, `table`

### Settings UI Types
- `input`: Text/number input field
- `select`: Dropdown with predefined options

## Development Workflow

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Build and publish to Semaphor
npm run publish
```

## Publishing to Semaphor

### Initial Setup
```bash
# Install Semaphor CLI globally
npm install -g semaphor-cli

# Initialize plugin (choose "Plugin" when prompted)
semaphor init
# Required: Project ID, Project Secret, Plugin name, Build path (dist)
```

### Publishing Updates
```bash
# Build and publish
npm run build
semaphor publish
```

## Best Practices

### Component Development
1. **Data Handling**: Always validate data exists before rendering
2. **Settings**: Provide sensible defaults for all settings
3. **Theme Integration**: Use theme colors and respect dark/light mode
4. **Performance**: Implement proper memoization for expensive calculations
5. **Accessibility**: Include proper ARIA labels and keyboard support

### Code Quality
- Run `npm run lint` before committing
- Follow existing code patterns and conventions
- Use TypeScript types from `config-types.ts`
- Keep components focused and reusable

## Available Libraries

- **React 18.3**: Component framework
- **Recharts 2.13**: Charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Radix UI**: Unstyled, accessible UI components

## Testing Components

1. Use development server to preview with mock data
2. Test with various data shapes and sizes
3. Verify all settings work correctly
4. Test theme switching (light/dark modes)
5. Ensure responsive behavior

## Troubleshooting

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Publishing Issues
- Verify Semaphor credentials in `.semaphor` config
- Ensure build completes successfully before publishing
- Check that component names are unique in dashboard

## Important Notes

- Component names must be unique across all Semaphor dashboards
- All exported components must be registered in `components.config.ts`
- The `data` prop structure depends on your SQL query results
- Settings changes trigger component re-renders automatically
- Components should be stateless and derive all state from props