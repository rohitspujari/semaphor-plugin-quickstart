# Chip Filter

## Overview

A custom filter component that displays filter options as clickable chip/tag buttons. Supports single-select and multi-select modes, optional search functionality, select all/clear actions, and customizable chip styling. Theme-aware with dark mode support.

## Architecture

- **Presentation Only**: All filter logic (cascading, scoping, SQL operations) is handled by Semaphor through callbacks
- **Selection Handling**: Toggles selection on click, respects `isSingleSelect` mode
- **Search Integration**: Optional search input that triggers `onSearchChange` callback
- **Pagination**: Limits visible chips with `maxVisibleChips`, shows count of hidden options
- **Theme-Aware**: Uses theme colors for selected state, adapts to dark/light mode

### Selection Logic

```
Single Select Mode:
- Click selected chip → deselect (empty array)
- Click unselected chip → select only that chip

Multi Select Mode:
- Click selected chip → remove from selection
- Click unselected chip → add to selection
```

## Supported Data Types

Works with all data types. Best suited for:
- Text/categorical columns with limited distinct values
- Status fields, categories, tags
- Any column where visual chip selection makes sense

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| showSearch | boolean | true | Show/hide the search input |
| maxVisibleChips | number | 20 | Max chips visible before "more" message |
| chipStyle | string | "rounded" | Chip border style: "rounded", "square", or "pill" |

## Usage Notes

- **Large Option Sets**: Use `maxVisibleChips` to limit display; search helps users find hidden options
- **Single vs Multi**: Controlled by `isSingleSelect` prop from Semaphor based on filter configuration
- **Select All**: Only shown in multi-select mode when `onSelectAll` callback is provided
- **Theme Colors**: Selected chip uses `theme.colors[0]`; unselected uses gray tones
- **Scrollable Container**: Chips wrap and container scrolls at `maxHeight: 200px`
- **Loading States**: Shows "Loading options..." when `isLoading` or `isFetching` is true
- **Best For**: Category filters, tag selection, status filtering with ~5-50 options
