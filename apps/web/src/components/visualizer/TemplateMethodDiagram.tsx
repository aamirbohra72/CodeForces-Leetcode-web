'use client';

import type { TemplateMethodState } from '@/types/visual-script';

export function TemplateMethodDiagram({ diagram }: { diagram: TemplateMethodState }) {
  const { steps, label } = diagram;

  return (
    <svg viewBox={`0 0 320 ${40 + steps.length * 36}`} className="h-full w-full max-h-[300px]" role="img" aria-label="Template method diagram">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      <rect x={20} y={28} width={280} height={steps.length * 36 + 16} rx={8} fill="#1a1a1a" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
      <text x={36} y={48} fill="rgba(255,255,255,0.4)" fontSize={9} fontWeight={600}>
        SKELETON ALGORITHM
      </text>

      {steps.map((step, i) => {
        const y = 58 + i * 36;
        const active = step.active;
        const done = step.done;
        return (
          <g key={step.id}>
            <rect
              x={32}
              y={y}
              width={256}
              height={28}
              rx={4}
              fill={active ? 'rgba(34,197,94,0.2)' : done ? 'rgba(34,197,94,0.08)' : step.hook ? 'rgba(245,158,11,0.08)' : '#242424'}
              stroke={active ? '#22c55e' : step.hook ? '#f59e0b88' : 'rgba(255,255,255,0.1)'}
              strokeWidth={active ? 2 : 1}
              strokeDasharray={step.hook ? '4 3' : undefined}
            />
            <text x={48} y={y + 18} fill={active ? '#86efac' : 'rgba(255,255,255,0.7)'} fontSize={11} fontWeight={active ? 600 : 400}>
              {done ? '✓ ' : step.hook ? '◇ ' : `${i + 1}. `}
              {step.label}
            </text>
            {step.hook ? (
              <text x={270} y={y + 18} textAnchor="end" fill="#fbbf24" fontSize={9}>
                hook
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
