'use client';

import type { LinkedListDiagramState, LinkedListPointer } from '@/types/visual-script';

const NODE_W = 44;
const NODE_H = 40;
const GAP = 52;
const ROW_GAP = 88;
const LEFT = 24;
const TOP = 40;

const COLORS = {
  accent: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.2)', caret: '#22c55e', label: '#86efac' },
  secondary: { stroke: '#38bdf8', fill: 'rgba(56,189,248,0.2)', caret: '#38bdf8', label: '#7dd3fc' },
  node: { stroke: 'rgba(255,255,255,0.2)', fill: '#222' },
  highlight: { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.2)' },
  null: 'rgba(255,255,255,0.35)',
  random: '#c084fc',
};

function palette(p: LinkedListPointer, i: number) {
  if (p.color) return COLORS[p.color];
  return i === 0 ? COLORS.accent : COLORS.secondary;
}

export function LinkedListDiagram({ diagram }: { diagram: LinkedListDiagramState }) {
  const { rows, pointers = [], highlight = [], cycle, randomLinks = [] } = diagram;
  const hot = new Set(highlight.map((h) => `${h.row}:${h.index}`));

  const maxLen = Math.max(...rows.map((r) => r.values.length), 1);
  const width = Math.max(420, LEFT * 2 + maxLen * (NODE_W + GAP) + 48);
  const height = TOP + rows.length * ROW_GAP + 56;

  const nodeX = (index: number) => LEFT + index * (NODE_W + GAP);
  const rowY = (row: number) => TOP + row * ROW_GAP;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[320px]" role="img" aria-label="Linked list diagram">
      <defs>
        <marker id="ll-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.4)" />
        </marker>
        <marker id="ll-random" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.random} />
        </marker>
      </defs>

      {rows.map((list, row) => {
        const y = rowY(row);
        return (
          <g key={row}>
            {list.label ? (
              <text x={LEFT} y={y - 12} fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
                {list.label}
              </text>
            ) : null}

            {list.values.map((val, i) => {
              const x = nodeX(i);
              const key = `${row}:${i}`;
              const isHot = hot.has(key);
              const stroke = isHot ? COLORS.highlight.stroke : COLORS.node.stroke;
              const fill = isHot ? COLORS.highlight.fill : COLORS.node.fill;

              return (
                <g key={key}>
                  {i < list.values.length - 1 ? (
                    <line
                      x1={x + NODE_W}
                      y1={y + NODE_H / 2}
                      x2={x + GAP - 8}
                      y2={y + NODE_H / 2}
                      stroke="rgba(255,255,255,0.35)"
                      strokeWidth={1.5}
                      markerEnd="url(#ll-arrow)"
                    />
                  ) : (
                    <>
                      <line
                        x1={x + NODE_W}
                        y1={y + NODE_H / 2}
                        x2={x + GAP - 8}
                        y2={y + NODE_H / 2}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={1.5}
                      />
                      <text x={x + GAP + 8} y={y + NODE_H / 2 + 4} fill={COLORS.null} fontSize={11}>
                        null
                      </text>
                    </>
                  )}
                  <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={8} fill={fill} stroke={stroke} strokeWidth={isHot ? 2.5 : 1.25} />
                  <text x={x + NODE_W / 2} y={y + NODE_H / 2 + 5} textAnchor="middle" fill="#f5f5f5" fontSize={15} fontWeight={600}>
                    {val}
                  </text>
                </g>
              );
            })}

            {cycle && cycle.row === row && list.values.length > 0 ? (
              <path
                d={`M ${nodeX(list.values.length - 1) + NODE_W / 2} ${y + NODE_H}
                    C ${nodeX(list.values.length - 1) + NODE_W / 2} ${y + NODE_H + 28},
                      ${nodeX(cycle.toIndex) + NODE_W / 2} ${y + NODE_H + 28},
                      ${nodeX(cycle.toIndex) + NODE_W / 2} ${y + NODE_H}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
            ) : null}
          </g>
        );
      })}

      {randomLinks.map((link, i) => {
        const y = rowY(link.row) + NODE_H / 2;
        const x1 = nodeX(link.from) + NODE_W / 2;
        const x2 = nodeX(link.to) + NODE_W / 2;
        const bend = link.to >= link.from ? -28 - i * 6 : 28 + i * 6;
        return (
          <path
            key={`r-${i}`}
            d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + bend} ${x2} ${y}`}
            fill="none"
            stroke={COLORS.random}
            strokeWidth={1.75}
            strokeDasharray="4 3"
            markerEnd="url(#ll-random)"
          />
        );
      })}

      {pointers.map((p, i) => {
        const pal = palette(p, i);
        const cx = nodeX(p.index) + NODE_W / 2;
        const cy = rowY(p.row) + NODE_H + 22;
        return (
          <g key={p.name} style={{ transform: `translate(${cx}px, ${cy}px)`, transition: 'transform 240ms ease' }}>
            <polygon points="0,-7 -4,2 4,2" fill={pal.caret} />
            <text y={13} textAnchor="middle" fill={pal.label} fontSize={10} fontWeight={700}>
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
