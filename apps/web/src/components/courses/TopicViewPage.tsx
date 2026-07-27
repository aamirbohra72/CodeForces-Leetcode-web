'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '@/lib/api';
import type { GeneratedCourse, GeneratedTopic } from '@/types/generated-course';
import { TOPIC_TYPE_LABELS, type TopicType } from '@/types/generated-course';
import { CourseSidebar } from './CourseSidebar';
import { MCQComponent } from './MCQComponent';
import { Toast } from './Toast';

type TopicViewPageProps = {
  course: GeneratedCourse;
  topic: GeneratedTopic;
  onTopicComplete?: () => void;
};

export function TopicViewPage({ course, topic, onTopicComplete }: TopicViewPageProps) {
  const [completed, setCompleted] = useState(topic.completed ?? false);
  const [marking, setMarking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isQuizType = topic.type === 'diagnostic' || topic.type === 'quiz';

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      await api.post(`/progress/${topic.id}/complete`);
      setCompleted(true);
      onTopicComplete?.();
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Failed to mark complete');
    } finally {
      setMarking(false);
    }
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <CourseSidebar course={course} activeTopicId={topic.id} className="hidden md:flex" />

        <main className="min-w-0 flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <header className="space-y-1 border-b border-[#3a3a3a] pb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {TOPIC_TYPE_LABELS[topic.type as TopicType]}
              </p>
              <h1 className="text-2xl font-bold text-white">{topic.title}</h1>
              <p className="text-sm text-white/40">{topic.estimatedMinutes} min</p>
            </header>

            {topic.content ? (
              <article className="space-y-4 text-[15px] leading-relaxed text-white/80 [&_a]:text-emerald-400 [&_code]:rounded [&_code]:bg-[#161616] [&_code]:px-1 [&_code]:text-emerald-300 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:text-white/80 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[#161616] [&_pre]:p-4 [&_ul]:list-disc [&_ul]:space-y-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.content}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-sm text-white/50">Content is loading or unavailable.</p>
            )}

            {isQuizType && topic.mcqs.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  {topic.type === 'diagnostic' ? 'Diagnostic Assessment' : 'Quiz'}
                </h2>
                <MCQComponent
                  topicId={topic.id}
                  mcqs={topic.mcqs}
                  onComplete={() => {
                    setCompleted(true);
                    onTopicComplete?.();
                  }}
                />
              </section>
            )}

            {!isQuizType && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => void handleMarkComplete()}
                  disabled={marking || completed}
                  className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                >
                  {completed ? 'Completed ✓' : marking ? 'Saving...' : 'Mark complete'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
