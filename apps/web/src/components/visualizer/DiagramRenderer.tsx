'use client';

import type { Step } from '@/types/visual-script';
import { ArrayDiagram } from './ArrayDiagram';
import { BinarySearchDiagram } from './BinarySearchDiagram';
import { ContainerDiagram } from './ContainerDiagram';
import { DpTableDiagram } from './DpTableDiagram';
import { ElevationDiagram } from './ElevationDiagram';
import { GraphDiagram } from './GraphDiagram';
import { GridDiagram } from './GridDiagram';
import { HeapDiagram } from './HeapDiagram';
import { IntervalDiagram } from './IntervalDiagram';
import { LinkedListDiagram } from './LinkedListDiagram';
import { SequenceDiagram } from './SequenceDiagram';
import { StackDiagram } from './StackDiagram';
import { StringDiagram } from './StringDiagram';
import { TreeDiagram } from './TreeDiagram';
import { WindowDequeDiagram } from './WindowDequeDiagram';
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
      ) : diagram.kind === 'elevation' ? (
        <ElevationDiagram diagram={diagram} />
      ) : diagram.kind === 'container' ? (
        <ContainerDiagram diagram={diagram} />
      ) : diagram.kind === 'string' ? (
        <StringDiagram diagram={diagram} />
      ) : diagram.kind === 'interval' ? (
        <IntervalDiagram diagram={diagram} />
      ) : diagram.kind === 'windowDeque' ? (
        <WindowDequeDiagram diagram={diagram} />
      ) : diagram.kind === 'linkedList' ? (
        <LinkedListDiagram diagram={diagram} />
      ) : diagram.kind === 'binarySearch' ? (
        <BinarySearchDiagram diagram={diagram} />
      ) : diagram.kind === 'tree' ? (
        <TreeDiagram diagram={diagram} />
      ) : diagram.kind === 'stack' ? (
        <StackDiagram diagram={diagram} />
      ) : diagram.kind === 'grid' ? (
        <GridDiagram diagram={diagram} />
      ) : diagram.kind === 'graph' ? (
        <GraphDiagram diagram={diagram} />
      ) : diagram.kind === 'dpTable' ? (
        <DpTableDiagram diagram={diagram} />
      ) : diagram.kind === 'heap' ? (
        <HeapDiagram diagram={diagram} />
      ) : (
        <ArrayDiagram diagram={diagram} />
      )}
    </div>
  );
}
