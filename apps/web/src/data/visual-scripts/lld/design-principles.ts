import { accessStep, principleStep, script } from './helpers';

const cohesionCoupling = script(
  'lld-design-cohesion-coupling',
  'Cohesion & Coupling',
  'Design Principles',
  'High cohesion keeps related logic together; low coupling minimizes ripple effects between modules.',
  [
    '// High cohesion: all auth logic in AuthService',
    '// Low coupling: AuthService talks via IUserRepo interface',
    '// Bad: OrderService imports 12 concrete classes',
  ],
  [
    principleStep(
      1,
      { title: 'Low Cohesion', items: ['User CRUD in OrderService', 'Email in OrderService', 'PDF export in OrderService'], good: false },
      { title: 'High Cohesion', items: ['OrderService → orders only', 'AuthService → auth only', 'EmailService → delivery only'], good: true, highlight: true },
      { cohesion: 'split' },
      'Low cohesion scatters unrelated jobs; high cohesion groups what changes together.',
      'Cohesion comparison',
    ),
    principleStep(
      3,
      { title: 'Tight Coupling', items: ['imports PostgresDriver', 'imports StripeSDK', 'imports S3Client directly'], good: false },
      { title: 'Loose Coupling', items: ['depends on IPaymentGateway', 'depends on IStorage', 'swap via DI'], good: true, highlight: true },
      { coupling: 'interfaces' },
      'Tight coupling to concrete libs means every swap rewrites callers. Interfaces decouple modules.',
    ),
  ],
);

const dryKissYagni = script(
  'lld-design-dry-kiss-yagni',
  'DRY · KISS · YAGNI',
  'Design Principles',
  'DRY removes duplication, KISS favors simplicity, YAGNI avoids building features you do not need yet.',
  [
    '// DRY: extract shared validation once',
    '// KISS: plain functions over frameworks',
    '// YAGNI: no plugin system until req #2',
  ],
  [
    principleStep(
      1,
      { title: 'Violates DRY', items: ['validate email × 4 files', 'copy-paste bug risk', 'change in 4 places'], good: false },
      { title: 'DRY', items: ['EmailValidator.validate()', 'single source of truth', 'one fix propagates'], good: true, highlight: true },
      { principle: 'DRY' },
      'Don\'t Repeat Yourself — one authoritative implementation for each piece of knowledge.',
    ),
    principleStep(
      2,
      { title: 'Over-engineered', items: ['Factory of factories', '6 abstraction layers', 'hard to debug'], good: false },
      { title: 'KISS', items: ['direct function call', 'readable flow', 'easy to test'], good: true, highlight: true },
      { principle: 'KISS' },
      'Keep It Simple — the simplest design that solves today\'s problem is usually best.',
    ),
    principleStep(
      3,
      { title: 'YAGNI violation', items: ['multi-tenant on day 1', 'unused export API', 'premature scaling'], good: false },
      { title: 'YAGNI', items: ['ship MVP auth', 'add tenant when sold', 'refactor when needed'], good: true, highlight: true },
      { principle: 'YAGNI' },
      'You Aren\'t Gonna Need It — build for current requirements, not imagined futures.',
    ),
  ],
);

const lawOfDemeter = script(
  'lld-design-law-of-demeter',
  'Law of Demeter',
  'Design Principles',
  'Only talk to your immediate friends — don\'t reach through object chains into someone else\'s internals.',
  [
    '// Bad: order.getCustomer().getAddress().getZip()',
    '// Good: order.getShippingZip()',
  ],
  [
    accessStep(
      1,
      ['order', 'customer', 'address', 'zip'],
      { violation: 'yes' },
      'order.getCustomer().getAddress().getZip() — traversing three objects\' internals.',
      { activeIndex: 3, violation: true },
    ),
    accessStep(
      2,
      ['order', 'getShippingZip()'],
      { allowed: 'yes' },
      'order.getShippingZip() — Order delegates to its friends; client stays at one hop.',
      { activeIndex: 1, violation: false },
    ),
    accessStep(
      3,
      ['order', 'customer', 'wallet', 'balance'],
      { violation: 'yes' },
      'Each extra dot is a coupling point — when Address changes, every chain caller breaks.',
      { activeIndex: 3, violation: true, label: 'Chain of coupling' },
    ),
  ],
);

export const DESIGN_SCRIPTS = {
  'lld-design-cohesion-coupling': cohesionCoupling,
  'lld-design-dry-kiss-yagni': dryKissYagni,
  'lld-design-law-of-demeter': lawOfDemeter,
};
