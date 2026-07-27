'use client';

import type { PrincipleCompareState } from '@/types/visual-script';

function Panel({ panel, x }: { panel: PrincipleCompareState['left']; x: number }) {
  const good = panel.good;
  const stroke = panel.highlight ? '#22c55e' : good ? '#22c55e88' : '#f8717188';
  const fill = panel.highlight ? 'rgba(34,197,94,0.12)' : good ? 'rgba(34,197,94,0.06)' : 'rgba(248,113,113,0.06)';

  return (
    <g>
      <rect x={x} y={36} width={180} height={180} rx={8} fill={fill} stroke={stroke} strokeWidth={panel.highlight ? 2 : 1.5} />
      <text x={x + 90} y={58} textAnchor="middle" fill={good ? '#86efac' : '#fca5a5'} fontSize={12} fontWeight={700}>
        {panel.title}
      </text>
      {panel.items.map((item, i) => (
        <g key={item}>
          <text x={x + 16} y={82 + i * 24} fill="rgba(255,255,255,0.65)" fontSize={11}>
            {good ? '✓' : '✗'} {item}
          </text>
        </g>
      ))}
    </g>
  );
}

export function PrincipleCompareDiagram({ diagram }: { diagram: PrincipleCompareState }) {
  const { left, right, label } = diagram;
  return (
    <svg viewBox="0 0 420 230" className="h-full w-full max-h-[260px]" role="img" aria-label="Principle comparison">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}
      <Panel panel={left} x={20} />
      <text x={210} y={126} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={18}>
        vs
      </text>
      <Panel panel={right} x={220} />
    </svg>
  );
}
