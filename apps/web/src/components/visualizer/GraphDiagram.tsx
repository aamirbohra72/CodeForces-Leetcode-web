'use client';

import type { GraphDiagramState } from '@/types/visual-script';

const NODE_R = 20;

export function GraphDiagram({ diagram }: { diagram: GraphDiagramState }) {
  const { nodes, edges, visited = [], active = [], queue = [], label } = diagram;

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const visitedSet = new Set(visited);
  const activeSet = new Set(active);
  const queueSet = new Set(queue);

  let maxX = 400;
  let maxY = 240;
  for (const n of nodes) {
    maxX = Math.max(maxX, n.x + NODE_R + 24);
    maxY = Math.max(maxY, n.y + NODE_R + 40);
  }

  const width = maxX;
  const height = maxY;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Graph diagram">
      {label ? (
        <text x={16} y={18} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {edges.map((e, i) => {
        const from = byId.get(e.from);
        const to = byId.get(e.to);
        if (!from || !to) return null;
        const hot = visitedSet.has(e.from) && visitedSet.has(e.to);
        return (
          <line
            key={`${e.from}-${e.to}-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={hot ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.22)'}
            strokeWidth={hot ? 2 : 1.5}
          />
        );
      })}

      {nodes.map((n) => {
        const isActive = activeSet.has(n.id);
        const isVisited = visitedSet.has(n.id);
        const inQueue = queueSet.has(n.id);

        const stroke = isActive ? '#22c55e' : isVisited ? '#f59e0b' : inQueue ? '#38bdf8' : 'rgba(255,255,255,0.25)';
        const fill = isActive
          ? 'rgba(34,197,94,0.28)'
          : isVisited
            ? 'rgba(245,158,11,0.2)'
            : inQueue
              ? 'rgba(56,189,248,0.18)'
              : '#222222';

        return (
          <g key={n.id} style={{ transition: 'transform 200ms ease' }}>
            <circle cx={n.x} cy={n.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={isActive || isVisited || inQueue ? 2.5 : 1.5} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#f5f5f5" fontSize={13} fontWeight={600}>
              {n.label}
            </text>
            {inQueue ? (
              <text x={n.x} y={n.y + NODE_R + 14} textAnchor="middle" fill="#7dd3fc" fontSize={9} fontWeight={600}>
                queue
              </text>
            ) : null}
          </g>
        );
      })}

      {queue.length > 0 ? (
        <text x={16} y={height - 10} fill="rgba(56,189,248,0.85)" fontSize={10} fontWeight={600}>
          queue: [{queue.join(', ')}]
        </text>
      ) : null}
    </svg>
  );
}
