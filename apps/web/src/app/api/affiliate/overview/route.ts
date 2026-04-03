import { NextRequest, NextResponse } from 'next/server';
import {
  AFFILIATE_COURSES,
  AFFILIATE_QUERY_KEY,
} from '@/data/affiliate';

function decodeJwtPayloadSub(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = JSON.parse(
      Buffer.from(padded, 'base64').toString('utf8')
    ) as { userId?: string; sub?: string };
    return json.userId ?? json.sub ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  let userId: string | null = null;
  if (auth?.startsWith('Bearer ')) {
    userId = decodeJwtPayloadSub(auth.slice(7));
  }

  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  const origin =
    publicUrl ||
    (req.headers.get('x-forwarded-host') && req.headers.get('x-forwarded-proto')
      ? `${req.headers.get('x-forwarded-proto')}://${req.headers.get('x-forwarded-host')}`
      : req.nextUrl.origin);

  const courses = AFFILIATE_COURSES.map((c) => ({
    id: c.id,
    name: c.name,
    path: c.path,
    commissionPercent: c.commissionPercent,
    soldCount: c.soldCount,
  }));

  const studentsRegistered = 0;
  const redeemedInr = 0;
  const pendingInr = 0;
  const lockedInr = 0;
  const earnedInrTillDate = redeemedInr + pendingInr + lockedInr;

  return NextResponse.json({
    userId: userId ?? null,
    metrics: {
      studentsRegistered,
      redeemedInr,
      pendingInr,
      lockedInr,
      earnedInrTillDate,
    },
    courses,
    siteOrigin: origin,
    queryKey: AFFILIATE_QUERY_KEY,
  });
}
