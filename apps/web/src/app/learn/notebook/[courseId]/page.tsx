'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { CourseOutlinePage } from '@/components/courses/CourseOutlinePage';
import { api } from '@/lib/api';
import type { GeneratedCourse } from '@/types/generated-course';

function isContentPending(course: GeneratedCourse): boolean {
  return course.units.some((u) => u.topics.some((t) => !t.content?.trim()));
}

export default function NotebookCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<GeneratedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writingLessons, setWritingLessons] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const load = async () => {
      try {
        const data = await api.get<GeneratedCourse>(`/courses/${courseId}`);
        if (cancelled) return;
        setCourse(data);
        setError('');
        setLoading(false);

        const pending = isContentPending(data);
        setWritingLessons(pending);
        return pending;
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load course');
          setLoading(false);
        }
        return false;
      }
    };

    void (async () => {
      const pending = await load();
      if (!pending || cancelled) return;

      pollTimer = setInterval(() => {
        void (async () => {
          const stillPending = await load();
          if (!stillPending && pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
          }
        })();
      }, 4000);
    })();

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [courseId]);

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-8">
      {loading && <p className="text-white/50">Loading course...</p>}
      {error && (
        <div className="space-y-4">
          <p className="text-red-400">{error}</p>
          <Link href="/learn/create" className="text-sm text-emerald-400 hover:underline">
            Create a new course
          </Link>
        </div>
      )}
      {writingLessons && course && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span className="text-sm text-emerald-200">
            Writing lessons and quizzes in the background — this page will update automatically…
          </span>
        </div>
      )}
      {course && <CourseOutlinePage course={course} />}
    </DashboardShell>
  );
}
