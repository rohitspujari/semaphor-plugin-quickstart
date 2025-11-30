import { Data } from '../../config-types';

/**
 * Sample data for showcase testing
 */
export const sampleData: Data = [
  { customer_name: 'Aaron Hawkins', count: 4, avg_sales: 77.85 },
  { customer_name: 'Aaron Smayling', count: 1, avg_sales: 65.78 },
  { customer_name: 'Adam Bellavance', count: 5, avg_sales: 887.73 },
  { customer_name: 'Adam Hart', count: 1, avg_sales: 841.56 },
  { customer_name: 'Adam Shillingsburg', count: 7, avg_sales: 181.46 },
  { customer_name: 'Adrian Barton', count: 1, avg_sales: 117.96 },
  { customer_name: 'Adrian Shami', count: 2, avg_sales: 27.32 },
];

export const sampleSettings = {
  label: 'Customer Sales',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b'],
  mode: 'light' as const,
};
