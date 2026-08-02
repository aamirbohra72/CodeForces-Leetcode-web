import type { AssignmentQuestion } from '@/types/assignment';
import type { CourseTutorial } from '@/data/tutorials/system-design';
import {
  getHldQuestionsByIds,
  systemDesignTutorials,
} from '@/data/tutorials/system-design';
import type { TutorialLearningContent } from '@/data/tutorials/learning-content';
import { dsaBank } from './catalog-dsa';
import { nodeBank } from './catalog-nodejs';
import { reactBank } from './catalog-react';
import { javascriptBank } from './catalog-javascript';
import { pythonBank } from './catalog-python';

const banks = [dsaBank, nodeBank, reactBank, javascriptBank, pythonBank];

const questionById = new Map(
  banks.flatMap((b) => b.questions).map((q) => [q.id, q] as const),
);

export const catalogLearningById: Record<string, TutorialLearningContent> = {
  ...dsaBank.learning,
  ...nodeBank.learning,
  ...reactBank.learning,
  ...javascriptBank.learning,
  ...pythonBank.learning,
};

export function getTutorialsForCourse(courseId: string): CourseTutorial[] {
  if (courseId === '5') return systemDesignTutorials;
  switch (courseId) {
    case '1':
      return dsaBank.tutorials;
    case '2':
      return nodeBank.tutorials;
    case '3':
      return reactBank.tutorials;
    case '4':
      return javascriptBank.tutorials;
    case '6':
      return pythonBank.tutorials;
    default:
      return [];
  }
}

export function getTutorial(
  courseId: string,
  tutorialId: string,
): CourseTutorial | undefined {
  return getTutorialsForCourse(courseId).find((t) => t.id === tutorialId);
}

export function getQuestionsForTutorial(
  courseId: string,
  questionIds: string[],
): AssignmentQuestion[] {
  if (courseId === '5') return getHldQuestionsByIds(questionIds);
  return questionIds
    .map((id) => questionById.get(id))
    .filter((q): q is AssignmentQuestion => Boolean(q));
}

export function getCatalogLessonCount(courseId: string): number {
  return getTutorialsForCourse(courseId).length;
}
