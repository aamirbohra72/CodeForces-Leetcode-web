'use client';

import { useCallback, useState } from 'react';
import { INDIAN_STATES } from '@/data/affiliate';
import { cn } from '@/lib/cn';

type Region = 'india' | 'international';

export function AffiliateKycForm() {
  const [region, setRegion] = useState<Region>('india');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMessage(null);
      const form = e.currentTarget;
      const fd = new FormData(form);

      const base = { phone: String(fd.get('phone') ?? '').trim() };

      const body =
        region === 'india'
          ? {
              region: 'india' as const,
              ...base,
              panNumber: String(fd.get('panNumber') ?? '').trim().toUpperCase(),
              nameOnPan: String(fd.get('nameOnPan') ?? '').trim(),
              aadharNumber: String(fd.get('aadharNumber') ?? '').replace(/\s/g, ''),
              state: String(fd.get('state') ?? ''),
            }
          : {
              region: 'international' as const,
              ...base,
              fullName: String(fd.get('fullName') ?? '').trim(),
              country: String(fd.get('country') ?? '').trim(),
              taxId: String(fd.get('taxId') ?? '').trim() || undefined,
            };

      setSubmitting(true);
      try {
        const res = await fetch('/api/affiliate/application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
        if (!res.ok) {
          setMessage({ type: 'err', text: data.error ?? 'Something went wrong' });
          return;
        }
        setMessage({ type: 'ok', text: data.message ?? 'Submitted successfully.' });
        form.reset();
      } catch {
        setMessage({ type: 'err', text: 'Network error. Try again.' });
      } finally {
        setSubmitting(false);
      }
    },
    [region]
  );

  return (
    <section className="rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] p-6">
      <h2 className="text-lg font-semibold text-white">Affiliate verification (KYC)</h2>
      <div
        className="mt-4 rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sm text-[#b8d4e8]"
        role="note"
      >
        <p className="font-medium text-sky-200">Before you submit</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Use details exactly as on your government ID.</li>
          <li>Keep ID images under 150KB when uploads are enabled.</li>
          <li>Documents must be legible; blurry photos may delay approval.</li>
        </ol>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-[#b0b0b0]">Where are you from?</span>
        <div className="flex rounded-lg border border-[#3a3a3a] p-0.5">
          {(
            [
              { id: 'international' as const, label: 'Outside India' },
              { id: 'india' as const, label: 'India' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRegion(opt.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-semibold transition',
                region === opt.id ? 'bg-emerald-600 text-white' : 'text-[#b0b0b0] hover:text-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {region === 'india' ? (
          <>
            <Field label="PAN number" required>
              <input
                name="panNumber"
                required
                maxLength={10}
                placeholder="ABCDE1234F"
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                autoComplete="off"
              />
            </Field>
            <Field label="Name on PAN" required>
              <input
                name="nameOnPan"
                required
                placeholder="Full name as on PAN"
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </Field>
            <Field label="Aadhaar number" required>
              <input
                name="aadharNumber"
                required
                inputMode="numeric"
                pattern="[0-9]{12}"
                maxLength={12}
                placeholder="12-digit Aadhaar"
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </Field>
            <Field label="State" required>
              <select
                name="state"
                required
                defaultValue=""
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" disabled>
                  Select state
                </option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Full legal name" required>
              <input
                name="fullName"
                required
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </Field>
            <Field label="Country" required>
              <input
                name="country"
                required
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </Field>
            <Field label="Tax ID (optional)">
              <input
                name="taxId"
                className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </Field>
          </>
        )}

        <Field label="Phone number" required>
          <input
            name="phone"
            required
            inputMode="tel"
            placeholder={region === 'india' ? '10-digit mobile' : 'Include country code if applicable'}
            className="w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2 text-white placeholder:text-[#666] focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </Field>

        <p className="text-xs text-[#888]">
          Identity document uploads will attach to this application when file storage is enabled for your account.
        </p>

        {message ? (
          <p
            className={cn('text-sm', message.type === 'ok' ? 'text-emerald-400' : 'text-red-400')}
            role="status"
          >
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-[#b0b0b0]">
        {label}
        {required ? <span className="text-red-400"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
