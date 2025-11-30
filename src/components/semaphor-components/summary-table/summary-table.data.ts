import { Data } from '../../config-types';

/**
 * Sample data for showcase testing
 */
export const sampleData: Data = [
  { region: 'North', product: 'Widget A', sales: 15000 },
  { region: 'South', product: 'Widget B', sales: 22000 },
  { region: 'East', product: 'Widget A', sales: 18500 },
  { region: 'West', product: 'Widget C', sales: 31000 },
  { region: 'Central', product: 'Widget B', sales: 12500 },
];

export const sampleSettings = {
  title: 'Q4 Sales Overview',
  showTotal: 'true',
  currency: 'USD',
  decimalPlaces: '0',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  mode: 'light' as const,
};
