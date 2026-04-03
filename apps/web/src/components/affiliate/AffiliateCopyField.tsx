'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/lib/cn';

export type AffiliateCopyFieldProps = {
  label: string;
  value: string;
  className?: string;
  /** Shorter label for screen readers / mobile */
  copyLabel?: string;
};

export function AffiliateCopyField({ label, value, className, copyLabel = 'Copy link' }: AffiliateCopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [value]);

  return (
    <div className={cn('rounded-lg border border-dashed border-emerald-500/50 bg-emerald-500/10 p-3', className)}>
      {label ? <p className="mb-2 text-xs font-medium text-[#a0a0a0]">{label}</p> : null}
      <div className="flex flex-wrap items-center gap-2">
        <code className="min-w-0 flex-1 break-all text-sm text-white">{value}</code>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-md bg-[#3a3a3a] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4a4a4a]"
          aria-label={copyLabel}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
