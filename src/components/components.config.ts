import { ComponentsConfig } from './types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'Recent Sales', // Name of the component
      icon: 'Table2',
      component: 'RecentSales',
      settings: {
        label: {
          title: 'Label', // Label for the component
          defaultValue: 'my label', // Default value for the label
          ui: 'input', // UI for the label
        },
      },
    },
  ],
};
