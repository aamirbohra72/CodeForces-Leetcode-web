'use client';

import { cn } from '@/lib/cn';
import type { Step } from '@/types/visual-script';

type StatePanelProps = {
  state: Step['state'];
  className?: string;
};

export function StatePanel({ state, className }: StatePanelProps) {
  const entries = Object.entries(state);

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#141414]',
        className,
      )}
    >
      <div className="shrink-0 border-b border-[#3a3a3a] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
        state
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {entries.length === 0 ? (
          <p className="px-3 py-2 text-sm text-white/35">—</p>
        ) : (
          <table className="w-full text-left">
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-1.5 font-mono text-xs text-white/40">{key}</td>
                  <td className="px-3 py-1.5 text-right font-mono text-sm text-white/85">
                    {value === null ? '—' : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
