import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
const aadharRegex = /^[0-9]{12}$/;
const inMobileRegex = /^[6-9][0-9]{9}$/;

const indiaSchema = z.object({
  region: z.literal('india'),
  panNumber: z.string().regex(panRegex, 'Invalid PAN format'),
  nameOnPan: z.string().min(2).max(120),
  aadharNumber: z.string().regex(aadharRegex, 'Aadhaar must be 12 digits'),
  state: z.string().min(1),
  phone: z.string().regex(inMobileRegex, 'Enter a valid 10-digit Indian mobile'),
});

const internationalSchema = z.object({
  region: z.literal('international'),
  fullName: z.string().min(2).max(120),
  country: z.string().min(2).max(80),
  taxId: z.string().min(2).max(40).optional(),
  phone: z.string().min(8).max(20),
});

const bodySchema = z.discriminatedUnion('region', [
  indiaSchema,
  internationalSchema,
]);

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Persist to DB / queue when ready; log shape only in dev.
  return NextResponse.json({
    ok: true,
    message: 'Application received. Our team will review your details.',
  });
}
