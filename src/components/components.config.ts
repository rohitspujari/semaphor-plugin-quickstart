import { ComponentsConfig } from './types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'Recent Sales',
      icon: 'Table2',
      component: 'RecentSales',
      settings: {
        label: {
          title: 'Label',
          defaultValue: 'label',
          ui: 'input',
        },
      },
    },
  ],
};
