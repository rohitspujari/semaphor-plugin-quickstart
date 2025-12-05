import { Data } from '../../config-types';

/**
 * Sample data for Sankey Chart
 *
 * This represents a website user journey / conversion funnel
 * showing how visitors flow through different stages.
 */
export const sampleData: Data = [
  // Traffic sources to landing pages
  { source: 'Organic Search', target: 'Homepage', value: 5200 },
  { source: 'Organic Search', target: 'Product Page', value: 3100 },
  { source: 'Paid Ads', target: 'Landing Page', value: 4800 },
  { source: 'Paid Ads', target: 'Product Page', value: 2200 },
  { source: 'Social Media', target: 'Homepage', value: 2800 },
  { source: 'Social Media', target: 'Blog', value: 1900 },
  { source: 'Direct', target: 'Homepage', value: 3500 },
  { source: 'Email', target: 'Product Page', value: 1800 },
  { source: 'Email', target: 'Landing Page', value: 1200 },
  { source: 'Referral', target: 'Homepage', value: 1100 },

  // Landing pages to actions
  { source: 'Homepage', target: 'Browse Products', value: 7200 },
  { source: 'Homepage', target: 'Sign Up', value: 2100 },
  { source: 'Homepage', target: 'Exit', value: 2300 },
  { source: 'Product Page', target: 'Add to Cart', value: 4800 },
  { source: 'Product Page', target: 'Browse Products', value: 1500 },
  { source: 'Product Page', target: 'Exit', value: 800 },
  { source: 'Landing Page', target: 'Sign Up', value: 3200 },
  { source: 'Landing Page', target: 'Browse Products', value: 1800 },
  { source: 'Landing Page', target: 'Exit', value: 1000 },
  { source: 'Blog', target: 'Browse Products', value: 900 },
  { source: 'Blog', target: 'Sign Up', value: 600 },
  { source: 'Blog', target: 'Exit', value: 400 },

  // Actions to conversion
  { source: 'Browse Products', target: 'Add to Cart', value: 6800 },
  { source: 'Browse Products', target: 'Exit', value: 4600 },
  { source: 'Add to Cart', target: 'Checkout', value: 8200 },
  { source: 'Add to Cart', target: 'Exit', value: 3400 },
  { source: 'Sign Up', target: 'Browse Products', value: 3100 },
  { source: 'Sign Up', target: 'Exit', value: 2800 },

  // Final conversion
  { source: 'Checkout', target: 'Purchase', value: 6100 },
  { source: 'Checkout', target: 'Abandoned', value: 2100 },
];

export const sampleSettings = {
  title: 'User Journey Flow',
  nodeWidth: '20',
  nodePadding: '24',
};

export const sampleTheme = {
  colors: [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
  ],
  mode: 'light' as const,
};
