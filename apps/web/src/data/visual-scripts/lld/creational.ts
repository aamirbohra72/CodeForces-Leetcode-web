import { creationStep, script, singletonStep } from './helpers';

const singleton = script(
  'lld-creational-singleton',
  'Singleton',
  'Creational Patterns',
  'Ensure a class has exactly one instance and provide a global access point to it.',
  [
    'class Config {',
    '  private static instance: Config',
    '  static getInstance() {',
    '    if (!instance) instance = new Config()',
    '    return instance',
    '  }',
    '}',
  ],
  [
    singletonStep(3, [{ label: 'App.init()' }, { label: 'Logger.setup()' }], { label: 'Config', memory: '0x7f3a' }, 0, { calls: 1 }, 'App.init() calls getInstance() — creates the sole Config object.', 'First access'),
    singletonStep(4, [{ label: 'App.init()' }, { label: 'Logger.setup()' }], { label: 'Config', memory: '0x7f3a' }, 1, { calls: 2 }, 'Logger.setup() also calls getInstance() — both pointers resolve to the same memory address.', 'Shared instance'),
    singletonStep(5, [{ label: 'API.route()' }, { label: 'Cache.warm()' }], { label: 'Config', memory: '0x7f3a' }, undefined, { refs: 4 }, 'Every call site shares one Config — no duplicate state or race to initialize.', 'Single source'),
  ],
);

const factoryMethod = script(
  'lld-creational-factory-method',
  'Factory Method',
  'Creational Patterns',
  'Define an interface for creating objects, but let subclasses decide which class to instantiate.',
  [
    'abstract class Logistics {',
    '  createTransport(): Transport',
    '  planDelivery() { t = createTransport() }',
    '}',
    'class RoadLogistics { createTransport() → Truck }',
  ],
  [
    creationStep(2, { steps: ['Logistics.createTransport()', 'return new Truck()'], activeStep: 0 }, { name: 'Transport', parts: ['wheels', 'cargo bed'] }, { phase: 'factory call' }, 'RoadLogistics.createTransport() is the factory method — subclass picks the product.', 'Factory method'),
    creationStep(3, { steps: ['Logistics.createTransport()', 'return new Truck()'], activeStep: 1 }, { name: 'Truck', parts: ['wheels', 'cargo bed'], built: true }, { product: 'Truck' }, 'planDelivery() calls createTransport() without knowing Truck vs Ship — polymorphic creation.'),
    creationStep(4, { steps: ['SeaLogistics.createTransport()', 'return new Ship()'], activeStep: 1 }, { name: 'Ship', parts: ['hull', 'container'], built: true }, { product: 'Ship' }, 'Swap subclass to SeaLogistics — same planDelivery(), different product. No client changes.'),
  ],
);

const abstractFactory = script(
  'lld-creational-abstract-factory',
  'Abstract Factory',
  'Creational Patterns',
  'Provide an interface for creating families of related objects without specifying concrete classes.',
  [
    'interface GUIFactory {',
    '  createButton(): Button',
    '  createCheckbox(): Checkbox',
    '}',
    'WinFactory → WinButton + WinCheckbox',
  ],
  [
    creationStep(1, { steps: ['GUIFactory.createButton()', 'GUIFactory.createCheckbox()'], activeStep: 0 }, { name: 'WinTheme', parts: ['WinButton', 'WinCheckbox'] }, { family: 'Windows' }, 'Abstract factory defines a family — Button + Checkbox must match the same OS theme.', 'Product family'),
    creationStep(2, { steps: ['GUIFactory.createButton()', 'GUIFactory.createCheckbox()'], activeStep: 1 }, { name: 'WinTheme', parts: ['WinButton', 'WinCheckbox'], built: true }, { consistent: 'yes' }, 'WinFactory produces a coherent WinButton + WinCheckbox set — no Mac button with Win checkbox.'),
    creationStep(3, { steps: ['MacFactory.createButton()', 'MacFactory.createCheckbox()'], activeStep: 1 }, { name: 'MacTheme', parts: ['MacButton', 'MacCheckbox'], built: true }, { swap: 'factory' }, 'Swap the whole factory to MacFactory — entire UI family changes together.'),
  ],
);

const builder = script(
  'lld-creational-builder',
  'Builder',
  'Creational Patterns',
  'Separate construction of a complex object from its representation — step-by-step assembly.',
  [
    'new PizzaBuilder()',
    '  .dough("thin")',
    '  .sauce("tomato")',
    '  .topping("mozzarella")',
    '  .build()',
  ],
  [
    creationStep(1, { steps: ['dough("thin")', 'sauce("tomato")', 'topping("mozzarella")', 'build()'], activeStep: 0 }, { name: 'Pizza', parts: ['thin crust', '—', '—'] }, { step: 1 }, 'Builder starts with dough — each fluent call adds one part.', 'Step 1'),
    creationStep(2, { steps: ['dough("thin")', 'sauce("tomato")', 'topping("mozzarella")', 'build()'], activeStep: 2 }, { name: 'Pizza', parts: ['thin crust', 'tomato', 'mozzarella'] }, { step: 3 }, 'Toppings added incrementally — Director can define preset recipes using the same builder.'),
    creationStep(4, { steps: ['dough("thin")', 'sauce("tomato")', 'topping("mozzarella")', 'build()'], activeStep: 3 }, { name: 'Pizza', parts: ['thin crust', 'tomato', 'mozzarella'], built: true }, { done: 'yes' }, 'build() validates and returns immutable Pizza — construction logic stays out of the product class.'),
  ],
);

const prototype = script(
  'lld-creational-prototype',
  'Prototype',
  'Creational Patterns',
  'Clone existing objects instead of constructing from scratch — copy the prototype to spawn new instances.',
  [
    'const template = new Enemy("orc", hp: 100)',
    'const grunt = template.clone()',
    'const boss = template.clone(); boss.hp *= 3',
  ],
  [
    creationStep(1, { steps: ['template = new Enemy()', 'clone() → grunt', 'clone() → boss'], activeStep: 0 }, { name: 'Enemy', parts: ['orc', 'hp: 100'] }, { source: 'template' }, 'Original Enemy is the prototype — expensive setup done once.', 'Prototype'),
    creationStep(2, { steps: ['template = new Enemy()', 'clone() → grunt', 'clone() → boss'], activeStep: 1 }, { name: 'Grunt', parts: ['orc', 'hp: 100'], built: true }, { clone: 'shallow copy' }, 'clone() copies fields — grunt shares structure but is a distinct object.'),
    creationStep(3, { steps: ['template = new Enemy()', 'clone() → grunt', 'clone() → boss'], activeStep: 2 }, { name: 'Boss', parts: ['orc', 'hp: 300'], built: true }, { customize: 'hp × 3' }, 'boss cloned then customized — faster than new Enemy() + reconfigure every field.'),
  ],
);

export const CREATIONAL_SCRIPTS = {
  'lld-creational-singleton': singleton,
  'lld-creational-factory-method': factoryMethod,
  'lld-creational-abstract-factory': abstractFactory,
  'lld-creational-builder': builder,
  'lld-creational-prototype': prototype,
};
