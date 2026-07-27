'use client';

import Link from 'next/link';
import type { GeneratedCourse } from '@/types/generated-course';
import {
  TOPIC_TYPE_LABELS,
  topicTypeIcon,
  type TopicType,
} from '@/types/generated-course';
import { cn } from '@/lib/cn';

type CourseOutlinePageProps = {
  course: GeneratedCourse;
};

export function CourseOutlinePage({ course }: CourseOutlinePageProps) {
  const totalMinutes = course.units.reduce((sum, u) => sum + u.estimatedMinutes, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 border-b border-[#3a3a3a] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Notebook</p>
        <h1 className="text-3xl font-bold text-white">{course.title}</h1>
        <p className="text-white/60">{course.description}</p>
        <p className="text-sm text-white/40">
          {course.units.length} units · {totalMinutes} min total
        </p>
      </header>

      {course.units.map((unit) => (
        <section key={unit.id} className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold text-emerald-400">Unit {unit.order}</span>
              <h2 className="text-xl font-semibold text-white">{unit.title}</h2>
            </div>
            <p className="text-sm text-white/55">{unit.description}</p>
            <div className="flex flex-wrap gap-2">
              {unit.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/40">
              {unit.topics.length} topics · {unit.estimatedMinutes} min
            </p>
          </div>

          <ul className="space-y-1">
            {unit.topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/learn/notebook/${course.id}/topics/${topic.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition',
                    'hover:border-[#3a3a3a] hover:bg-[#161616]',
                  )}
                >
                  <span className="text-lg" aria-hidden>
                    {topicTypeIcon(topic.type as TopicType)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{topic.title}</div>
                    <div className="text-xs text-white/40">
                      {TOPIC_TYPE_LABELS[topic.type as TopicType]} · {topic.estimatedMinutes}m
                    </div>
                  </div>
                  {topic.completed && (
                    <span className="text-emerald-400" title="Completed">
                      ✓
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
