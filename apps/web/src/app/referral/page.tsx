import type { Metadata } from 'next';
import { ReferralLanding } from '@/components/referral/ReferralLanding';

export const metadata: Metadata = {
  title: 'Referral Program | Codeforces Platform',
  description:
    'Join the referral program — earn cash for every friend who enrolls, and give them a course discount.',
};

export default function ReferralPage() {
  return <ReferralLanding />;
}
