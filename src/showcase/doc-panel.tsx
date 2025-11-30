import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SettingConfig } from '../components/config-types';

// Custom components for styled markdown tables
const markdownComponents: Components = {
  table: ({ children }) => (
    <table className="w-full text-sm border-collapse border border-border rounded-md overflow-hidden my-3">
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs my-3">
        <code>{children}</code>
      </pre>
    ) : (
      <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

type DocPanelProps = {
  component: {
    name: string;
    docs?: { description: string; dataSchema?: string; useCases?: string[] };
    settings?: Record<string, SettingConfig>;
    supportedDataTypes?: string[];
  };
  componentType: 'visuals' | 'filters';
};

export function DocPanel({ component, componentType }: DocPanelProps) {
  const { docs, settings } = component;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b">
        <h3 className="font-medium">Documentation</h3>
      </div>
      <div className="p-4 space-y-6 overflow-auto max-h-[500px]">
        {/* Description */}
        {docs?.description && (
          <section>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{docs.description}</p>
          </section>
        )}

        {/* Use Cases */}
        {docs?.useCases && docs.useCases.length > 0 && (
          <section>
            <h4 className="font-medium mb-2">Use Cases</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {docs.useCases.map((uc, i) => (
                <li key={i}>{uc}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Data Schema (visuals only) */}
        {componentType === 'visuals' && docs?.dataSchema && (
          <section>
            <h4 className="font-medium mb-2">Data Schema</h4>
            <div className="text-sm text-muted-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {docs.dataSchema}
              </ReactMarkdown>
            </div>
          </section>
        )}

        {/* Supported Data Types (filters only) */}
        {componentType === 'filters' && component.supportedDataTypes && (
          <section>
            <h4 className="font-medium mb-2">Supported Data Types</h4>
            <p className="text-sm text-muted-foreground">
              {component.supportedDataTypes.length > 0
                ? component.supportedDataTypes.join(', ')
                : 'All data types'}
            </p>
          </section>
        )}

        {/* Settings */}
        {settings && Object.keys(settings).length > 0 && (
          <section>
            <h4 className="font-medium mb-2">Settings</h4>
            <div className="space-y-3">
              {Object.entries(settings).map(([key, setting]) => (
                <div key={key} className="text-sm border-l-2 border-muted pl-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-muted px-1 rounded">{key}</span>
                    <span className="text-muted-foreground">
                      ({setting.ui === 'select' ? 'dropdown' : 'text input'})
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1">
                    <strong>{setting.title}</strong> &mdash; Default:{' '}
                    <code className="bg-muted px-1 rounded">
                      {setting.defaultValue}
                    </code>
                  </div>
                  {setting.docs?.description && (
                    <p className="text-muted-foreground mt-1">
                      {setting.docs.description}
                    </p>
                  )}
                  {setting.options && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Options: {setting.options.map((o) => o.label).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
