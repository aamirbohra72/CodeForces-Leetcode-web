/**
 * Private reference solutions + known-bad fixtures for conformance.
 * Run with: npm run test:judge --workspace=@codeforces/api
 */
import { jsProblems } from '../../../packages/db/prisma/catalog/jsProblems';
import { runDockerJudge, isDockerJudgeAvailable } from '../src/services/dockerJudgeService';

const references: Record<string, string> = {
  'anagram-checker': `
const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const a = (lines[0] || '').trim();
const b = (lines[1] || '').trim();
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const c = Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    c[s.charCodeAt(i) - 97]++;
    c[t.charCodeAt(i) - 97]--;
  }
  return c.every((x) => x === 0);
}
console.log(isAnagram(a, b) ? 'YES' : 'NO');
`,
  'hello-world': `console.log('Hello, World!');`,
  'voting-eligibility': `
const age = Number(require('fs').readFileSync(0, 'utf8').trim());
console.log(age >= 18 ? 'ELIGIBLE' : 'NOT ELIGIBLE');
`,
  'binary-search': `
const lines = require('fs').readFileSync(0, 'utf8').split(/\\r?\\n/);
const n = parseInt(lines[0], 10);
const nums = lines[1].trim().split(/\\s+/).map(Number).slice(0, n);
const target = parseInt(lines[2], 10);
function binarySearch(arr, t) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) return mid;
    if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
console.log(binarySearch(nums, target));
`,
  'deep-clone': `
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
module.exports = { deepClone };
`,
  'compose-pipe': `
function compose(fns) {
  return (x) => fns.reduceRight((v, f) => f(v), x);
}
function pipe(fns) {
  return (x) => fns.reduce((v, f) => f(v), x);
}
module.exports = { compose, pipe };
`,
};

const bad: Record<string, string> = {
  'hello-world': `console.log('hello world');`,
  'voting-eligibility': `console.log('YES');`,
  'deep-clone': `
function deepClone(value) { return value; }
module.exports = { deepClone };
`,
  'compose-pipe': `
function compose(fns) { return (x) => x; }
function pipe(fns) { return (x) => x; }
module.exports = { compose, pipe };
`,
};

async function main() {
  if (!(await isDockerJudgeAvailable())) {
    console.error('Docker unavailable — skip reference conformance');
    process.exit(2);
  }

  let failed = 0;
  for (const [slug, source] of Object.entries(references)) {
    const challenge = jsProblems.find((c) => c.slug === slug);
    if (!challenge) {
      console.warn('missing challenge', slug);
      continue;
    }
    const result = await runDockerJudge({
      mode: challenge.judgeMode,
      language: 'javascript',
      sourceCode: source,
      cases: challenge.testCases,
      timeoutMs: 8000,
    });
    if (result.status !== 'ACCEPTED') {
      console.error('REF FAIL', slug, result.feedback, 'score', result.score);
      failed += 1;
    } else {
      console.log('REF OK', slug);
    }
  }

  for (const [slug, source] of Object.entries(bad)) {
    const challenge = jsProblems.find((c) => c.slug === slug);
    if (!challenge) continue;
    const result = await runDockerJudge({
      mode: challenge.judgeMode,
      language: 'javascript',
      sourceCode: source,
      cases: challenge.testCases,
      timeoutMs: 8000,
    });
    if (result.status === 'ACCEPTED') {
      console.error('BAD unexpectedly ACCEPTED', slug);
      failed += 1;
    } else {
      console.log('BAD correctly rejected', slug, result.status);
    }
  }

  if (failed) {
    console.error(`Conformance failures: ${failed}`);
    process.exit(1);
  }
  console.log('Reference conformance passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
