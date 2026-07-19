#!/usr/bin/env node
/**
 * JS function harness matching packages/db/prisma/catalog/jsProblems.ts protocol.
 * Supports both module.exports (CJS) and ESM named exports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

function out(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function loadUser(userModule) {
  const abs = path.resolve(userModule);
  // Prefer CJS for module.exports starters
  try {
    const require = createRequire(import.meta.url);
    // Clear cache
    try {
      delete require.cache[require.resolve(abs)];
    } catch {
      /* ignore */
    }
    return require(abs);
  } catch {
    const mod = await import(pathToFileURL(abs).href + `?t=${Date.now()}`);
    return mod.default && typeof mod.default === 'object' ? { ...mod, ...mod.default } : mod;
  }
}

const NAMED_FNS = {
  add1: (x) => x + 1,
  double: (x) => x * 2,
  square: (x) => x * x,
  negate: (x) => -x,
};

function makeFakeTimers() {
  let now = 0;
  const timers = [];
  let idSeq = 1;
  return {
    now: () => now,
    setTimeout(fn, ms) {
      const id = idSeq++;
      timers.push({ id, fn, due: now + ms });
      return id;
    },
    clearTimeout(id) {
      const i = timers.findIndex((t) => t.id === id);
      if (i >= 0) timers.splice(i, 1);
    },
    advance(ms) {
      const target = now + ms;
      while (true) {
        timers.sort((a, b) => a.due - b.due);
        const next = timers[0];
        if (!next || next.due > target) break;
        now = next.due;
        timers.shift();
        next.fn();
      }
      now = target;
    },
    flush() {
      timers.sort((a, b) => a.due - b.due);
      while (timers.length) {
        const next = timers.shift();
        now = next.due;
        next.fn();
      }
    },
  };
}

async function runScenario(mod, input) {
  const fnName = input.fn;
  switch (fnName) {
    case 'deepClone': {
      const deepClone = mod.deepClone || mod.default;
      if (typeof deepClone !== 'function') throw new Error('Export deepClone(value)');
      const value = input.value;
      const cloned = deepClone(value);
      if (value && typeof value === 'object' && cloned === value) {
        throw new Error('deepClone returned same reference');
      }
      return cloned;
    }
    case 'debounce': {
      const debounce = mod.debounce || mod.default;
      if (typeof debounce !== 'function') throw new Error('Export debounce(fn, wait)');
      const timers = makeFakeTimers();
      const origSet = globalThis.setTimeout;
      const origClear = globalThis.clearTimeout;
      globalThis.setTimeout = timers.setTimeout.bind(timers);
      globalThis.clearTimeout = timers.clearTimeout.bind(timers);
      try {
        const invocations = [];
        const spy = (...args) => invocations.push({ t: timers.now(), args });
        const debounced = debounce(spy, input.wait ?? 50);
        const calls = [...(input.calls ?? [])].sort((a, b) => a.t - b.t);
        let cursor = 0;
        for (const call of calls) {
          timers.advance(call.t - cursor);
          cursor = call.t;
          debounced(...(call.args ?? []));
        }
        timers.flush();
        return invocations;
      } finally {
        globalThis.setTimeout = origSet;
        globalThis.clearTimeout = origClear;
      }
    }
    case 'throttle': {
      const throttle = mod.throttle || mod.default;
      if (typeof throttle !== 'function') throw new Error('Export throttle(fn, wait)');
      const timers = makeFakeTimers();
      const origSet = globalThis.setTimeout;
      const origClear = globalThis.clearTimeout;
      globalThis.setTimeout = timers.setTimeout.bind(timers);
      globalThis.clearTimeout = timers.clearTimeout.bind(timers);
      try {
        const invocations = [];
        const spy = (...args) => invocations.push({ t: timers.now(), args });
        const throttled = throttle(spy, input.wait ?? 50);
        const calls = [...(input.calls ?? [])].sort((a, b) => a.t - b.t);
        let cursor = 0;
        for (const call of calls) {
          timers.advance(call.t - cursor);
          cursor = call.t;
          throttled(...(call.args ?? []));
        }
        timers.flush();
        return invocations;
      } finally {
        globalThis.setTimeout = origSet;
        globalThis.clearTimeout = origClear;
      }
    }
    case 'memoize': {
      const memoize = mod.memoize || mod.default;
      if (typeof memoize !== 'function') throw new Error('Export memoize(fn)');
      let callCount = 0;
      const base = (...args) => {
        callCount += 1;
        return args.reduce((a, b) => a + b, 0);
      };
      const memo = memoize(base);
      const results = (input.calls ?? []).map((args) => memo(...args));
      return { results, callCount };
    }
    case 'curry': {
      const curry = mod.curry || mod.default;
      if (typeof curry !== 'function') throw new Error('Export curry(fn, arity?)');
      const arity = input.arity ?? 3;
      const sum = (...xs) => xs.reduce((a, b) => a + b, 0);
      // Support curry(fn) using fn.length, or curry(fn, arity)
      let curried;
      try {
        curried = curry(sum, arity);
      } catch {
        Object.defineProperty(sum, 'length', { value: arity });
        curried = curry(sum);
      }
      return (input.chains ?? []).map((groups) => {
        let fn = curried;
        for (const g of groups) fn = fn(...g);
        return fn;
      });
    }
    case 'promiseAllSettled': {
      const promiseAllSettled = mod.promiseAllSettled || mod.default;
      if (typeof promiseAllSettled !== 'function') throw new Error('Export promiseAllSettled(iterable)');
      const promises = (input.tasks ?? []).map((task) => {
        const delay = task.delay ?? 0;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (task.type === 'reject') reject(task.reason ?? 'error');
            else resolve(task.value);
          }, delay);
        });
      });
      const settled = await promiseAllSettled(promises);
      return settled.map((s) =>
        s.status === 'fulfilled'
          ? { status: 'fulfilled', value: s.value }
          : { status: 'rejected', reason: s.reason },
      );
    }
    case 'compose':
    case 'pipe': {
      const compose = mod.compose;
      const pipe = mod.pipe;
      const fns = (input.fns ?? []).map((name) => {
        const f = NAMED_FNS[name];
        if (!f) throw new Error(`Unknown named fn ${name}`);
        return f;
      });
      if (fnName === 'compose') {
        if (typeof compose !== 'function') throw new Error('Export compose(fns)');
        // Support both compose(fnsArray) and compose(...fns)
        const combined = compose.length === 0 || compose.length > 1 ? compose(...fns) : compose(fns);
        return combined(input.input);
      }
      if (typeof pipe !== 'function') throw new Error('Export pipe(fns)');
      const combined = pipe.length === 0 || pipe.length > 1 ? pipe(...fns) : pipe(fns);
      return combined(input.input);
    }
    case 'LRUCache': {
      const LRUCache = mod.LRUCache || mod.default;
      if (!LRUCache) throw new Error('Export class LRUCache');
      const cache = new LRUCache(input.capacity ?? 2);
      const results = [];
      for (const op of input.ops ?? []) {
        if (op[0] === 'put') {
          cache.put(op[1], op[2]);
          results.push(null);
        } else if (op[0] === 'get') {
          results.push(cache.get(op[1]));
        }
      }
      return results;
    }
    case 'EventEmitter': {
      const EventEmitter = mod.EventEmitter || mod.default;
      if (!EventEmitter) throw new Error('Export class EventEmitter');
      const ee = typeof EventEmitter === 'function' ? new EventEmitter() : EventEmitter();
      const log = [];
      const handlers = new Map();
      const getHandler = (label) => {
        if (!handlers.has(label)) {
          handlers.set(label, (...args) => log.push([label, args]));
        }
        return handlers.get(label);
      };
      for (const op of input.ops ?? []) {
        const [type, event, ...rest] = op;
        if (type === 'on') ee.on(event, getHandler(rest[0]));
        else if (type === 'once' && typeof ee.once === 'function') ee.once(event, getHandler(rest[0]));
        else if (type === 'once') {
          const h = getHandler(rest[0]);
          const wrap = (...args) => {
            h(...args);
            ee.off?.(event, wrap);
          };
          ee.on(event, wrap);
        } else if (type === 'off') ee.off?.(event, getHandler(rest[0]));
        else if (type === 'emit') ee.emit(event, ...rest);
      }
      return log;
    }
    default:
      throw new Error(`Unknown fn harness: ${fnName}`);
  }
}

async function main() {
  try {
    const payloadPath = process.argv[2];
    const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
    const input = typeof payload.input === 'string' ? JSON.parse(payload.input) : payload.input;
    const expected =
      typeof payload.expectedOutput === 'string'
        ? JSON.parse(payload.expectedOutput)
        : payload.expectedOutput;

    // Ensure CJS path for module.exports starters
    let userPath = payload.userModule;
    const src = fs.readFileSync(userPath, 'utf8');
    if (/module\.exports/.test(src) && !userPath.endsWith('.cjs')) {
      const cjsPath = userPath.replace(/\.[^.]+$/, '') + '.cjs';
      fs.writeFileSync(cjsPath, src);
      userPath = cjsPath;
    }

    const mod = await loadUser(userPath);
    const actual = await runScenario(mod, input);
    if (!deepEqual(actual, expected)) {
      out({
        ok: false,
        status: 'WRONG_ANSWER',
        error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`.slice(0, 500),
        output: JSON.stringify(actual),
      });
      return;
    }
    out({ ok: true, output: JSON.stringify(actual) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /SyntaxError|Unexpected|Cannot find|Export /i.test(msg)
      ? 'COMPILATION_ERROR'
      : 'RUNTIME_ERROR';
    out({ ok: false, status, error: msg.slice(0, 500) });
  }
}

await main();
