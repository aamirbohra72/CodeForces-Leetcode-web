export type LldPattern = {
  id: string;
  title: string;
  categoryId: string;
  categoryTitle: string;
  categoryOrder: number;
  visualScriptId?: string;
};

export type LldPatternCategory = {
  id: string;
  order: number;
  title: string;
  patterns: LldPattern[];
};

const CATEGORIES: { id: string; order: number; title: string; patterns: string[] }[] = [
  {
    id: 'oop',
    order: 1,
    title: 'OOP Foundations',
    patterns: [
      'Objects & Classes',
      'Encapsulation',
      'Abstraction',
      'Inheritance',
      'Polymorphism',
      'Composition over Inheritance',
      'UML Relationships',
      'Abstract class vs Interface',
    ],
  },
  {
    id: 'solid',
    order: 2,
    title: 'SOLID Principles',
    patterns: [
      'Single Responsibility (S)',
      'Open/Closed (O)',
      'Liskov Substitution (L)',
      'Interface Segregation (I)',
      'Dependency Inversion (D)',
    ],
  },
  {
    id: 'design',
    order: 3,
    title: 'Design Principles',
    patterns: ['Cohesion & Coupling', 'DRY · KISS · YAGNI', 'Law of Demeter'],
  },
  {
    id: 'creational',
    order: 4,
    title: 'Creational Patterns',
    patterns: ['Singleton', 'Factory Method', 'Abstract Factory', 'Builder', 'Prototype'],
  },
  {
    id: 'structural',
    order: 5,
    title: 'Structural Patterns',
    patterns: ['Decorator', 'Adapter', 'Facade', 'Composite', 'Proxy', 'Bridge', 'Flyweight'],
  },
  {
    id: 'behavioral',
    order: 6,
    title: 'Behavioral Patterns',
    patterns: [
      'Strategy',
      'Observer',
      'State',
      'Command',
      'Chain of Responsibility',
      'Template Method',
      'Iterator',
      'Mediator',
      'Memento',
      'Visitor',
    ],
  },
  {
    id: 'machine',
    order: 7,
    title: 'Machine-Coding Challenges',
    patterns: [
      'Design a Parking Lot',
      'Design a Vending Machine',
      'Design Splitwise',
      'Design Tic-Tac-Toe',
      'Design BookMyShow',
      'Design an Elevator System',
    ],
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[()·]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildCatalog(): LldPatternCategory[] {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
    order: cat.order,
    title: cat.title,
    patterns: cat.patterns.map((title) => {
      const id = `lld-${cat.id}-${slugify(title)}`;
      return {
        id,
        title,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryOrder: cat.order,
        visualScriptId: id,
      };
    }),
  }));
}

export const LLD_PATTERN_CATEGORIES = buildCatalog();
export const LLD_PATTERNS: LldPattern[] = LLD_PATTERN_CATEGORIES.flatMap((c) => c.patterns);

const SCRIPT_TO_PATTERN = Object.fromEntries(
  LLD_PATTERNS.filter((p) => p.visualScriptId).map((p) => [p.visualScriptId!, p.id]),
) as Record<string, string>;

const LEGACY_SCRIPT_IDS: Record<string, string> = {
  'lld-encapsulation-withdraw': 'lld-oop-encapsulation',
};

export function patternIdForLldScript(scriptId: string): string | undefined {
  return SCRIPT_TO_PATTERN[scriptId] ?? LEGACY_SCRIPT_IDS[scriptId];
}

export function getLldPattern(id: string): LldPattern | undefined {
  return LLD_PATTERNS.find((p) => p.id === id);
}

export function getDefaultLldPatternId(): string {
  return 'lld-oop-objects-classes';
}

export function getLldPatternStats() {
  const total = LLD_PATTERNS.length;
  const animated = LLD_PATTERNS.filter((p) => p.visualScriptId).length;
  const categories = LLD_PATTERN_CATEGORIES.length;
  return { total, animated, categories };
}

export function searchLldPatterns(query: string): LldPattern[] {
  const q = query.trim().toLowerCase();
  if (!q) return LLD_PATTERNS;
  return LLD_PATTERNS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.categoryTitle.toLowerCase().includes(q),
  );
}

export function categoriesWithLldPatterns(patternIds: Set<string> | null): LldPatternCategory[] {
  if (!patternIds) return LLD_PATTERN_CATEGORIES;
  return LLD_PATTERN_CATEGORIES.map((cat) => ({
    ...cat,
    patterns: cat.patterns.filter((p) => patternIds.has(p.id)),
  })).filter((cat) => cat.patterns.length > 0);
}
