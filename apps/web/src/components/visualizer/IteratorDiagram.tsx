'use client';

import type { IteratorDiagramState } from '@/types/visual-script';

export function IteratorDiagram({ diagram }: { diagram: IteratorDiagramState }) {
  const { collection, cursor, current, label } = diagram;
  const cellW = 44;
  const width = Math.max(360, collection.length * cellW + 80);

  return (
    <svg viewBox={`0 0 ${width} 180`} className="h-full w-full max-h-[220px]" role="img" aria-label="Iterator diagram">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      <text x={40} y={48} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        COLLECTION
      </text>
      {collection.map((item, i) => {
        const x = 40 + i * cellW;
        const isCursor = i === cursor;
        return (
          <g key={`${item}-${i}`}>
            <rect
              x={x}
              y={56}
              width={cellW - 4}
              height={40}
              rx={6}
              fill={isCursor ? 'rgba(34,197,94,0.25)' : '#2a2a2a'}
              stroke={isCursor ? '#22c55e' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isCursor ? 2.5 : 1.5}
            />
            <text x={x + (cellW - 4) / 2} y={82} textAnchor="middle" fill="#f5f5f5" fontSize={13} fontWeight={600}>
              {item}
            </text>
            {isCursor ? (
              <text x={x + (cellW - 4) / 2} y={52} textAnchor="middle" fill="#22c55e" fontSize={14}>
                ▼
              </text>
            ) : null}
          </g>
        );
      })}

      <rect x={width - 130} y={56} width={110} height={80} rx={8} fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={width - 75} y={78} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9} fontWeight={600}>
        ITERATOR
      </text>
      <text x={width - 75} y={100} textAnchor="middle" fill="#7dd3fc" fontSize={11}>
        cursor = {cursor}
      </text>
      {current ? (
        <text x={width - 75} y={122} textAnchor="middle" fill="#86efac" fontSize={12} fontWeight={600}>
          → {current}
        </text>
      ) : null}
    </svg>
  );
}
