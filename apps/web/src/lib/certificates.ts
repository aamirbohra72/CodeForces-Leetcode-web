/**
 * Certificate claim flow — course catalog + local completion state.
 * Completion can later be driven by real progress APIs.
 */

export type CertificateStatus = 'enroll' | 'in_progress' | 'eligible';

export type CertificateCourse = {
  id: string;
  title: string;
  /** Learn / feature path for enroll / continue */
  href: string;
  /**
   * Seeded eligibility for demo / known completions.
   * Runtime completion in localStorage overrides this when set.
   */
  seedEligible?: boolean;
};

export const CERTIFICATE_COURSES: CertificateCourse[] = [
  { id: '1', title: 'Salaam DSA', href: '/learn/1' },
  { id: '2', title: 'Salaam Node.js', href: '/learn/2' },
  { id: '3', title: 'Salaam Frontend System Design', href: '/learn/5' },
  { id: '4', title: 'Salaam React', href: '/learn/3' },
  {
    id: '5',
    title: 'Salaam JavaScript',
    href: '/learn/4',
    seedEligible: true,
  },
  { id: '6', title: 'Crack Frontend Interview', href: '/interview' },
  { id: '7', title: 'Masterclasses', href: '/learn' },
];

const completedKey = (courseId: string) => `certificate:completed:${courseId}`;
const enrolledKey = (courseId: string) => `enrolled:course:${courseId}`;

export function isCourseCompleted(courseId: string): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(completedKey(courseId)) === '1') return true;
  const course = CERTIFICATE_COURSES.find((c) => c.id === courseId);
  return Boolean(course?.seedEligible);
}

export function markCourseCompleted(courseId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(completedKey(courseId), '1');
}

export function isCourseEnrolled(courseId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(enrolledKey(courseId)) === '1';
}

export function getCertificateStatus(course: CertificateCourse): CertificateStatus {
  if (isCourseCompleted(course.id)) return 'eligible';
  if (isCourseEnrolled(course.id)) return 'in_progress';
  return 'enroll';
}

export function resolveCertificateCourses(): Array<CertificateCourse & { status: CertificateStatus }> {
  return CERTIFICATE_COURSES.map((course) => ({
    ...course,
    status: getCertificateStatus(course),
  }));
}
