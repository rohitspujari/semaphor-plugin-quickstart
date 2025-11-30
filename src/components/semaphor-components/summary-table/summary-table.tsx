/**
 * =============================================================================
 * SEMAPHOR CUSTOM VISUAL EXAMPLE: Sales Dashboard with Inline Filters
 * =============================================================================
 *
 * This file demonstrates how to build a custom visual component for Semaphor
 * dashboards. It showcases all the key features available to plugin developers:
 *
 * 1. Receiving and displaying query data
 * 2. Using theme colors for consistent styling
 * 3. Configurable settings via the manifest
 * 4. Rendering inline filters for user-controlled filtering
 *
 * WHAT IS A CUSTOM VISUAL?
 * ------------------------
 * A custom visual is a React component that Semaphor loads dynamically into
 * dashboard cards. You build it, publish it, and Semaphor users can select
 * it just like any built-in chart type (bar, line, pie, etc.).
 *
 * Your component receives data from SQL queries configured in Semaphor,
 * along with theme information and optional inline filters that users
 * can interact with directly in your visual.
 *
 * =============================================================================
 */

import { SingleInputVisualProps } from '../../config-types';

/**
 * UNDERSTANDING THE PROPS
 * -----------------------
 *
 * SingleInputVisualProps contains everything your component needs:
 *
 * @prop {Data} data
 *   The query results as an array of records. Each record is an object
 *   with column names as keys. Example:
 *   [
 *     { region: "North", product: "Widget A", sales: 15000 },
 *     { region: "South", product: "Widget B", sales: 22000 },
 *   ]
 *
 * @prop {Record<string, string | number | boolean>} settings
 *   User-configurable settings defined in your manifest (components.config.ts).
 *   These appear in the Semaphor UI when users configure your visual.
 *   Example: { showTotal: true, currency: "USD", decimalPlaces: 2 }
 *
 * @prop {CustomCardTheme} theme
 *   Theme information from the dashboard for consistent styling:
 *   - colors: string[] - Array of brand colors from the dashboard theme
 *   - mode: 'light' | 'dark' | 'system' - Current color mode
 *
 * @prop {ReactNode[]} inlineFilters
 *   Pre-rendered filter components that you can place anywhere in your visual.
 *   These are configured by Semaphor users and allow filtering directly within
 *   your component. Always an array (empty if no filters configured).
 *
 *   WHY INLINE FILTERS?
 *   Instead of filters appearing only in a dashboard header, inline filters
 *   let users interact with filters right where the data is displayed.
 *   This is great for:
 *   - Self-contained visuals that don't rely on external filter bars
 *   - Custom filter placement (top, side, integrated into the visual)
 *   - Better UX for embedded analytics where space is limited
 *
 * There are additional props available (filters, filterValues, params, editing)
 * but the ones above are the most commonly used.
 */

export function SummaryTable({
  data,
  settings,
  theme,
  inlineFilters = [], // Always default to empty array for safety
}: SingleInputVisualProps) {
  // ===========================================================================
  // STEP 1: HANDLE EMPTY/LOADING STATES
  // ===========================================================================
  // Always handle the case where data hasn't loaded yet or is empty.
  // This prevents errors and provides good UX.

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <p>No data available. Configure a data source in the visual editor.</p>
      </div>
    );
  }

  // ===========================================================================
  // STEP 2: READ SETTINGS WITH DEFAULTS
  // ===========================================================================
  // Settings come from your manifest configuration. Users can change these
  // in the Semaphor UI. Always provide sensible defaults.

  const title = (settings?.title as string) || 'Sales Overview';
  const showTotal = settings?.showTotal !== 'false'; // Settings values are strings from the config
  const currency = (settings?.currency as string) || 'USD';
  const decimalPlaces = Number(settings?.decimalPlaces) || 0;

  // ===========================================================================
  // STEP 3: PROCESS YOUR DATA
  // ===========================================================================
  // Your component receives raw query results. Transform them as needed.

  // Dynamically get column names from the first record
  // This makes your component work with any query structure
  const columns = Object.keys(data[0]);

  // Assume first column is a label, last column is a numeric value
  // In production, you might use settings to let users map columns
  const labelColumn = columns[0];
  const valueColumn = columns[columns.length - 1];

  // Calculate aggregations
  const total = data.reduce((sum, row) => {
    const value = Number(row[valueColumn]) || 0;
    return sum + value;
  }, 0);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  };

  // Find top performer
  const topPerformer = data.reduce<{
    label: string | number | boolean;
    value: number;
  }>(
    (max, row) => {
      const value = Number(row[valueColumn]) || 0;
      return value > max.value ? { label: row[labelColumn], value } : max;
    },
    { label: '', value: 0 }
  );

  // ===========================================================================
  // STEP 4: USE THEME COLORS
  // ===========================================================================
  // The theme prop provides colors from the dashboard's theme.
  // Use these to maintain visual consistency with the rest of the dashboard.

  const primaryColor = theme?.colors?.[0] || '#3b82f6'; // Blue fallback
  const secondaryColor = theme?.colors?.[1] || '#10b981'; // Green fallback
  const isDarkMode = theme?.mode === 'dark';

  // ===========================================================================
  // STEP 5: RENDER YOUR COMPONENT
  // ===========================================================================
  // Now bring it all together. Note how we:
  // - Render inline filters at the top for easy access
  // - Use theme colors for visual elements
  // - Display settings-controlled content
  // - Present the data in a user-friendly format

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* =====================================================================
          INLINE FILTERS SECTION
          =====================================================================
          This is the key feature! Inline filters are pre-rendered React nodes
          that you simply place wherever makes sense for your visual.

          The filters are fully functional - Semaphor handles all the logic:
          - Fetching filter options from the database
          - Managing selected values
          - Re-running queries when filters change
          - Persisting filter state

          You just render them. That's it!

          PLACEMENT OPTIONS:
          - Top of the visual (like here) - most common
          - In a sidebar
          - Above specific sections
          - In a collapsible panel
          - Anywhere that makes sense for your UX
      */}
      {inlineFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border">
          {/* Render all the inline filters */}
          {inlineFilters}
        </div>
      )}

      {/* Header with title from settings */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showTotal && (
          <div className="text-2xl font-bold" style={{ color: primaryColor }}>
            {formatCurrency(total)}
          </div>
        )}
      </div>

      {/* Top performer highlight - uses theme colors */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: isDarkMode
            ? `${secondaryColor}20`
            : `${secondaryColor}10`,
          borderLeft: `4px solid ${secondaryColor}`,
        }}
      >
        <p className="text-sm text-muted-foreground">Top Performer</p>
        <p className="text-lg font-semibold">
          {String(topPerformer.label)} - {formatCurrency(topPerformer.value)}
        </p>
      </div>

      {/* Data table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left p-2 text-sm font-medium text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b last:border-0 hover:bg-muted/50 transition-colors"
              >
                {columns.map((col) => {
                  const value = row[col];
                  const isNumeric = typeof value === 'number';
                  return (
                    <td key={col} className="p-2">
                      {isNumeric ? formatCurrency(value) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer showing record count */}
      <div className="text-xs text-muted-foreground text-right">
        Showing {data.length} records
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * NEXT STEPS
 * =============================================================================
 *
 * 1. EXPORT YOUR COMPONENT
 *    Add to src/components/index.ts:
 *    export { SalesDashboard } from './semaphor-components/sales-dashboard';
 *
 * 2. CONFIGURE IN MANIFEST
 *    Add to src/components/components.config.ts (see below for example)
 *
 * 3. BUILD & PUBLISH
 *    npm run build
 *    semaphor publish
 *
 * 4. USE IN SEMAPHOR
 *    - Open your dashboard in Semaphor
 *    - Add or edit a card
 *    - Select your custom visual from the chart type selector
 *    - Configure data source and settings
 *    - Add inline filters if desired
 *
 * =============================================================================
 * MANIFEST CONFIGURATION EXAMPLE
 * =============================================================================
 *
 * Add this to your components.config.ts visuals array:
 *
 * {
 *   name: 'Sales Dashboard',
 *   component: 'SalesDashboard',
 *   componentType: 'chart',
 *   chartType: 'sales-dashboard',
 *   icon: 'BarChart3',
 *   settings: {
 *     title: {
 *       title: 'Dashboard Title',
 *       defaultValue: 'Sales Overview',
 *       ui: 'input',
 *     },
 *     showTotal: {
 *       title: 'Show Total',
 *       defaultValue: 'true',
 *       ui: 'select',
 *       options: [
 *         { label: 'Yes', value: 'true' },
 *         { label: 'No', value: 'false' },
 *       ],
 *     },
 *     currency: {
 *       title: 'Currency',
 *       defaultValue: 'USD',
 *       ui: 'select',
 *       options: [
 *         { label: 'USD ($)', value: 'USD' },
 *         { label: 'EUR (€)', value: 'EUR' },
 *         { label: 'GBP (£)', value: 'GBP' },
 *       ],
 *     },
 *     decimalPlaces: {
 *       title: 'Decimal Places',
 *       defaultValue: '0',
 *       ui: 'input',
 *     },
 *   },
 * }
 *
 * =============================================================================
 */
