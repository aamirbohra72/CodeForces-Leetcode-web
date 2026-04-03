import { AFFILIATE_INSTRUCTIONS } from '@/data/affiliate';

export function AffiliateInstructions() {
  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white">Instructions for affiliate partners</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[#c8c8c8]">
        {AFFILIATE_INSTRUCTIONS.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </section>
  );
}
