import { ComponentsConfig } from './config-types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'Expandable Table',
      component: 'ExpandableTable',
      componentType: 'chart',
      chartType: 'expandable-table',
      icon: 'TableProperties',
      settings: {
        title: {
          title: 'Title',
          defaultValue: 'Expandable Table',
          ui: 'input',
          docs: { description: 'Header title displayed above the table' },
        },
        showNested: {
          title: 'Show Nested Details',
          defaultValue: 'true',
          ui: 'select',
          options: [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ],
          docs: {
            description:
              'Enable Level 2 expansion for items with details',
          },
        },
      },
      docs: {
        description:
          'A hierarchical table with two levels of expandable sections. Uses position-based columns. Demonstrates Print State Protocol for PDF export support.',
        dataSchema: `
### Position-Based Column Mapping

| Position | Purpose | Required |
|----------|---------|----------|
| 1st column | Category - groups rows | Yes |
| 2nd column | Name - item label | Yes |
| 3rd column | Value - numeric totals | Yes |
| 4th column | Details - expandable content | No |
| 5th+ | Extra fields in expanded view | No |

### Example Query
\`\`\`sql
SELECT category, product_name, price, description, status
FROM products
ORDER BY category, product_name
\`\`\`
        `.trim(),
        useCases: [
          'Product inventory with expandable details',
          'Hierarchical data exploration',
          'Testing Print State Protocol for PDF export',
          'Grouped data with drill-down capability',
        ],
      },
    },
    {
      name: 'Sankey Chart',
      component: 'SankeyChart',
      componentType: 'chart',
      chartType: 'sankey-chart',
      icon: 'GitBranch',
      settings: {
        title: {
          title: 'Title',
          defaultValue: '',
          ui: 'input',
          docs: { description: 'Optional title displayed above the chart' },
        },
        nodeWidth: {
          title: 'Node Width',
          defaultValue: '20',
          ui: 'input',
          docs: { description: 'Width of node rectangles in pixels' },
        },
        nodePadding: {
          title: 'Node Padding',
          defaultValue: '24',
          ui: 'input',
          docs: { description: 'Vertical spacing between nodes' },
        },
      },
      docs: {
        description:
          'A flowing visualization showing how values move between categories. Perfect for user journeys, budget flows, and process analysis.',
        dataSchema: `
### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| source | text | Yes | Origin node name |
| target | text | Yes | Destination node name |
| value | number | Yes | Flow quantity |

### Example Query
\`\`\`sql
SELECT page_from AS source, page_to AS target, COUNT(*) AS value
FROM user_sessions
GROUP BY page_from, page_to
\`\`\`
        `.trim(),
        useCases: [
          'User journey and conversion funnels',
          'Budget allocation flows',
          'Energy or resource distribution',
          'Supply chain visualization',
        ],
      },
    },
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
      name: 'Multi KPI Grid',
      component: 'MultiKpiGrid',
      componentType: 'chart',
      chartType: 'multi-kpi-grid',
      visualType: 'multiple',
      icon: 'LayoutGrid',
      minInputs: 1,
      maxInputs: 12,
      slots: [
        {
          position: '0+',
          label: 'KPI',
          description: 'Each tab renders as a KPI card.',
          expectedType: 'kpi',
          required: false,
        },
      ],
      docs: {
        description:
          'A multi-input KPI grid that renders each tab as a KPI card with comparison metadata.',
        dataSchema: `
### Expected Data Format

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| segment | text | Yes | current, comparison, trendline |
| value | number | Yes | KPI value for the segment |

### Example Query
\`\`\`sql
SELECT 'current' AS segment, SUM(revenue) AS value FROM orders
UNION ALL
SELECT 'comparison' AS segment, SUM(revenue) AS value FROM orders_prev
\`\`\`
        `.trim(),
        useCases: [
          'KPI dashboards with multiple metrics',
          'Comparison metrics with trend indicators',
          'Multi-input custom visual examples',
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
