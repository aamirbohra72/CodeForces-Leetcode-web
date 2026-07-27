'use client';

import type { DomainGraphDiagramState } from '@/types/visual-script';

const TYPE_COLORS: Record<string, { fill: string; stroke: string }> = {
  User: { fill: 'rgba(56,189,248,0.15)', stroke: '#38bdf8' },
  Group: { fill: 'rgba(168,85,247,0.15)', stroke: '#a855f7' },
  Expense: { fill: 'rgba(245,158,11,0.15)', stroke: '#f59e0b' },
  Show: { fill: 'rgba(245,158,11,0.15)', stroke: '#f59e0b' },
  Seat: { fill: 'rgba(34,197,94,0.15)', stroke: '#22c55e' },
  Booking: { fill: 'rgba(244,63,94,0.15)', stroke: '#f43f5e' },
  Vehicle: { fill: 'rgba(56,189,248,0.15)', stroke: '#38bdf8' },
  Spot: { fill: 'rgba(34,197,94,0.15)', stroke: '#22c55e' },
  Floor: { fill: 'rgba(168,85,247,0.15)', stroke: '#a855f7' },
  default: { fill: '#2a2a2a', stroke: 'rgba(255,255,255,0.22)' },
};

export function DomainGraphDiagram({ diagram }: { diagram: DomainGraphDiagramState }) {
  const { nodes, edges, label } = diagram;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  let maxX = 400;
  let maxY = 260;
  for (const n of nodes) {
    maxX = Math.max(maxX, n.x + 100);
    maxY = Math.max(maxY, n.y + 60);
  }

  return (
    <svg viewBox={`0 0 ${maxX} ${maxY}`} className="h-full w-full max-h-[320px]" role="img" aria-label="Domain object graph">
      <defs>
        <marker id="domain-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.4)" />
        </marker>
        <marker id="domain-arrow-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#22c55e" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {edges.map((e, i) => {
        const from = byId.get(e.from);
        const to = byId.get(e.to);
        if (!from || !to) return null;
        const hot = e.highlight;
        return (
          <g key={`e-${i}`}>
            <line
              x1={from.x + 50}
              y1={from.y + 24}
              x2={to.x + 50}
              y2={to.y}
              stroke={hot ? '#22c55e' : 'rgba(255,255,255,0.2)'}
              strokeWidth={hot ? 2 : 1.5}
              markerEnd={`url(#${hot ? 'domain-arrow-hot' : 'domain-arrow'})`}
            />
            {e.label ? (
              <text x={(from.x + to.x) / 2 + 50} y={(from.y + to.y) / 2 + 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={9}>
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {nodes.map((n) => {
        const colors = TYPE_COLORS[n.type] ?? TYPE_COLORS.default;
        return (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={100}
              height={48}
              rx={8}
              fill={n.highlight ? 'rgba(34,197,94,0.2)' : colors.fill}
              stroke={n.highlight ? '#22c55e' : colors.stroke}
              strokeWidth={n.highlight ? 2.5 : 1.5}
            />
            <text x={n.x + 50} y={n.y + 16} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9} fontWeight={600}>
              {n.type}
            </text>
            <text x={n.x + 50} y={n.y + 32} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
              {n.label}
            </text>
            {n.diff ? (
              <text x={n.x + 50} y={n.y + 58} textAnchor="middle" fill="#86efac" fontSize={10} fontWeight={600}>
                {n.diff}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
