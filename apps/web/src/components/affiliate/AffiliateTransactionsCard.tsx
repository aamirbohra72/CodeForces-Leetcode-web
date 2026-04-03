export function AffiliateTransactionsCard() {
  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Transaction history</h2>
          <p className="mt-1 text-xs text-[#888]">Payouts and commission releases.</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-amber-900/40 px-3 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-700/50 transition hover:bg-amber-900/60"
          disabled
          title="Available when balance exceeds threshold"
        >
          Ask for payout
        </button>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center py-10 text-center text-sm text-[#a0a0a0]">
        <p className="max-w-md">
          No payout history yet. Share courses with your network — your commission timeline will appear here.
        </p>
      </div>
    </section>
  );
}
