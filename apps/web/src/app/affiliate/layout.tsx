import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate | Dashboard',
  description: 'Affiliate program — links, commissions, and verification.',
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
