import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { REFERRAL_PROGRAMS } from '@/data/referral';

const programIds = REFERRAL_PROGRAMS.map((p) => p.id) as [string, ...string[]];

const inviteSchema = z.object({
  friendName: z.string().trim().min(2).max(80),
  friendPhone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile'),
  friendEmail: z.string().trim().email().max(120),
  graduationYear: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, 'Enter a valid graduation year'),
  programId: z.enum(programIds),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = inviteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Persist to DB / CRM when ready.
  return NextResponse.json({
    ok: true,
    message: 'Referral submitted. We will reach out to your friend soon.',
  });
}
