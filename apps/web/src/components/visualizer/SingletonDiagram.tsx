'use client';

import type { SingletonDiagramState } from '@/types/visual-script';

export function SingletonDiagram({ diagram }: { diagram: SingletonDiagramState }) {
  const { callSites, instance, activeCallIndex, label } = diagram;
  const width = 420;
  const height = 240;
  const instanceY = 170;
  const instanceX = width / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Singleton diagram">
      <defs>
        <marker id="singleton-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#22c55e" />
        </marker>
        <marker id="singleton-arrow-dim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {callSites.map((site, i) => {
        const x = 80 + i * ((width - 160) / Math.max(callSites.length - 1, 1));
        const active = activeCallIndex === i;
        return (
          <g key={`call-${i}`}>
            <rect
              x={x - 56}
              y={36}
              width={112}
              height={40}
              rx={8}
              fill={active ? 'rgba(56,189,248,0.15)' : '#242424'}
              stroke={active ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
              strokeWidth={active ? 2 : 1.5}
            />
            <text x={x} y={52} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>
              call site
            </text>
            <text x={x} y={68} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={500}>
              {site.label}
            </text>
            <line
              x1={x}
              y1={76}
              x2={instanceX}
              y2={instanceY - 28}
              stroke={active ? '#22c55e' : 'rgba(255,255,255,0.2)'}
              strokeWidth={active ? 2 : 1.5}
              markerEnd={`url(#${active ? 'singleton-arrow' : 'singleton-arrow-dim'})`}
            />
          </g>
        );
      })}

      <rect
        x={instanceX - 70}
        y={instanceY - 28}
        width={140}
        height={56}
        rx={10}
        fill="rgba(34,197,94,0.18)"
        stroke="#22c55e"
        strokeWidth={2.5}
      />
      <text x={instanceX} y={instanceY - 6} textAnchor="middle" fill="#86efac" fontSize={10} fontWeight={600}>
        SINGLE INSTANCE
      </text>
      <text x={instanceX} y={instanceY + 12} textAnchor="middle" fill="#f5f5f5" fontSize={13} fontWeight={600}>
        {instance.label}
      </text>
      <text x={instanceX} y={instanceY + 26} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={10} fontFamily="ui-monospace, monospace">
        @ {instance.memory}
      </text>
    </svg>
  );
}
