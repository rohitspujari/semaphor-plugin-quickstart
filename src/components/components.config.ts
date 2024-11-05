import { ComponentsConfig } from './types';

export const config: ComponentsConfig = {
  visuals: [
    // {
    //   name: 'Card One',
    //   component: 'CardOne',
    // },
    // {
    //   name: 'Card Two',
    //   component: 'CardTwo',
    // },
    // {
    //   name: 'Display Card',
    //   component: 'DisplayCard',
    //   dataInputs: ['Chart Data', 'Table Data', 'KPI Data'],
    // },
    // {
    //   name: 'Recent Sales',
    //   icon: 'Table2',
    //   component: 'RecentSales',
    // },
    {
      name: 'Area Chart',
      component: 'SemaphorAreaChart',
      settings: {
        type: {
          title: 'Type',
          defaultValue: 'natural',
          ui: 'select',
          options: [
            { label: 'Natural', value: 'natural' },
            { label: 'Step', value: 'step' },
            { label: 'Linear', value: 'linear' },
            // { label: 'Basis', value: 'basis' },
          ],
        },
      },
    },
    {
      name: 'Bar Chart',
      component: 'SemaphorBarChart',
      settings: {
        label: {
          title: 'Label',
          defaultValue: 'label',
          ui: 'input',
        },
      },
    },
    {
      name: 'Line Chart',
      component: 'SemaphorLineChart',
      settings: {
        type: {
          title: 'Type',
          defaultValue: 'natural',
          ui: 'select',
          options: [
            { label: 'Natural', value: 'natural' },
            { label: 'Step', value: 'step' },
            { label: 'Linear', value: 'linear' },
            // { label: 'Basis', value: 'basis' },
          ],
        },
      },
    },
    // {
    //   name: 'Horizontal Bar Chart',
    //   component: 'HorizontalBarChart',
    // },
    // {
    //   name: 'Pie Chart',
    //   component: 'SemaphorPieChart',
    // },
    {
      name: 'Donut Chart',
      component: 'SemaphorDonutChart',
      settings: {
        label: {
          title: 'Label',
          defaultValue: 'Total',
          ui: 'input',
        },
      },
    },
  ],
};
