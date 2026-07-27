export type SequenceMessage = {
  from: string;
  to: string;
  label: string;
  invalid?: boolean;
};

export type SequenceDiagramState = {
  kind: 'sequence';
  actors: string[];
  messages: SequenceMessage[];
  selfCalls?: string[];
};

export type ArrayCell = {
  value: number;
  index: number;
};

export type ArrayPointer = {
  name: string;
  index: number;
  color?: 'accent' | 'secondary';
};

export type ArrayDiagramState = {
  kind: 'array';
  cells: ArrayCell[];
  pointers: ArrayPointer[];
  highlightIndices?: number[];
};

export type DiagramState = SequenceDiagramState | ArrayDiagramState;

export type Step = {
  activeLine: number;
  diagram: DiagramState;
  state: Record<string, string | number | null>;
  captionSeed: string;
};

export type Approach = {
  id: string;
  label: string;
  complexity: { time: string; space: string };
  code: string[];
  steps: Step[];
};

export type VisualScriptMeta = {
  eyebrow: string;
  description: string;
  companies: string[];
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  leetcode?: string;
  section: string;
};

export type VisualScript = {
  id: string;
  type: 'dsa' | 'lld';
  title: string;
  meta: VisualScriptMeta;
  approaches: Approach[];
  defaultApproachId?: string;
};

export function getDefaultApproach(script: VisualScript): Approach {
  const id = script.defaultApproachId ?? script.approaches[0]?.id;
  return script.approaches.find((a) => a.id === id) ?? script.approaches[0];
}

export function approachPlayerKey(scriptId: string, approachId: string): string {
  return `${scriptId}::${approachId}`;
}
