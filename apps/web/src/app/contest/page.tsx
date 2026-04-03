import { redirect } from 'next/navigation';

/** Alias: global nav and copy use "Contests"; support singular /contest. */
export default function ContestPage() {
  redirect('/contests');
}
