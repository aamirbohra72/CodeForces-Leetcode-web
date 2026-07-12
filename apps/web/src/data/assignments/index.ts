import type { Assignment } from '@/types/assignment';
import { hldEdtechAssignment } from './hld-edtech';

/** All seeded assignments. Add more JSON/TS modules here as you expand courses. */
export const allAssignments: Assignment[] = [hldEdtechAssignment];

export function getAssignmentsForCourse(courseId: string): Assignment[] {
  return allAssignments.filter((a) => a.courseId === courseId);
}

export function getAssignmentById(assignmentId: string): Assignment | undefined {
  return allAssignments.find((a) => a.id === assignmentId);
}
