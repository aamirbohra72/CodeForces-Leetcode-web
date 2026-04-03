/**
 * Concatenate class names; omit falsy values.
 */
export function cn(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ');
}
