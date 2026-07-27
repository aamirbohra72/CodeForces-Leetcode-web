'use client';

import type { SequenceDiagramState } from '@/types/visual-script';

type SequenceDiagramProps = {
  diagram: SequenceDiagramState;
};

const ACTOR_W = 160;
const LEFT_PAD = 48;
const TOP = 28;
const LIFELINE_TOP = 78;
const MSG_START_Y = 110;
const MSG_GAP = 56;
const SELF_CALL_H = 34;

function StickFigure({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} stroke="#e5e5e5" strokeWidth={1.6} fill="none">
      <circle cx={0} cy={-28} r={8} />
      <line x1={0} y1={-20} x2={0} y2={0} />
      <line x1={0} y1={-12} x2={-12} y2={-2} />
      <line x1={0} y1={-12} x2={12} y2={-2} />
      <line x1={0} y1={0} x2={-10} y2={16} />
      <line x1={0} y1={0} x2={10} y2={16} />
    </g>
  );
}

export function SequenceDiagram({ diagram }: SequenceDiagramProps) {
  const { actors, messages, selfCalls = [] } = diagram;
  const width = Math.max(380, LEFT_PAD * 2 + actors.length * ACTOR_W);
  const messageBlockH =
    messages.length * MSG_GAP + (selfCalls.length > 0 ? SELF_CALL_H + 20 : 0);
  const height = Math.max(240, MSG_START_Y + messageBlockH + 36);

  const actorX = (i: number) => LEFT_PAD + ACTOR_W / 2 + i * ACTOR_W;
  const actorIndex = (name: string) => {
    const idx = actors.indexOf(name);
    return idx >= 0 ? idx : 0;
  };

  const isPerson = (name: string) =>
    /client|caller|user|actor/i.test(name);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full max-h-[320px]"
      role="img"
      aria-label="Sequence diagram"
    >
      <defs>
        <marker
          id="arrow-ok"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
        </marker>
        <marker
          id="arrow-invalid"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
        </marker>
        <marker
          id="arrow-self"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
        </marker>
      </defs>

      {actors.map((actor, i) => {
        const cx = actorX(i);
        const person = isPerson(actor);
        return (
          <g key={actor}>
            {person ? (
              <StickFigure x={cx} y={TOP + 20} />
            ) : (
              <rect
                x={cx - 58}
                y={TOP}
                width={116}
                height={36}
                rx={8}
                fill="#2a2a2a"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1}
              />
            )}
            <text
              x={cx}
              y={person ? TOP + 52 : TOP + 23}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize={13}
              fontWeight={500}
            >
              {actor}
            </text>
            <line
              x1={cx}
              y1={LIFELINE_TOP}
              x2={cx}
              y2={height - 14}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.5}
              strokeDasharray="4 6"
            />
          </g>
        );
      })}

      {messages.map((msg, i) => {
        const fromX = actorX(actorIndex(msg.from));
        const toX = actorX(actorIndex(msg.to));
        const y = MSG_START_Y + i * MSG_GAP;
        const goingRight = toX >= fromX;
        const stroke = msg.invalid ? '#f87171' : '#22c55e';
        const markerId = msg.invalid ? 'arrow-invalid' : 'arrow-ok';

        return (
          <g key={`msg-${i}`}>
            <line
              x1={fromX + (goingRight ? 10 : -10)}
              y1={y}
              x2={toX + (goingRight ? -12 : 12)}
              y2={y}
              stroke={stroke}
              strokeWidth={2}
              markerEnd={`url(#${markerId})`}
            />
            <text
              x={(fromX + toX) / 2}
              y={y - 10}
              textAnchor="middle"
              fill={msg.invalid ? '#fca5a5' : '#86efac'}
              fontSize={12}
            >
              {msg.label}
            </text>
          </g>
        );
      })}

      {selfCalls.map((label, i) => {
        const targetName =
          actors.find((a) => !isPerson(a)) ?? actors[actors.length - 1];
        const cx = actorX(actorIndex(targetName));
        const y = MSG_START_Y + messages.length * MSG_GAP + i * (SELF_CALL_H + 14);

        return (
          <g key={`self-${i}`}>
            <path
              d={`M ${cx} ${y} C ${cx + 42} ${y}, ${cx + 42} ${y + SELF_CALL_H}, ${cx} ${y + SELF_CALL_H}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              markerEnd="url(#arrow-self)"
            />
            <text x={cx + 50} y={y + SELF_CALL_H / 2 + 4} fill="#7dd3fc" fontSize={12}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
