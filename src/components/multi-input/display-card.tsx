import { CardOne } from '../single-input/card-one';
import { CardTwo } from '../single-input/card-two';

import { DataArray } from '../types';

type DisplayCardProps = {
  data: DataArray;
  settings?: Record<string, string | number | boolean>[];
};

export function DisplayCard({ data, settings }: DisplayCardProps) {
  return (
    <div className="space-y-2">
      <CardOne data={data[0]} settings={settings?.[0]} />
      <CardTwo data={data[1]} settings={settings?.[1]} />
    </div>
  );
}
