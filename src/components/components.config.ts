import { ComponentsConfig } from './config-types';

export const config: ComponentsConfig = {
  visuals: [
    {
      name: 'My New Table', // Name of the component,
      component: 'MyTable',
      componentType: 'chart',
      chartType: 'table',
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
