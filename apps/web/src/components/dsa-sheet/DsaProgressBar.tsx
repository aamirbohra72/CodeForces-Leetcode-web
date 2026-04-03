import { cn } from '@/lib/cn';

type DsaProgressBarProps = {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
};

export function DsaProgressBar({ completed, total, className, showLabel = true }: DsaProgressBarProps) {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100));
  return (
    <div className={cn('w-full', className)}>
      {showLabel ? (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-white">Overall progress</span>
          <span className="text-white/50">
            {completed} of {total} completed
          </span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="mt-1 flex justify-end">
        <span className="text-sm font-semibold text-green-400">{pct}%</span>
      </div>
    </div>
  );
}
