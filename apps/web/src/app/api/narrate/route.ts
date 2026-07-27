import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Stub narration endpoint — echoes captionSeed so the visualizer UI
 * is testable end-to-end. Real Mistral wiring lands separately.
 */
const narrateSchema = z.object({
  scriptId: z.string().min(1),
  approachId: z.string().optional(),
  stepIndex: z.number().int().nonnegative(),
  captionSeed: z.string(),
  state: z.record(z.union([z.string(), z.number(), z.null()])),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = narrateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { captionSeed } = parsed.data;

  // Simulate a tiny network delay so the CaptionBar skeleton is visible
  await new Promise((r) => setTimeout(r, 180));

  return NextResponse.json({ caption: captionSeed });
}
