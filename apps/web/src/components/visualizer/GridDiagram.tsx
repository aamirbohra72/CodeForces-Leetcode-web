'use client';

import type { GridCoord, GridDiagramState } from '@/types/visual-script';

const CELL = 44;
const GAP = 4;
const LEFT = 36;
const TOP = 36;

function coordKey({ row, col }: GridCoord): string {
  return `${row},${col}`;
}

export function GridDiagram({ diagram }: { diagram: GridDiagramState }) {
  const { rows, highlight = [], visited = [], path = [], label } = diagram;
  const rowCount = rows.length;
  const colCount = rowCount > 0 ? Math.max(...rows.map((r) => r.length)) : 0;

  const highlightSet = new Set(highlight.map(coordKey));
  const visitedSet = new Set(visited.map(coordKey));
  const pathSet = new Set(path.map(coordKey));

  const width = Math.max(320, LEFT * 2 + colCount * (CELL + GAP) - GAP);
  const height = Math.max(180, TOP + 24 + rowCount * (CELL + GAP) - GAP + 16);

  const cellX = (col: number) => LEFT + col * (CELL + GAP);
  const cellY = (row: number) => TOP + row * (CELL + GAP);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Grid diagram">
      {label ? (
        <text x={LEFT} y={18} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {path.map((c, i) => (
        <rect
          key={`path-${coordKey(c)}-${i}`}
          x={cellX(c.col) - 2}
          y={cellY(c.row) - 2}
          width={CELL + 4}
          height={CELL + 4}
          rx={8}
          fill="rgba(34,197,94,0.08)"
          stroke="rgba(34,197,94,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      ))}

      {rows.map((row, r) =>
        row.map((cell, c) => {
          const key = coordKey({ row: r, col: c });
          const isHighlight = highlightSet.has(key);
          const isVisited = visitedSet.has(key);
          const isPath = pathSet.has(key);

          const stroke = isHighlight
            ? '#22c55e'
            : isPath
              ? 'rgba(34,197,94,0.55)'
              : isVisited
                ? '#f59e0b'
                : 'rgba(255,255,255,0.14)';
          const fill = isHighlight
            ? 'rgba(34,197,94,0.28)'
            : isPath
              ? 'rgba(34,197,94,0.18)'
              : isVisited
                ? 'rgba(245,158,11,0.18)'
                : '#222222';
          const sw = isHighlight || isVisited || isPath ? 2.25 : 1.25;

          return (
            <g key={key}>
              <rect
                x={cellX(c)}
                y={cellY(r)}
                width={CELL}
                height={CELL}
                rx={7}
                fill={fill}
                stroke={stroke}
                strokeWidth={sw}
                style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
              />
              <text
                x={cellX(c) + CELL / 2}
                y={cellY(r) + CELL / 2 + 5}
                textAnchor="middle"
                fill="#f5f5f5"
                fontSize={cell.length > 2 ? 12 : 15}
                fontWeight={600}
              >
                {cell}
              </text>
            </g>
          );
        }),
      )}

      {rows.map((_, r) => (
        <text key={`row-${r}`} x={LEFT - 10} y={cellY(r) + CELL / 2 + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={10}>
          {r}
        </text>
      ))}
      {Array.from({ length: colCount }, (_, c) => (
        <text key={`col-${c}`} x={cellX(c) + CELL / 2} y={TOP - 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>
          {c}
        </text>
      ))}
    </svg>
  );
}
