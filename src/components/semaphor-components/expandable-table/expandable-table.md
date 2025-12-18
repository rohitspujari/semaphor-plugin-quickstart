# Expandable Table

## Overview

A hierarchical table component with two levels of expandable sections. Demonstrates the **Print State Protocol** for PDF export support of expandable UI components.

This component uses **position-based column detection** - no need to match specific column names.

## Column Mapping (Position-Based)

| Position | Purpose | Required |
|----------|---------|----------|
| 1st column | Category - groups rows together | Yes |
| 2nd column | Name - item display label | Yes |
| 3rd column | Value - numeric value for totals | Yes |
| 4th column | Details - expandable content | No (enables Level 2 expansion) |
| 5th+ columns | Additional fields shown in expanded section | No |

## Print State Protocol Implementation

### Level 1 (Category Rows)

```tsx
<button
  data-spr-expand-id={`category-${category}`}
  aria-expanded={isExpanded}
  onClick={() => toggleRow(categoryId)}
>
```

### Level 2 (Item Rows with Details)

```tsx
<button
  data-spr-expand-id={`${categoryId}/item-${index}`}
  aria-expanded={isItemExpanded}
  onClick={() => toggleDetail(itemId)}
>
```

### Key Points

1. **Stable IDs**: Category IDs derived from category value, item IDs use index
2. **Hierarchical IDs**: Nested expandables use `parent/child` format
3. **aria-expanded**: Always present for accessibility and print detection
4. **Button elements**: All expandable triggers are clickable buttons

## Architecture

```
┌─────────────────────────────────────────┐
│ Category Header (Level 1)         ▶ 500 │ ← data-spr-expand-id="category-electronics"
├─────────────────────────────────────────┤
│   Item Row (Level 2)             ▶ 299  │ ← data-spr-expand-id="category-electronics/item-0"
│   ┌─────────────────────────────────┐   │
│   │ details: Product description... │   │ ← Expanded detail content
│   │ status: active                  │   │ ← Extra columns (5th+)
│   │ date: 2024-01-15               │   │
│   └─────────────────────────────────┘   │
│   Item Row (no 4th column)         150  │ ← No expand (not expandable)
└─────────────────────────────────────────┘
```

## Sample Query

```sql
SELECT
  category,           -- 1st: grouping
  product_name,       -- 2nd: display name
  price,              -- 3rd: numeric value
  description,        -- 4th: expandable details (optional)
  status,             -- 5th+: extra fields
  created_at
FROM products
ORDER BY category, product_name
```

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| title | string | "Expandable Table" | Header title displayed above the table |
| showNested | "true"/"false" | "true" | Enable/disable Level 2 nested expansion |

## Testing Print State Protocol

To test PDF export with expanded sections:

1. Run `npm run dev` and open Showcase
2. Find the "Expandable Table" component
3. Expand some categories and items
4. The print system should:
   - Detect elements with `data-spr-expand-id`
   - Read `aria-expanded` state
   - Capture which sections are open for PDF rendering

### Expected Behavior

- When a category is expanded, its `aria-expanded="true"`
- When an item with details is expanded, its `aria-expanded="true"`
- The hierarchical ID format allows the print system to restore nested state correctly

## Usage Notes

- Column order matters - the component reads columns by position, not name
- Items without a 4th column value are not expandable at Level 2
- All columns beyond the 4th are displayed in the expanded detail section
- Totals are calculated per category and overall using the 3rd column
