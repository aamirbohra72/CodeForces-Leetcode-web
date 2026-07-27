'use client';

import type { ArrayDiagramState, ArrayPointer } from '@/types/visual-script';

type ArrayDiagramProps = {
  diagram: ArrayDiagramState;
};

const CELL_W = 58;
const CELL_H = 52;
const CELL_GAP = 8;
const LEFT_PAD = 28;
const TOP = 40;

const COLORS = {
  accent: { stroke: '#22c55e', fill: 'rgba(34,197,94,0.18)', caret: '#22c55e', label: '#86efac' },
  secondary: { stroke: '#38bdf8', fill: 'rgba(56,189,248,0.18)', caret: '#38bdf8', label: '#7dd3fc' },
  idle: { stroke: 'rgba(255,255,255,0.14)', fill: '#222222', caret: '#a3a3a3', label: '#a3a3a3' },
};

function pointerColor(p: ArrayPointer, indexInList: number) {
  if (p.color) return COLORS[p.color];
  return indexInList === 0 ? COLORS.accent : COLORS.secondary;
}

export function ArrayDiagram({ diagram }: ArrayDiagramProps) {
  const { cells, pointers, highlightIndices = [] } = diagram;
  const highlight = new Set(highlightIndices);
  const width = Math.max(340, LEFT_PAD * 2 + cells.length * (CELL_W + CELL_GAP));
  const height = 200;

  const cellX = (index: number) => LEFT_PAD + index * (CELL_W + CELL_GAP);
  const cellCenterX = (index: number) => cellX(index) + CELL_W / 2;

  const colorAtIndex = (index: number) => {
    const ptr = pointers.find((p) => p.index === index);
    if (!ptr) return null;
    const idx = pointers.indexOf(ptr);
    return pointerColor(ptr, idx);
  };

  const offsetFor = (name: string, index: number) => {
    const atSame = pointers.filter((p) => p.index === index).map((p) => p.name);
    if (atSame.length <= 1) return 0;
    const i = atSame.indexOf(name);
    return (i - (atSame.length - 1) / 2) * 26;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full max-h-[280px]"
      role="img"
      aria-label="Array diagram"
    >
      {cells.map((cell) => {
        const x = cellX(cell.index);
        const isHot = highlight.has(cell.index);
        const ptrColor = colorAtIndex(cell.index);
        const stroke = isHot && ptrColor ? ptrColor.stroke : COLORS.idle.stroke;
        const fill = isHot && ptrColor ? ptrColor.fill : COLORS.idle.fill;
        const sw = isHot ? 2.5 : 1.25;

        return (
          <g key={cell.index}>
            <rect
              x={x}
              y={TOP}
              width={CELL_W}
              height={CELL_H}
              rx={8}
              fill={fill}
              stroke={stroke}
              strokeWidth={sw}
              style={{ transition: 'fill 200ms ease, stroke 200ms ease, stroke-width 200ms ease' }}
            />
            <text
              x={x + CELL_W / 2}
              y={TOP + CELL_H / 2 + 6}
              textAnchor="middle"
              fill="#f5f5f5"
              fontSize={17}
              fontWeight={600}
            >
              {cell.value}
            </text>
            <text
              x={x + CELL_W / 2}
              y={TOP + CELL_H + 20}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize={11}
            >
              [{cell.index}]
            </text>
          </g>
        );
      })}

      {pointers.map((p, i) => {
        const palette = pointerColor(p, i);
        const cx = cellCenterX(p.index) + offsetFor(p.name, p.index);
        const y = TOP + CELL_H + 44;
        return (
          <g
            key={p.name}
            style={{
              transform: `translate(${cx}px, ${y}px)`,
              transition: 'transform 220ms ease',
            }}
          >
            <polygon points="0,-9 -6,2 6,2" fill={palette.caret} />
            <text
              y={16}
              textAnchor="middle"
              fill={palette.label}
              fontSize={12}
              fontWeight={700}
            >
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
