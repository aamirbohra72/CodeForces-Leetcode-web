'use client';

import type { CreationFlowDiagramState } from '@/types/visual-script';

export function CreationFlowDiagram({ diagram }: { diagram: CreationFlowDiagramState }) {
  const { recipe, product, label } = diagram;
  const { steps, activeStep = -1 } = recipe;
  const built = product.built;

  return (
    <svg viewBox="0 0 440 240" className="h-full w-full max-h-[280px]" role="img" aria-label="Creation flow diagram">
      <defs>
        <marker id="create-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#22c55e" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      <text x={24} y={44} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        RECIPE / BLUEPRINT
      </text>
      <rect x={20} y={52} width={180} height={160} rx={8} fill="#1a1a1a" stroke="rgba(255,255,255,0.18)" strokeWidth={1.5} />
      {steps.map((step, i) => {
        const active = i === activeStep;
        const done = i < activeStep || built;
        return (
          <g key={step}>
            <circle
              cx={36}
              cy={78 + i * 28}
              r={8}
              fill={active ? 'rgba(34,197,94,0.3)' : done ? 'rgba(34,197,94,0.15)' : '#2a2a2a'}
              stroke={active ? '#22c55e' : done ? '#22c55e88' : 'rgba(255,255,255,0.2)'}
              strokeWidth={active ? 2 : 1.5}
            />
            {done && !active ? (
              <text x={36} y={82 + i * 28} textAnchor="middle" fill="#22c55e" fontSize={10} fontWeight={700}>
                ✓
              </text>
            ) : null}
            <text
              x={52}
              y={82 + i * 28}
              fill={active ? '#86efac' : done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.45)'}
              fontSize={11}
              fontWeight={active ? 600 : 400}
            >
              {step}
            </text>
          </g>
        );
      })}

      <line x1={200} y1={132} x2={248} y2={132} stroke={built || activeStep >= 0 ? '#22c55e' : 'rgba(255,255,255,0.2)'} strokeWidth={2} markerEnd="url(#create-arrow)" />

      <text x={270} y={44} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
        PRODUCT
      </text>
      <rect
        x={260}
        y={52}
        width={160}
        height={160}
        rx={8}
        fill={built ? 'rgba(34,197,94,0.12)' : '#1a1a1a'}
        stroke={built ? '#22c55e' : 'rgba(255,255,255,0.18)'}
        strokeWidth={built ? 2 : 1.5}
      />
      <text x={340} y={88} textAnchor="middle" fill="#f5f5f5" fontSize={14} fontWeight={700}>
        {product.name}
      </text>
      {product.parts.map((part, i) => (
        <rect
          key={part}
          x={280}
          y={100 + i * 26}
          width={120}
          height={20}
          rx={4}
          fill={built || i <= activeStep ? 'rgba(34,197,94,0.2)' : '#2a2a2a'}
          stroke={built || i <= activeStep ? '#22c55e88' : 'rgba(255,255,255,0.12)'}
        />
      ))}
      {product.parts.map((part, i) => (
        <text key={`lbl-${part}`} x={340} y={114 + i * 26} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={10}>
          {part}
        </text>
      ))}
    </svg>
  );
}
