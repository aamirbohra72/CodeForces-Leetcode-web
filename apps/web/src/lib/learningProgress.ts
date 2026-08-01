'use client';

import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  syncStreakToLocal,
  type CompleteItemPayload,
  type CourseLearningProgress,
  type LearningSummary,
} from '@/types/learning-progress';

export async function fetchLearningSummary(): Promise<LearningSummary | null> {
  if (!getToken()) return null;
  const summary = await api.get<LearningSummary>('/progress/me');
  syncStreakToLocal(summary.streak);
  return summary;
}

export async function fetchCourseProgress(
  courseId: string,
): Promise<CourseLearningProgress | null> {
  if (!getToken()) return null;
  const data = await api.get<{ progress: CourseLearningProgress | null }>(
    `/progress/course/${encodeURIComponent(courseId)}`,
  );
  return data.progress;
}

export async function completeLearningItem(payload: CompleteItemPayload) {
  const result = await api.post<{
    progress: CourseLearningProgress;
    streak: LearningSummary['streak'];
  }>('/progress/item/complete', payload);
  syncStreakToLocal(result.streak);
  return result;
}
