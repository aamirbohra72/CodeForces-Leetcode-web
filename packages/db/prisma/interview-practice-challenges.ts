/**
 * @deprecated Use packages/db/prisma/catalog instead.
 * Kept so older imports do not break; re-exports catalog challenges mapped to legacy shape.
 */
import { allCatalogChallenges } from './catalog';

export type InterviewChallengeSeed = {
  title: string;
  description: string;
  difficulty: string;
  practiceLanguage: string;
  companies: string[];
  estimatedTime: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
};

export const interviewPracticeChallenges: InterviewChallengeSeed[] = allCatalogChallenges.map((c) => ({
  title: c.title,
  description: c.description,
  difficulty: c.difficulty,
  practiceLanguage: c.practiceLanguage,
  companies: c.companies,
  estimatedTime: c.estimatedTime,
  inputFormat: c.inputFormat,
  outputFormat: c.outputFormat,
  constraints: c.constraints,
  sampleInput: c.sampleInput,
  sampleOutput: c.sampleOutput,
}));
