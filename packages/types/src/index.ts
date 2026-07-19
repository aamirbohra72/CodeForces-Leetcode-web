import type { UserRole as DBUserRole, ContestStatus as DBContestStatus, SubmissionStatus as DBSubmissionStatus } from '@codeforces/db';

export type UserRole = DBUserRole;
export type ContestStatus = DBContestStatus;
export type SubmissionStatus = DBSubmissionStatus;

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contest {
  id: string;
  name: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  status: ContestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  contestId: string;
  slug?: string | null;
  title: string;
  description: string;
  difficulty: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  /** When set, used for /practice language filter and badges (JavaScript vs React.js) */
  practiceLanguage?: string | null;
  companies?: string[];
  estimatedTime?: string | null;
  judgeMode?: 'STDIN' | 'JS_FUNCTION' | 'REACT_COMPONENT';
  allowedLanguages?: string[];
  starterCode?: string | null;
  judgeReady?: boolean;
  sampleTestCases?: Array<{
    id: string;
    name: string;
    input: string;
    expectedOutput: string;
    isSample: boolean;
    order: number;
  }>;
  testCaseSummary?: {
    sampleCount: number;
    hiddenCount: number;
    totalCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionResultCase {
  name: string;
  order: number;
  isHidden: boolean;
  isSample: boolean;
  passed: boolean;
  status: string;
  expected?: string;
  actual?: string;
  message?: string;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
  score?: number;
  aiResponse?: string | null;
  resultJson?: string | null;
  hintText?: string | null;
  submittedAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

