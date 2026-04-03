import type { DsaDifficulty } from '@/data/dsa-sheet';
import { cn } from '@/lib/cn';

const styles: Record<DsaDifficulty, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

type DsaDifficultyBadgeProps = {
  difficulty: DsaDifficulty;
  className?: string;
};

export function DsaDifficultyBadge({ difficulty, className }: DsaDifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize',
        styles[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}
