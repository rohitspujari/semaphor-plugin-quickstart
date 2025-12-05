# Sankey Chart

## Overview

A refined, flowing visualization that shows how values move from one category to another. The Sankey chart uses curved paths with gradient coloring to represent flows between nodes, making it easy to identify major pathways and bottlenecks in any process.

Perfect for visualizing:
- User journeys and conversion funnels
- Budget allocations and spending flows
- Energy production and consumption
- Supply chain logistics
- Any process with quantified transfers between stages

## Architecture

### Data Transformation
The component transforms flat tabular data into a Sankey-compatible graph structure:
1. **Node extraction**: Unique values from source and target columns become nodes
2. **Link creation**: Each row becomes a flow link with its value
3. **Index mapping**: Nodes are indexed for Recharts compatibility

### Rendering Pipeline
1. **ResponsiveContainer**: Ensures chart fills available space
2. **Custom nodes**: Rectangles with hover states and glow effects
3. **Custom links**: Curved bezier paths with gradient fills
4. **Custom tooltips**: Rich, responsive tooltips with flow details

### Interactivity
- **Node hover**: Highlights connected flows, dims unrelated elements
- **Link hover**: Shows flow tooltip with source → target visualization
- **Smooth transitions**: All state changes animate over 300ms

## Data Shape

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| source | text | Yes | Origin node name (e.g., "Homepage", "Paid Ads") |
| target | text | Yes | Destination node name (e.g., "Checkout", "Exit") |
| value | number | Yes | Flow quantity between source and target |

The component auto-detects columns by name:
- **source**: First column or column containing "source"
- **target**: Second column or column containing "target"
- **value**: Third column or column containing "value", "amount", or "count"

## Sample Query

```sql
-- User journey funnel
SELECT
  page_from AS source,
  page_to AS target,
  COUNT(*) AS value
FROM user_sessions
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY page_from, page_to
HAVING COUNT(*) > 10
ORDER BY value DESC

-- Budget allocation
SELECT
  department AS source,
  expense_category AS target,
  SUM(amount) AS value
FROM budget_allocations
WHERE fiscal_year = 2024
GROUP BY department, expense_category

-- Sales pipeline
SELECT
  lead_source AS source,
  deal_stage AS target,
  COUNT(*) AS value
FROM sales_pipeline
GROUP BY lead_source, deal_stage
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| title | string | "" | Optional title displayed above the chart |
| nodeWidth | number | 20 | Width of node rectangles in pixels |
| nodePadding | number | 24 | Vertical spacing between nodes |

## Usage Notes

### Best Practices
- **Limit nodes**: 15-25 nodes provides optimal readability
- **Filter low values**: Use HAVING clause to filter out noise
- **Logical ordering**: Data flows left-to-right; structure queries so sources appear first in your process

### Data Considerations
- **Circular flows**: Avoid data where source equals target
- **Zero values**: Rows with value ≤ 0 are automatically filtered
- **Missing data**: Empty source or target values are skipped

### Theming
The chart respects dashboard theme colors:
- Node colors cycle through the theme palette
- Link gradients transition between source and target colors
- Tooltip styling adapts to maintain contrast

### Performance
- Handles 100+ flows smoothly
- For very large datasets (500+ rows), consider aggregating on the server
- Interactive states use CSS transitions for GPU acceleration
