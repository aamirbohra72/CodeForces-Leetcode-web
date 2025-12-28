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
  title: string;
  description: string;
  difficulty: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
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

