/**
 * Stable numeric-looking affiliate ref from a user id (or fallback).
 * Same input always yields same ref (deterministic for shareable links).
 */
export function affiliateRefFromUserId(userId: string | undefined | null): string {
  if (!userId || !userId.trim()) {
    return 'guest';
  }
  let h = 0;
  for (let i = 0; i < userId.length; i++) {
    h = (Math.imul(31, h) + userId.charCodeAt(i)) | 0;
  }
  const positive = Math.abs(h);
  return String(1_000_000_000 + (positive % 8_999_999_999));
}
