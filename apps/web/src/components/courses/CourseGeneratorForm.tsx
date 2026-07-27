'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { GeneratedCourse, SourceType } from '@/types/generated-course';
import { Toast } from './Toast';
import { cn } from '@/lib/cn';

type Tab = 'text' | 'pdf' | 'topic';

const LOADING_STEPS = [
  'Structuring course...',
  'Saving outline...',
  'Almost ready...',
];

export function CourseGeneratorForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('text');
  const [sourceContent, setSourceContent] = useState('');
  const [goal, setGoal] = useState('');
  const [topicPrompt, setTopicPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading) {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      setLoadingStep(0);
      return;
    }
    stepTimerRef.current = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 8000);
    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [loading]);

  const handlePdfUpload = useCallback(async (file: File) => {
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      const { text } = await api.postForm<{ text: string }>('/courses/extract-pdf', form);
      setSourceContent(text);
      setTab('text');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'PDF extraction failed';
      setError(msg);
      setToast(msg);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!getToken()) {
      const msg = 'Please log in to generate a course';
      setError(msg);
      setToast(msg);
      return;
    }

    let content = sourceContent.trim();
    let sourceType: SourceType = tab === 'topic' ? 'topic' : 'text';

    if (tab === 'topic') {
      content = topicPrompt.trim();
      if (!content) {
        setError('Enter a topic to generate a course from');
        return;
      }
    } else if (!content) {
      setError('Provide source content');
      return;
    }

    if (tab === 'pdf' && sourceContent) {
      sourceType = 'text';
    }

    setLoading(true);
    try {
      const course = await api.post<GeneratedCourse>('/courses/generate', {
        sourceType,
        sourceContent: content,
        goal: goal.trim() || undefined,
      });
      router.push(`/learn/notebook/${course.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Course generation failed';
      setError(msg);
      setToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'text', label: 'Paste Text' },
    { id: 'pdf', label: 'Upload PDF' },
    { id: 'topic', label: 'Topic Prompt' },
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Create Your Course</h1>
          <p className="mt-1 text-sm text-white/50">
            Turn notes, PDFs, or a topic into a structured notebook-style course.
          </p>
        </div>

        <div className="flex gap-2 border-b border-[#3a3a3a] pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition',
                tab === t.id
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-white/50 hover:text-white',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'text' && (
          <div>
            <label className="mb-2 block text-sm text-white/70">Source content</label>
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              rows={12}
              placeholder="Paste your notes, article, or syllabus here..."
              className="w-full rounded-lg border border-[#3a3a3a] bg-[#161616] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        )}

        {tab === 'pdf' && (
          <div className="rounded-lg border border-dashed border-[#3a3a3a] bg-[#161616] p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePdfUpload(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm text-white hover:bg-[#333]"
            >
              Choose PDF file
            </button>
            {sourceContent && (
              <p className="mt-4 text-sm text-emerald-400">
                PDF extracted ({sourceContent.length.toLocaleString()} chars). Switch to Paste Text to
                review.
              </p>
            )}
          </div>
        )}

        {tab === 'topic' && (
          <div>
            <label className="mb-2 block text-sm text-white/70">What should the course cover?</label>
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. AI Agents, RAG & MCP Servers"
              className="w-full rounded-lg border border-[#3a3a3a] bg-[#161616] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm text-white/70">Learning goal (optional)</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Prepare for a backend interview"
            className="w-full rounded-lg border border-[#3a3a3a] bg-[#161616] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {loading && (
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <span className="text-sm text-emerald-200">{LOADING_STEPS[loadingStep]}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Course'}
        </button>
      </form>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
