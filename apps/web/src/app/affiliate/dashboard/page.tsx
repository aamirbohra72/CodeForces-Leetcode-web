import { redirect } from 'next/navigation';

/** Alias for tools/bookmarks that expect `/affiliate/dashboard`. */
export default function AffiliateDashboardAliasPage() {
  redirect('/affiliate');
}
