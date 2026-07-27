'use client';

import type { DpTableDiagramState } from '@/types/visual-script';

const CELL_W = 52;
const CELL_H = 40;
const GAP = 4;
const LABEL_W = 56;
const TOP = 40;
const LEFT = LABEL_W + 12;

function coordKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function DpTableDiagram({ diagram }: { diagram: DpTableDiagramState }) {
  const { rowLabels, colLabels, values, highlight = [], label } = diagram;
  const highlightSet = new Set(highlight.map((c) => coordKey(c.row, c.col)));

  const rows = values.length;
  const cols = rows > 0 ? Math.max(colLabels.length, ...values.map((r) => r.length)) : colLabels.length;

  const tableW = cols * (CELL_W + GAP) - GAP;
  const tableH = rows * (CELL_H + GAP) - GAP;
  const width = Math.max(360, LEFT + tableW + 24);
  const height = Math.max(200, TOP + tableH + 24);

  const cellX = (col: number) => LEFT + col * (CELL_W + GAP);
  const cellY = (row: number) => TOP + row * (CELL_H + GAP);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="DP table diagram">
      {label ? (
        <text x={LEFT} y={18} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {colLabels.map((lbl, c) => (
        <text key={`col-${c}`} x={cellX(c) + CELL_W / 2} y={TOP - 10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={10} fontWeight={600}>
          {lbl}
        </text>
      ))}

      {rowLabels.map((lbl, r) => (
        <text key={`row-${r}`} x={LEFT - 8} y={cellY(r) + CELL_H / 2 + 4} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize={10} fontWeight={600}>
          {lbl}
        </text>
      ))}

      {values.map((row, r) =>
        row.map((val, c) => {
          const hot = highlightSet.has(coordKey(r, c));
          const display = val == null ? '—' : String(val);
          return (
            <g key={coordKey(r, c)}>
              <rect
                x={cellX(c)}
                y={cellY(r)}
                width={CELL_W}
                height={CELL_H}
                rx={7}
                fill={hot ? 'rgba(34,197,94,0.25)' : '#222222'}
                stroke={hot ? '#22c55e' : 'rgba(255,255,255,0.14)'}
                strokeWidth={hot ? 2.5 : 1.25}
                style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
              />
              <text
                x={cellX(c) + CELL_W / 2}
                y={cellY(r) + CELL_H / 2 + 5}
                textAnchor="middle"
                fill={val == null ? 'rgba(255,255,255,0.25)' : '#f5f5f5'}
                fontSize={display.length > 4 ? 11 : 14}
                fontWeight={600}
              >
                {display}
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}
