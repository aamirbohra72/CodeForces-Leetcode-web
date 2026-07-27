import {
  domainStep,
  fanOutStep,
  fsmStep,
  iteratorStep,
  script,
  seqStep,
  templateStep,
  umlStep,
} from './helpers';

const strategy = script(
  'lld-behavioral-strategy',
  'Strategy',
  'Behavioral Patterns',
  'Define a family of algorithms, encapsulate each, and make them interchangeable at runtime.',
  ['interface SortStrategy { sort(data) }', 'context.setStrategy(new QuickSort())', 'context.sort(arr)'],
  [
    umlStep(1, [{ id: 'ctx', name: 'Sorter', members: ['- strategy'], x: 80, y: 40, highlight: true }, { id: 'iface', name: 'SortStrategy', stereotype: 'interface', members: ['+ sort()'], x: 260, y: 40 }, { id: 'quick', name: 'QuickSort', members: ['+ sort()'], x: 200, y: 150, highlight: true }], [{ from: 'ctx', to: 'iface', kind: 'association' }, { from: 'quick', to: 'iface', kind: 'implements', highlight: true }], { algo: 'QuickSort' }, 'Sorter delegates to SortStrategy — algorithm is pluggable.'),
    umlStep(3, [{ id: 'ctx', name: 'Sorter', members: ['- strategy'], x: 80, y: 40, highlight: true }, { id: 'iface', name: 'SortStrategy', stereotype: 'interface', members: ['+ sort()'], x: 260, y: 40 }, { id: 'merge', name: 'MergeSort', members: ['+ sort()'], x: 200, y: 150, highlight: true }], [{ from: 'merge', to: 'iface', kind: 'implements', highlight: true }], { swap: 'MergeSort' }, 'setStrategy(new MergeSort()) at runtime — no Sorter code changes.'),
  ],
);

const observer = script(
  'lld-behavioral-observer',
  'Observer',
  'Behavioral Patterns',
  'Define a one-to-many dependency — when subject state changes, all observers are notified automatically.',
  ['subject.attach(observer)', 'subject.setPrice(99)', '// all observers notified'],
  [
    fanOutStep(1, [{ id: 'subj', label: 'Stock', role: 'source' }, { id: 'ui', label: 'UI', role: 'target' }, { id: 'alert', label: 'Alert', role: 'target' }, { id: 'log', label: 'Logger', role: 'target' }], [], 'broadcast', { attached: 3 }, 'Stock subject maintains a list of observers.', 'Subscribe'),
    fanOutStep(2, [{ id: 'subj', label: 'Stock', role: 'source' }, { id: 'ui', label: 'UI', role: 'target' }, { id: 'alert', label: 'Alert', role: 'target' }, { id: 'log', label: 'Logger', role: 'target' }], [{ from: 'subj', to: 'ui', label: 'price=99', active: true }], 'broadcast', { event: 'price change' }, 'setPrice(99) — first observer UI receives update (one active edge per step).'),
    fanOutStep(3, [{ id: 'subj', label: 'Stock', role: 'source' }, { id: 'ui', label: 'UI', role: 'target' }, { id: 'alert', label: 'Alert', role: 'target' }, { id: 'log', label: 'Logger', role: 'target' }], [{ from: 'subj', to: 'alert', label: 'price=99', active: true }, { from: 'subj', to: 'log', label: 'price=99', active: true }], 'broadcast', { all: 'notified' }, 'Alert and Logger notified next — subject broadcasts without knowing observer details.'),
  ],
);

const state = script(
  'lld-behavioral-state',
  'State',
  'Behavioral Patterns',
  'Let an object alter its behavior when its internal state changes — looks like the object changed class.',
  ['class VendingMachine {', '  state: State', '  insertCoin() { state.insertCoin() }', '}'],
  [
    fsmStep(1, [{ id: 'idle', label: 'Idle', x: 40, y: 80 }, { id: 'hasCoin', label: 'HasCoin', x: 180, y: 80 }, { id: 'dispense', label: 'Dispensing', x: 320, y: 80 }], [{ from: 'idle', to: 'hasCoin', label: 'insertCoin', active: true }], 'idle', { action: 'insertCoin' }, 'VendingMachine starts Idle — insertCoin transitions to HasCoin.'),
    fsmStep(2, [{ id: 'idle', label: 'Idle', x: 40, y: 80 }, { id: 'hasCoin', label: 'HasCoin', x: 180, y: 80 }, { id: 'dispense', label: 'Dispensing', x: 320, y: 80 }], [{ from: 'hasCoin', to: 'dispense', label: 'selectItem', active: true }], 'hasCoin', { action: 'selectItem' }, 'selectItem moves to Dispensing — behavior delegated to current State object.'),
    fsmStep(3, [{ id: 'idle', label: 'Idle', x: 40, y: 80 }, { id: 'hasCoin', label: 'HasCoin', x: 180, y: 80 }, { id: 'dispense', label: 'Dispensing', x: 320, y: 80 }], [{ from: 'dispense', to: 'idle', label: 'done', active: true }], 'dispense', { action: 'dispense' }, 'After dispensing, state returns to Idle — no giant if/else in the machine.'),
  ],
);

const command = script(
  'lld-behavioral-command',
  'Command',
  'Behavioral Patterns',
  'Encapsulate a request as an object — parameterize, queue, log, and undo operations.',
  ['interface Command { execute(); undo() }', 'remote.pressButton(cmd)', 'history.push(cmd)'],
  [
    seqStep(1, ['Remote', 'LightOnCmd', 'Light'], [{ from: 'Remote', to: 'LightOnCmd', label: 'execute()' }, { from: 'LightOnCmd', to: 'Light', label: 'on()' }], { state: 'on' }, 'Remote invokes Command object — request is encapsulated, not a direct method call.'),
    seqStep(2, ['Remote', 'History', 'LightOffCmd'], [{ from: 'Remote', to: 'History', label: 'push(cmd)' }, { from: 'Remote', to: 'LightOffCmd', label: 'execute()' }], { queued: 'yes' }, 'Commands can be stored in history for undo/redo or macro sequences.'),
    seqStep(3, ['Remote', 'LightOnCmd', 'Light'], [{ from: 'Remote', to: 'LightOnCmd', label: 'undo()' }, { from: 'LightOnCmd', to: 'Light', label: 'off()' }], { state: 'off' }, 'undo() reverses the last command — LightOnCmd knows how to roll back.'),
  ],
);

const chainOfResponsibility = script(
  'lld-behavioral-chain-of-responsibility',
  'Chain of Responsibility',
  'Behavioral Patterns',
  'Pass a request along a chain of handlers — each decides to process or forward.',
  ['auth → rateLimit → cache → handler', 'request flows until someone handles it'],
  [
    fanOutStep(1, [{ id: 'req', label: 'Request', role: 'source' }, { id: 'auth', label: 'Auth', role: 'handler' }, { id: 'rate', label: 'RateLimit', role: 'handler' }, { id: 'cache', label: 'Cache', role: 'handler' }, { id: 'api', label: 'Handler', role: 'target' }], [{ from: 'req', to: 'auth', label: 'check', active: true }], 'chain', { step: 1 }, 'Request hits Auth first — validates token.', 'Chain start'),
    fanOutStep(2, [{ id: 'auth', label: 'Auth ✓', role: 'handler' }, { id: 'rate', label: 'RateLimit', role: 'handler' }, { id: 'cache', label: 'Cache', role: 'handler' }, { id: 'api', label: 'Handler', role: 'target' }], [{ from: 'auth', to: 'rate', label: 'forward', active: true }], 'chain', { step: 2 }, 'Auth passes through → RateLimit checks quota.'),
    fanOutStep(3, [{ id: 'rate', label: 'RateLimit ✓', role: 'handler' }, { id: 'cache', label: 'Cache HIT', role: 'handler' }, { id: 'api', label: 'Handler', role: 'target' }], [{ from: 'cache', to: 'req', label: 'response', active: true }], 'chain', { hit: 'cache' }, 'Cache returns response — Handler never reached. Chain stops at first handler that resolves.'),
  ],
);

const templateMethod = script(
  'lld-behavioral-template-method',
  'Template Method',
  'Behavioral Patterns',
  'Define the skeleton of an algorithm in a base class, letting subclasses override specific steps.',
  ['abstract class DataParser {', '  parse() { open(); read(); close() }', '  abstract read()', '}'],
  [
    templateStep(1, [{ id: '1', label: 'open()', active: true }, { id: '2', label: 'read()', hook: true }, { id: '3', label: 'close()' }], { step: 'open' }, 'Template defines fixed skeleton — open() runs first.', 'Skeleton'),
    templateStep(2, [{ id: '1', label: 'open()', done: true }, { id: '2', label: 'read() — CSV', hook: true, active: true }, { id: '3', label: 'close()' }], { subclass: 'CSVParser' }, 'CSVParser overrides read() hook — JSONParser would differ only here.'),
    templateStep(3, [{ id: '1', label: 'open()', done: true }, { id: '2', label: 'read() — CSV', done: true }, { id: '3', label: 'close()', active: true }], { invariant: 'order fixed' }, 'close() always runs last — invariant steps cannot be skipped by subclasses.'),
  ],
);

const iterator = script(
  'lld-behavioral-iterator',
  'Iterator',
  'Behavioral Patterns',
  'Provide sequential access to collection elements without exposing internal representation.',
  ['for (const x of collection) { }', 'iterator = list.iterator()', 'while (iter.hasNext()) iter.next()'],
  [
    iteratorStep(1, ['A', 'B', 'C', 'D'], 0, { pos: 0 }, 'Iterator starts at index 0 — collection internals hidden.', 'A', 'Traversal'),
    iteratorStep(2, ['A', 'B', 'C', 'D'], 1, { pos: 1 }, 'next() advances cursor, returns current element.', 'B'),
    iteratorStep(3, ['A', 'B', 'C', 'D'], 3, { pos: 3 }, 'hasNext() false at end — same interface for ArrayList, LinkedList, Tree.', 'D'),
  ],
);

const mediator = script(
  'lld-behavioral-mediator',
  'Mediator',
  'Behavioral Patterns',
  'Define an object that encapsulates how a set of objects interact — colleagues talk through the mediator, not each other.',
  ['chatRoom.send(msg, from, to)', '// users never reference each other directly'],
  [
    fanOutStep(1, [{ id: 'alice', label: 'Alice', role: 'target' }, { id: 'bob', label: 'Bob', role: 'target' }, { id: 'carol', label: 'Carol', role: 'target' }], [], 'star', { problem: 'mesh' }, 'Without mediator: N users → N² connections. Tight coupling everywhere.'),
    fanOutStep(2, [{ id: 'alice', label: 'Alice', role: 'target' }, { id: 'med', label: 'ChatRoom', role: 'hub' }, { id: 'bob', label: 'Bob', role: 'target' }], [{ from: 'alice', to: 'med', label: 'hi Bob', active: true }], 'star', { via: 'mediator' }, 'Alice sends to ChatRoom mediator — not directly to Bob.'),
    fanOutStep(3, [{ id: 'med', label: 'ChatRoom', role: 'hub' }, { id: 'bob', label: 'Bob', role: 'target' }], [{ from: 'med', to: 'bob', label: 'deliver', active: true }], 'star', { routed: 'yes' }, 'Mediator routes message to Bob — colleagues stay decoupled.'),
  ],
);

const memento = script(
  'lld-behavioral-memento',
  'Memento',
  'Behavioral Patterns',
  'Capture and externalize an object\'s internal state so it can be restored later — undo without breaking encapsulation.',
  ['originator.createMemento()', 'caretaker.save(memento)', 'originator.restore(memento)'],
  [
    domainStep(1, [{ id: 'orig', label: 'Editor', type: 'Originator', x: 40, y: 60, highlight: true }, { id: 'care', label: 'History', type: 'Caretaker', x: 200, y: 60 }, { id: 'mem', label: 'Memento', type: 'Snapshot', x: 360, y: 60 }], [{ from: 'orig', to: 'mem', label: 'createMemento()' }], { text: 'Hello World' }, 'Editor creates Memento with internal text snapshot.'),
    domainStep(2, [{ id: 'orig', label: 'Editor', type: 'Originator', x: 40, y: 60 }, { id: 'care', label: 'History', type: 'Caretaker', x: 200, y: 60, highlight: true }, { id: 'mem', label: 'v1: "Hello"', type: 'Snapshot', x: 360, y: 60, highlight: true }], [{ from: 'orig', to: 'mem', label: 'save' }, { from: 'care', to: 'mem', label: 'stores', highlight: true }], { saved: 'yes' }, 'Caretaker stores memento — cannot read or modify Editor internals.'),
    domainStep(3, [{ id: 'orig', label: 'Editor', type: 'Originator', x: 40, y: 60, highlight: true, diff: 'restored' }, { id: 'care', label: 'History', type: 'Caretaker', x: 200, y: 60 }, { id: 'mem', label: 'v1: "Hello"', type: 'Snapshot', x: 360, y: 60, highlight: true }], [{ from: 'care', to: 'orig', label: 'restore()', highlight: true }], { text: 'Hello' }, 'restore(memento) rolls back — undo without exposing private fields.'),
  ],
);

const visitor = script(
  'lld-behavioral-visitor',
  'Visitor',
  'Behavioral Patterns',
  'Add new operations to object structure without changing element classes — double dispatch.',
  ['element.accept(visitor)', 'visitor.visitCircle(c)', 'visitor.visitSquare(s)'],
  [
    fanOutStep(1, [{ id: 'doc', label: 'Document', role: 'source' }, { id: 'circle', label: 'Circle', role: 'target' }, { id: 'square', label: 'Square', role: 'target' }], [{ from: 'doc', to: 'circle', label: 'accept()', active: true }], 'broadcast', { dispatch: 1 }, 'Document traverses shapes — each calls accept(visitor).'),
    fanOutStep(2, [{ id: 'export', label: 'ExportVisitor', role: 'hub' }, { id: 'circle', label: 'Circle', role: 'target' }], [{ from: 'circle', to: 'export', label: 'visitCircle()', active: true }], 'star', { op: 'export SVG' }, 'Double dispatch: Circle.accept → visitor.visitCircle — operation lives in visitor.'),
    fanOutStep(3, [{ id: 'export', label: 'ExportVisitor', role: 'hub' }, { id: 'square', label: 'Square', role: 'target' }], [{ from: 'square', to: 'export', label: 'visitSquare()', active: true }], 'star', { op: 'export SVG' }, 'Add AreaVisitor without editing Circle or Square — new visitor class only.'),
  ],
);

export const BEHAVIORAL_SCRIPTS = {
  'lld-behavioral-strategy': strategy,
  'lld-behavioral-observer': observer,
  'lld-behavioral-state': state,
  'lld-behavioral-command': command,
  'lld-behavioral-chain-of-responsibility': chainOfResponsibility,
  'lld-behavioral-template-method': templateMethod,
  'lld-behavioral-iterator': iterator,
  'lld-behavioral-mediator': mediator,
  'lld-behavioral-memento': memento,
  'lld-behavioral-visitor': visitor,
};
