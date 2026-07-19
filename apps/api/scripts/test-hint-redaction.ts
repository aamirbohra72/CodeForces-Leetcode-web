import assert from 'node:assert/strict';

function deterministicHint(status: string): string {
  switch (status) {
    case 'WRONG_ANSWER':
      return 'Compare your output formatting and edge cases against the sample.';
    case 'COMPILATION_ERROR':
      return 'Fix syntax/compile errors first.';
    case 'RUNTIME_ERROR':
      return 'A runtime exception occurred.';
    case 'TIME_LIMIT_EXCEEDED':
      return 'Your solution is too slow for the hidden cases.';
    default:
      return 'Review the problem statement and try again.';
  }
}

function redactHiddenCases(
  cases: Array<{ isHidden: boolean; expected?: string; actual?: string; name: string; passed: boolean }>,
) {
  return cases.map((c) =>
    c.isHidden
      ? { name: 'hidden', isHidden: true, passed: c.passed, expected: undefined, actual: undefined }
      : c,
  );
}

assert.match(deterministicHint('WRONG_ANSWER'), /edge cases/i);
assert.match(deterministicHint('COMPILATION_ERROR'), /syntax/i);

const redacted = redactHiddenCases([
  { isHidden: false, name: 'sample', passed: false, expected: '1', actual: '2' },
  { isHidden: true, name: 'secret', passed: false, expected: '9', actual: '8' },
]);
assert.equal(redacted[0].expected, '1');
assert.equal(redacted[1].expected, undefined);
assert.equal(redacted[1].name, 'hidden');

console.log('hint/redaction unit checks passed');
