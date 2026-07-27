'use client';

import Link from 'next/link';
import type { GeneratedCourse } from '@/types/generated-course';
import { topicTypeIcon, type TopicType } from '@/types/generated-course';
import { cn } from '@/lib/cn';

type CourseSidebarProps = {
  course: GeneratedCourse;
  activeTopicId: string;
  className?: string;
};

export function CourseSidebar({ course, activeTopicId, className }: CourseSidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-[220px] shrink-0 flex-col border-r border-[#3a3a3a] bg-[#161616] lg:w-[260px]',
        className,
      )}
    >
      <div className="border-b border-[#3a3a3a] px-3 py-3">
        <Link
          href={`/learn/notebook/${course.id}`}
          className="mb-2 inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/70"
        >
          ← Course outline
        </Link>
        <div className="line-clamp-2 text-sm font-semibold text-white">{course.title}</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Course topics">
        {course.units.map((unit) => (
          <div key={unit.id} className="mb-4">
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Unit {unit.order}: {unit.title}
            </div>
            <ul className="space-y-0.5">
              {unit.topics.map((topic) => {
                const active = topic.id === activeTopicId;
                return (
                  <li key={topic.id}>
                    <Link
                      href={`/learn/notebook/${course.id}/topics/${topic.id}`}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition',
                        active
                          ? 'bg-emerald-500/20 font-medium text-emerald-200'
                          : 'text-white/55 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      <span className="shrink-0 text-xs" aria-hidden>
                        {topicTypeIcon(topic.type as TopicType)}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{topic.title}</span>
                      {topic.completed && (
                        <span className="shrink-0 text-emerald-400" aria-label="Completed">
                          ✓
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
