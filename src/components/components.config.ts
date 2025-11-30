import { ComponentsConfig } from './config-types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'My New Table',
      component: 'MyTable',
      componentType: 'chart',
      chartType: 'table',
      settings: {
        label: {
          title: 'Label',
          defaultValue: 'my label',
          ui: 'input',
          docs: { description: 'The title displayed at the top of the table' },
        },
      },
      docs: {
        description:
          'A compact sales table showing customer names with initials avatar, order count, and sales values. Includes a total at the top.',
        dataSchema: `
### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| First column | text | Yes | Customer or entity name (used for avatar initials) |
| Second column | any | Yes | Secondary info displayed below the name |
| Third column | number | Yes | Numeric value (used for totals and display) |

### Example Query
\`\`\`sql
SELECT customer_name, count(*) as count, AVG(sales) as avg_sales
FROM orders
GROUP BY customer_name
LIMIT 10
\`\`\`
        `.trim(),
        useCases: [
          'Customer sales leaderboard',
          'Top performers list',
          'Compact sales summary',
        ],
      },
    },
    {
      name: 'Summary Table',
      component: 'SummaryTable',
      componentType: 'chart',
      chartType: 'summary-table',
      icon: 'LayoutDashboard',
      settings: {
        title: {
          title: 'Table Title',
          defaultValue: 'Sales Overview',
          ui: 'input',
          docs: {
            description: 'The heading displayed at the top of the table',
          },
        },
        showTotal: {
          title: 'Show Total',
          defaultValue: 'true',
          ui: 'select',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ],
          docs: {
            description:
              'Whether to display the aggregated total value in the header',
          },
        },
        currency: {
          title: 'Currency',
          defaultValue: 'USD',
          ui: 'select',
          options: [
            { label: 'USD ($)', value: 'USD' },
            { label: 'EUR (€)', value: 'EUR' },
            { label: 'GBP (£)', value: 'GBP' },
          ],
          docs: {
            description:
              'Currency code for formatting numeric values (e.g., USD, EUR, GBP)',
          },
        },
        decimalPlaces: {
          title: 'Decimal Places',
          defaultValue: '0',
          ui: 'input',
          docs: {
            description: 'Number of decimal places to show in formatted values',
          },
        },
      },
      docs: {
        description:
          'A summary card showing an aggregated total, top performer highlight, and a detail table with currency formatting. Supports inline filters for interactive filtering.',
        dataSchema: `
### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| First column | text | Yes | Label for each row (e.g., region, product) |
| Last column | number | Yes | Numeric value to aggregate and format |
| Other columns | any | No | Additional data displayed in table |

### Example Query
\`\`\`sql
SELECT region, product, SUM(sales) as sales
FROM orders
GROUP BY region, product
\`\`\`
        `.trim(),
        useCases: [
          'Regional sales performance',
          'Product revenue comparison',
          'Any tabular data with numeric totals',
        ],
      },
    },
  ],
  filters: [
    {
      name: 'Chip Filter',
      component: 'ChipFilter',
      filterType: 'chip-filter',
      icon: 'Layers',
      supportedDataTypes: [],
      settings: {
        showSearch: {
          title: 'Show Search',
          defaultValue: 'true',
          ui: 'select',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ],
          docs: {
            description:
              'Whether to show a search box to filter the chip options',
          },
        },
        maxVisibleChips: {
          title: 'Max Visible Chips',
          defaultValue: '20',
          ui: 'input',
          docs: {
            description:
              'Maximum number of chips to display before showing a "more" indicator',
          },
        },
        chipStyle: {
          title: 'Chip Style',
          defaultValue: 'rounded',
          ui: 'select',
          options: [
            { label: 'Rounded', value: 'rounded' },
            { label: 'Pill', value: 'pill' },
            { label: 'Square', value: 'square' },
          ],
          docs: {
            description: 'Visual style of the chips: rounded, pill, or square',
          },
        },
      },
      docs: {
        description:
          'A chip-based multi-select filter that displays options as clickable chips. Great for categorical data with a moderate number of options.',
        useCases: [
          'Category selection (e.g., product types, regions)',
          'Tag-based filtering',
          'Multi-select with visual feedback',
          'Filters where users need to see all options at once',
        ],
      },
    },
  ],
};
