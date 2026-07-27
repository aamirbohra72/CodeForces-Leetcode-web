'use client';

import { DashboardShell } from '@/components/DashboardShell';
import { CourseGeneratorForm } from '@/components/courses/CourseGeneratorForm';

export default function CreateCoursePage() {
  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-8">
      <CourseGeneratorForm />
    </DashboardShell>
  );
}
