import { cn } from '@/lib/cn';

export type AffiliateMetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  valueClassName?: string;
};

export function AffiliateMetricCard({ title, value, subtitle, valueClassName }: AffiliateMetricCardProps) {
  return (
    <div className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-4">
      <p className="text-sm text-[#b0b0b0]">{title}</p>
      <p className={cn('mt-1 text-lg font-semibold tabular-nums', valueClassName ?? 'text-white')}>{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-[#888]">{subtitle}</p> : null}
    </div>
  );
}
