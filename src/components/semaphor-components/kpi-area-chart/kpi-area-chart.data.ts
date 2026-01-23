// Multi-input sample data - array of data arrays
// Slot 0: KPI data with segment convention
// Slot 1: Time series data for area chart

export const sampleData = [
  // Tab 0: KPI data
  [
    { segment: 'current', value: 125000 },
    { segment: 'comparison', value: 98000 },
  ],
  // Tab 1: Time series data (1st col = label, remaining cols = series)
  [
    { month: 'Jan', revenue: 85000, profit: 12000, orders: 320 },
    { month: 'Feb', revenue: 92000, profit: 15000, orders: 380 },
    { month: 'Mar', revenue: 88000, profit: 13500, orders: 350 },
    { month: 'Apr', revenue: 95000, profit: 16000, orders: 410 },
    { month: 'May', revenue: 102000, profit: 18500, orders: 450 },
    { month: 'Jun', revenue: 98000, profit: 17000, orders: 420 },
    { month: 'Jul', revenue: 110000, profit: 21000, orders: 490 },
    { month: 'Aug', revenue: 115000, profit: 23000, orders: 520 },
    { month: 'Sep', revenue: 108000, profit: 20000, orders: 480 },
    { month: 'Oct', revenue: 118000, profit: 24500, orders: 540 },
    { month: 'Nov', revenue: 122000, profit: 26000, orders: 560 },
    { month: 'Dec', revenue: 125000, profit: 28000, orders: 580 },
  ],
];

export const sampleTabMetadata = {
  titles: ['Total Revenue', 'Monthly Trend'],
  cardTypes: ['kpi', 'chart'],
  cardIds: ['kpi-revenue', 'trend-revenue'],
};

export const sampleCardMetadata = [
  {
    cardType: 'kpi',
    title: 'Total Revenue',
    kpiConfig: {
      options: {
        lowerIsBetter: false,
        showComparison: true,
      },
      comparisonMetadata: {
        'cmp-1': {
          type: 'previous_period',
          displayLabel: 'vs Last Year',
        },
      },
      formatNumber: {
        currency: 'USD',
        decimalPlaces: 0,
        locale: 'en-US',
      },
    },
  },
  {
    cardType: 'chart',
    title: 'Monthly Trend',
  },
];

export const sampleSettings = {};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  mode: 'light' as const,
};
