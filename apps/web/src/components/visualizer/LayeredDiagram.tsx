'use client';

import type { LayeredDiagramState } from '@/types/visual-script';

const COLORS: Record<string, string> = {
  core: 'rgba(34,197,94,0.2)',
  wrapper: 'rgba(56,189,248,0.15)',
  leaf: 'rgba(245,158,11,0.15)',
  branch: 'rgba(168,85,247,0.15)',
};

const STROKES: Record<string, string> = {
  core: '#22c55e',
  wrapper: '#38bdf8',
  leaf: '#f59e0b',
  branch: '#a855f7',
};

export function LayeredDiagram({ diagram }: { diagram: LayeredDiagramState }) {
  const { layers, tree = [], layout = 'stack', label } = diagram;
  const byId = new Map(layers.map((l) => [l.id, l]));

  if (layout === 'tree' && tree.length > 0) {
    const children = new Map<string, string[]>();
    for (const { parent, child } of tree) {
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent)!.push(child);
    }
    const roots = layers.filter((l) => !tree.some((t) => t.child === l.id));

    const renderNode = (id: string, x: number, y: number, depth: number): { w: number; nodes: JSX.Element[] } => {
      const layer = byId.get(id);
      if (!layer) return { w: 0, nodes: [] };
      const kids = children.get(id) ?? [];
      const variant = layer.variant ?? 'branch';
      const fill = COLORS[variant];
      const stroke = layer.highlight ? '#22c55e' : STROKES[variant];
      const boxW = 100;
      const boxH = 44;
      const gap = 16;

      if (kids.length === 0) {
        return {
          w: boxW,
          nodes: [
            <g key={id}>
              <rect x={x} y={y} width={boxW} height={boxH} rx={6} fill={fill} stroke={stroke} strokeWidth={layer.highlight ? 2.5 : 1.5} />
              <text x={x + boxW / 2} y={y + 18} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
                {layer.label}
              </text>
              {layer.sublabel ? (
                <text x={x + boxW / 2} y={y + 32} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>
                  {layer.sublabel}
                </text>
              ) : null}
            </g>,
          ],
        };
      }

      let childX = x;
      const childNodes: JSX.Element[] = [];
      let totalW = 0;
      const childY = y + boxH + gap + 20;
      for (const kid of kids) {
        const { w, nodes } = renderNode(kid, childX, childY, depth + 1);
        childNodes.push(...nodes);
        childX += w + gap;
        totalW += w + gap;
      }
      totalW -= gap;
      const centerX = x + Math.max(boxW, totalW) / 2;

      return {
        w: Math.max(boxW, totalW),
        nodes: [
          <g key={id}>
            <rect x={centerX - boxW / 2} y={y} width={boxW} height={boxH} rx={6} fill={fill} stroke={stroke} strokeWidth={layer.highlight ? 2.5 : 1.5} />
            <text x={centerX} y={y + 18} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
              {layer.label}
            </text>
            {layer.sublabel ? (
              <text x={centerX} y={y + 32} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9}>
                {layer.sublabel}
              </text>
            ) : null}
            {kids.map((kid) => {
              const kidLayer = byId.get(kid);
              if (!kidLayer) return null;
              return (
                <line
                  key={`line-${id}-${kid}`}
                  x1={centerX}
                  y1={y + boxH}
                  x2={centerX}
                  y2={childY}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                />
              );
            })}
          </g>,
          ...childNodes,
        ],
      };
    };

    const allNodes: JSX.Element[] = [];
    let offsetX = 20;
    for (const root of roots) {
      const { w, nodes } = renderNode(root.id, offsetX, 30, 0);
      allNodes.push(...nodes);
      offsetX += w + 40;
    }

    return (
      <svg viewBox={`0 0 ${Math.max(400, offsetX)} 260`} className="h-full w-full max-h-[300px]" role="img" aria-label="Composite tree diagram">
        {label ? (
          <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
            {label}
          </text>
        ) : null}
        {allNodes}
      </svg>
    );
  }

  if (layout === 'bridge') {
    const left = layers.filter((_, i) => i % 2 === 0);
    const right = layers.filter((_, i) => i % 2 === 1);
    return (
      <svg viewBox="0 0 440 220" className="h-full w-full max-h-[280px]" role="img" aria-label="Bridge diagram">
        {label ? (
          <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
            {label}
          </text>
        ) : null}
        <text x={80} y={40} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
          ABSTRACTION
        </text>
        <text x={300} y={40} fill="rgba(255,255,255,0.4)" fontSize={10} fontWeight={600}>
          IMPLEMENTATION
        </text>
        {left.map((layer, i) => {
          const variant = layer.variant ?? 'core';
          return (
            <g key={layer.id}>
              <rect x={30} y={55 + i * 58} width={130} height={44} rx={6} fill={COLORS[variant]} stroke={layer.highlight ? '#22c55e' : STROKES[variant]} strokeWidth={layer.highlight ? 2.5 : 1.5} />
              <text x={95} y={82 + i * 58} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
                {layer.label}
              </text>
              {right[i] ? (
                <>
                  <line x1={160} y1={77 + i * 58} x2={270} y2={77 + i * 58} stroke={layer.highlight ? '#22c55e' : 'rgba(255,255,255,0.25)'} strokeWidth={layer.highlight ? 2 : 1.5} strokeDasharray="4 4" />
                  <rect x={280} y={55 + i * 58} width={130} height={44} rx={6} fill={COLORS[right[i].variant ?? 'wrapper']} stroke={right[i].highlight ? '#22c55e' : STROKES[right[i].variant ?? 'wrapper']} strokeWidth={right[i].highlight ? 2.5 : 1.5} />
                  <text x={345} y={82 + i * 58} textAnchor="middle" fill="#f5f5f5" fontSize={11} fontWeight={600}>
                    {right[i].label}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
    );
  }

  const boxW = 280;
  const boxH = 44;
  const gap = 6;
  const totalH = layers.length * (boxH + gap) + 20;

  return (
    <svg viewBox={`0 0 340 ${totalH}`} className="h-full w-full max-h-[320px]" role="img" aria-label="Layered composition diagram">
      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}
      {layers.map((layer, i) => {
        const y = 28 + i * (boxH + gap);
        const variant = layer.variant ?? (i === layers.length - 1 ? 'core' : 'wrapper');
        const inset = i * 12;
        return (
          <g key={layer.id}>
            <rect
              x={30 + inset}
              y={y}
              width={boxW - inset * 2}
              height={boxH}
              rx={6}
              fill={COLORS[variant]}
              stroke={layer.highlight ? '#22c55e' : STROKES[variant]}
              strokeWidth={layer.highlight ? 2.5 : 1.5}
            />
            <text x={30 + boxW / 2} y={y + 18} textAnchor="middle" fill="#f5f5f5" fontSize={12} fontWeight={600}>
              {layer.label}
            </text>
            {layer.sublabel ? (
              <text x={30 + boxW / 2} y={y + 32} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={10}>
                {layer.sublabel}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
