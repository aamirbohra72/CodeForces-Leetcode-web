'use client';

import type { ElevationDiagramState, ElevationPointer } from '@/types/visual-script';

type ElevationDiagramProps = {
  diagram: ElevationDiagramState;
};

const BAR_W = 34;
const GAP = 7;
const UNIT = 22;
const LEFT = 36;
const BASE_PAD = 52;

const COLORS = {
  accent: { stroke: '#22c55e', fill: '#166534', caret: '#22c55e', label: '#86efac' },
  secondary: { stroke: '#38bdf8', fill: '#0c4a6e', caret: '#38bdf8', label: '#7dd3fc' },
  bar: { stroke: 'rgba(255,255,255,0.22)', fill: '#2a2a2a' },
  focus: { stroke: '#f59e0b', fill: '#422006' },
  water: { fill: 'rgba(56,189,248,0.55)', stroke: 'rgba(56,189,248,0.85)' },
  guideLeft: '#86efac',
  guideRight: '#7dd3fc',
  guideWater: '#38bdf8',
};

function pointerPalette(p: ElevationPointer, i: number) {
  if (p.color) return COLORS[p.color];
  return i === 0 ? COLORS.accent : COLORS.secondary;
}

export function ElevationDiagram({ diagram }: ElevationDiagramProps) {
  const { heights, waterUnits, focusIndices = [], pointers = [], guides } = diagram;
  const focus = new Set(focusIndices);
  const maxH = Math.max(
    ...heights,
    ...waterUnits.map((w, i) => heights[i] + w),
    guides?.leftMax ?? 0,
    guides?.rightMax ?? 0,
    1,
  );
  const chartH = maxH * UNIT + BASE_PAD + 36;
  const width = Math.max(360, LEFT * 2 + heights.length * (BAR_W + GAP));
  const baseY = chartH - BASE_PAD;

  const barX = (i: number) => LEFT + i * (BAR_W + GAP);
  const yAt = (h: number) => baseY - h * UNIT;
  const totalWater = waterUnits.reduce((a, b) => a + b, 0);

  const offsetFor = (name: string, index: number) => {
    const atSame = pointers.filter((p) => p.index === index).map((p) => p.name);
    if (atSame.length <= 1) return 0;
    const i = atSame.indexOf(name);
    return (i - (atSame.length - 1) / 2) * 22;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${chartH}`}
      className="h-full w-full max-h-[320px]"
      role="img"
      aria-label="Elevation map with trapped rainwater"
    >
      {/* baseline */}
      <line
        x1={LEFT - 12}
        y1={baseY}
        x2={width - LEFT + 12}
        y2={baseY}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5}
      />

      {/* guide lines for brute-force / per-index scan */}
      {guides?.leftMax != null ? (
        <line
          x1={LEFT - 8}
          y1={yAt(guides.leftMax)}
          x2={width - LEFT + 8}
          y2={yAt(guides.leftMax)}
          stroke={COLORS.guideLeft}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.75}
        />
      ) : null}
      {guides?.rightMax != null ? (
        <line
          x1={LEFT - 8}
          y1={yAt(guides.rightMax)}
          x2={width - LEFT + 8}
          y2={yAt(guides.rightMax)}
          stroke={COLORS.guideRight}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.75}
        />
      ) : null}
      {guides?.waterLevel != null ? (
        <line
          x1={LEFT - 8}
          y1={yAt(guides.waterLevel)}
          x2={width - LEFT + 8}
          y2={yAt(guides.waterLevel)}
          stroke={COLORS.guideWater}
          strokeWidth={2}
          opacity={0.9}
        />
      ) : null}

      {heights.map((h, i) => {
        const x = barX(i);
        const isFocus = focus.has(i);
        const barTop = yAt(h);
        const barHeight = h * UNIT;
        const water = waterUnits[i] ?? 0;
        const waterTop = yAt(h + water);
        const waterHeight = water * UNIT;
        const palette = isFocus ? COLORS.focus : COLORS.bar;

        return (
          <g key={i}>
            {water > 0 ? (
              <rect
                x={x}
                y={waterTop}
                width={BAR_W}
                height={waterHeight}
                fill={COLORS.water.fill}
                stroke={COLORS.water.stroke}
                strokeWidth={1}
                rx={3}
                style={{ transition: 'y 280ms ease, height 280ms ease' }}
              />
            ) : null}
            <rect
              x={x}
              y={barTop}
              width={BAR_W}
              height={Math.max(barHeight, 2)}
              rx={4}
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth={isFocus ? 2.5 : 1.25}
              style={{ transition: 'fill 200ms ease, stroke 200ms ease' }}
            />
            <text
              x={x + BAR_W / 2}
              y={barTop - (water > 0 ? waterHeight + 6 : 6)}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
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

      {pointers.map((p, i) => {
        const palette = pointerPalette(p, i);
        const cx = barX(p.index) + BAR_W / 2 + offsetFor(p.name, p.index);
        const y = baseY + 28;
        return (
          <g
            key={p.name}
            style={{
              transform: `translate(${cx}px, ${y}px)`,
              transition: 'transform 240ms ease',
            }}
          >
            <polygon points="0,-8 -5,2 5,2" fill={palette.caret} />
            <text y={14} textAnchor="middle" fill={palette.label} fontSize={11} fontWeight={700}>
              {p.name}
            </text>
          </g>
        );
      })}

      <text
        x={width - LEFT}
        y={22}
        textAnchor="end"
        fill="rgba(56,189,248,0.9)"
        fontSize={12}
        fontWeight={600}
      >
        trapped: {totalWater}
      </text>

      {guides?.leftMax != null ? (
        <text x={LEFT} y={yAt(guides.leftMax) - 4} fill={COLORS.guideLeft} fontSize={10}>
          leftMax={guides.leftMax}
        </text>
      ) : null}
      {guides?.rightMax != null ? (
        <text
          x={width - LEFT}
          y={yAt(guides.rightMax) - 4}
          textAnchor="end"
          fill={COLORS.guideRight}
          fontSize={10}
        >
          rightMax={guides.rightMax}
        </text>
      ) : null}
    </svg>
  );
}
