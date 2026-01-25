// Multi KPI Grid sample data
// Slot 0 = Hero KPI (large, top)
// Slot 1+ = Child KPIs (smaller, row below)

export const sampleData = [
  // Slot 0: Hero KPI - Labour Gross
  [
    { segment: 'current', value: 28494 },
    { segment: 'comparison', value: 45624 },
  ],
  // Slot 1: Child KPI - Lbr Grs %
  [
    { segment: 'current', value: 73.8 },
    { segment: 'comparison', value: 72.0 },
  ],
  // Slot 2: Child KPI - Labour Sale
  [
    { segment: 'current', value: 38630 },
    { segment: 'comparison', value: 61630 },
  ],
  // Slot 3: Child KPI - Discounts
  [
    { segment: 'current', value: 0 },
    { segment: 'comparison', value: 0 },
  ],
  // Slot 4: Child KPI - $0 Hours
  [
    { segment: 'current', value: 0.51 },
    { segment: 'comparison', value: 1.01 },
  ],
];

export const sampleTabMetadata = {
  titles: ['Labour Gross', 'Lbr Grs %', 'Labour Sale', 'Discounts', '$0 Hours'],
  cardTypes: ['kpi', 'kpi', 'kpi', 'kpi', 'kpi'],
  cardIds: ['hero-kpi', 'child-1', 'child-2', 'child-3', 'child-4'],
};

export const sampleCardMetadata = [
  {
    cardType: 'kpi',
    title: 'Labour Gross',
    kpiConfig: {
      options: {
        lowerIsBetter: false,
        showComparison: true,
      },
      formatNumber: {
        currency: 'USD',
        decimalPlaces: 0,
      },
    },
  },
  {
    cardType: 'kpi',
    title: 'Lbr Grs %',
    kpiConfig: {
      options: {
        lowerIsBetter: false,
        showComparison: true,
      },
      formatNumber: {
        suffix: '%',
        decimalPlaces: 1,
      },
    },
  },
  {
    cardType: 'kpi',
    title: 'Labour Sale',
    kpiConfig: {
      options: {
        lowerIsBetter: true,
        showComparison: true,
      },
      formatNumber: {
        currency: 'USD',
        decimalPlaces: 0,
      },
    },
  },
  {
    cardType: 'kpi',
    title: 'Discounts',
    kpiConfig: {
      options: {
        lowerIsBetter: true,
        showComparison: true,
      },
      formatNumber: {
        currency: 'USD',
        decimalPlaces: 0,
      },
    },
  },
  {
    cardType: 'kpi',
    title: '$0 Hours',
    kpiConfig: {
      options: {
        lowerIsBetter: true,
        showComparison: true,
      },
      formatNumber: {
        decimalPlaces: 2,
      },
    },
  },
];

export const sampleSettings = {
  infoTooltip: 'Labour metrics for the current period compared to target.',
};

export const sampleTheme = {
  colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  mode: 'light' as const,
};
