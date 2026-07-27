import { fanOutStep, flyweightStep, layeredStep, script } from './helpers';

const decorator = script(
  'lld-structural-decorator',
  'Decorator',
  'Structural Patterns',
  'Wrap an object to add responsibilities dynamically — stack decorators without subclass explosion.',
  [
    'let coffee: Beverage = new Espresso()',
    'coffee = new Milk(coffee)',
    'coffee = new Whip(coffee)',
    'coffee.cost()  // base + milk + whip',
  ],
  [
    layeredStep(1, [{ id: 'esp', label: 'Espresso', sublabel: '$2.00', variant: 'core', highlight: true }], { cost: 2 }, 'Start with Espresso — the core component.', { layout: 'stack' }),
    layeredStep(2, [{ id: 'milk', label: 'Milk', sublabel: '+$0.50', variant: 'wrapper' }, { id: 'esp', label: 'Espresso', variant: 'core', highlight: true }], { cost: 2.5 }, 'Milk decorator wraps Espresso — delegates cost() then adds its price.', { layout: 'stack' }),
    layeredStep(3, [{ id: 'whip', label: 'Whip', variant: 'wrapper' }, { id: 'milk', label: 'Milk', variant: 'wrapper' }, { id: 'esp', label: 'Espresso', variant: 'core', highlight: true }], { cost: 3 }, 'Whip wraps Milk wraps Espresso — each layer is transparent to the client.', { layout: 'stack' }),
  ],
);

const adapter = script(
  'lld-structural-adapter',
  'Adapter',
  'Structural Patterns',
  'Convert one interface into another — make incompatible classes work together.',
  [
    'class USPlug { volts: 120 }',
    'class EUPlug { volts: 230 }',
    'class Adapter implements USPlug {',
    '  constructor(eu: EUPlug) {}',
    '}',
  ],
  [
    layeredStep(1, [{ id: 'client', label: 'US Device', sublabel: 'expects 120V', variant: 'core' }, { id: 'eu', label: 'EU Socket', sublabel: '230V', variant: 'wrapper', highlight: true }], { mismatch: 'yes' }, 'US device cannot plug into EU socket — incompatible interfaces.', { layout: 'stack' }),
    layeredStep(3, [{ id: 'adapter', label: 'VoltageAdapter', sublabel: '230→120V', variant: 'wrapper', highlight: true }, { id: 'eu', label: 'EU Socket', variant: 'core' }], { converts: 'yes' }, 'Adapter wraps EU socket and exposes USPlug interface — translation layer.', { layout: 'stack' }),
    layeredStep(4, [{ id: 'client', label: 'US Device', variant: 'core', highlight: true }, { id: 'adapter', label: 'VoltageAdapter', variant: 'wrapper', highlight: true }, { id: 'eu', label: 'EU Socket', variant: 'core' }], { works: 'yes' }, 'Device sees 120V — adapter handles conversion internally. Client unchanged.', { layout: 'stack' }),
  ],
);

const facade = script(
  'lld-structural-facade',
  'Facade',
  'Structural Patterns',
  'Provide a unified simplified interface to a complex subsystem of classes.',
  [
    'class HomeTheaterFacade {',
    '  watchMovie() {',
    '    projector.on(); amp.setVolume(5); dvd.play()',
    '  }',
    '}',
  ],
  [
    fanOutStep(1, [{ id: 'client', label: 'Client', role: 'source' }, { id: 'proj', label: 'Projector', role: 'target' }, { id: 'amp', label: 'Amplifier', role: 'target' }, { id: 'dvd', label: 'DVD', role: 'target' }], [], 'broadcast', { before: 'complex' }, 'Without Facade, client must orchestrate Projector, Amp, and DVD separately.', 'Subsystem complexity'),
    fanOutStep(2, [{ id: 'client', label: 'Client', role: 'source' }, { id: 'facade', label: 'HomeTheater', role: 'hub' }, { id: 'proj', label: 'Projector', role: 'target' }, { id: 'amp', label: 'Amp', role: 'target' }, { id: 'dvd', label: 'DVD', role: 'target' }], [{ from: 'client', to: 'facade', label: 'watchMovie()', active: true }], 'star', { simplify: 'yes' }, 'Client calls one method on HomeTheater facade.', 'Single entry point'),
    fanOutStep(3, [{ id: 'facade', label: 'HomeTheater', role: 'hub' }, { id: 'proj', label: 'Projector', role: 'target' }, { id: 'amp', label: 'Amp', role: 'target' }, { id: 'dvd', label: 'DVD', role: 'target' }], [{ from: 'facade', to: 'proj', label: 'on()', active: true }, { from: 'facade', to: 'amp', label: 'vol=5', active: true }, { from: 'facade', to: 'dvd', label: 'play()', active: true }], 'star', { delegated: 'yes' }, 'Facade fans out to subsystem — client never touches low-level APIs.'),
  ],
);

const composite = script(
  'lld-structural-composite',
  'Composite',
  'Structural Patterns',
  'Compose objects into tree structures so clients treat individual and groups uniformly.',
  [
    'interface Component { render() }',
    'class Leaf implements Component { }',
    'class Folder implements Component {',
    '  children: Component[]',
    '}',
  ],
  [
    layeredStep(
      1,
      [
        { id: 'root', label: 'Folder', variant: 'branch', highlight: true },
        { id: 'f1', label: 'docs/', variant: 'branch' },
        { id: 'f2', label: 'img/', variant: 'branch' },
        { id: 'file1', label: 'readme.md', variant: 'leaf' },
        { id: 'file2', label: 'logo.png', variant: 'leaf' },
      ],
      { tree: 'file system' },
      'Folder can contain Files and other Folders — same render() on any node.',
      { tree: [{ parent: 'root', child: 'f1' }, { parent: 'root', child: 'f2' }, { parent: 'f1', child: 'file1' }, { parent: 'f2', child: 'file2' }], layout: 'tree' },
    ),
    layeredStep(
      2,
      [
        { id: 'root', label: 'Folder', variant: 'branch', highlight: true },
        { id: 'f1', label: 'docs/', variant: 'branch', highlight: true },
        { id: 'f2', label: 'img/', variant: 'branch' },
        { id: 'file1', label: 'readme.md', variant: 'leaf', highlight: true },
        { id: 'file2', label: 'logo.png', variant: 'leaf' },
      ],
      { op: 'root.render()' },
      'root.render() recursively renders all children — client cannot tell leaf from composite.',
      { tree: [{ parent: 'root', child: 'f1' }, { parent: 'root', child: 'f2' }, { parent: 'f1', child: 'file1' }, { parent: 'f2', child: 'file2' }], layout: 'tree' },
    ),
  ],
);

const proxy = script(
  'lld-structural-proxy',
  'Proxy',
  'Structural Patterns',
  'Provide a surrogate that controls access to another object — lazy load, cache, or permission checks.',
  [
    'class ImageProxy implements Image {',
    '  getBitmap() {',
    '    if (!real) real = new RealImage(path)',
    '    return real.getBitmap()',
    '  }',
    '}',
  ],
  [
    layeredStep(1, [{ id: 'client', label: 'Gallery', variant: 'core' }, { id: 'proxy', label: 'ImageProxy', sublabel: 'placeholder', variant: 'wrapper', highlight: true }], { loaded: 'no' }, 'Gallery holds ImageProxy — lightweight placeholder, no disk I/O yet.', { layout: 'stack' }),
    layeredStep(2, [{ id: 'client', label: 'Gallery', variant: 'core', highlight: true }, { id: 'proxy', label: 'ImageProxy', sublabel: 'loading…', variant: 'wrapper', highlight: true }, { id: 'real', label: 'RealImage', sublabel: '4MB bitmap', variant: 'core' }], { loaded: 'yes' }, 'User clicks → proxy lazy-loads RealImage on first access.', { layout: 'stack' }),
    layeredStep(3, [{ id: 'client', label: 'Gallery', variant: 'core' }, { id: 'proxy', label: 'ImageProxy', sublabel: 'cached', variant: 'wrapper', highlight: true }, { id: 'real', label: 'RealImage', variant: 'core' }], { cached: 'yes' }, 'Second access uses cached RealImage — proxy adds lazy loading without changing client code.'),
  ],
);

const bridge = script(
  'lld-structural-bridge',
  'Bridge',
  'Structural Patterns',
  'Decouple abstraction from implementation so both can vary independently.',
  [
    'class Remote { device: Device }',
    'class TV extends Device { turnOn() }',
    'class Radio extends Device { turnOn() }',
  ],
  [
    layeredStep(1, [{ id: 'remote', label: 'Remote', variant: 'core', highlight: true }, { id: 'tv', label: 'TV', variant: 'wrapper' }], { pair: 'Remote+TV' }, 'Remote abstraction holds a Device implementation reference.', { layout: 'bridge' }),
    layeredStep(2, [{ id: 'remote', label: 'Remote', variant: 'core', highlight: true }, { id: 'radio', label: 'Radio', variant: 'wrapper', highlight: true }], { swap: 'impl' }, 'Swap TV for Radio — Remote code unchanged. Abstraction and implementation vary independently.', { layout: 'bridge' }),
  ],
);

const flyweight = script(
  'lld-structural-flyweight',
  'Flyweight',
  'Structural Patterns',
  'Share intrinsic state across many fine-grained objects to save memory.',
  [
    'TreeFactory.getTree("oak", "green")',
    '// shares TreeType; position is extrinsic',
  ],
  [
    flyweightStep(1, 'TreeFactory', [], [{ label: 'Tree @ (10,20)', key: 'oak+green' }], { pool: 0 }, 'Each tree needs type+color (intrinsic) and x,y (extrinsic).', 'Before pooling'),
    flyweightStep(2, 'TreeFactory', [{ key: 'oak+green', count: 1 }], [{ label: 'Tree @ (10,20)', key: 'oak+green', highlight: true }, { label: 'Tree @ (50,80)', key: 'oak+green' }], { pool: 1 }, 'First oak+green stored in pool — second tree reuses same TreeType object.', 'Shared intrinsic'),
    flyweightStep(3, 'TreeFactory', [{ key: 'oak+green', count: 500 }], [{ label: '500 trees', key: 'oak+green', highlight: true }], { saved: '499 objects' }, '500 identical-looking trees share one flyweight — extrinsic position differs per instance.'),
  ],
);

export const STRUCTURAL_SCRIPTS = {
  'lld-structural-decorator': decorator,
  'lld-structural-adapter': adapter,
  'lld-structural-facade': facade,
  'lld-structural-composite': composite,
  'lld-structural-proxy': proxy,
  'lld-structural-bridge': bridge,
  'lld-structural-flyweight': flyweight,
};
