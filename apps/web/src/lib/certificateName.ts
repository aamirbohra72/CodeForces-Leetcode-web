/**
 * Prefer a human-readable name for certificates (Clerk profile → email → username).
 */
export function formatNameFromEmailLocal(localPart: string): string {
  return localPart
    .replace(/[._+-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function resolveCertificateRecipientName(input: {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  username?: string | null;
}): string {
  const fromParts = [input.firstName, input.lastName]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
  if (fromParts) return fromParts;

  const full = (input.fullName || '').trim();
  if (full) return full;

  const email = (input.email || '').trim();
  if (email.includes('@')) {
    return formatNameFromEmailLocal(email.split('@')[0]);
  }

  const username = (input.username || '').trim();
  if (username) return username;

  return 'Learner';
}
