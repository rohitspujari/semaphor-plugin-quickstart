# My Table

## Overview

A custom sales list component that displays customer data with avatars, details, and sales amounts. Shows a summary total at the top and renders each record as a styled list item with initials avatar.

## Architecture

- Dynamically reads column names from the first data row
- Uses column[0] for name (displayed + used for avatar initials)
- Uses column[1] for secondary text (e.g., count, category)
- Uses column[2] for the numeric value displayed on the right
- Calculates total of column[2] values for the summary header
- Renders avatar initials from first letters of words in the name

## Data Shape

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| column[0] | text | Yes | Primary identifier (name) - used for avatar initials |
| column[1] | text/number | Yes | Secondary information (displayed below name) |
| column[2] | number | Yes | Numeric value (summed for total, displayed on right) |

The component reads columns dynamically by position, so column names can vary.

## Sample Query

```sql
SELECT
  customer_name,
  COUNT(*) as count,
  AVG(sales_amount) as avg_sales
FROM orders
GROUP BY customer_name
ORDER BY avg_sales DESC
LIMIT 10
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| label | string | "Custom Sales Table" | Header title displayed above the list |

## Usage Notes

- Best suited for displaying ranked lists (top customers, top products, etc.)
- Avatar shows initials from first column (splits on spaces, takes first letter of each word)
- Total is calculated by summing the third column values
- Returns null if data is empty (no loading state shown)
- Format assumes third column is currency-like (adds commas, 2 decimal places)
