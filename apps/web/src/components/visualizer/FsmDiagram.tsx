'use client';

import type { FsmDiagramState } from '@/types/visual-script';

const NODE_W = 88;
const NODE_H = 36;
const R = 40;

export function FsmDiagram({ diagram }: { diagram: FsmDiagramState }) {
  const { states, transitions, current, label } = diagram;
  const byId = new Map(states.map((s) => [s.id, s]));

  let maxX = 400;
  let maxY = 240;
  for (const s of states) {
    maxX = Math.max(maxX, s.x + NODE_W + 30);
    maxY = Math.max(maxY, s.y + NODE_H + 40);
  }

  return (
    <svg viewBox={`0 0 ${maxX} ${maxY}`} className="h-full w-full max-h-[320px]" role="img" aria-label="State machine diagram">
      <defs>
        <marker id="fsm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={transitions.some((t) => t.active) ? '#22c55e' : 'rgba(255,255,255,0.4)'} />
        </marker>
        <marker id="fsm-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#22c55e" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {transitions.map((t, i) => {
        const from = byId.get(t.from);
        const to = byId.get(t.to);
        if (!from || !to) return null;
        const self = t.from === t.to;
        const active = t.active;
        const stroke = active ? '#22c55e' : 'rgba(255,255,255,0.25)';
        const cx1 = from.x + NODE_W / 2;
        const cy1 = from.y + NODE_H / 2;
        const cx2 = to.x + NODE_W / 2;
        const cy2 = to.y + NODE_H / 2;

        if (self) {
          return (
            <g key={`t-${i}`}>
              <path
                d={`M ${cx1 + R / 2} ${from.y} C ${cx1 + 50} ${from.y - 40}, ${cx1 - 50} ${from.y - 40}, ${cx1 - R / 2} ${from.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={active ? 2.5 : 1.5}
                markerEnd={`url(#${active ? 'fsm-arrow-active' : 'fsm-arrow'})`}
              />
              <text x={cx1} y={from.y - 48} textAnchor="middle" fill={active ? '#86efac' : 'rgba(255,255,255,0.45)'} fontSize={10}>
                {t.label}
              </text>
            </g>
          );
        }

        const dx = cx2 - cx1;
        const dy = cy2 - cy1;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const x1 = cx1 + ux * (NODE_W / 2 + 4);
        const y1 = cy1 + uy * (NODE_H / 2 + 4);
        const x2 = cx2 - ux * (NODE_W / 2 + 8);
        const y2 = cy2 - uy * (NODE_H / 2 + 8);

        return (
          <g key={`t-${i}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={active ? 2.5 : 1.5}
              markerEnd={`url(#${active ? 'fsm-arrow-active' : 'fsm-arrow'})`}
            />
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 - 6}
              textAnchor="middle"
              fill={active ? '#86efac' : 'rgba(255,255,255,0.45)'}
              fontSize={10}
            >
              {t.label}
            </text>
          </g>
        );
      })}

      {states.map((s) => {
        const isCurrent = s.id === current;
        return (
          <g key={s.id}>
            {isCurrent ? (
              <rect
                x={s.x - 4}
                y={s.y - 4}
                width={NODE_W + 8}
                height={NODE_H + 8}
                rx={10}
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                opacity={0.6}
              />
            ) : null}
            <rect
              x={s.x}
              y={s.y}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill={isCurrent ? 'rgba(34,197,94,0.25)' : '#2a2a2a'}
              stroke={isCurrent ? '#22c55e' : 'rgba(255,255,255,0.22)'}
              strokeWidth={isCurrent ? 2.5 : 1.5}
            />
            <text x={s.x + NODE_W / 2} y={s.y + NODE_H / 2 + 4} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
