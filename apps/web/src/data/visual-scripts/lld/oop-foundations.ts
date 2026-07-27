import { script, seqStep, umlStep } from './helpers';
import { encapsulationScript } from '../encapsulation';

const objectsClasses = script(
  'lld-oop-objects-classes',
  'Objects & Classes',
  'OOP Foundations',
  'A class is the blueprint; an object is a concrete instance with its own state.',
  [
    'class Car {',
    '  brand: string',
    '  speed: number = 0',
    '  accelerate() { speed += 10 }',
    '}',
    'const mine = new Car("Tesla")',
  ],
  [
    umlStep(
      1,
      [
        { id: 'car', name: 'Car', members: ['- brand: string', '- speed: number', '+ accelerate()'], x: 140, y: 30, highlight: true },
      ],
      [],
      { phase: 'blueprint' },
      'Car is the class — it defines shared structure and behavior for all cars.',
      'Class blueprint',
    ),
    umlStep(
      5,
      [
        { id: 'car', name: 'Car', members: ['- brand: string', '- speed: number', '+ accelerate()'], x: 140, y: 30 },
        { id: 'mine', name: 'mine', stereotype: 'instance', members: ['brand = "Tesla"', 'speed = 0'], x: 140, y: 150, highlight: true },
      ],
      [{ from: 'mine', to: 'car', kind: 'implements', label: 'instanceof', highlight: true }],
      { instance: 'mine' },
      'new Car("Tesla") creates mine — a distinct object with its own field values.',
      'Object instance',
    ),
    umlStep(
      4,
      [
        { id: 'car', name: 'Car', members: ['- brand: string', '- speed: number', '+ accelerate()'], x: 80, y: 30 },
        { id: 'mine', name: 'mine', stereotype: 'instance', members: ['brand = "Tesla"', 'speed = 30'], x: 40, y: 150, highlight: true },
        { id: 'yours', name: 'yours', stereotype: 'instance', members: ['brand = "BMW"', 'speed = 0'], x: 220, y: 150 },
      ],
      [
        { from: 'mine', to: 'car', kind: 'implements', label: 'instanceof' },
        { from: 'yours', to: 'car', kind: 'implements', label: 'instanceof' },
      ],
      { mineSpeed: 30, yoursSpeed: 0 },
      'mine.accelerate() only changes mine.speed. Each object owns its state independently.',
    ),
  ],
);

const abstraction = script(
  'lld-oop-abstraction',
  'Abstraction',
  'OOP Foundations',
  'Expose what matters, hide how it works — callers depend on a simple contract, not internals.',
  [
    'interface PaymentGateway {',
    '  charge(amount): Receipt',
    '}',
    '// StripeAdapter hides HTTP, retries, idempotency',
    'gateway.charge(99)',
  ],
  [
    umlStep(
      1,
      [
        { id: 'gw', name: 'PaymentGateway', stereotype: 'interface', members: ['+ charge(amount)'], x: 60, y: 40, highlight: true },
        { id: 'stripe', name: 'StripeAdapter', members: ['- apiKey', '- httpClient', '+ charge()'], x: 220, y: 40 },
      ],
      [{ from: 'stripe', to: 'gw', kind: 'implements' }],
      { view: 'public API' },
      'Client sees only PaymentGateway.charge() — the essential operation.',
      'Public contract',
    ),
    umlStep(
      4,
      [
        { id: 'client', name: 'Checkout', members: ['+ pay()'], x: 140, y: 30, highlight: true },
        { id: 'gw', name: 'PaymentGateway', stereotype: 'interface', members: ['+ charge(amount)'], x: 140, y: 130 },
        { id: 'stripe', name: 'StripeAdapter', members: ['- apiKey', '- httpClient', '+ charge()'], x: 140, y: 230 },
      ],
      [
        { from: 'client', to: 'gw', kind: 'association', highlight: true },
        { from: 'stripe', to: 'gw', kind: 'implements' },
      ],
      { hidden: 'HTTP, retries, signing' },
      'StripeAdapter hides HTTP calls and retry logic. Checkout never touches those details.',
    ),
    seqStep(4, ['Checkout', 'Gateway'], [{ from: 'Checkout', to: 'Gateway', label: 'charge(99)' }], { amount: 99 }, 'One line from the client — abstraction collapsed complexity behind the interface.', ['validate → POST → parse']),
  ],
);

const inheritance = script(
  'lld-oop-inheritance',
  'Inheritance',
  'OOP Foundations',
  'A subclass extends a parent class, inheriting fields and methods while adding or overriding behavior.',
  ['class Animal { speak() }', 'class Dog extends Animal {', '  speak() { return "woof" }', '}'],
  [
    umlStep(
      1,
      [
        { id: 'animal', name: 'Animal', members: ['+ speak()'], x: 140, y: 30, highlight: true },
        { id: 'dog', name: 'Dog', members: ['+ speak() override'], x: 140, y: 150 },
      ],
      [{ from: 'dog', to: 'animal', kind: 'extends', highlight: true }],
      { relation: 'is-a' },
      'Dog extends Animal — the hollow-triangle UML arrow means "is-a".',
    ),
    umlStep(
      3,
      [
        { id: 'animal', name: 'Animal', members: ['+ speak()'], x: 140, y: 30 },
        { id: 'dog', name: 'Dog', members: ['+ speak() → "woof"'], x: 140, y: 150, highlight: true },
        { id: 'spot', name: 'spot', stereotype: 'instance', members: ['speak() → "woof"'], x: 140, y: 270, highlight: true },
      ],
      [
        { from: 'dog', to: 'animal', kind: 'extends' },
        { from: 'spot', to: 'dog', kind: 'implements', label: 'instanceof' },
      ],
      { call: 'spot.speak()' },
      'spot inherits Dog.speak(). Override replaces the parent implementation for all dogs.',
    ),
  ],
);

const polymorphism = script(
  'lld-oop-polymorphism',
  'Polymorphism',
  'OOP Foundations',
  'One interface, many forms — the runtime type decides which implementation runs.',
  [
    'Animal a = new Dog()',
    'a.speak()  // "woof"',
    'a = new Cat()',
    'a.speak()  // "meow"',
  ],
  [
    umlStep(
      1,
      [
        { id: 'animal', name: 'Animal', stereotype: 'abstract', members: ['+ speak()'], x: 140, y: 30, highlight: true },
        { id: 'dog', name: 'Dog', members: ['+ speak() → woof'], x: 40, y: 150 },
        { id: 'cat', name: 'Cat', members: ['+ speak() → meow'], x: 240, y: 150 },
      ],
      [
        { from: 'dog', to: 'animal', kind: 'extends' },
        { from: 'cat', to: 'animal', kind: 'extends' },
      ],
      { ref: 'Animal a' },
      'Variable a is typed Animal but can point to any subclass.',
    ),
    umlStep(
      2,
      [
        { id: 'animal', name: 'Animal', stereotype: 'abstract', members: ['+ speak()'], x: 140, y: 30 },
        { id: 'dog', name: 'Dog', members: ['+ speak() → woof'], x: 40, y: 150, highlight: true },
        { id: 'cat', name: 'Cat', members: ['+ speak() → meow'], x: 240, y: 150 },
        { id: 'ref', name: 'a → Dog', stereotype: 'instance', members: ['runtime: Dog'], x: 40, y: 260, highlight: true },
      ],
      [{ from: 'ref', to: 'dog', kind: 'association', highlight: true }],
      { output: 'woof' },
      'a = new Dog(); a.speak() dispatches to Dog — dynamic dispatch at runtime.',
    ),
    umlStep(
      4,
      [
        { id: 'animal', name: 'Animal', stereotype: 'abstract', members: ['+ speak()'], x: 140, y: 30 },
        { id: 'dog', name: 'Dog', members: ['+ speak() → woof'], x: 40, y: 150 },
        { id: 'cat', name: 'Cat', members: ['+ speak() → meow'], x: 240, y: 150, highlight: true },
        { id: 'ref', name: 'a → Cat', stereotype: 'instance', members: ['runtime: Cat'], x: 240, y: 260, highlight: true },
      ],
      [{ from: 'ref', to: 'cat', kind: 'association', highlight: true }],
      { output: 'meow' },
      'Reassign a = new Cat() — same call site, different behavior. That is polymorphism.',
    ),
  ],
);

const compositionOverInheritance = script(
  'lld-oop-composition-over-inheritance',
  'Composition over Inheritance',
  'OOP Foundations',
  'Prefer has-a over is-a — compose behaviors from parts instead of deep inheritance trees.',
  [
    '// Bad: class FlyingCar extends Car, Plane',
    '// Good:',
    'class Car { engine: Engine }',
    'class FlyingCar { car: Car; wings: Wings }',
  ],
  [
    umlStep(
      1,
      [
        { id: 'vehicle', name: 'Vehicle', members: ['+ move()'], x: 140, y: 20 },
        { id: 'car', name: 'Car', members: ['+ drive()'], x: 60, y: 110 },
        { id: 'plane', name: 'Plane', members: ['+ fly()'], x: 220, y: 110 },
        { id: 'flyingcar', name: 'FlyingCar', members: ['?'], x: 140, y: 200, highlight: true },
      ],
      [
        { from: 'car', to: 'vehicle', kind: 'extends' },
        { from: 'plane', to: 'vehicle', kind: 'extends' },
        { from: 'flyingcar', to: 'car', kind: 'extends', label: 'fragile' },
        { from: 'flyingcar', to: 'plane', kind: 'extends', label: 'diamond?' },
      ],
      { problem: 'multiple inheritance' },
      'Deep is-a chains get brittle. FlyingCar extending both Car and Plane is a design smell.',
    ),
    umlStep(
      4,
      [
        { id: 'engine', name: 'Engine', members: ['+ start()'], x: 40, y: 40 },
        { id: 'wings', name: 'Wings', members: ['+ lift()'], x: 240, y: 40 },
        { id: 'flyingcar', name: 'FlyingCar', members: ['- car: Car', '- wings: Wings'], x: 140, y: 150, highlight: true },
      ],
      [
        { from: 'flyingcar', to: 'engine', kind: 'composition', highlight: true },
        { from: 'flyingcar', to: 'wings', kind: 'composition', highlight: true },
      ],
      { pattern: 'has-a' },
      'FlyingCar composes Engine and Wings — swap parts without rewriting the inheritance tree.',
    ),
  ],
);

const umlRelationships = script(
  'lld-oop-uml-relationships',
  'UML Relationships',
  'OOP Foundations',
  'UML arrows encode different relationships: extends, implements, association, aggregation, composition.',
  [
    'extends / implements — type hierarchy',
    'association — uses temporarily',
    'aggregation — has-a (shared lifetime)',
    'composition — owns (same lifetime)',
  ],
  [
    umlStep(
      1,
      [
        { id: 'parent', name: 'Shape', stereotype: 'abstract', members: ['+ area()'], x: 140, y: 30, highlight: true },
        { id: 'child', name: 'Circle', members: ['+ area()'], x: 140, y: 150, highlight: true },
      ],
      [{ from: 'child', to: 'parent', kind: 'extends', highlight: true }],
      { arrow: 'extends' },
      'Solid line + hollow triangle = extends (inheritance).',
    ),
    umlStep(
      2,
      [
        { id: 'iface', name: 'Drawable', stereotype: 'interface', members: ['+ draw()'], x: 60, y: 40 },
        { id: 'circle', name: 'Circle', members: ['+ draw()'], x: 220, y: 40, highlight: true },
      ],
      [{ from: 'circle', to: 'iface', kind: 'implements', highlight: true }],
      { arrow: 'implements' },
      'Dashed line + hollow triangle = implements an interface.',
    ),
    umlStep(
      3,
      [
        { id: 'order', name: 'Order', members: ['- items'], x: 60, y: 60, highlight: true },
        { id: 'item', name: 'Item', members: ['+ price'], x: 220, y: 60 },
      ],
      [{ from: 'order', to: 'item', kind: 'aggregation', highlight: true, label: 'has items' }],
      { arrow: 'aggregation' },
      'Hollow diamond = aggregation — Order has Items that can exist independently.',
    ),
    umlStep(
      4,
      [
        { id: 'house', name: 'House', members: ['- rooms'], x: 60, y: 60, highlight: true },
        { id: 'room', name: 'Room', members: ['+ id'], x: 220, y: 60 },
      ],
      [{ from: 'house', to: 'room', kind: 'composition', highlight: true, label: 'owns' }],
      { arrow: 'composition' },
      'Filled diamond = composition — Rooms die with the House; strong ownership.',
    ),
  ],
);

const abstractVsInterface = script(
  'lld-oop-abstract-class-vs-interface',
  'Abstract class vs Interface',
  'OOP Foundations',
  'Abstract classes share code + partial contract; interfaces define pure capability contracts with no state.',
  [
    'abstract class Animal {',
    '  abstract speak()',
    '  breathe() { /* shared */ }',
    '}',
    'interface Flyable { fly() }',
  ],
  [
    umlStep(
      1,
      [
        { id: 'animal', name: 'Animal', stereotype: 'abstract', members: ['+ breathe() concrete', '+ speak() abstract'], x: 80, y: 40, highlight: true },
        { id: 'dog', name: 'Dog', members: ['+ speak() → woof'], x: 80, y: 160 },
        { id: 'flyable', name: 'Flyable', stereotype: 'interface', members: ['+ fly()'], x: 260, y: 40, highlight: true },
        { id: 'duck', name: 'Duck', members: ['+ speak()', '+ fly()'], x: 260, y: 160 },
      ],
      [
        { from: 'dog', to: 'animal', kind: 'extends' },
        { from: 'duck', to: 'animal', kind: 'extends' },
        { from: 'duck', to: 'flyable', kind: 'implements' },
      ],
      { compare: 'both' },
      'Abstract Animal shares breathe(); Flyable is a capability mixin with no implementation.',
    ),
    umlStep(
      2,
      [
        { id: 'animal', name: 'Animal', stereotype: 'abstract', members: ['+ breathe() ✓', '+ speak() *'], x: 80, y: 40 },
        { id: 'flyable', name: 'Flyable', stereotype: 'interface', members: ['+ fly() only'], x: 260, y: 40, highlight: true },
      ],
      [],
      { rule: 'single extends, many implements' },
      'A class extends one abstract class but can implement many interfaces — Duck is Animal + Flyable.',
    ),
  ],
);

export const OOP_SCRIPTS = {
  'lld-oop-objects-classes': objectsClasses,
  'lld-oop-encapsulation': encapsulationScript,
  'lld-oop-abstraction': abstraction,
  'lld-oop-inheritance': inheritance,
  'lld-oop-polymorphism': polymorphism,
  'lld-oop-composition-over-inheritance': compositionOverInheritance,
  'lld-oop-uml-relationships': umlRelationships,
  'lld-oop-abstract-class-vs-interface': abstractVsInterface,
};
