import type { VisualScript } from '@/types/visual-script';

export const encapsulationScript: VisualScript = {
  id: 'lld-encapsulation-withdraw',
  type: 'lld',
  title: 'Encapsulation',
  meta: {
    eyebrow: 'CONCEPT · INTRO',
    section: 'OOP Foundations',
    description:
      'Bundle data with the methods that guard it, hide the internals, and expose only a safe public interface — so invariants can’t be broken.',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
  },
  defaultApproachId: 'encapsulated',
  approaches: [
    {
      id: 'broken',
      label: 'Public fields',
      complexity: { time: '—', space: '—' },
      code: [
        'class Wallet {',
        '  balance: number  // public — anyone can write',
        '}',
        '',
        'wallet.balance = -500',
        'wallet.balance += 9999',
        '// no validation, no audit trail',
      ],
      steps: [
        {
          activeLine: 5,
          diagram: {
            kind: 'sequence',
            actors: ['Client', 'Wallet'],
            messages: [
              {
                from: 'Client',
                to: 'Wallet',
                label: 'balance = -500  ✗',
                invalid: true,
              },
            ],
          },
          state: { balance: -500, access: 'direct write', valid: 'no' },
          captionSeed:
            'Anyone can set balance to anything. A negative balance breaks the invariant instantly.',
        },
        {
          activeLine: 6,
          diagram: {
            kind: 'sequence',
            actors: ['Client', 'Wallet'],
            messages: [
              {
                from: 'Client',
                to: 'Wallet',
                label: 'balance += 9999  ✗',
                invalid: true,
              },
            ],
          },
          state: { balance: 9499, access: 'direct write', valid: 'no' },
          captionSeed:
            'Inflating balance with no checks. Public fields are a back door — every caller becomes responsible for correctness.',
        },
      ],
    },
    {
      id: 'encapsulated',
      label: 'Private + methods',
      complexity: { time: '—', space: '—' },
      code: [
        'class Wallet {',
        '  private balance: number',
        '',
        '  withdraw(amount: number): Result {',
        '    if amount <= 0 or amount > balance',
        '      return Err("invalid")',
        '    balance -= amount',
        '    return Ok(balance)',
        '  }',
        '}',
      ],
      steps: [
        {
          activeLine: 5,
          diagram: {
            kind: 'sequence',
            actors: ['Client', 'Wallet'],
            messages: [
              {
                from: 'Client',
                to: 'Wallet',
                label: 'withdraw(200)',
              },
            ],
            selfCalls: ['validate amount'],
          },
          state: { balance: 100, amount: 200, result: 'pending' },
          captionSeed:
            'Client calls withdraw(200). The object checks the request before touching balance.',
        },
        {
          activeLine: 6,
          diagram: {
            kind: 'sequence',
            actors: ['Client', 'Wallet'],
            messages: [
              {
                from: 'Client',
                to: 'Wallet',
                label: 'withdraw(200)',
              },
            ],
            selfCalls: ['reject: insufficient'],
          },
          state: { balance: 100, amount: 200, result: 'Err("invalid")' },
          captionSeed:
            '200 exceeds balance — mutation blocked. The invariant “balance ≥ 0” survives because writes go through one gate.',
        },
        {
          activeLine: 7,
          diagram: {
            kind: 'sequence',
            actors: ['Client', 'Wallet'],
            messages: [
              {
                from: 'Client',
                to: 'Wallet',
                label: 'withdraw(40)',
              },
            ],
            selfCalls: ['deduct 40'],
          },
          state: { balance: 60, amount: 40, result: 'Ok(60)' },
          captionSeed:
            'withdraw(40) passes validation. Balance updates safely — encapsulation keeps the object always-valid.',
        },
      ],
    },
  ],
};
