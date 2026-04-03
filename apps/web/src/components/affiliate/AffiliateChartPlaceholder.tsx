export function AffiliateChartPlaceholder() {
  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white">Month-wise course sales</h2>
      <div
        className="mt-4 flex h-48 items-center justify-center rounded-lg bg-[#1a1a1a] text-sm text-[#666]"
        role="img"
        aria-label="Chart placeholder — connect analytics to render sales over time"
      >
        Chart will load when sales data is available.
      </div>
    </section>
  );
}
