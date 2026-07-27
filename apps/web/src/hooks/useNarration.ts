'use client';

import { useEffect, useRef, useState } from 'react';
import type { Step } from '@/types/visual-script';

type NarrateRequest = {
  scriptId: string;
  approachId: string;
  stepIndex: number;
  captionSeed: string;
  state: Step['state'];
};

type NarrateResponse = {
  caption: string;
};

const DEBOUNCE_MS = 150;

export function useNarration(
  scriptId: string,
  approachId: string,
  stepIndex: number,
  captionSeed: string,
  state: Step['state'],
) {
  const [caption, setCaption] = useState(captionSeed);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const trackedScript = useRef(scriptId);

  if (trackedScript.current !== scriptId) {
    trackedScript.current = scriptId;
    cacheRef.current = new Map();
  }

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const cacheKey = `${scriptId}:${approachId}:${stepIndex}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached !== undefined) {
      setCaption(cached);
      setLoading(false);
      return;
    }

    setCaption(captionSeed);
    setLoading(true);
    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const body: NarrateRequest = {
          scriptId,
          approachId,
          stepIndex,
          captionSeed,
          state: stateRef.current,
        };
        const res = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`narrate ${res.status}`);
        const data = (await res.json()) as NarrateResponse;
        const text = data.caption ?? captionSeed;
        cacheRef.current.set(cacheKey, text);
        setCaption(text);
      } catch (err) {
        if ((err as { name?: string }).name === 'AbortError') return;
        cacheRef.current.set(cacheKey, captionSeed);
        setCaption(captionSeed);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [scriptId, approachId, stepIndex, captionSeed]);

  return { caption, loading };
}
