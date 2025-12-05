# Summary Table

## Overview

A comprehensive sales dashboard component that combines a data table with summary metrics. Features inline filter support, top performer highlighting, configurable currency formatting, and theme-aware styling. This is the primary example component demonstrating all plugin capabilities.

## Architecture

- **Data Processing**: Dynamically reads column names from data, assumes first column is label, last column is numeric value
- **Aggregations**: Calculates total and identifies top performer automatically
- **Inline Filters**: Renders pre-built filter components at the top when configured
- **Theme Integration**: Uses dashboard theme colors for highlights and respects dark/light mode
- **Currency Formatting**: Uses `Intl.NumberFormat` for locale-aware currency display

### Data Flow

1. Receive data from Semaphor query
2. Extract column names dynamically
3. Calculate total and find top performer
4. Format numeric values as currency
5. Render table with theme-styled highlights

## Data Shape

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| column[0] | text | Yes | Label/category column (used in top performer display) |
| column[...] | any | No | Additional columns displayed in table |
| column[last] | number | Yes | Numeric value column (summed for total, used for top performer) |

The component reads columns dynamically by position, making it flexible for various query structures.

## Sample Query

```sql
SELECT
  region,
  product,
  SUM(sales_amount) as sales
FROM orders
GROUP BY region, product
ORDER BY sales DESC
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| title | string | "Sales Overview" | Header title displayed at the top |
| showTotal | boolean | true | Whether to show the total amount in header |
| currency | string | "USD" | Currency code for formatting (USD, EUR, GBP) |
| decimalPlaces | number | 0 | Number of decimal places in currency display |

## Usage Notes

- **Inline Filters**: When configured in Semaphor, filters appear in a styled bar at the top. Semaphor handles all filter logic.
- **Theme Colors**: Uses `theme.colors[0]` for primary (total), `theme.colors[1]` for secondary (top performer highlight)
- **Dark Mode**: Automatically adjusts highlight backgrounds based on `theme.mode`
- **Empty State**: Shows "No data available" message when data is empty or undefined
- **Numeric Detection**: Formats values as currency only if they're numeric type
- **Best For**: Sales dashboards, performance summaries, ranked lists with metrics
