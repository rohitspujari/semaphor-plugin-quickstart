import { useState } from 'react';
import * as Components from '../components';
import { sampleDataRegistry } from './sample-data-registry';
import { TSelectedRecord } from '../components/config-types';

type ComponentCardProps = {
  component: { name: string; component: string };
  componentType: 'visuals' | 'filters';
};

export function ComponentCard({ component, componentType }: ComponentCardProps) {
  const Component = (Components as any)[component.component];
  const dataModule = sampleDataRegistry[component.component] || {};

  // For filter preview - track selected values
  const [selectedValues, setSelectedValues] = useState<TSelectedRecord[]>(
    dataModule.sampleSelectedValues || []
  );

  if (!Component) {
    return (
      <div className="p-4 text-red-500">
        Component not found: {component.component}
      </div>
    );
  }

  // Render visual component
  if (componentType === 'visuals') {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-2 border-b">
          <h3 className="font-medium">{component.name}</h3>
          <span className="text-xs text-muted-foreground">
            Visual &middot; {component.component}
          </span>
        </div>
        <div className="h-[500px] p-4 overflow-auto">
          <Component
            data={dataModule.sampleData || []}
            settings={dataModule.sampleSettings}
            theme={dataModule.sampleTheme}
            tabMetadata={dataModule.sampleTabMetadata}
            cardMetadata={dataModule.sampleCardMetadata}
            inlineFilters={[]}
          />
        </div>
      </div>
    );
  }

  // Render filter component
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium">{component.name}</h3>
        <span className="text-xs text-muted-foreground">
          Filter &middot; {component.component}
        </span>
      </div>
      <div className="p-4">
        <Component
          options={dataModule.sampleOptions || []}
          selectedValues={selectedValues}
          onChange={setSelectedValues}
          onClear={() => setSelectedValues([])}
          isLoading={false}
          isFetching={false}
          isError={false}
          settings={dataModule.sampleSettings}
          theme={dataModule.sampleTheme}
        />
        <div className="mt-4 p-3 bg-muted/50 rounded text-sm">
          <strong>Selected:</strong>{' '}
          {selectedValues.length > 0
            ? selectedValues.map((v) => v.label || String(v.value)).join(', ')
            : 'None'}
        </div>
      </div>
    </div>
  );
}
