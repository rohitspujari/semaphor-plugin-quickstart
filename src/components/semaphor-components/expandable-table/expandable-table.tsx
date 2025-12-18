import { useState } from 'react';
import { SingleInputVisualProps } from '../../config-types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

type ExpandedState = Record<string, boolean>;

export function ExpandableTable({ data, settings }: SingleInputVisualProps) {
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});
  const [expandedDetails, setExpandedDetails] = useState<ExpandedState>({});

  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-muted-foreground text-center">
        No data available
      </div>
    );
  }

  const title = (settings?.title as string) || 'Expandable Table';
  const showNested = settings?.showNested !== 'false';

  // Position-based column detection
  const keys = Object.keys(data[0]);
  const categoryKey = keys[0]; // 1st column = category (grouping)
  const nameKey = keys[1];     // 2nd column = name (display)
  const valueKey = keys[2];    // 3rd column = value (numeric)
  const detailsKey = keys[3];  // 4th column = details (expandable, optional)
  const extraKeys = keys.slice(4); // 5th+ columns = additional details

  // Group data by category (1st column)
  const groupedData = data.reduce((acc, row) => {
    const category = String(row[categoryKey] || 'Uncategorized');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(row);
    return acc;
  }, {} as Record<string, typeof data>);

  const categories = Object.keys(groupedData);

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const toggleDetail = (detailId: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [detailId]: !prev[detailId],
    }));
  };

  const formatValue = (value: string | number | boolean) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="p-4 bg-background rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="border rounded-lg overflow-hidden">
        {categories.map((category) => {
          const categoryId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;
          const isExpanded = expandedRows[categoryId] ?? false;
          const items = groupedData[category];
          const totalValue = items.reduce(
            (sum, item) => sum + (Number(item[valueKey]) || 0),
            0
          );

          return (
            <div key={categoryId} className="border-b last:border-b-0">
              {/* Category Header - Level 1 Expandable */}
              <button
                data-spr-expand-id={categoryId}
                aria-expanded={isExpanded}
                onClick={() => toggleRow(categoryId)}
                className={cn(
                  'w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors',
                  'text-left font-medium'
                )}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{category}</span>
                  <span className="text-xs text-muted-foreground">
                    ({items.length} items)
                  </span>
                </div>
                <span className="font-semibold">{formatValue(totalValue)}</span>
              </button>

              {/* Expanded Content - Level 1 */}
              {isExpanded && (
                <div className="bg-muted/20">
                  {items.map((item, index) => {
                    const itemId = `${categoryId}/item-${index}`;
                    const isItemExpanded = expandedDetails[itemId] ?? false;
                    const hasDetails = showNested && detailsKey && item[detailsKey];

                    return (
                      <div key={itemId} className="border-t border-muted">
                        {/* Item Row - Level 2 Expandable (if has details) */}
                        {hasDetails ? (
                          <button
                            data-spr-expand-id={itemId}
                            aria-expanded={isItemExpanded}
                            onClick={() => toggleDetail(itemId)}
                            className={cn(
                              'w-full flex items-center justify-between p-3 pl-8',
                              'hover:bg-muted/50 transition-colors text-left'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isItemExpanded ? (
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span>{item[nameKey]}</span>
                            </div>
                            <span>{formatValue(item[valueKey] as number)}</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-3 pl-12">
                            <span>{item[nameKey]}</span>
                            <span>{formatValue(item[valueKey] as number)}</span>
                          </div>
                        )}

                        {/* Detail Content - Level 2 */}
                        {hasDetails && isItemExpanded && (
                          <div className="bg-muted/30 p-3 pl-14 text-sm text-muted-foreground">
                            <div className="space-y-1">
                              <p>
                                <strong>{detailsKey}:</strong>{' '}
                                {String(item[detailsKey])}
                              </p>
                              {extraKeys.map((key) =>
                                item[key] ? (
                                  <p key={key}>
                                    <strong>{key}:</strong> {String(item[key])}
                                  </p>
                                ) : null
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with total */}
      <div className="mt-4 pt-3 border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {categories.length} categories, {data.length} total items
        </span>
        <span className="font-semibold">
          Total: {formatValue(data.reduce((sum, item) => sum + (Number(item[valueKey]) || 0), 0))}
        </span>
      </div>
    </div>
  );
}
