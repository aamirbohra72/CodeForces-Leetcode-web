'use client';

import type { WindowDequeDiagramState } from '@/types/visual-script';

const CELL_W = 44;
const GAP = 6;
const LEFT = 28;
const TOP = 36;

export function WindowDequeDiagram({ diagram }: { diagram: WindowDequeDiagramState }) {
  const { values, windowStart, windowEnd, dequeIndices, currentMax } = diagram;
  const n = values.length;
  const width = Math.max(400, LEFT * 2 + n * (CELL_W + GAP));
  const height = 200;

  const cellX = (i: number) => LEFT + i * (CELL_W + GAP);
  const wStart = Math.min(windowStart, windowEnd);
  const wEnd = Math.max(windowStart, windowEnd);
  const inDeque = new Set(dequeIndices);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[240px]" role="img" aria-label="Sliding window with deque">
      {/* window band */}
      <rect
        x={cellX(wStart) - 4}
        y={TOP - 6}
        width={cellX(wEnd) - cellX(wStart) + CELL_W + 8}
        height={50}
        rx={8}
        fill="rgba(34,197,94,0.1)"
        stroke="rgba(34,197,94,0.4)"
        strokeWidth={1.5}
      />

      {values.map((v, i) => {
        const x = cellX(i);
        const inWindow = i >= wStart && i <= wEnd;
        const isFront = dequeIndices[0] === i;
        const inD = inDeque.has(i);

        return (
          <g key={i}>
            <rect
              x={x}
              y={TOP}
              width={CELL_W}
              height={40}
              rx={7}
              fill={inWindow ? 'rgba(34,197,94,0.15)' : '#222'}
              stroke={isFront ? '#22c55e' : inD ? '#38bdf8' : 'rgba(255,255,255,0.14)'}
              strokeWidth={isFront ? 2.5 : inD ? 2 : 1.25}
            />
            <text x={x + CELL_W / 2} y={TOP + 25} textAnchor="middle" fill="#f5f5f5" fontSize={16} fontWeight={600}>
              {v}
            </text>
            <text x={x + CELL_W / 2} y={TOP + 54} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10}>
              {i}
            </text>
          </g>
        );
      })}

      {/* deque strip */}
      <text x={LEFT} y={TOP + 78} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        deque (indices, decreasing values →)
      </text>
      <rect x={LEFT} y={TOP + 84} width={width - LEFT * 2} height={36} rx={8} fill="#141414" stroke="#3a3a3a" />
      {dequeIndices.length === 0 ? (
        <text x={LEFT + 12} y={TOP + 106} fill="rgba(255,255,255,0.3)" fontSize={11}>
          empty
        </text>
      ) : (
        dequeIndices.map((idx, i) => (
          <g key={`${idx}-${i}`}>
            <rect
              x={LEFT + 10 + i * 52}
              y={TOP + 90}
              width={46}
              height={24}
              rx={6}
              fill={i === 0 ? 'rgba(34,197,94,0.25)' : 'rgba(56,189,248,0.15)'}
              stroke={i === 0 ? '#22c55e' : '#38bdf8'}
            />
            <text x={LEFT + 33 + i * 52} y={TOP + 106} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>
              {idx}→{values[idx]}
            </text>
          </g>
        ))
      )}

      {currentMax != null ? (
        <text x={width - LEFT} y={22} textAnchor="end" fill="rgba(34,197,94,0.9)" fontSize={12} fontWeight={600}>
          window max: {currentMax}
        </text>
      ) : null}
    </svg>
  );
}
