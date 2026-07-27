'use client';

import type { StackDiagramState } from '@/types/visual-script';

const CELL_W = 40;
const LEFT = 28;
const TOP = 40;

function StackColumn({
  items,
  label,
  x,
  bottom,
  width = 90,
  accent = false,
}: {
  items: string[];
  label: string;
  x: number;
  bottom: number;
  width?: number;
  accent?: boolean;
}) {
  const top = TOP;
  return (
    <g>
      <text x={x + width / 2} y={22} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
        {label}
      </text>
      <rect x={x} y={top} width={width} height={bottom - top} rx={10} fill="#141414" stroke="#3a3a3a" />
      {items.length === 0 ? (
        <text x={x + width / 2} y={top + 40} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={11}>
          empty
        </text>
      ) : (
        items.map((item, i) => {
          const fromBottom = items.length - 1 - i;
          const y = bottom - 36 - fromBottom * 34;
          return (
            <g key={`${label}-${item}-${i}`}>
              <rect
                x={x + 10}
                y={y}
                width={width - 20}
                height={28}
                rx={6}
                fill={accent ? 'rgba(34,197,94,0.18)' : 'rgba(56,189,248,0.15)'}
                stroke={accent ? '#22c55e' : '#38bdf8'}
              />
              <text
                x={x + width / 2}
                y={y + 18}
                textAnchor="middle"
                fill="#fff"
                fontSize={13}
                fontWeight={600}
                fontFamily="ui-monospace, monospace"
              >
                {item}
              </text>
            </g>
          );
        })
      )}
    </g>
  );
}

export function StackDiagram({ diagram }: { diagram: StackDiagramState }) {
  const {
    input,
    cursor = 0,
    values,
    stack,
    stackLabel = 'stack',
    secondaryStack,
    secondaryLabel = 'stack 2',
    highlightIndices = [],
    matched,
    invalid,
    status,
  } = diagram;

  const cells: (string | number)[] = values ?? (input ? input.split('') : []);
  const n = cells.length;
  const hot = new Set(highlightIndices);
  const dual = secondaryStack != null;
  const stackArea = dual ? 220 : 120;
  const width = Math.max(440, LEFT * 2 + Math.max(n, 1) * (CELL_W + 6) + stackArea);
  const height = 240;
  const stackBottom = 210;

  const cellX = (i: number) => LEFT + i * (CELL_W + 6);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Stack diagram">
      <text x={LEFT} y={22} fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
        {values ? 'array' : input ? 'input' : 'tokens'}
      </text>

      {cells.map((ch, i) => {
        const x = cellX(i);
        const isCursor = i === cursor;
        const isHot = hot.has(i) || isCursor;
        return (
          <g key={i}>
            <rect
              x={x}
              y={TOP}
              width={CELL_W}
              height={40}
              rx={7}
              fill={isHot ? 'rgba(34,197,94,0.2)' : i < cursor ? '#1a1a1a' : '#222'}
              stroke={isHot ? '#22c55e' : 'rgba(255,255,255,0.14)'}
              strokeWidth={isHot ? 2.5 : 1.25}
            />
            <text
              x={x + CELL_W / 2}
              y={TOP + 25}
              textAnchor="middle"
              fill="#f5f5f5"
              fontSize={values ? 14 : 16}
              fontWeight={600}
              fontFamily="ui-monospace, monospace"
            >
              {ch}
            </text>
            {values ? (
              <text x={x + CELL_W / 2} y={TOP + 56} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>
                {i}
              </text>
            ) : null}
          </g>
        );
      })}

      {n > 0 && cursor < n && !values ? (
        <polygon
          points={`${cellX(cursor) + CELL_W / 2},${TOP + 48} ${cellX(cursor) + CELL_W / 2 - 5},${TOP + 56} ${cellX(cursor) + CELL_W / 2 + 5},${TOP + 56}`}
          fill="#22c55e"
        />
      ) : null}

      <StackColumn
        items={stack}
        label={stackLabel}
        x={width - (dual ? 210 : 110)}
        bottom={stackBottom}
        accent={false}
      />
      {dual ? (
        <StackColumn
          items={secondaryStack!}
          label={secondaryLabel}
          x={width - 100}
          bottom={stackBottom}
          accent
        />
      ) : null}

      {(status || matched != null) && (
        <text
          x={LEFT}
          y={height - 12}
          fill={
            matched
              ? 'rgba(34,197,94,0.9)'
              : invalid
                ? 'rgba(245,158,11,0.9)'
                : 'rgba(255,255,255,0.55)'
          }
          fontSize={12}
          fontWeight={600}
        >
          {status ??
            (matched ? 'valid — stack empty at end' : invalid ? 'invalid — mismatch or leftover' : 'scanning…')}
        </text>
      )}
    </svg>
  );
}
