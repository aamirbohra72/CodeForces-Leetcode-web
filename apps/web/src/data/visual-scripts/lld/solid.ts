import { script, seqStep, umlStep } from './helpers';

const singleResponsibility = script(
  'lld-solid-single-responsibility-s',
  'Single Responsibility (S)',
  'SOLID Principles',
  'A class should have one reason to change — one job, one axis of responsibility.',
  [
    'class Report {',
    '  generate() { /* data */ }',
    '  saveToDb() { /* persistence */ }',
    '  sendEmail() { /* delivery */ }',
    '}',
    '// Split: ReportGenerator, ReportRepository, EmailService',
  ],
  [
    seqStep(
      3,
      ['Client', 'Report'],
      [{ from: 'Client', to: 'Report', label: 'generate() + save() + email()' }],
      { reasons: 3 },
      'One Report class does formatting, DB, and email — three reasons to change.',
      ['format', 'INSERT', 'SMTP'],
    ),
    umlStep(
      5,
      [
        { id: 'gen', name: 'ReportGenerator', members: ['+ generate()'], x: 30, y: 60, highlight: true },
        { id: 'repo', name: 'ReportRepository', members: ['+ save()'], x: 170, y: 60, highlight: true },
        { id: 'mail', name: 'EmailService', members: ['+ send()'], x: 310, y: 60, highlight: true },
      ],
      [],
      { reasons: 1 },
      'Split into three classes — each has exactly one reason to change.',
      'One job per class',
    ),
    seqStep(
      2,
      ['Client', 'Generator', 'Repository', 'Email'],
      [
        { from: 'Client', to: 'Generator', label: 'generate()' },
        { from: 'Client', to: 'Repository', label: 'save()' },
        { from: 'Client', to: 'Email', label: 'send()' },
      ],
      { cohesion: 'high' },
      'Client orchestrates, but each service owns a single concern.',
    ),
  ],
);

const openClosed = script(
  'lld-solid-openclosed-o',
  'Open/Closed (O)',
  'SOLID Principles',
  'Open for extension, closed for modification — add behavior via new types, not by editing existing code.',
  [
    'interface Discount { apply(total) }',
    'class PercentOff implements Discount { }',
    'class FlatOff implements Discount { }',
    '// Checkout unchanged when adding new discount',
  ],
  [
    umlStep(
      1,
      [
        { id: 'checkout', name: 'Checkout', members: ['+ total(d: Discount)'], x: 140, y: 40, highlight: true },
        { id: 'disc', name: 'Discount', stereotype: 'interface', members: ['+ apply()'], x: 140, y: 140 },
      ],
      [{ from: 'checkout', to: 'disc', kind: 'association' }],
      { state: 'closed for modification' },
      'Checkout.total() is stable — we never edit it to add promotions.',
    ),
    umlStep(
      3,
      [
        { id: 'checkout', name: 'Checkout', members: ['+ total(d: Discount)'], x: 140, y: 30 },
        { id: 'disc', name: 'Discount', stereotype: 'interface', members: ['+ apply()'], x: 140, y: 120 },
        { id: 'pct', name: 'PercentOff', members: ['+ apply()'], x: 40, y: 210, highlight: true },
        { id: 'flat', name: 'FlatOff', members: ['+ apply()'], x: 240, y: 210 },
      ],
      [
        { from: 'pct', to: 'disc', kind: 'implements', highlight: true },
        { from: 'flat', to: 'disc', kind: 'implements' },
      ],
      { extension: 'new class' },
      'Add PercentOff by creating a new class — open for extension, closed for modification.',
    ),
  ],
);

const liskov = script(
  'lld-solid-liskov-substitution-l',
  'Liskov Substitution (L)',
  'SOLID Principles',
  'Subtypes must be substitutable for their base type without breaking expectations.',
  [
    'class Rectangle { setW(); setH() }',
    'class Square extends Rectangle {',
    '  setW(w) { w=h=w }  // breaks LSP',
    '}',
  ],
  [
    umlStep(
      1,
      [
        { id: 'rect', name: 'Rectangle', members: ['+ setWidth()', '+ setHeight()', '+ area()'], x: 80, y: 40, highlight: true },
        { id: 'sq', name: 'Square', members: ['+ setWidth() override', '+ setHeight() override'], x: 80, y: 160, highlight: true },
      ],
      [{ from: 'sq', to: 'rect', kind: 'extends', highlight: true }],
      { expect: 'independent w, h' },
      'Client expects Rectangle: set width and height independently.',
    ),
    seqStep(
      3,
      ['Client', 'Square'],
      [{ from: 'Client', to: 'Square', label: 'setW(5); setH(10)', invalid: true }],
      { area: 100, expected: 50 },
      'Square forces w=h — substituting Square for Rectangle breaks area() expectations. LSP violated.',
      ['setW → w=h=5', 'setH ignored'],
    ),
    umlStep(
      5,
      [
        { id: 'shape', name: 'Shape', stereotype: 'abstract', members: ['+ area()'], x: 140, y: 40, highlight: true },
        { id: 'rect', name: 'Rectangle', members: ['+ setW/H', '+ area()'], x: 60, y: 150 },
        { id: 'sq', name: 'Square', members: ['+ setSide()', '+ area()'], x: 220, y: 150, highlight: true },
      ],
      [
        { from: 'rect', to: 'shape', kind: 'extends' },
        { from: 'sq', to: 'shape', kind: 'extends' },
      ],
      { fix: 'separate contracts' },
      'Fix: both extend Shape but Square does not inherit Rectangle\'s setW/setH contract.',
    ),
  ],
);

const interfaceSegregation = script(
  'lld-solid-interface-segregation-i',
  'Interface Segregation (I)',
  'SOLID Principles',
  'Clients should not depend on methods they do not use — split fat interfaces into focused ones.',
  [
    'interface Worker { work(); eat(); sleep() }',
    '// Robot forced to implement eat(), sleep()',
    'interface Workable { work() }',
    'interface Feedable { eat() }',
  ],
  [
    umlStep(
      1,
      [
        { id: 'worker', name: 'Worker', stereotype: 'interface', members: ['+ work()', '+ eat()', '+ sleep()'], x: 140, y: 40, highlight: true },
        { id: 'robot', name: 'Robot', members: ['+ work()', 'eat() ???', 'sleep() ???'], x: 140, y: 160, highlight: true },
      ],
      [{ from: 'robot', to: 'worker', kind: 'implements' }],
      { problem: 'fat interface' },
      'Robot must stub eat() and sleep() — forced dependency on unused methods.',
    ),
    umlStep(
      4,
      [
        { id: 'work', name: 'Workable', stereotype: 'interface', members: ['+ work()'], x: 60, y: 50, highlight: true },
        { id: 'feed', name: 'Feedable', stereotype: 'interface', members: ['+ eat()'], x: 220, y: 50, highlight: true },
        { id: 'human', name: 'Human', members: ['+ work()', '+ eat()'], x: 60, y: 160 },
        { id: 'robot', name: 'Robot', members: ['+ work() only'], x: 220, y: 160, highlight: true },
      ],
      [
        { from: 'human', to: 'work', kind: 'implements' },
        { from: 'human', to: 'feed', kind: 'implements' },
        { from: 'robot', to: 'work', kind: 'implements', highlight: true },
      ],
      { fix: 'segregated' },
      'Robot implements only Workable — no dummy eat() or sleep().',
    ),
  ],
);

const dependencyInversion = script(
  'lld-solid-dependency-inversion-d',
  'Dependency Inversion (D)',
  'SOLID Principles',
  'Depend on abstractions, not concretions — high-level modules should not import low-level details.',
  [
    'class OrderService {',
    '  constructor(private repo: OrderRepository) {}',
    '}',
    '// not: new PostgresOrderRepo() inside',
  ],
  [
    seqStep(
      1,
      ['OrderService', 'PostgresRepo'],
      [{ from: 'OrderService', to: 'PostgresRepo', label: 'new PostgresRepo()', invalid: true }],
      { coupling: 'concrete' },
      'OrderService directly constructs Postgres — swapping DB means editing business logic.',
    ),
    umlStep(
      2,
      [
        { id: 'svc', name: 'OrderService', members: ['- repo: IOrderRepo'], x: 80, y: 50, highlight: true },
        { id: 'iface', name: 'IOrderRepo', stereotype: 'interface', members: ['+ save()'], x: 260, y: 50, highlight: true },
        { id: 'pg', name: 'PostgresRepo', members: ['+ save()'], x: 200, y: 160 },
        { id: 'mongo', name: 'MongoRepo', members: ['+ save()'], x: 320, y: 160 },
      ],
      [
        { from: 'svc', to: 'iface', kind: 'association', highlight: true },
        { from: 'pg', to: 'iface', kind: 'implements' },
        { from: 'mongo', to: 'iface', kind: 'implements' },
      ],
      { depends: 'abstraction' },
      'OrderService depends on IOrderRepo — inject Postgres or Mongo at runtime.',
    ),
    seqStep(
      3,
      ['Client', 'OrderService', 'IOrderRepo'],
      [
        { from: 'Client', to: 'OrderService', label: 'createOrder()' },
        { from: 'OrderService', to: 'IOrderRepo', label: 'repo.save()' },
      ],
      { injected: 'PostgresRepo' },
      'High-level OrderService calls the abstraction; DI container wires the concrete repo.',
      ['validate order'],
    ),
  ],
);

export const SOLID_SCRIPTS = {
  'lld-solid-single-responsibility-s': singleResponsibility,
  'lld-solid-openclosed-o': openClosed,
  'lld-solid-liskov-substitution-l': liskov,
  'lld-solid-interface-segregation-i': interfaceSegregation,
  'lld-solid-dependency-inversion-d': dependencyInversion,
};
