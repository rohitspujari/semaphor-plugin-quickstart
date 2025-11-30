import { TSelectedRecord } from '../../config-types';

/**
 * Sample data for showcase testing
 */
export const sampleOptions: TSelectedRecord[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'toys', label: 'Toys' },
  { value: 'books', label: 'Books' },
  { value: 'sports', label: 'Sports' },
  { value: 'beauty', label: 'Beauty' },
];

export const sampleSelectedValues: TSelectedRecord[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
];

export const sampleSettings = {
  showSearch: 'true',
  maxVisibleChips: '20',
  chipStyle: 'rounded',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981'],
  mode: 'light' as const,
};
