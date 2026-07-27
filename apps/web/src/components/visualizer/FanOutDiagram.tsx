'use client';

import type { FanOutDiagramState } from '@/types/visual-script';

export function FanOutDiagram({ diagram }: { diagram: FanOutDiagramState }) {
  const { nodes, edges, layout, label } = diagram;
  const width = 420;
  const height = 260;

  const positions = new Map<string, { x: number; y: number }>();

  if (layout === 'chain') {
    const handlers = nodes.filter((n) => n.role === 'handler' || n.role === 'target');
    const source = nodes.find((n) => n.role === 'source');
    const ordered = source ? [source, ...handlers] : handlers;
    ordered.forEach((n, i) => positions.set(n.id, { x: 50 + i * 90, y: 120 }));
  } else if (layout === 'star') {
    const hub = nodes.find((n) => n.role === 'hub') ?? nodes[0];
    const others = nodes.filter((n) => n.id !== hub?.id);
    if (hub) positions.set(hub.id, { x: width / 2, y: 130 });
    others.forEach((n, i) => {
      const angle = (Math.PI * 2 * i) / others.length - Math.PI / 2;
      positions.set(n.id, { x: width / 2 + Math.cos(angle) * 120, y: 130 + Math.sin(angle) * 80 });
    });
  } else {
    const source = nodes.find((n) => n.role === 'source');
    const targets = nodes.filter((n) => n.role === 'target' || n.role === 'handler');
    if (source) positions.set(source.id, { x: 60, y: height / 2 });
    targets.forEach((n, i) => {
      positions.set(n.id, { x: 280, y: 50 + i * ((height - 100) / Math.max(targets.length - 1, 1)) });
    });
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[300px]" role="img" aria-label="Fan-out diagram">
      <defs>
        <marker id="fan-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#22c55e" />
        </marker>
        <marker id="fan-arrow-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.2)" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {edges.map((e, i) => {
        const from = positions.get(e.from);
        const to = positions.get(e.to);
        if (!from || !to) return null;
        const active = e.active;
        return (
          <g key={`edge-${i}`}>
            <line
              x1={from.x + 40}
              y1={from.y}
              x2={to.x - 40}
              y2={to.y}
              stroke={active ? '#22c55e' : 'rgba(255,255,255,0.15)'}
              strokeWidth={active ? 2.5 : 1.5}
              markerEnd={`url(#${active ? 'fan-arrow' : 'fan-arrow-dim'})`}
            />
            {e.label ? (
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 6}
                textAnchor="middle"
                fill={active ? '#86efac' : 'rgba(255,255,255,0.35)'}
                fontSize={9}
              >
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {nodes.map((n) => {
        const pos = positions.get(n.id);
        if (!pos) return null;
        const isHub = n.role === 'hub' || n.role === 'source';
        const hasActiveEdge = edges.some((e) => e.active && (e.from === n.id || e.to === n.id));
        return (
          <g key={n.id}>
            <rect
              x={pos.x - 44}
              y={pos.y - 22}
              width={88}
              height={44}
              rx={isHub ? 22 : 8}
              fill={hasActiveEdge ? 'rgba(34,197,94,0.2)' : isHub ? 'rgba(56,189,248,0.15)' : '#2a2a2a'}
              stroke={hasActiveEdge ? '#22c55e' : isHub ? '#38bdf8' : 'rgba(255,255,255,0.22)'}
              strokeWidth={hasActiveEdge ? 2.5 : 1.5}
            />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
