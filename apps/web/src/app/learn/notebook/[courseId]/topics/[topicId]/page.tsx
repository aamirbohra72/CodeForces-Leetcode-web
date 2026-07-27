'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { TopicViewPage } from '@/components/courses/TopicViewPage';
import { api } from '@/lib/api';
import type { GeneratedCourse, GeneratedTopic } from '@/types/generated-course';

export default function NotebookTopicPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const topicId = params.topicId as string;
  const [course, setCourse] = useState<GeneratedCourse | null>(null);
  const [topic, setTopic] = useState<GeneratedTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCourse = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<GeneratedCourse>(`/courses/${courseId}`);
      const found = data.units.flatMap((u) => u.topics).find((t) => t.id === topicId);
      if (!found) {
        setError('Topic not found');
        setCourse(null);
        setTopic(null);
        return;
      }
      setCourse(data);
      setTopic(found);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load topic');
    } finally {
      setLoading(false);
    }
  }, [courseId, topicId]);

  useEffect(() => {
    void loadCourse();
  }, [loadCourse]);

  if (loading) {
    return (
      <DashboardShell mainClassName="p-8">
        <p className="text-white/50">Loading topic...</p>
      </DashboardShell>
    );
  }

  if (error || !course || !topic) {
    return (
      <DashboardShell mainClassName="p-8">
        <div className="space-y-4">
          <p className="text-red-400">{error || 'Topic not found'}</p>
          <Link
            href={`/learn/notebook/${courseId}`}
            className="text-sm text-emerald-400 hover:underline"
          >
            Back to course outline
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell mainClassName="min-h-0 overflow-hidden p-0">
      <TopicViewPage course={course} topic={topic} onTopicComplete={() => void loadCourse()} />
    </DashboardShell>
  );
}
