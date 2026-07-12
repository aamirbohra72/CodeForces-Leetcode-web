'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import {
  TA_HELP_LANGUAGES,
  TA_HELP_TOPICS,
  type TaHelpType,
} from '@/data/ta-help';

const inputClass =
  'w-full rounded-lg border border-[#3a3a3a] bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder:text-[#666] outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40';

const labelClass = 'mb-1.5 block text-xs font-medium text-[#a0a0a0]';

export type TaHelpCreatePayload = {
  title: string;
  type: TaHelpType;
  problem: string;
  topic: string;
  language: string;
  description: string;
};

type TaHelpCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TaHelpCreatePayload) => void;
};

export function TaHelpCreateModal({ open, onClose, onSubmit }: TaHelpCreateModalProps) {
  const [type, setType] = useState<TaHelpType>('text');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ta-help-create-title"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[#3a3a3a] bg-[#2a2a2a] px-5 py-4">
          <h2 id="ta-help-create-title" className="text-lg font-bold text-white">
            Ask a Teaching Assistant
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 text-xl text-[#b0b0b0] hover:bg-[#3a3a3a] hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSubmit({
              title: String(fd.get('title') ?? ''),
              type,
              problem: String(fd.get('problem') ?? ''),
              topic: String(fd.get('topic') ?? ''),
              language: String(fd.get('language') ?? ''),
              description: String(fd.get('description') ?? ''),
            });
            e.currentTarget.reset();
            setType('text');
          }}
        >
          <div>
            <span className={labelClass}>Request type</span>
            <div className="flex gap-2">
              {(
                [
                  { id: 'text' as const, label: 'Text help' },
                  { id: 'video' as const, label: 'Video call' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition',
                    type === opt.id
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                      : 'border-[#3a3a3a] text-[#b0b0b0] hover:border-[#4a4a4a] hover:text-white',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ta-title">
              Title
            </label>
            <input
              id="ta-title"
              name="title"
              required
              minLength={4}
              className={inputClass}
              placeholder="e.g. Facing compilation error"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ta-problem">
              Problem / assignment
            </label>
            <input
              id="ta-problem"
              name="problem"
              required
              minLength={2}
              className={inputClass}
              placeholder="Problem name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ta-topic">
                Topic
              </label>
              <select id="ta-topic" name="topic" required className={inputClass} defaultValue="">
                <option value="" disabled>
                  Select topic
                </option>
                {TA_HELP_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="ta-language">
                Language
              </label>
              <select id="ta-language" name="language" required className={inputClass} defaultValue="">
                <option value="" disabled>
                  Select language
                </option>
                {TA_HELP_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ta-description">
              Describe your issue
            </label>
            <textarea
              id="ta-description"
              name="description"
              required
              minLength={20}
              rows={4}
              className={cn(inputClass, 'resize-y')}
              placeholder="What have you tried? Where are you stuck?"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#3a3a3a] py-2.5 text-sm font-semibold text-[#b0b0b0] hover:border-[#4a4a4a] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
