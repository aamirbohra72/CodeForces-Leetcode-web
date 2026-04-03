'use client';

import { AffiliateCopyField } from '@/components/affiliate/AffiliateCopyField';

export type AffiliateCourseTableRow = {
  id: string;
  name: string;
  commissionPercent: number;
  fullUrl: string;
  soldCount: number;
};

export type AffiliateCourseTableProps = {
  rows: AffiliateCourseTableRow[];
  /** When set, empty rows show this instead of the loading state. */
  errorMessage?: string | null;
};

export function AffiliateCourseTable({ rows, errorMessage }: AffiliateCourseTableProps) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-[#3a3a3a] bg-[#1a1a1a]/40 px-4 py-10 text-center text-sm text-[#888]">
        {errorMessage ?? 'Loading affiliate links…'}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[#3a3a3a]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#3a3a3a] bg-[#252525]">
            <th className="px-4 py-3 font-semibold text-[#b0b0b0]">Course</th>
            <th className="px-4 py-3 font-semibold text-[#b0b0b0]">Commission</th>
            <th className="px-4 py-3 font-semibold text-[#b0b0b0]">Link</th>
            <th className="px-4 py-3 font-semibold text-[#b0b0b0]">Sold</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#3a3a3a] last:border-0">
              <td className="px-4 py-3 font-medium text-white">{row.name}</td>
              <td className="px-4 py-3 text-emerald-400">{row.commissionPercent}% of final price</td>
              <td className="px-4 py-3">
                <AffiliateCopyField label="" value={row.fullUrl} className="border-emerald-500/30 bg-[#1a1a1a]/80 p-2" />
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  {row.soldCount} sold
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
