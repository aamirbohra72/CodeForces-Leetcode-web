'use client';

import type { Step } from '@/types/visual-script';
import { ArrayDiagram } from './ArrayDiagram';
import { SequenceDiagram } from './SequenceDiagram';
import { cn } from '@/lib/cn';

type DiagramRendererProps = {
  step: Step;
  className?: string;
};

export function DiagramRenderer({ step, className }: DiagramRendererProps) {
  const { diagram } = step;

  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#101010] p-3',
        className,
      )}
    >
      {diagram.kind === 'sequence' ? (
        <SequenceDiagram diagram={diagram} />
      ) : (
        <ArrayDiagram diagram={diagram} />
      )}
    </div>
  );
}
