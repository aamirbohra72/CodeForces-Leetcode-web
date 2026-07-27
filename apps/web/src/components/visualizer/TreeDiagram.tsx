'use client';

import type { TreeDiagramState, TreeNodeSpec } from '@/types/visual-script';

const NODE_R = 18;
const H_GAP = 56;
const V_GAP = 56;

type Pos = { x: number; y: number };

function layoutTree(
  nodes: TreeNodeSpec[],
  rootId: string,
  originX: number,
  originY: number,
): Map<string, Pos> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const positions = new Map<string, Pos>();

  function depthOf(id: string | null | undefined): number {
    if (!id || !byId.has(id)) return 0;
    const n = byId.get(id)!;
    return 1 + Math.max(depthOf(n.left), depthOf(n.right));
  }

  function place(id: string | null | undefined, x: number, y: number, span: number) {
    if (!id || !byId.has(id)) return;
    positions.set(id, { x, y });
    const n = byId.get(id)!;
    const childSpan = span / 2;
    if (n.left) place(n.left, x - childSpan, y + V_GAP, childSpan);
    if (n.right) place(n.right, x + childSpan, y + V_GAP, childSpan);
  }

  const depth = depthOf(rootId);
  const span = Math.max(H_GAP, (1 << Math.max(depth - 1, 0)) * (H_GAP / 2));
  place(rootId, originX, originY, span);
  return positions;
}

function TreeCanvas({
  nodes,
  rootId,
  highlightIds,
  activeIds,
  badges,
  label,
  offsetX,
}: {
  nodes: TreeNodeSpec[];
  rootId: string;
  highlightIds: string[];
  activeIds: string[];
  badges?: Record<string, string>;
  label?: string;
  offsetX: number;
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const positions = layoutTree(nodes, rootId, offsetX, label ? 48 : 32);
  const hot = new Set(highlightIds);
  const active = new Set(activeIds);

  let maxX = offsetX;
  let maxY = 40;
  for (const p of positions.values()) {
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (const n of nodes) {
    const from = positions.get(n.id);
    if (!from) continue;
    for (const childId of [n.left, n.right]) {
      if (!childId || !byId.has(childId)) continue;
      const to = positions.get(childId);
      if (!to) continue;
      edges.push({ x1: from.x, y1: from.y + NODE_R, x2: to.x, y2: to.y - NODE_R, key: `${n.id}-${childId}` });
    }
  }

  return (
    <g>
      {label ? (
        <text x={offsetX} y={20} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}
      {edges.map((e) => (
        <line key={e.key} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      ))}
      {[...positions.entries()].map(([id, pos]) => {
        const n = byId.get(id)!;
        const isHot = hot.has(id);
        const isActive = active.has(id);
        const stroke = isActive ? '#22c55e' : isHot ? '#f59e0b' : 'rgba(255,255,255,0.25)';
        const fill = isActive ? 'rgba(34,197,94,0.25)' : isHot ? 'rgba(245,158,11,0.2)' : '#222';
        return (
          <g key={id} style={{ transition: 'transform 200ms ease' }}>
            <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={isActive || isHot ? 2.5 : 1.5} />
            <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="#f5f5f5" fontSize={13} fontWeight={600}>
              {n.value}
            </text>
            {badges?.[id] ? (
              <text x={pos.x} y={pos.y + NODE_R + 14} textAnchor="middle" fill="#86efac" fontSize={9} fontWeight={600}>
                {badges[id]}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

export function TreeDiagram({ diagram }: { diagram: TreeDiagramState }) {
  const {
    nodes,
    rootId,
    secondary,
    highlightIds = [],
    activeIds = [],
    badges,
    label,
  } = diagram;

  const hasSecondary = Boolean(secondary);
  const width = hasSecondary ? 560 : 420;
  const height = 260;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Binary tree diagram">
      {label && !hasSecondary ? (
        <text x={width / 2} y={16} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}
      <TreeCanvas
        nodes={nodes}
        rootId={rootId}
        highlightIds={highlightIds}
        activeIds={activeIds}
        badges={badges}
        label={hasSecondary ? label ?? 'tree A' : undefined}
        offsetX={hasSecondary ? width * 0.25 : width / 2}
      />
      {secondary ? (
        <TreeCanvas
          nodes={secondary.nodes}
          rootId={secondary.rootId}
          highlightIds={highlightIds}
          activeIds={activeIds}
          badges={badges}
          label={secondary.label ?? 'tree B'}
          offsetX={width * 0.75}
        />
      ) : null}
    </svg>
  );
}
