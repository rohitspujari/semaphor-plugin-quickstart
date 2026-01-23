# KPI Area Chart

## Overview

A multi-input visual that combines a KPI metric header with a multi-series gradient area chart. This visual is ideal for displaying a key performance indicator alongside multiple trend lines (e.g., revenue, profit, orders).

## Architecture

This is a **multi-input visual** with 2 required slots:

- **Slot 0 (KPI)**: Provides the main KPI value and comparison data using the segment convention
- **Slot 1 (Trend)**: Provides time series data with one or more series for the area chart

The component uses:
- KPI utilities (`parseKPIData`, `formatKPIValue`, `getPercentChange`) for handling the metric
- Recharts `AreaChart` with gradient fills for each series
- Auto-detection of series columns (all columns after the first become separate areas)

## Data Shape

### Slot 0: KPI Data

Uses the standard KPI segment convention:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| segment | text | Yes | `current` or `comparison` |
| value | number | Yes | The KPI value |

**Example Query:**
```sql
SELECT 'current' AS segment, SUM(revenue) AS value
FROM orders
WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)
UNION ALL
SELECT 'comparison' AS segment, SUM(revenue) AS value
FROM orders
WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year')
  AND order_date < DATE_TRUNC('year', CURRENT_DATE)
```

### Slot 1: Trend Data (Multi-Series)

| Position | Purpose | Required |
|----------|---------|----------|
| 1st column | Label (date, month, etc.) | Yes |
| 2nd+ columns | Numeric series values | Yes (at least one) |

Each column after the first becomes a separate area series with its own color.

**Single Series Example:**
```sql
SELECT month, revenue FROM monthly_sales ORDER BY month
```

**Multi-Series Example:**
```sql
SELECT
  TO_CHAR(order_date, 'Mon') AS month,
  SUM(revenue) AS revenue,
  SUM(profit) AS profit,
  COUNT(*) AS orders
FROM orders
GROUP BY DATE_TRUNC('month', order_date), TO_CHAR(order_date, 'Mon')
ORDER BY DATE_TRUNC('month', order_date)
```

## Settings

This visual inherits KPI formatting from `cardMetadata`:

| Property | Source | Description |
|----------|--------|-------------|
| title | `cardMetadata[0].title` | Display name for the KPI |
| currency | `kpiConfig.formatNumber.currency` | Currency code (USD, EUR, etc.) |
| decimalPlaces | `kpiConfig.formatNumber.decimalPlaces` | Number of decimal places |
| lowerIsBetter | `kpiConfig.options.lowerIsBetter` | Inverts the color logic for change indicator |
| showComparison | `kpiConfig.options.showComparison` | Whether to show the % change |

## Usage Notes

- The area chart uses the first theme color for the gradient fill
- If no comparison data is provided, only the current value is shown
- The chart automatically adapts to the container size
- Column names in the trend data don't matter - only the order (1st = label, 2nd = value)
