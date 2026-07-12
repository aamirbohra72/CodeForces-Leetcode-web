export type LlmQuestion = {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'long_answer';
  marks: number;
  question: string;
  options?: string[];
  correct_answer?: string;
  expected_answer?: string;
  explanation: string;
};

export type LlmFlashcard = { id: string; front: string; back: string };

export type LlmTutorial = {
  id: string;
  title: string;
  dateLabel: string;
  duration: string;
  estimatedTimeLeft: string;
  videoTitle: string;
  videoMeta: string;
  questions: LlmQuestion[];
  flashcards: LlmFlashcard[];
  notes: {
    title: string;
    introduction: string;
    keyConcepts: { heading: string; body: string }[];
  };
  coinsPerCorrect: number;
  completionBonusCoins: number;
  watchSessionCoins: number;
};

export type LlmCoursePack = {
  courseId: string;
  courseTitle: string;
  topic: string;
  generatedAt?: string;
  source: 'llm';
  tutorials: LlmTutorial[];
};

/** Courses that load curriculum live from Mistral (not static TS/JSON). */
export const LLM_COURSE_IDS = new Set(['3']);

export function isLlmDrivenCourse(courseId: string): boolean {
  return LLM_COURSE_IDS.has(courseId);
}
