'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';

type ToastProps = {
  message: string;
  type?: 'error' | 'success';
  onDismiss: () => void;
};

export function Toast({ message, type = 'error', onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 max-w-md rounded-lg border px-4 py-3 text-sm shadow-lg',
        type === 'error'
          ? 'border-red-500/40 bg-red-950/90 text-red-100'
          : 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-white/60 hover:text-white"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
