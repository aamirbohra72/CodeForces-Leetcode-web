export function AffiliateStudentsTable() {
  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white">Enrolled students</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-[#3a3a3a]">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#3a3a3a] bg-[#252525]">
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[#888]">Student</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[#888]">Status</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[#888]">Earned</th>
              <th className="px-3 py-2 font-semibold uppercase tracking-wide text-[#888]">Commission</th>
            </tr>
          </thead>
        </table>
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-[#888]">
          <span className="text-2xl" aria-hidden>
            🔒
          </span>
          <p className="max-w-sm text-sm">
            No referrals yet. Share your links — when students enroll, they will show up here.
          </p>
        </div>
      </div>
    </section>
  );
}
