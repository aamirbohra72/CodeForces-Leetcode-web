'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step } from '@/types/visual-script';

export type SpeedMultiplier = 1 | 1.5 | 2;

const BASE_INTERVAL_MS = 1400;

function intervalForSpeed(speed: SpeedMultiplier): number {
  return Math.round(BASE_INTERVAL_MS / speed);
}

type StepPlayerSource = {
  key: string;
  steps: Step[];
};

export function useStepPlayer(source: StepPlayerSource) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SpeedMultiplier>(1);
  const [trackedKey, setTrackedKey] = useState(source.key);
  const lastStep = Math.max(0, source.steps.length - 1);

  if (source.key !== trackedKey) {
    setTrackedKey(source.key);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  const next = useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i >= lastStep) {
        setIsPlaying(false);
        return i;
      }
      return i + 1;
    });
  }, [lastStep]);

  const prev = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const seek = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(lastStep, Math.round(i)));
      setCurrentStepIndex(clamped);
      if (clamped >= lastStep) setIsPlaying(false);
    },
    [lastStep],
  );

  const play = useCallback(() => {
    setCurrentStepIndex((i) => {
      if (i >= lastStep) return 0;
      return i;
    });
    setIsPlaying(true);
  }, [lastStep]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const indexRef = useRef(currentStepIndex);
  indexRef.current = currentStepIndex;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      if (indexRef.current >= lastStep) {
        setIsPlaying(false);
        return;
      }
      setCurrentStepIndex((i) => {
        if (i >= lastStep) {
          setIsPlaying(false);
          return i;
        }
        const nextIdx = i + 1;
        if (nextIdx >= lastStep) setIsPlaying(false);
        return nextIdx;
      });
    }, intervalForSpeed(speed));
    return () => window.clearInterval(id);
  }, [isPlaying, speed, lastStep]);

  const currentStep = source.steps[currentStepIndex] ?? source.steps[0];

  return {
    currentStepIndex,
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    stepCount: source.steps.length,
    next,
    prev,
    seek,
    play,
    pause,
    reset,
  };
}
