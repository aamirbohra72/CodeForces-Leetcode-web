'use client';

import type { BinarySearchDiagramState } from '@/types/visual-script';

const CELL_W = 48;
const GAP = 6;
const LEFT = 32;
const TOP = 52;

export function BinarySearchDiagram({ diagram }: { diagram: BinarySearchDiagramState }) {
  const { values, lo, hi, mid, target, found, label } = diagram;
  const n = values.length;
  const width = Math.max(360, LEFT * 2 + n * (CELL_W + GAP));
  const height = 200;

  const cellX = (i: number) => LEFT + i * (CELL_W + GAP);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[240px]" role="img" aria-label="Binary search diagram">
      {label ? (
        <text x={LEFT} y={22} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}
      {target != null ? (
        <text x={width - LEFT} y={22} textAnchor="end" fill="rgba(56,189,248,0.9)" fontSize={12} fontWeight={600}>
          target: {target}
        </text>
      ) : null}

      {/* search space band */}
      {lo <= hi ? (
        <rect
          x={cellX(lo) - 4}
          y={TOP - 8}
          width={cellX(hi) - cellX(lo) + CELL_W + 8}
          height={48}
          rx={8}
          fill="rgba(34,197,94,0.1)"
          stroke="rgba(34,197,94,0.4)"
          strokeWidth={1.5}
        />
      ) : null}

      {values.map((v, i) => {
        const x = cellX(i);
        const inRange = i >= lo && i <= hi;
        const isMid = mid === i;
        const isFound = found && isMid;
        const stroke = isFound ? '#22c55e' : isMid ? '#f59e0b' : inRange ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)';
        const fill = isFound
          ? 'rgba(34,197,94,0.3)'
          : isMid
            ? 'rgba(245,158,11,0.2)'
            : inRange
              ? '#222'
              : '#161616';
        const opacity = inRange || isMid ? 1 : 0.45;

        return (
          <g key={i} opacity={opacity}>
            <rect x={x} y={TOP} width={CELL_W} height={40} rx={7} fill={fill} stroke={stroke} strokeWidth={isMid || isFound ? 2.5 : 1.25} />
            <text x={x + CELL_W / 2} y={TOP + 25} textAnchor="middle" fill="#f5f5f5" fontSize={15} fontWeight={600}>
              {v}
            </text>
            <text x={x + CELL_W / 2} y={TOP + 56} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10}>
              {i}
            </text>
          </g>
        );
      })}

      {[
        { name: 'lo', index: lo, color: '#86efac' },
        { name: 'hi', index: hi, color: '#7dd3fc' },
        ...(mid != null ? [{ name: 'mid', index: mid, color: '#fcd34d' }] : []),
      ].map((p) => {
        const cx = cellX(p.index) + CELL_W / 2;
        const y = TOP + 72;
        return (
          <g key={p.name} style={{ transform: `translate(${cx}px, ${y}px)`, transition: 'transform 220ms ease' }}>
            <polygon points="0,-7 -4,2 4,2" fill={p.color} />
            <text y={13} textAnchor="middle" fill={p.color} fontSize={10} fontWeight={700}>
              {p.name}
            </text>
          </g>
        );
      })}

      {found != null ? (
        <text x={LEFT} y={height - 12} fill={found ? 'rgba(34,197,94,0.9)' : 'rgba(255,255,255,0.4)'} fontSize={11}>
          {found ? 'found at mid' : `search space [${lo}, ${hi}]`}
        </text>
      ) : null}
    </svg>
  );
}
