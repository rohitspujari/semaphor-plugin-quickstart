import { useState } from 'react';
import { config } from '../components/components.config';
import { ComponentCard } from './component-card';
import { DocPanel } from './doc-panel';
import { sampleDataRegistry } from './sample-data-registry';

export function Showcase() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    config.visuals[0]?.component || null
  );
  const [activeTab, setActiveTab] = useState<'visuals' | 'filters'>('visuals');

  const components =
    activeTab === 'visuals' ? config.visuals : config.filters || [];
  const selected = components.find((c) => c.component === selectedComponent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Plugin Showcase</h1>
        <p className="text-muted-foreground">
          Preview and test your custom components with sample data
        </p>
      </header>

      {/* Tab switcher */}
      <div className="border-b px-6">
        <div className="flex gap-4">
          <button
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'visuals'
                ? 'border-primary font-medium'
                : 'border-transparent hover:text-foreground/80'
            }`}
            onClick={() => {
              setActiveTab('visuals');
              setSelectedComponent(config.visuals[0]?.component || null);
            }}
          >
            Visuals ({config.visuals.length})
          </button>
          <button
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'filters'
                ? 'border-primary font-medium'
                : 'border-transparent hover:text-foreground/80'
            }`}
            onClick={() => {
              setActiveTab('filters');
              setSelectedComponent(config.filters?.[0]?.component || null);
            }}
          >
            Filters ({config.filters?.length || 0})
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar - component list */}
        <aside className="w-64 border-r p-4 space-y-2 min-h-[calc(100vh-120px)]">
          {components.map((comp) => (
            <button
              key={comp.component}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedComponent === comp.component
                  ? 'bg-accent'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => setSelectedComponent(comp.component)}
            >
              {comp.name}
            </button>
          ))}
        </aside>

        {/* Main area */}
        <main className="flex-1 p-6">
          {selected && (
            <div className="space-y-6">
              {/* Preview */}
              <ComponentCard component={selected} componentType={activeTab} />

              {/* Documentation */}
              <DocPanel
                component={selected}
                componentType={activeTab}
                sampleData={sampleDataRegistry[selected.component]?.sampleData}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
