'use client';

import type { ContainerDiagramState, ElevationPointer } from '@/types/visual-script';

const BAR_W = 34;
const GAP = 7;
const UNIT = 22;
const LEFT = 36;
const BASE_PAD = 52;

const COLORS = {
  accent: { stroke: '#22c55e', fill: '#166534', caret: '#22c55e', label: '#86efac' },
  secondary: { stroke: '#38bdf8', fill: '#0c4a6e', caret: '#38bdf8', label: '#7dd3fc' },
  bar: { stroke: 'rgba(255,255,255,0.22)', fill: '#2a2a2a' },
  wall: { stroke: '#22c55e', fill: '#14532d' },
  water: { fill: 'rgba(56,189,248,0.35)', stroke: 'rgba(56,189,248,0.7)' },
};

function pointerPalette(p: ElevationPointer, i: number) {
  if (p.color) return COLORS[p.color];
  return i === 0 ? COLORS.accent : COLORS.secondary;
}

export function ContainerDiagram({ diagram }: { diagram: ContainerDiagramState }) {
  const { heights, left, right, maxArea } = diagram;
  const maxH = Math.max(...heights, 1);
  const chartH = maxH * UNIT + BASE_PAD + 36;
  const width = Math.max(380, LEFT * 2 + heights.length * (BAR_W + GAP));
  const baseY = chartH - BASE_PAD;

  const barX = (i: number) => LEFT + i * (BAR_W + GAP);
  const yAt = (h: number) => baseY - h * UNIT;

  const l = Math.min(left, right);
  const r = Math.max(left, right);
  const wallH = Math.min(heights[l], heights[r]);
  const tankLeft = barX(l);
  const tankWidth = barX(r) + BAR_W - tankLeft;
  const tankTop = yAt(wallH);
  const tankHeight = wallH * UNIT;
  const area = wallH * (r - l);

  return (
    <svg
      viewBox={`0 0 ${width} ${chartH}`}
      className="h-full w-full max-h-[320px]"
      role="img"
      aria-label="Container with most water"
    >
      <line
        x1={LEFT - 12}
        y1={baseY}
        x2={width - LEFT + 12}
        y2={baseY}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5}
      />

      {/* water tank between walls */}
      <rect
        x={tankLeft}
        y={tankTop}
        width={tankWidth}
        height={tankHeight}
        fill={COLORS.water.fill}
        stroke={COLORS.water.stroke}
        strokeWidth={1.5}
        strokeDasharray="4 3"
        style={{ transition: 'x 240ms ease, width 240ms ease, y 240ms ease, height 240ms ease' }}
      />

      {heights.map((h, i) => {
        const x = barX(i);
        const isWall = i === l || i === r;
        const barTop = yAt(h);
        const barHeight = h * UNIT;
        const palette = isWall ? COLORS.wall : COLORS.bar;

        return (
          <g key={i}>
            <rect
              x={x}
              y={barTop}
              width={BAR_W}
              height={Math.max(barHeight, 2)}
              rx={4}
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth={isWall ? 2.5 : 1.25}
            />
            <text
              x={x + BAR_W / 2}
              y={barTop - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize={11}
              fontWeight={600}
            >
              {h}
            </text>
            <text
              x={x + BAR_W / 2}
              y={baseY + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize={10}
            >
              {i}
            </text>
          </g>
        );
      })}

      {[
        { name: 'L', index: l, color: 'accent' as const },
        { name: 'R', index: r, color: 'secondary' as const },
      ].map((p, i) => {
        const palette = pointerPalette(p, i);
        const cx = barX(p.index) + BAR_W / 2;
        const y = baseY + 28;
        return (
          <g key={p.name} style={{ transform: `translate(${cx}px, ${y}px)`, transition: 'transform 240ms ease' }}>
            <polygon points="0,-8 -5,2 5,2" fill={palette.caret} />
            <text y={14} textAnchor="middle" fill={palette.label} fontSize={11} fontWeight={700}>
              {p.name}
            </text>
          </g>
        );
      })}

      <text x={width - LEFT} y={22} textAnchor="end" fill="rgba(56,189,248,0.95)" fontSize={12} fontWeight={600}>
        area = min({heights[l]},{heights[r]}) × ({r}−{l}) = {area}
      </text>
      {maxArea != null ? (
        <text x={LEFT} y={22} fill="rgba(34,197,94,0.9)" fontSize={12} fontWeight={600}>
          max so far: {maxArea}
        </text>
      ) : null}
    </svg>
  );
}
