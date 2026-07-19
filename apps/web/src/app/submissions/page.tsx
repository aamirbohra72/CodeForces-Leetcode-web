'use client';

import { Suspense } from 'react';
import SubmissionsPage from './SubmissionsClient';

export default function SubmissionsPageWrapper() {
  return (
    <Suspense fallback={<div className="container">Loading...</div>}>
      <SubmissionsPage />
    </Suspense>
  );
}
