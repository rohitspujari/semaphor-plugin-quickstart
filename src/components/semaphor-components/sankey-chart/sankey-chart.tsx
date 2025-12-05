import { useMemo, useId, useState, useCallback, useRef, useEffect } from 'react';
import {
  Sankey,
  Layer,
  Rectangle,
  ResponsiveContainer,
} from 'recharts';
import { SingleInputVisualProps } from '../../config-types';

/**
 * Sankey Chart
 *
 * A refined, flowing visualization that shows how values move from one
 * category to another. Perfect for visualizing budgets, user journeys,
 * energy flows, or any process where quantities transfer between stages.
 */

// Types for Sankey data structure
type SankeyNode = {
  name: string;
  depth?: number;
  value?: number;
};

type SankeyLink = {
  source: number;
  target: number;
  value: number;
  sourceName?: string;
  targetName?: string;
};

type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
};

type TooltipData = {
  type: 'node' | 'link';
  x: number;
  y: number;
  data: any;
};

// Floating tooltip component
const FloatingTooltip = ({
  tooltip,
  primaryColor,
  containerRef,
}: {
  tooltip: TooltipData | null;
  primaryColor: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!tooltip || !containerRef.current) return null;

  const containerRect = containerRef.current.getBoundingClientRect();
  const tooltipWidth = 200;
  const tooltipHeight = 120;

  // Calculate position relative to container
  let left = tooltip.x - containerRect.left + 15;
  let top = tooltip.y - containerRect.top - tooltipHeight / 2;

  // Clamp to container bounds
  if (left + tooltipWidth > containerRect.width) {
    left = tooltip.x - containerRect.left - tooltipWidth - 15;
  }
  if (top < 0) top = 10;
  if (top + tooltipHeight > containerRect.height) {
    top = containerRect.height - tooltipHeight - 10;
  }

  if (tooltip.type === 'link') {
    const { sourceName, targetName, value } = tooltip.data;
    return (
      <div
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          background: 'rgba(15, 23, 42, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '16px 20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          minWidth: '190px',
          zIndex: 1000,
          pointerEvents: 'none',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          animation: 'tooltipFadeIn 0.15s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)`,
              boxShadow: `0 0 10px ${primaryColor}50`,
            }}
          />
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Flow
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{sourceName}</span>
          <svg width="20" height="12" viewBox="0 0 20 12">
            <defs>
              <linearGradient id="tooltipArrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={primaryColor} />
              </linearGradient>
            </defs>
            <path
              d="M0 6 L14 6 M10 2 L16 6 L10 10"
              stroke="url(#tooltipArrowGrad)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{targetName}</span>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>Value</span>
          <span
            style={{
              color: primaryColor,
              fontSize: '20px',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  // Node tooltip
  const { name, value } = tooltip.data;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        background: 'rgba(15, 23, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
        minWidth: '150px',
        zIndex: 1000,
        pointerEvents: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        animation: 'tooltipFadeIn 0.15s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}aa)`,
            boxShadow: `0 0 10px ${primaryColor}50`,
          }}
        />
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Node
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{name}</span>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>Total Flow</span>
        <span
          style={{
            color: primaryColor,
            fontSize: '20px',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {(value || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// Custom node component
const SankeyNodeComponent = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  payload,
  colors,
  onHover,
  containerWidth = 800,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: SankeyNode;
  colors: string[];
  onHover: (data: TooltipData | null) => void;
  containerWidth?: number;
}) => {
  const color = colors[index % colors.length];

  // Determine if label should be on left or right based on position
  const isRightSide = x > containerWidth * 0.5;
  const labelX = isRightSide ? x - 8 : x + width + 8;
  const textAnchor = isRightSide ? 'end' : 'start';

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      onHover({
        type: 'node',
        x: e.clientX,
        y: e.clientY,
        data: { name: payload?.name, value: payload?.value },
      });
    },
    [payload, onHover]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      onHover({
        type: 'node',
        x: e.clientX,
        y: e.clientY,
        data: { name: payload?.name, value: payload?.value },
      });
    },
    [payload, onHover]
  );

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <Layer key={`node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        radius={4}
        className="sankey-node"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      />
      {height > 14 && payload && (
        <>
          {/* Label background for contrast */}
          <text
            x={labelX}
            y={y + height / 2}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fill: 'var(--background, #ffffff)',
              stroke: 'var(--background, #ffffff)',
              strokeWidth: 4,
              strokeLinejoin: 'round',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              pointerEvents: 'none',
            }}
          >
            {payload.name}
          </text>
          {/* Label text */}
          <text
            x={labelX}
            y={y + height / 2}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className="sankey-label"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fill: '#475569',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              pointerEvents: 'none',
            }}
          >
            {payload.name}
          </text>
        </>
      )}
    </Layer>
  );
};

// Custom link component
const SankeyLinkComponent = ({
  sourceX = 0,
  targetX = 0,
  sourceY = 0,
  targetY = 0,
  sourceControlX = 0,
  targetControlX = 0,
  linkWidth = 0,
  index = 0,
  payload,
  colors,
  chartId,
  onHover,
}: {
  sourceX?: number;
  targetX?: number;
  sourceY?: number;
  targetY?: number;
  sourceControlX?: number;
  targetControlX?: number;
  linkWidth?: number;
  index?: number;
  payload?: SankeyLink;
  colors: string[];
  chartId: string;
  onHover: (data: TooltipData | null) => void;
}) => {
  if (!payload) return null;

  const sourceColor = colors[payload.source % colors.length];
  const targetColor = colors[payload.target % colors.length];
  const gradientId = `${chartId}-link-${index}`;

  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      onHover({
        type: 'link',
        x: e.clientX,
        y: e.clientY,
        data: {
          sourceName: payload.sourceName,
          targetName: payload.targetName,
          value: payload.value,
        },
      });
    },
    [payload, onHover]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      onHover({
        type: 'link',
        x: e.clientX,
        y: e.clientY,
        data: {
          sourceName: payload.sourceName,
          targetName: payload.targetName,
          value: payload.value,
        },
      });
    },
    [payload, onHover]
  );

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <Layer key={`link-${index}`}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={sourceColor} stopOpacity={0.75} />
          <stop offset="100%" stopColor={targetColor} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={linkWidth}
        strokeOpacity={0.5}
        strokeLinecap="round"
        className="sankey-link"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer' }}
      />
    </Layer>
  );
};

export function SankeyChart({
  data,
  settings,
  theme,
  inlineFilters = [],
}: SingleInputVisualProps) {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const handleHover = useCallback((data: TooltipData | null) => {
    setTooltip(data);
  }, []);

  // Track container width for label positioning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(container);
    setContainerWidth(container.offsetWidth);

    return () => observer.disconnect();
  }, []);

  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <div className="text-center space-y-2">
          <svg
            className="mx-auto w-12 h-12 opacity-30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 4 4-8" />
          </svg>
          <p>No data available</p>
          <p className="text-xs opacity-60">
            Configure a data source with source, target, and value columns
          </p>
        </div>
      </div>
    );
  }

  // Read settings with defaults
  const title = (settings?.title as string) || '';
  const nodeWidth = Number(settings?.nodeWidth) || 18;
  const nodePadding = Number(settings?.nodePadding) || 24;

  // Theme colors
  const defaultColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
  ];

  const colors = theme?.colors?.length ? theme.colors : defaultColors;
  const primaryColor = colors[0];

  // Transform tabular data to Sankey format
  const sankeyData = useMemo((): SankeyData => {
    const nodeSet = new Set<string>();
    const links: { source: string; target: string; value: number }[] = [];

    const columns = Object.keys(data[0]);
    const sourceCol = columns.find((c) => c.toLowerCase().includes('source')) || columns[0];
    const targetCol = columns.find((c) => c.toLowerCase().includes('target')) || columns[1];
    const valueCol = columns.find((c) =>
      c.toLowerCase().includes('value') ||
      c.toLowerCase().includes('amount') ||
      c.toLowerCase().includes('count')
    ) || columns[2];

    data.forEach((row) => {
      const source = String(row[sourceCol] || '');
      const target = String(row[targetCol] || '');
      const value = Number(row[valueCol]) || 0;

      if (source && target && value > 0) {
        nodeSet.add(source);
        nodeSet.add(target);
        links.push({ source, target, value });
      }
    });

    const nodes: SankeyNode[] = Array.from(nodeSet).map((name) => ({ name }));
    const nodeIndex = new Map(nodes.map((n, i) => [n.name, i]));

    return {
      nodes,
      links: links.map((l) => ({
        source: nodeIndex.get(l.source) ?? 0,
        target: nodeIndex.get(l.target) ?? 0,
        value: l.value,
        sourceName: l.source,
        targetName: l.target,
      })),
    };
  }, [data]);

  // Check if we have valid Sankey data
  if (sankeyData.nodes.length === 0 || sankeyData.links.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
        <div className="text-center space-y-2">
          <p>Invalid data format for Sankey chart</p>
          <p className="text-xs opacity-60">Requires columns: source, target, value</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" ref={containerRef}>
      <style>{`
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sankey-node {
          transition: filter 0.2s ease;
        }
        .sankey-node:hover {
          filter: brightness(1.15) drop-shadow(0 0 8px currentColor);
        }
        .sankey-link {
          transition: stroke-opacity 0.2s ease;
        }
        .sankey-link:hover {
          stroke-opacity: 0.85 !important;
        }
        .sankey-label {
          transition: fill 0.2s ease;
        }
      `}</style>

      {/* Inline filters */}
      {inlineFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/30 rounded-lg border shrink-0">
          {inlineFilters}
        </div>
      )}

      {/* Header */}
      {title && (
        <div className="px-1 mb-3 shrink-0">
          <h2
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Chart container */}
      <div className="flex-1 min-h-0 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={sankeyData}
            nodeWidth={nodeWidth}
            nodePadding={nodePadding}
            margin={{ top: 16, right: 120, bottom: 16, left: 100 }}
            link={(props: any) => (
              <SankeyLinkComponent
                {...props}
                colors={colors}
                chartId={chartId}
                onHover={handleHover}
              />
            )}
            node={(props: any) => (
              <SankeyNodeComponent
                {...props}
                colors={colors}
                onHover={handleHover}
                containerWidth={containerWidth - 200} // Account for margins
              />
            )}
          />
        </ResponsiveContainer>

        {/* Custom tooltip */}
        <FloatingTooltip
          tooltip={tooltip}
          primaryColor={primaryColor}
          containerRef={containerRef}
        />
      </div>

      {/* Footer */}
      <div className="text-[10px] text-muted-foreground/50 text-right px-1 pt-2 shrink-0">
        {sankeyData.nodes.length} nodes · {sankeyData.links.length} flows
      </div>
    </div>
  );
}
