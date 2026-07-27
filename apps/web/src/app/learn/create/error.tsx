'use client';

import { useEffect } from 'react';

export default function CreateCourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="max-w-md text-sm text-white/60">
        {error.message || 'Failed to load the course generator.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
      >
        Try again
      </button>
    </div>
  );
}
