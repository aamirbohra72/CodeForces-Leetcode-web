'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { QuizResult, SanitizedMCQ } from '@/types/generated-course';
import { cn } from '@/lib/cn';

type MCQComponentProps = {
  topicId: string;
  mcqs: SanitizedMCQ[];
  onComplete?: (result: QuizResult) => void;
};

type Phase = 'quiz' | 'review' | 'done';

export function MCQComponent({ topicId, mcqs, onComplete }: MCQComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentMcq = mcqs[currentIndex];

  const submitAnswers = async (allAnswers: number[]) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post<QuizResult>(`/progress/${topicId}/quiz`, {
        answers: allAnswers,
      });
      setResult(res);
      setPhase('done');
      onComplete?.(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Quiz submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (optionIndex: number) => {
    if (loading || phase !== 'quiz') return;

    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    const isLast = currentIndex >= mcqs.length - 1;

    if (isLast) {
      await submitAnswers(newAnswers);
    } else {
      setLoading(true);
      try {
        const partial = await api.post<QuizResult>(`/progress/${topicId}/quiz`, {
          answers: newAnswers,
        });
        setResult(partial);
        setPhase('review');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Quiz submission failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleContinue = () => {
    setPhase('quiz');
    setCurrentIndex((i) => i + 1);
  };

  if (mcqs.length === 0) {
    return <p className="text-sm text-white/50">No quiz questions available.</p>;
  }

  if (phase === 'done' && result) {
    return (
      <div className="space-y-6 rounded-lg border border-[#3a3a3a] bg-[#161616] p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white">Quiz Complete</h3>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {result.score} / {result.total}
          </p>
        </div>
        <div className="space-y-4">
          {mcqs.map((mcq, i) => {
            const r = result.results[i];
            const selected = answers[i];
            return (
              <div key={mcq.id} className="rounded-lg border border-[#3a3a3a] p-4">
                <p className="text-sm font-medium text-white">
                  {i + 1}. {mcq.question}
                </p>
                <p className="mt-2 text-xs text-white/50">
                  Your answer: {selected !== undefined ? mcq.options[selected] : '—'}
                </p>
                <p
                  className={cn(
                    'mt-1 text-xs font-medium',
                    r?.correct ? 'text-emerald-400' : 'text-red-400',
                  )}
                >
                  {r?.correct ? 'Correct' : 'Incorrect'}
                </p>
                {r?.explanation && (
                  <p className="mt-2 text-sm text-white/60">{r.explanation}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'review' && result) {
    const lastResult = result.results[result.results.length - 1];
    return (
      <div className="space-y-4 rounded-lg border border-[#3a3a3a] bg-[#161616] p-6">
        <p className="text-sm text-white/50">
          Question {currentIndex + 1} of {mcqs.length}
        </p>
        <p className="text-base font-medium text-white">{currentMcq?.question}</p>
        <p
          className={cn(
            'text-sm font-medium',
            lastResult?.correct ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          {lastResult?.correct ? 'Correct!' : 'Not quite.'}
        </p>
        {lastResult?.explanation && (
          <p className="text-sm text-white/70">{lastResult.explanation}</p>
        )}
        <button
          type="button"
          onClick={handleContinue}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          Next question
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-[#3a3a3a] bg-[#161616] p-6">
      <p className="text-sm text-white/50">
        Question {currentIndex + 1} of {mcqs.length}
      </p>
      <p className="text-base font-medium text-white">{currentMcq?.question}</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <ul className="space-y-2">
        {currentMcq?.options.map((option, idx) => (
          <li key={idx}>
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleSelect(idx)}
              className="w-full rounded-lg border border-[#3a3a3a] px-4 py-3 text-left text-sm text-white transition hover:border-emerald-500/50 hover:bg-emerald-500/10 disabled:opacity-50"
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
