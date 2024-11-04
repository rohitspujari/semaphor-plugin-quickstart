// Types

export type Data = Record<string, string | number | boolean>[];

export type DataArray = Data[];

export type SingleInputVisualProps = {
  data: Data;
  settings?: Record<string, string | number | boolean>;
};

export type MultiInputVisualProps = {
  data: DataArray;
  settings?: Record<string, string | number | boolean>[];
};

export type ComponentsConfig = {
  visuals: {
    name: string;
    component: string;
    icon?: string; // name of the icon (React Component) from lucide
    settings?: {
      [key: string]: {
        title: string;
        defaultValue: string;
        ui: 'input' | 'select';
        options?: {
          label: string;
          value: string;
        }[];
      };
    };
  }[];
};
