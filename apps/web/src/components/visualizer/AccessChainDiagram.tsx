'use client';

import type { AccessChainState } from '@/types/visual-script';

export function AccessChainDiagram({ diagram }: { diagram: AccessChainState }) {
  const { objects, activeIndex = -1, violation, label } = diagram;
  const width = Math.max(400, objects.length * 100 + 40);

  return (
    <svg viewBox={`0 0 ${width} 180`} className="h-full w-full max-h-[220px]" role="img" aria-label="Access chain diagram">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {objects.map((obj, i) => {
        const x = 30 + i * 95;
        const active = i === activeIndex;
        const pastViolation = violation && activeIndex >= 0 && i > activeIndex;
        const stroke = pastViolation ? '#f87171' : active ? '#22c55e' : 'rgba(255,255,255,0.22)';
        const fill = pastViolation ? 'rgba(248,113,113,0.12)' : active ? 'rgba(34,197,94,0.15)' : '#2a2a2a';

        return (
          <g key={`${obj}-${i}`}>
            {i > 0 ? (
              <text x={x - 48} y={88} textAnchor="middle" fill={pastViolation ? '#f87171' : 'rgba(255,255,255,0.35)'} fontSize={16} fontWeight={600}>
                .
              </text>
            ) : null}
            <rect x={x} y={60} width={80} height={44} rx={8} fill={fill} stroke={stroke} strokeWidth={active || pastViolation ? 2 : 1.5} />
            <text x={x + 40} y={87} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
              {obj}
            </text>
          </g>
        );
      })}

      {violation ? (
        <text x={width / 2} y={150} textAnchor="middle" fill="#fca5a5" fontSize={11}>
          ✗ Violates Law of Demeter — reaching through internals
        </text>
      ) : activeIndex >= 0 ? (
        <text x={width / 2} y={150} textAnchor="middle" fill="#86efac" fontSize={11}>
          ✓ Talk only to direct collaborators
        </text>
      ) : null}
    </svg>
  );
}
