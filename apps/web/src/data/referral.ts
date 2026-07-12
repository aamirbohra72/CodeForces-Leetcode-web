/**
 * Referral program config — marketing copy + reward math.
 * Keeps UI and API routes aligned.
 */

export const REFERRAL_REWARD_INR = 5000;
export const REFERRAL_FRIEND_DISCOUNT_INR = 2000;
export const REFERRAL_OLD_REWARD_INR = 2000;
export const REFERRAL_MAX_CALCULATOR = 8;
export const REFERRAL_JOINED_KEY = 'referral:joined';

export const REFERRAL_PROGRAMS = [
  { id: 'dsa', label: 'Salaam DSA' },
  { id: 'nodejs', label: 'Salaam Node.js' },
  { id: 'react', label: 'Salaam React' },
  { id: 'javascript', label: 'Salaam JavaScript' },
  { id: 'system-design', label: 'Frontend System Design' },
  { id: 'interview', label: 'Crack Frontend Interview' },
] as const;

export const REFERRAL_STEPS = [
  {
    id: 'share',
    title: 'Share their details',
    description: 'Just a name, phone, and email. Takes about 10 seconds.',
    icon: '📝',
  },
  {
    id: 'details',
    title: 'Tell us more',
    description: 'Pick a program so we can reach out at the right time.',
    icon: '🎯',
  },
  {
    id: 'payout',
    title: 'Set up your payout',
    description: 'One-time verification on your Affiliate dashboard.',
    icon: '🏦',
  },
  {
    id: 'earn',
    title: 'Get referral rewards',
    description: `When they enroll, you earn ₹${REFERRAL_REWARD_INR.toLocaleString('en-IN')}.`,
    icon: '🎉',
  },
] as const;

export const REFERRAL_AUDIENCES = [
  { id: 'job', label: 'Anybody looking for work', icon: '🔭' },
  { id: 'career', label: 'Wishing to move careers', icon: '💼' },
  { id: 'skills', label: 'Want to upgrade skills', icon: '✨' },
  { id: 'begin', label: 'Beginning a career in programming', icon: '💻' },
  { id: 'language', label: 'Learning a new coding language', icon: '⌨️' },
  { id: 'degree', label: 'Seeking a degree in programming', icon: '🎓' },
] as const;

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function rewardForReferrals(count: number): number {
  const n = Math.max(0, Math.min(REFERRAL_MAX_CALCULATOR, Math.floor(count)));
  return n * REFERRAL_REWARD_INR;
}

export function rewardTableRows(max = 5): Array<{ referrals: number; cash: number }> {
  return Array.from({ length: max }, (_, i) => {
    const referrals = i + 1;
    return { referrals, cash: rewardForReferrals(referrals) };
  });
}
