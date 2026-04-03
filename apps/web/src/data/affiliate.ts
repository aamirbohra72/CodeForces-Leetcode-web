/**
 * Affiliate program config — single source for UI + API routes.
 * Replace with CMS/DB when payouts go live.
 */

export type AffiliateCourseRow = {
  id: string;
  name: string;
  /** e.g. path or slug appended to site origin */
  path: string;
  commissionPercent: number;
  soldCount: number;
};

export const AFFILIATE_COURSES: AffiliateCourseRow[] = [
  {
    id: 'react',
    name: 'React Mastery',
    path: '/courses/react',
    commissionPercent: 10,
    soldCount: 0,
  },
  {
    id: 'frontend-sd',
    name: 'Frontend System Design',
    path: '/courses/frontend-system-design',
    commissionPercent: 10,
    soldCount: 0,
  },
  {
    id: 'node',
    name: 'Node.js Backend',
    path: '/courses/node',
    commissionPercent: 10,
    soldCount: 0,
  },
];

export const AFFILIATE_INSTRUCTIONS: string[] = [
  'Promote courses with integrity — no misleading claims or impersonation.',
  'Minimum payout threshold is ₹1000 INR (approximately $12 USD).',
  'Indian partners must submit valid PAN and Aadhaar for tax compliance.',
  'Payouts are processed on a schedule; amounts may vary with FX rates.',
  'Do not bid on our brand keywords in paid ads without written approval.',
  'Commission unlock timing follows each course’s refund window policy.',
  'For disputes or support, contact your platform support email listed in Settings.',
  'Keep affiliate links intact; altering tracking parameters may void commission.',
  'We reserve the right to suspend accounts that violate program terms.',
];

export const INDIAN_STATES: readonly string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
] as const;

export const AFFILIATE_QUERY_KEY = '_aff';
