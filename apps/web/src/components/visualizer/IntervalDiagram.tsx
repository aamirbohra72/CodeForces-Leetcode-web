'use client';

import type { IntervalDiagramState, IntervalSegment } from '@/types/visual-script';

const ROW_H = 36;
const TOP = 40;
const LEFT = 48;
const RIGHT_PAD = 48;

function axisBounds(intervals: IntervalSegment[], result?: IntervalSegment[]) {
  const all = [...intervals, ...(result ?? [])];
  const min = Math.min(...all.map((x) => x.start), 0);
  const max = Math.max(...all.map((x) => x.end), 1);
  return { min, max: max + 2 };
}

export function IntervalDiagram({ diagram }: { diagram: IntervalDiagramState }) {
  const { intervals, result, axisMin, axisMax } = diagram;
  const bounds = {
    min: axisMin ?? axisBounds(intervals, result).min,
    max: axisMax ?? axisBounds(intervals, result).max,
  };
  const span = bounds.max - bounds.min || 1;
  const width = 520;
  const resultRow = result && result.length > 0;
  const height = TOP + intervals.length * ROW_H + (resultRow ? ROW_H + 36 : 0) + 40;

  const xAt = (v: number) => LEFT + ((v - bounds.min) / span) * (width - LEFT - RIGHT_PAD);

  const renderBar = (seg: IntervalSegment, y: number, merged: boolean) => {
    const x1 = xAt(seg.start);
    const x2 = xAt(seg.end);
    const w = Math.max(x2 - x1, 4);
    const stroke = seg.active ? '#f59e0b' : merged ? '#22c55e' : '#38bdf8';
    const fill = seg.active ? 'rgba(245,158,11,0.25)' : merged ? 'rgba(34,197,94,0.2)' : 'rgba(56,189,248,0.18)';

    return (
      <g key={`${seg.start}-${seg.end}-${y}`}>
        <rect x={x1} y={y} width={w} height={22} rx={5} fill={fill} stroke={stroke} strokeWidth={seg.active ? 2.5 : 1.5} />
        <text x={x1 + 6} y={y + 15} fill="rgba(255,255,255,0.85)" fontSize={11} fontWeight={600}>
          [{seg.start},{seg.end}]{seg.label ? ` ${seg.label}` : ''}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full max-h-[280px]" role="img" aria-label="Interval timeline">
      {/* axis */}
      <line x1={LEFT} y1={height - 28} x2={width - RIGHT_PAD} y2={height - 28} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
      {[bounds.min, Math.floor((bounds.min + bounds.max) / 2), bounds.max].map((tick) => (
        <g key={tick}>
          <line x1={xAt(tick)} y1={height - 28} x2={xAt(tick)} y2={height - 22} stroke="rgba(255,255,255,0.3)" />
          <text x={xAt(tick)} y={height - 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10}>
            {tick}
          </text>
        </g>
      ))}

      <text x={LEFT} y={24} fill="rgba(255,255,255,0.45)" fontSize={11} fontWeight={600}>
        {resultRow ? 'input intervals' : 'intervals'}
      </text>

      {intervals.map((seg, i) => renderBar(seg, TOP + i * ROW_H, Boolean(seg.merged)))}

      {resultRow ? (
        <>
          <text x={LEFT} y={TOP + intervals.length * ROW_H + 16} fill="rgba(34,197,94,0.85)" fontSize={11} fontWeight={600}>
            merged result
          </text>
          {result!.map((seg, i) => renderBar({ ...seg, active: false }, TOP + intervals.length * ROW_H + 24 + i * ROW_H, true))}
        </>
      ) : null}
    </svg>
  );
}
