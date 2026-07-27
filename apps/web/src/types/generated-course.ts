export type TopicType =
  | 'diagnostic'
  | 'lesson'
  | 'guided_practice'
  | 'quiz'
  | 'summary';

export interface SanitizedMCQ {
  id: string;
  question: string;
  options: string[];
  explanation: string;
}

export interface GeneratedTopic {
  id: string;
  unitId: string;
  title: string;
  type: TopicType;
  order: number;
  estimatedMinutes: number;
  content: string;
  mcqs: SanitizedMCQ[];
  completed?: boolean;
  score?: number | null;
}

export interface GeneratedUnit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  tags: string[];
  topics: GeneratedTopic[];
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  createdBy: string;
  createdAt: string;
  units: GeneratedUnit[];
}

export interface QuizResult {
  score: number;
  total: number;
  results: Array<{ correct: boolean; explanation: string }>;
}

export type SourceType = 'text' | 'pdf' | 'topic';

export const TOPIC_TYPE_LABELS: Record<TopicType, string> = {
  diagnostic: 'Diagnostic',
  lesson: 'Lesson',
  guided_practice: 'Guided Practice',
  quiz: 'Quiz',
  summary: 'Summary',
};

export function topicTypeIcon(type: TopicType): string {
  switch (type) {
    case 'diagnostic':
      return '📋';
    case 'lesson':
      return '📖';
    case 'guided_practice':
      return '💻';
    case 'quiz':
      return '❓';
    case 'summary':
      return '✅';
    default:
      return '📄';
  }
}
