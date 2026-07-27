'use client';

import type { FlyweightDiagramState } from '@/types/visual-script';

export function FlyweightDiagram({ diagram }: { diagram: FlyweightDiagramState }) {
  const { factory, shared, extrinsic, label } = diagram;

  return (
    <svg viewBox="0 0 440 240" className="h-full w-full max-h-[280px]" role="img" aria-label="Flyweight pool diagram">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      <rect x={20} y={36} width={120} height={40} rx={8} fill="rgba(56,189,248,0.15)" stroke="#38bdf8" strokeWidth={1.5} />
      <text x={80} y={62} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
        {factory}
      </text>

      <text x={20} y={96} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        SHARED INTRINSIC POOL
      </text>
      <rect x={20} y={104} width={180} height={110} rx={8} fill="#1a1a1a" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
      {shared.map((s, i) => (
        <g key={s.key}>
          <rect x={32} y={116 + i * 30} width={156} height={24} rx={4} fill="rgba(34,197,94,0.12)" stroke="#22c55e88" />
          <text x={44} y={132 + i * 30} fill="#86efac" fontSize={10} fontWeight={600}>
            {s.key}
          </text>
          <text x={170} y={132 + i * 30} textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize={9}>
            ×{s.count} refs
          </text>
        </g>
      ))}

      <text x={230} y={96} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        EXTRINSIC CONTEXT
      </text>
      {extrinsic.map((e, i) => (
        <g key={e.label}>
          <rect
            x={230}
            y={104 + i * 38}
            width={190}
            height={32}
            rx={6}
            fill={e.highlight ? 'rgba(34,197,94,0.15)' : '#2a2a2a'}
            stroke={e.highlight ? '#22c55e' : 'rgba(255,255,255,0.18)'}
            strokeWidth={e.highlight ? 2 : 1.5}
          />
          <text x={244} y={124 + i * 38} fill="#f5f5f5" fontSize={11}>
            {e.label}
          </text>
          <text x={400} y={124 + i * 38} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize={9}>
            → {e.key}
          </text>
        </g>
      ))}
    </svg>
  );
}
