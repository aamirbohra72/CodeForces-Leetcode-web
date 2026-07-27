'use client';

import type { UmlClassDiagramState, UmlRelationKind } from '@/types/visual-script';

const BOX_W = 140;
const HEADER_H = 28;
const LINE_H = 16;

function boxHeight(members: string[]) {
  return HEADER_H + Math.max(members.length, 1) * LINE_H + 8;
}

const ARROW: Record<UmlRelationKind, { stroke: string; dash?: string; marker: string }> = {
  extends: { stroke: '#22c55e', marker: 'uml-extends' },
  implements: { stroke: '#38bdf8', dash: '6 4', marker: 'uml-implements' },
  association: { stroke: 'rgba(255,255,255,0.35)', marker: 'uml-arrow' },
  aggregation: { stroke: '#f59e0b', marker: 'uml-diamond-empty' },
  composition: { stroke: '#f87171', marker: 'uml-diamond-full' },
};

export function UmlClassDiagram({ diagram }: { diagram: UmlClassDiagramState }) {
  const { classes, relations, label } = diagram;
  const byId = new Map(classes.map((c) => [c.id, c]));

  let maxX = 420;
  let maxY = 260;
  for (const c of classes) {
    maxX = Math.max(maxX, c.x + BOX_W + 20);
    maxY = Math.max(maxY, c.y + boxHeight(c.members) + 20);
  }

  return (
    <svg viewBox={`0 0 ${maxX} ${maxY}`} className="h-full w-full max-h-[320px]" role="img" aria-label="UML class diagram">
      <defs>
        <marker id="uml-extends" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M2 2 L10 6 L2 10 L4 6 Z" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </marker>
        <marker id="uml-implements" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
        </marker>
        <marker id="uml-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.5)" />
        </marker>
        <marker id="uml-diamond-empty" viewBox="0 0 14 10" refX="12" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        </marker>
        <marker id="uml-diamond-full" viewBox="0 0 14 10" refX="12" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 5 L5 0 L10 5 L5 10 Z" fill="#f87171" stroke="#f87171" />
        </marker>
      </defs>

      {label ? (
        <text x={12} y={16} fill="rgba(255,255,255,0.5)" fontSize={11} fontWeight={600}>
          {label}
        </text>
      ) : null}

      {relations.map((rel, i) => {
        const from = byId.get(rel.from);
        const to = byId.get(rel.to);
        if (!from || !to) return null;
        const fromH = boxHeight(from.members);
        const x1 = from.x + BOX_W / 2;
        const y1 = from.y + fromH;
        const x2 = to.x + BOX_W / 2;
        const y2 = to.y;
        const style = ARROW[rel.kind];
        const hot = rel.highlight;
        return (
          <g key={`rel-${i}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={hot ? style.stroke : `${style.stroke}88`}
              strokeWidth={hot ? 2.5 : 1.5}
              strokeDasharray={style.dash}
              markerEnd={`url(#${style.marker})`}
            />
            {rel.label ? (
              <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2} fill="rgba(255,255,255,0.55)" fontSize={10}>
                {rel.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {classes.map((cls) => {
        const h = boxHeight(cls.members);
        const isInstance = cls.stereotype === 'instance';
        const isAbstract = cls.stereotype === 'abstract';
        const isInterface = cls.stereotype === 'interface';
        const stroke = cls.highlight ? '#22c55e' : 'rgba(255,255,255,0.22)';
        const fill = cls.highlight ? 'rgba(34,197,94,0.12)' : isInstance ? '#1e293b' : '#242424';

        return (
          <g key={cls.id}>
            <rect
              x={cls.x}
              y={cls.y}
              width={BOX_W}
              height={h}
              rx={isInstance ? 20 : 6}
              fill={fill}
              stroke={stroke}
              strokeWidth={cls.highlight ? 2 : 1.5}
              strokeDasharray={isAbstract || isInterface ? '5 3' : undefined}
            />
            {isInterface ? (
              <text x={cls.x + BOX_W / 2} y={cls.y + 12} textAnchor="middle" fill="#7dd3fc" fontSize={9} fontStyle="italic">
                «interface»
              </text>
            ) : isAbstract ? (
              <text x={cls.x + BOX_W / 2} y={cls.y + 12} textAnchor="middle" fill="#fbbf24" fontSize={9} fontStyle="italic">
                «abstract»
              </text>
            ) : isInstance ? (
              <text x={cls.x + BOX_W / 2} y={cls.y + 12} textAnchor="middle" fill="#a5b4fc" fontSize={9}>
                :{cls.name}
              </text>
            ) : null}
            <text
              x={cls.x + BOX_W / 2}
              y={cls.y + (isInstance ? 24 : isAbstract || isInterface ? 24 : 18)}
              textAnchor="middle"
              fill="#f5f5f5"
              fontSize={13}
              fontWeight={600}
              fontStyle={isAbstract ? 'italic' : undefined}
            >
              {isInstance ? cls.name : cls.name}
            </text>
            <line x1={cls.x} y1={cls.y + HEADER_H + (isInstance ? 8 : 0)} x2={cls.x + BOX_W} y2={cls.y + HEADER_H + (isInstance ? 8 : 0)} stroke="rgba(255,255,255,0.15)" />
            {cls.members.map((m, i) => (
              <text
                key={m}
                x={cls.x + 8}
                y={cls.y + HEADER_H + 14 + i * LINE_H + (isInstance ? 8 : 0)}
                fill="rgba(255,255,255,0.7)"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
              >
                {m}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
