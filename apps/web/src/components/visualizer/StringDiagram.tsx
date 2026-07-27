'use client';

import type { StringDiagramState, ElevationPointer } from '@/types/visual-script';

const CELL_W = 40;
const GAP = 6;
const LEFT = 32;
const TOP = 48;

const COLORS = {
  accent: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.2)', caret: '#22c55e', label: '#86efac' },
  secondary: { stroke: '#38bdf8', fill: 'rgba(56,189,248,0.2)', caret: '#38bdf8', label: '#7dd3fc' },
  window: 'rgba(34,197,94,0.12)',
  dup: { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.25)' },
  idle: { stroke: 'rgba(255,255,255,0.14)', fill: '#222222' },
};

function pointerPalette(p: ElevationPointer, i: number) {
  if (p.color) return COLORS[p.color];
  return i === 0 ? COLORS.accent : COLORS.secondary;
}

export function StringDiagram({ diagram }: { diagram: StringDiagramState }) {
  const { chars, windowStart, windowEnd, pointers = [], duplicateIndex } = diagram;
  const n = chars.length;
  const width = Math.max(340, LEFT * 2 + n * (CELL_W + GAP));
  const height = 160;

  const cellX = (i: number) => LEFT + i * (CELL_W + GAP);
  const hasWindow = windowStart != null && windowEnd != null;
  const wStart = hasWindow ? Math.min(windowStart!, windowEnd!) : 0;
  const wEnd = hasWindow ? Math.max(windowStart!, windowEnd!) : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[220px]" role="img" aria-label="String diagram">
      {hasWindow ? (
        <rect
          x={cellX(wStart) - 4}
          y={TOP - 8}
          width={cellX(wEnd) - cellX(wStart) + CELL_W + 8}
          height={52}
          rx={10}
          fill={COLORS.window}
          stroke="rgba(34,197,94,0.35)"
          strokeWidth={1.5}
          style={{ transition: 'x 220ms ease, width 220ms ease' }}
        />
      ) : null}

      {chars.split('').map((ch, i) => {
        const x = cellX(i);
        const inWindow = hasWindow && i >= wStart && i <= wEnd;
        const isDup = duplicateIndex === i;
        const stroke = isDup ? COLORS.dup.stroke : inWindow ? COLORS.accent.stroke : COLORS.idle.stroke;
        const fill = isDup ? COLORS.dup.fill : inWindow ? COLORS.accent.fill : COLORS.idle.fill;

        return (
          <g key={i}>
            <rect x={x} y={TOP} width={CELL_W} height={44} rx={8} fill={fill} stroke={stroke} strokeWidth={inWindow || isDup ? 2 : 1.25} />
            <text x={x + CELL_W / 2} y={TOP + 28} textAnchor="middle" fill="#f5f5f5" fontSize={18} fontWeight={600} fontFamily="ui-monospace, monospace">
              {ch}
            </text>
            <text x={x + CELL_W / 2} y={TOP + 58} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10}>
              {i}
            </text>
          </g>
        );
      })}

      {pointers.map((p, i) => {
        const palette = pointerPalette(p, i);
        const cx = cellX(p.index) + CELL_W / 2;
        const y = TOP + 72;
        return (
          <g key={p.name} style={{ transform: `translate(${cx}px, ${y}px)`, transition: 'transform 220ms ease' }}>
            <polygon points="0,-8 -5,2 5,2" fill={palette.caret} />
            <text y={14} textAnchor="middle" fill={palette.label} fontSize={11} fontWeight={700}>
              {p.name}
            </text>
          </g>
        );
      })}

      {hasWindow ? (
        <text x={LEFT} y={24} fill="rgba(34,197,94,0.85)" fontSize={11} fontWeight={600}>
          window: &quot;{chars.slice(wStart, wEnd + 1)}&quot; (len {wEnd - wStart + 1})
        </text>
      ) : null}
    </svg>
  );
}
