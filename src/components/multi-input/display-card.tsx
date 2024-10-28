import { CardOne } from '../single-input/card-one';
import { CardTwo } from '../single-input/card-two';

import { MultiInputVisualProps } from '../types';

export function DisplayCard({ data, settings }: MultiInputVisualProps) {
  return (
    <div className="space-y-2">
      <CardOne data={data[0]} settings={settings?.[0]} />
      <CardTwo data={data[1]} settings={settings?.[1]} />
    </div>
  );
}
