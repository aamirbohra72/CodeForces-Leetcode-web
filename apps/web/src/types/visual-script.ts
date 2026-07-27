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
  /** Inclusive sliding-window band (shown behind cells) */
  window?: { start: number; end: number };
};

export type ElevationPointer = {
  name: string;
  index: number;
  color?: 'accent' | 'secondary';
};

/** Vertical bar chart for elevation / rain-water style problems */
export type ElevationDiagramState = {
  kind: 'elevation';
  heights: number[];
  /** Trapped water units sitting on top of each bar */
  waterUnits: number[];
  focusIndices?: number[];
  pointers?: ElevationPointer[];
  /** Horizontal guide lines in height units (brute force / DP walkthrough) */
  guides?: {
    leftMax?: number;
    rightMax?: number;
    waterLevel?: number;
  };
};

/** Container With Most Water — tank fill between two walls */
export type ContainerDiagramState = {
  kind: 'container';
  heights: number[];
  left: number;
  right: number;
  maxArea?: number;
};

/** String / substring sliding window */
export type StringDiagramState = {
  kind: 'string';
  chars: string;
  windowStart?: number;
  windowEnd?: number;
  pointers?: ElevationPointer[];
  duplicateIndex?: number;
};

export type IntervalSegment = {
  start: number;
  end: number;
  label?: string;
  active?: boolean;
  merged?: boolean;
};

/** Merge intervals on a number line */
export type IntervalDiagramState = {
  kind: 'interval';
  intervals: IntervalSegment[];
  result?: IntervalSegment[];
  axisMin?: number;
  axisMax?: number;
};

/** Sliding window maximum — window + monotonic deque */
export type WindowDequeDiagramState = {
  kind: 'windowDeque';
  values: number[];
  windowStart: number;
  windowEnd: number;
  dequeIndices: number[];
  currentMax?: number;
};

export type LinkedListRow = {
  label?: string;
  values: (number | string)[];
};

export type LinkedListPointer = {
  name: string;
  row: number;
  index: number;
  color?: 'accent' | 'secondary';
};

/** Horizontal node chains — supports multiple rows, cycles, highlights */
export type LinkedListDiagramState = {
  kind: 'linkedList';
  rows: LinkedListRow[];
  pointers?: LinkedListPointer[];
  highlight?: { row: number; index: number }[];
  /** Cycle back-edge from last node to toIndex (Floyd / cycle detection) */
  cycle?: { row: number; toIndex: number };
  /** Random pointer arcs (Copy List with Random Pointer) */
  randomLinks?: { row: number; from: number; to: number }[];
};

/** Sorted array binary search with lo / hi / mid */
export type BinarySearchDiagramState = {
  kind: 'binarySearch';
  values: number[];
  lo: number;
  hi: number;
  mid?: number;
  target?: number;
  found?: boolean;
  label?: string;
};

export type TreeNodeSpec = {
  id: string;
  value: number | string;
  left?: string | null;
  right?: string | null;
};

/** Binary tree layout — nodes + edges, optional dual trees */
export type TreeDiagramState = {
  kind: 'tree';
  nodes: TreeNodeSpec[];
  rootId: string;
  /** Optional second tree (Same Tree / Subtree) */
  secondary?: { nodes: TreeNodeSpec[]; rootId: string; label?: string };
  highlightIds?: string[];
  activeIds?: string[];
  /** Visited / level-order queue labels under nodes */
  badges?: Record<string, string>;
  label?: string;
};

/** 2D grid — islands, pathfinding, matrix DP */
export type GridCoord = { row: number; col: number };

export type GridDiagramState = {
  kind: 'grid';
  rows: string[][];
  highlight?: GridCoord[];
  visited?: GridCoord[];
  path?: GridCoord[];
  label?: string;
};

export type GraphNodeSpec = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type GraphEdgeSpec = {
  from: string;
  to: string;
};

/** Fixed-layout graph — BFS / DFS / shortest path */
export type GraphDiagramState = {
  kind: 'graph';
  nodes: GraphNodeSpec[];
  edges: GraphEdgeSpec[];
  visited?: string[];
  active?: string[];
  queue?: string[];
  label?: string;
};

/** DP table with row / column labels */
export type DpTableDiagramState = {
  kind: 'dpTable';
  rowLabels: string[];
  colLabels: string[];
  values: (number | string | null)[][];
  highlight?: GridCoord[];
  label?: string;
};

/** Binary heap as array-backed tree */
export type HeapDiagramState = {
  kind: 'heap';
  values: (number | string)[];
  highlightIndices?: number[];
  label?: string;
};

/** Char / token stack for parentheses & stack problems */
export type StackDiagramState = {
  kind: 'stack';
  /** Character input (parentheses / decode). Prefer values for numeric arrays. */
  input?: string;
  cursor?: number;
  /** Numeric / token array shown as cells (temps, histogram, RPN) */
  values?: (number | string)[];
  stack: string[];
  stackLabel?: string;
  /** Second stack (queue via two stacks, min-stack aux) */
  secondaryStack?: string[];
  secondaryLabel?: string;
  highlightIndices?: number[];
  matched?: boolean;
  invalid?: boolean;
  status?: string;
};

/** UML class diagram — classes, instances, extends/implements */
export type UmlClassBox = {
  id: string;
  name: string;
  stereotype?: 'abstract' | 'interface' | 'instance';
  members: string[];
  x: number;
  y: number;
  highlight?: boolean;
};

export type UmlRelationKind = 'extends' | 'implements' | 'association' | 'aggregation' | 'composition';

export type UmlRelation = {
  from: string;
  to: string;
  kind: UmlRelationKind;
  label?: string;
  highlight?: boolean;
};

export type UmlClassDiagramState = {
  kind: 'umlClass';
  classes: UmlClassBox[];
  relations: UmlRelation[];
  label?: string;
};

/** Finite state machine — states as nodes, transitions as edges */
export type FsmState = { id: string; label: string; x: number; y: number };
export type FsmTransition = { from: string; to: string; label: string; active?: boolean };

export type FsmDiagramState = {
  kind: 'fsm';
  states: FsmState[];
  transitions: FsmTransition[];
  current: string;
  label?: string;
};

/** Singleton — call sites converging on one shared instance */
export type SingletonDiagramState = {
  kind: 'singleton';
  callSites: { label: string }[];
  instance: { label: string; memory: string };
  activeCallIndex?: number;
  label?: string;
};

/** Layered / nested composition — decorator, composite, bridge, proxy */
export type LayerBox = {
  id: string;
  label: string;
  sublabel?: string;
  highlight?: boolean;
  variant?: 'core' | 'wrapper' | 'leaf' | 'branch';
};

export type LayeredDiagramState = {
  kind: 'layered';
  layers: LayerBox[];
  /** Tree edges for composite structures */
  tree?: { parent: string; child: string }[];
  layout?: 'stack' | 'tree' | 'bridge';
  label?: string;
};

/** Fan-out / fan-in — observer, mediator, chain of responsibility */
export type FanOutNode = {
  id: string;
  label: string;
  role: 'source' | 'hub' | 'target' | 'handler';
};

export type FanOutEdge = { from: string; to: string; label?: string; active?: boolean };

export type FanOutDiagramState = {
  kind: 'fanOut';
  nodes: FanOutNode[];
  edges: FanOutEdge[];
  layout: 'broadcast' | 'chain' | 'star';
  label?: string;
};

/** Creation flow — factory, builder, prototype */
export type CreationFlowDiagramState = {
  kind: 'creationFlow';
  recipe: { steps: string[]; activeStep?: number };
  product: { name: string; parts: string[]; built?: boolean };
  label?: string;
};

/** Domain object graph — splitwise, bookmyshow, parking lot */
export type DomainNode = {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  highlight?: boolean;
  diff?: string;
};

export type DomainEdge = { from: string; to: string; label?: string; highlight?: boolean };

export type DomainGraphDiagramState = {
  kind: 'domainGraph';
  nodes: DomainNode[];
  edges: DomainEdge[];
  label?: string;
};

/** Side-by-side principle comparison — cohesion, DRY, etc. */
export type PrinciplePanel = {
  title: string;
  items: string[];
  good?: boolean;
  highlight?: boolean;
};

export type PrincipleCompareState = {
  kind: 'principleCompare';
  left: PrinciplePanel;
  right: PrinciplePanel;
  label?: string;
};

/** Law of Demeter — dot-chain access visualization */
export type AccessChainState = {
  kind: 'accessChain';
  objects: string[];
  activeIndex?: number;
  violation?: boolean;
  label?: string;
};

/** Flyweight — shared intrinsic state pool */
export type FlyweightDiagramState = {
  kind: 'flyweight';
  factory: string;
  shared: { key: string; count: number }[];
  extrinsic: { label: string; key: string; highlight?: boolean }[];
  label?: string;
};

/** Template method — skeleton algorithm with hook steps */
export type TemplateStep = { id: string; label: string; hook?: boolean; active?: boolean; done?: boolean };

export type TemplateMethodState = {
  kind: 'templateMethod';
  steps: TemplateStep[];
  label?: string;
};

/** Iterator — collection with cursor */
export type IteratorDiagramState = {
  kind: 'iterator';
  collection: string[];
  cursor: number;
  current?: string;
  label?: string;
};

export type DiagramState =
  | SequenceDiagramState
  | ArrayDiagramState
  | ElevationDiagramState
  | ContainerDiagramState
  | StringDiagramState
  | IntervalDiagramState
  | WindowDequeDiagramState
  | LinkedListDiagramState
  | BinarySearchDiagramState
  | TreeDiagramState
  | StackDiagramState
  | GridDiagramState
  | GraphDiagramState
  | DpTableDiagramState
  | HeapDiagramState
  | UmlClassDiagramState
  | FsmDiagramState
  | SingletonDiagramState
  | LayeredDiagramState
  | FanOutDiagramState
  | CreationFlowDiagramState
  | DomainGraphDiagramState
  | PrincipleCompareState
  | AccessChainState
  | FlyweightDiagramState
  | TemplateMethodState
  | IteratorDiagramState;

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
