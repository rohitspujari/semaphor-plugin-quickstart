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
