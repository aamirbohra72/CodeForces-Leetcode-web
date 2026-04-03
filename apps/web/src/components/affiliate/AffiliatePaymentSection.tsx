export function AffiliatePaymentSection() {
  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white">Payment methods</h2>
      <p className="mt-1 text-sm text-[#a0a0a0]">Manage your payout details.</p>
      <div className="mt-6 flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-[#4a4a4a] bg-[#1a1a1a]/50">
        <button
          type="button"
          className="rounded-lg border border-[#3a3a3a] bg-[#333] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#444]"
          disabled
          title="Coming soon"
        >
          + Add payment method
        </button>
      </div>
      <p className="mt-2 text-xs text-[#666]">Payout method onboarding will be available after your affiliate account is approved.</p>
    </section>
  );
}
