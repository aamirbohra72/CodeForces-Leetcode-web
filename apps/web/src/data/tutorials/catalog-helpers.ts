import type { AssignmentQuestion } from '@/types/assignment';
import type { CourseTutorial } from '@/data/tutorials/system-design';
import type { TutorialLearningContent } from '@/data/tutorials/learning-content';

export function mcq(
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  marks = 2,
): AssignmentQuestion {
  return {
    id,
    type: 'multiple_choice',
    marks,
    question,
    options,
    correct_answer: options[correctIndex],
    explanation,
  };
}

export function tutorial(
  partial: Omit<CourseTutorial, 'estimatedTimeLeft' | 'videoMeta'> & {
    estimatedTimeLeft?: string;
    videoMeta?: string;
  },
): CourseTutorial {
  return {
    estimatedTimeLeft: partial.estimatedTimeLeft ?? '2 hours left',
    videoMeta: partial.videoMeta ?? 'Self-paced · Notes + practice included',
    ...partial,
  };
}

export function learning(
  tutorialId: string,
  notesTitle: string,
  introduction: string,
  concepts: { heading: string; body: string }[],
  flashcards: { front: string; back: string }[],
): TutorialLearningContent {
  return {
    tutorialId,
    coinsPerCorrect: 2,
    completionBonusCoins: 8,
    watchSessionCoins: 3,
    flashcards: flashcards.map((f, i) => ({
      id: `${tutorialId}-f${i + 1}`,
      front: f.front,
      back: f.back,
    })),
    notes: {
      title: notesTitle,
      introduction,
      keyConcepts: concepts,
    },
  };
}

export type CatalogBank = {
  tutorials: CourseTutorial[];
  questions: AssignmentQuestion[];
  learning: Record<string, TutorialLearningContent>;
};
