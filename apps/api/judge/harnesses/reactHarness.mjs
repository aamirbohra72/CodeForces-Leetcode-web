#!/usr/bin/env node
/**
 * React component harness using esbuild + jsdom + testing-library.
 * Blocks non-allowlisted imports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import * as esbuild from 'esbuild';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const ALLOWED = new Set(['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client']);

function out(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.navigator = window.navigator;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Node = window.Node;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
  // localStorage polyfill
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(String(k), String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
  return dom;
}

async function bundleUser(userFile) {
  const result = await esbuild.build({
    entryPoints: [userFile],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'browser',
    jsx: 'automatic',
    plugins: [
      {
        name: 'allowlist-imports',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            if (args.kind === 'entry-point') return null;
            if (args.path.startsWith('.') || args.path.startsWith('/')) {
              return { path: path.resolve(path.dirname(args.importer), args.path) };
            }
            if (!ALLOWED.has(args.path) && !args.path.startsWith('react/')) {
              return {
                errors: [{ text: `Import not allowed in judge: ${args.path}` }],
              };
            }
            return { path: require.resolve(args.path), external: false };
          });
        },
      },
    ],
  });
  return result.outputFiles[0].text;
}

async function main() {
  try {
    const payload = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    const input = typeof payload.input === 'string' ? JSON.parse(payload.input) : payload.input;
    const expected =
      typeof payload.expectedOutput === 'string'
        ? JSON.parse(payload.expectedOutput)
        : payload.expectedOutput ?? { pass: true };

    setupDom();
    const React = require('react');
    const { createRoot } = require('react-dom/client');
    const { act } = require('react');
    const bundled = await bundleUser(payload.userFile);
    const module = { exports: {} };
    const fn = new Function('require', 'module', 'exports', 'React', bundled);
    fn(require, module, module.exports, React);
    const exported = module.exports;
    const exportName = input.exportName || Object.keys(exported).find((k) => k !== 'default') || 'default';
    const Component = exported[exportName] || exported.default;
    if (!Component) {
      out({ ok: false, status: 'COMPILATION_ERROR', error: `Missing export ${exportName}` });
      return;
    }

    const rootEl = document.getElementById('root');
    const root = createRoot(rootEl);
    await act(async () => {
      root.render(React.createElement(Component, input.props || {}));
    });

    const assertions = input.assertions || [{ type: 'render' }];
    for (const assertion of assertions) {
      if (assertion.type === 'render') {
        if (!rootEl.textContent && rootEl.children.length === 0) {
          throw new Error('Component rendered empty output');
        }
      } else if (assertion.type === 'expectText') {
        if (!rootEl.textContent?.includes(assertion.text)) {
          throw new Error(`Expected text "${assertion.text}"`);
        }
      } else if (assertion.type === 'fill') {
        const el = rootEl.querySelector(assertion.selector);
        if (!el) throw new Error(`Missing selector ${assertion.selector}`);
        await act(async () => {
          el.value = assertion.value;
          el.dispatchEvent(new window.Event('input', { bubbles: true }));
          el.dispatchEvent(new window.Event('change', { bubbles: true }));
        });
      } else if (assertion.type === 'click') {
        const el = rootEl.querySelector(assertion.selector);
        if (!el) throw new Error(`Missing selector ${assertion.selector}`);
        await act(async () => {
          el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        });
      } else if (assertion.type === 'expectSelector') {
        if (!rootEl.querySelector(assertion.selector)) {
          throw new Error(`Missing selector ${assertion.selector}`);
        }
      }
    }

    if (expected.pass === false) {
      out({ ok: false, status: 'WRONG_ANSWER', error: 'Expected failure fixture' });
      return;
    }

    out({ ok: true, output: JSON.stringify({ pass: true }) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = /Import not allowed|SyntaxError|Unexpected/i.test(msg)
      ? 'COMPILATION_ERROR'
      : /Expected|Missing/i.test(msg)
        ? 'WRONG_ANSWER'
        : 'RUNTIME_ERROR';
    out({ ok: false, status, error: msg.slice(0, 500) });
  }
}

await main();
