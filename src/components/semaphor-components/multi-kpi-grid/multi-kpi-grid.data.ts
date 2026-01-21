export const sampleData = [
  [
    { segment: 'current', value: 28494 },
    { segment: 'comparison', value: 45624 },
  ],
  [
    { segment: 'current', value: 38630 },
    { segment: 'comparison', value: 61620 },
  ],
  [
    { segment: 'current', value: 738 },
    { segment: 'comparison', value: 694 },
  ],
  [
    { segment: 'current', value: 0 },
    { segment: 'comparison', value: 10 },
  ],
];

export const sampleTabMetadata = {
  titles: ['Labour Gross', 'Labour Sale', 'Hours', 'Discounts'],
  cardTypes: ['kpi', 'kpi', 'kpi', 'kpi'],
  cardIds: ['tab-1', 'tab-2', 'tab-3', 'tab-4'],
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
    },
  },
  {
    cardType: 'kpi',
    title: 'Hours',
    kpiConfig: {
      options: {
        lowerIsBetter: false,
        showComparison: true,
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
    },
  },
];

export const sampleTheme = {
  colors: ['#2f80ed', '#27ae60', '#f2994a', '#eb5757'],
  mode: 'light',
};

export const sampleSettings = [];
