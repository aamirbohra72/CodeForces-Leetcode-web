'use client';

import type { HeapDiagramState } from '@/types/visual-script';

const NODE_R = 18;
const LEVEL_H = 52;

function nodePos(index: number, level: number, levelWidth: number, left: number): { x: number; y: number } {
  const nodesInLevel = 2 ** level;
  const posInLevel = index - (2 ** level - 1);
  const slotW = levelWidth / nodesInLevel;
  return {
    x: left + slotW * posInLevel + slotW / 2,
    y: 36 + level * LEVEL_H,
  };
}

function levelOf(index: number): number {
  return Math.floor(Math.log2(index + 1));
}

export function HeapDiagram({ diagram }: { diagram: HeapDiagramState }) {
  const { values, highlightIndices = [], label } = diagram;
  const n = values.length;
  const maxLevel = n > 0 ? levelOf(n - 1) : 0;
  const width = Math.max(320, 80 + (2 ** (maxLevel + 1)) * 36);
  const height = Math.max(160, 56 + (maxLevel + 1) * LEVEL_H);
  const levelWidth = width - 80;
  const left = 40;
  const highlightSet = new Set(highlightIndices);

  const positions = values.map((_, i) => nodePos(i, levelOf(i), levelWidth, left));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Heap diagram">
      {label ? (
        <text x={left} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {values.map((_, i) => {
        const lc = 2 * i + 1;
        const rc = 2 * i + 2;
        const p = positions[i];
        return (
          <g key={`edge-${i}`}>
            {lc < n ? (
              <line x1={p.x} y1={p.y + NODE_R} x2={positions[lc].x} y2={positions[lc].y - NODE_R} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
            ) : null}
            {rc < n ? (
              <line x1={p.x} y1={p.y + NODE_R} x2={positions[rc].x} y2={positions[rc].y - NODE_R} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
            ) : null}
          </g>
        );
      })}

      {values.map((val, i) => {
        const p = positions[i];
        const hi = highlightSet.has(i);
        return (
          <g key={`node-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={NODE_R}
              fill={hi ? 'rgba(34,197,94,0.28)' : 'rgba(56,189,248,0.15)'}
              stroke={hi ? '#22c55e' : '#38bdf8'}
              strokeWidth={hi ? 2.25 : 1.5}
            />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#f5f5f5" fontSize={12} fontWeight={600} fontFamily="ui-monospace, monospace">
              {val}
            </text>
            <text x={p.x} y={p.y + NODE_R + 12} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={9}>
              [{i}]
            </text>
          </g>
        );
      })}
    </svg>
  );
}
