'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { getAssignmentsForCourse } from '@/data/assignments';
import { getTutorialsForCourse } from '@/data/tutorials/system-design';
import { isLlmDrivenCourse, type LlmCoursePack } from '@/types/llm-course';

const courseData: Record<
  string,
  {
    title: string;
    description: string;
    rating: number;
    reviews: number;
    language: string;
    isPremium: boolean;
    category: string;
    modules: { id: string; title: string; duration: string; completed: boolean }[];
  }
> = {
  '1': {
    title: 'Salaam DSA',
    description:
      'Master Data Structures and Algorithms with hands-on coding, clear explanations, and real-world problem-solving.',
    rating: 4.9,
    reviews: 1000,
    language: 'English',
    isPremium: true,
    category: 'DSA',
    modules: [
      { id: '1', title: 'Introduction to DSA', duration: '2h 30m', completed: false },
      { id: '2', title: 'Arrays and Strings', duration: '3h 15m', completed: false },
      { id: '3', title: 'Linked Lists', duration: '2h 45m', completed: false },
      { id: '4', title: 'Stacks and Queues', duration: '2h 20m', completed: false },
      { id: '5', title: 'Trees and Binary Trees', duration: '4h 10m', completed: false },
    ],
  },
  '2': {
    title: 'Salaam Node.js',
    description: 'From basics to advanced concepts, gain experience in building applications with Node.js.',
    rating: 4.8,
    reviews: 2000,
    language: 'English',
    isPremium: true,
    category: 'Backend',
    modules: [
      { id: '1', title: 'Node.js Fundamentals', duration: '2h 30m', completed: false },
      { id: '2', title: 'Express.js Basics', duration: '3h 15m', completed: false },
      { id: '3', title: 'Database Integration', duration: '2h 45m', completed: false },
    ],
  },
  '3': {
    title: 'Salaam React',
    description:
      'Learn React from scratch and build modern web applications with hooks, context, and more. Curriculum is generated live by AI for React/JS only.',
    rating: 4.9,
    reviews: 1500,
    language: 'English',
    isPremium: true,
    category: 'Frontend',
    modules: [],
  },
  '5': {
    title: 'System Design',
    description: 'Learn to design scalable systems and ace your system design interviews.',
    rating: 4.8,
    reviews: 1200,
    language: 'English',
    isPremium: true,
    category: 'System Design',
    modules: [],
  },
};

type Tab = 'tutorials' | 'assignments';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courseData[courseId];
  const assignments = getAssignmentsForCourse(courseId);
  const staticTutorials = getTutorialsForCourse(courseId);
  const llmCourse = isLlmDrivenCourse(courseId);

  const [enrolled, setEnrolled] = useState(false);
  const [tab, setTab] = useState<Tab>('tutorials');
  const [llmPack, setLlmPack] = useState<LlmCoursePack | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);
  const [llmError, setLlmError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `enrolled:course:${courseId}`;
    setEnrolled(localStorage.getItem(key) === '1');
  }, [courseId]);

  useEffect(() => {
    if (!llmCourse || !enrolled) return;
    let cancelled = false;
    (async () => {
      try {
        setLlmLoading(true);
        setLlmError('');
        const pack = await api.get<LlmCoursePack>(`/courses/${courseId}/pack`);
        if (!cancelled) setLlmPack(pack);
      } catch (e: unknown) {
        if (!cancelled) setLlmError(e instanceof Error ? e.message : 'Failed to generate live React curriculum');
      } finally {
        if (!cancelled) setLlmLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, llmCourse, enrolled]);

  const enroll = () => {
    setEnrolled(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`enrolled:course:${courseId}`, '1');
    }
  };

  const tutorialList =
    llmPack?.tutorials?.map((t) => ({
      id: t.id,
      title: t.title,
      duration: t.duration,
      completed: false,
      problemCount: t.questions.length,
      href: `/learn/${courseId}/tutorials/${t.id}`,
      assignmentHref: `/learn/${courseId}/tutorials/${t.id}?tab=assignment`,
      live: true as boolean,
    })) ??
    (staticTutorials.length > 0
      ? staticTutorials.map((t) => ({
          id: t.id,
          title: t.title,
          duration: t.duration,
          completed: false,
          problemCount: t.questionIds.length,
          href: `/learn/${courseId}/tutorials/${t.id}`,
          assignmentHref: `/learn/${courseId}/tutorials/${t.id}?tab=assignment`,
          live: false as boolean,
        }))
      : (course?.modules ?? []).map((m) => ({
          id: m.id,
          title: m.title,
          duration: m.duration,
          completed: m.completed,
          problemCount: 0,
          href: `/learn/${courseId}`,
          assignmentHref: `/learn/${courseId}/assignments`,
          live: false as boolean,
        })));

  if (!course) {
    return (
      <DashboardShell mainClassName="p-8">
        <h1>Course not found</h1>
        <Link href="/learn">Back to Courses</Link>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
      <main style={{ background: '#1a1a1a', color: 'white', padding: '2rem', minHeight: '100%' }}>
        <Link
          href="/learn"
          style={{ display: 'inline-block', marginBottom: '1.5rem', color: '#22c55e', textDecoration: 'none' }}
        >
          ← Back to Courses
        </Link>

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
              {course.isPremium && (
                <span
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  PREMIUM
                </span>
              )}
              <span
                style={{
                  background: '#3a3a3a',
                  color: '#b0b0b0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                }}
              >
                {course.language}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                <span>⭐</span>
                <span style={{ fontWeight: 600 }}>{course.rating}</span>
                <span style={{ fontSize: '0.875rem', color: '#b0b0b0', marginLeft: '0.25rem' }}>
                  ({course.reviews > 1000 ? `${(course.reviews / 1000).toFixed(1)}K` : course.reviews} Reviews)
                </span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>{course.title.toUpperCase()}</h1>
            <p style={{ fontSize: '1.1rem', color: '#b0b0b0', lineHeight: 1.6, marginBottom: '2rem' }}>
              {course.description}
            </p>

            <button
              onClick={enroll}
              style={{
                padding: '1rem 2rem',
                background: enrolled ? '#22c55e' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {enrolled ? '✓ Enrolled' : 'Enroll Now'}
            </button>
          </div>

          <div
            style={{
              width: 400,
              maxWidth: '100%',
              height: 300,
              background: `linear-gradient(135deg, ${
                course.category === 'DSA'
                  ? '#f59e0b, #ef4444'
                  : course.category === 'System Design'
                    ? '#3b82f6, #8b5cf6'
                    : '#ef4444, #dc2626'
              })`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '6rem',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {course.title.split(' ')[0].charAt(0)}
            </div>
          </div>
        </div>

        {enrolled && (
          <div style={{ marginTop: '2rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '0.25rem',
                borderBottom: '1px solid #2a2a2a',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setTab('tutorials')}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === 'tutorials' ? '2px solid #22c55e' : '2px solid transparent',
                  color: tab === 'tutorials' ? '#22c55e' : '#9ca3af',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tutorials {tutorialList.length}
              </button>
              <button
                type="button"
                onClick={() => setTab('assignments')}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === 'assignments' ? '2px solid #22c55e' : '2px solid transparent',
                  color: tab === 'assignments' ? '#22c55e' : '#9ca3af',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Assignments {tutorialList.filter((t) => t.problemCount > 0).length || assignments.length}
              </button>
            </div>

            {tab === 'tutorials' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Course Tutorials</h2>
                {llmCourse ? (
                  <p style={{ margin: 0, color: '#9ca3af' }}>
                    Live AI curriculum (React / JS only) via Mistral
                    {llmPack?.generatedAt ? ` · generated ${new Date(llmPack.generatedAt).toLocaleString()}` : ''}
                  </p>
                ) : null}
                {llmLoading ? <div style={{ color: '#9ca3af' }}>Generating React curriculum with LLM…</div> : null}
                {llmError ? <div style={{ color: '#f87171' }}>{llmError}</div> : null}
                {!llmLoading &&
                  !llmError &&
                  tutorialList.map((module, index) => (
                  <div
                    key={module.id}
                    style={{
                      background: '#2a2a2a',
                      padding: '1.5rem',
                      borderRadius: 8,
                      border: '1px solid #3a3a3a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: module.completed ? '#22c55e' : '#3a3a3a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {module.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{module.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#b0b0b0', margin: 0 }}>
                          {module.duration}
                          {module.problemCount > 0 ? ` · ${module.problemCount} practice problems` : ''}
                          {module.live ? ' · Live LLM' : ''}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={module.href}
                      style={{
                        padding: '0.5rem 1.5rem',
                        background: '#22c55e',
                        color: 'white',
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {module.completed ? 'Review' : 'Start'}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Practice Assignments by Tutorial</h2>
                <p style={{ margin: 0, color: '#9ca3af' }}>
                  Not a timed test — open a set, solve problems one by one, and see score after each submit.
                </p>

                {tutorialList.some((t) => t.problemCount > 0) ? (
                  tutorialList
                    .filter((t) => t.problemCount > 0)
                    .map((t) => (
                      <Link
                        key={t.id}
                        href={t.assignmentHref}
                        style={{
                          display: 'block',
                          textDecoration: 'none',
                          color: 'inherit',
                          background: '#2a2a2a',
                          padding: '1.35rem 1.5rem',
                          borderRadius: 10,
                          border: '1px solid #3a3a3a',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: 8 }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{t.title}</h3>
                          <span
                            style={{
                              background: '#f59e0b',
                              color: '#111',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 999,
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              height: 'fit-content',
                            }}
                          >
                            PRACTICE
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={chipStyle}>{t.problemCount} problems</span>
                          <span style={chipStyle}>{t.duration}</span>
                          <span style={chipStyle}>Score after each solve</span>
                        </div>
                      </Link>
                    ))
                ) : (
                  <div style={{ color: '#9ca3af', padding: '2rem 0' }}>No assignments yet for this course.</div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </DashboardShell>
  );
}

const chipStyle = {
  padding: '0.25rem 0.6rem',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.08)',
  color: '#e5e5e5',
  fontSize: '0.75rem',
  fontWeight: 500,
} as const;
