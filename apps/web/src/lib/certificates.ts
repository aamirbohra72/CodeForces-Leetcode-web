/**
 * Certificate claim flow — driven by enrollments + DB learning progress.
 */

export type CertificateStatus = 'enroll' | 'in_progress' | 'eligible';

export type CertificateCourse = {
  id: string;
  /** Product /learn/:id used for enrollment + progress */
  productId: string;
  title: string;
  href: string;
};

export const CERTIFICATE_COURSES: CertificateCourse[] = [
  { id: '1', productId: '1', title: 'Salaam DSA', href: '/learn/1' },
  { id: '2', productId: '2', title: 'Salaam Node.js', href: '/learn/2' },
  { id: '3', productId: '5', title: 'Salaam Frontend System Design', href: '/learn/5' },
  { id: '4', productId: '3', title: 'Salaam React', href: '/learn/3' },
  { id: '5', productId: '4', title: 'Salaam JavaScript', href: '/learn/4' },
  { id: '6', productId: 'interview', title: 'Crack Frontend Interview', href: '/interview' },
  { id: '7', productId: 'masterclass', title: 'Masterclasses', href: '/learn' },
];

const completedKey = (courseId: string) => `certificate:completed:${courseId}`;
const enrolledKey = (productId: string) => `enrolled:course:${productId}`;

export function isCourseCompleted(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(completedKey(productId)) === '1';
}

export function markCourseCompleted(productId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(completedKey(productId), '1');
}

export function isCourseEnrolled(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(enrolledKey(productId)) === '1';
}

export function getCertificateStatus(
  course: CertificateCourse,
  opts?: { enrolled?: boolean; percent?: number; completed?: boolean },
): CertificateStatus {
  if (opts?.completed || isCourseCompleted(course.productId) || (opts?.percent ?? 0) >= 80) {
    return 'eligible';
  }
  if (opts?.enrolled || isCourseEnrolled(course.productId) || (opts?.percent ?? 0) > 0) {
    return 'in_progress';
  }
  return 'enroll';
}

export function resolveCertificateCourses(opts?: {
  enrolledIds?: Set<string>;
  progressByProduct?: Map<string, { percent: number; completed: boolean }>;
}): Array<CertificateCourse & { status: CertificateStatus; percent: number }> {
  return CERTIFICATE_COURSES.map((course) => {
    const progress = opts?.progressByProduct?.get(course.productId);
    const enrolled =
      opts?.enrolledIds?.has(course.productId) || isCourseEnrolled(course.productId);
    const status = getCertificateStatus(course, {
      enrolled,
      percent: progress?.percent,
      completed: progress?.completed,
    });
    return {
      ...course,
      status,
      percent: progress?.percent ?? (status === 'eligible' ? 100 : 0),
    };
  });
}
