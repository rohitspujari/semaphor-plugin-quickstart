import { ComponentsConfig } from './types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'Card One',
      component: 'CardOne',
    },
    {
      name: 'Card Two',
      component: 'CardTwo',
    },
    {
      name: 'Area Chart Stacked',
      component: 'AreaChartStacked',
      settings: {
        type: {
          title: 'Type',
          defaultValue: 'natural',
          ui: 'select',
          options: [
            { label: 'Natural', value: 'natural' },
            { label: 'Step', value: 'step' },
            { label: 'Linear', value: 'linear' },
            { label: 'Basis', value: 'basis' },
          ],
        },
      },
    },
    {
      name: 'Bar Chart Multiple',
      component: 'BarChartMultiple',
      settings: {
        label: {
          title: 'Label',
          defaultValue: 'label',
          ui: 'input',
        },
      },
    },
    {
      name: 'Horizontal Bar Chart',
      component: 'HorizontalBarChart',
    },
  ],
};
