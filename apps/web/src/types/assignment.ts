export type QuestionType = 'multiple_choice' | 'short_answer' | 'long_answer';

export interface AssignmentQuestion {
  id: string;
  type: QuestionType;
  marks: number;
  question: string;
  options?: string[];
  correct_answer?: string;
  expected_answer?: string;
  explanation?: string;
}

export interface AssignmentSection {
  section_id: string;
  title: string;
  marks: number;
  questions: AssignmentQuestion[];
}

export interface GradingRubric {
  multiple_choice: string;
  short_answer: {
    full_marks: string;
    partial_marks: string;
    zero: string;
  };
  long_answer: {
    full_marks: string;
    partial_marks: string;
    zero: string;
  };
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  total_marks: number;
  estimated_time: string;
  sections: AssignmentSection[];
  grading_rubric?: GradingRubric;
  topics_covered?: string[];
}

export interface FlatQuestion extends AssignmentQuestion {
  sectionId: string;
  sectionTitle: string;
}

export function flattenAssignmentQuestions(assignment: Assignment): FlatQuestion[] {
  return assignment.sections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      sectionId: section.section_id,
      sectionTitle: section.title,
    })),
  );
}
