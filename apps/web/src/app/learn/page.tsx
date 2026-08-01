'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { markLocalEnrollment, markLocalEnrollments } from '@/lib/enrollment';
import { startRazorpayCheckout } from '@/lib/razorpayCheckout';

interface Course {
  id: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  language: string;
  isPremium: boolean;
  category: string;
  image?: string;
}

interface GeneratedCourseSummary {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  createdAt: string;
  unitCount: number;
  topicCount: number;
  estimatedMinutes: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Salaam DSA',
    description:
      'Master Data Structures and Algorithms with hands-on coding, clear explanations, and real-world problem-solving.',
    rating: 4.9,
    reviews: 1000,
    language: 'English',
    isPremium: true,
    category: 'DSA',
  },
  {
    id: '2',
    title: 'Salaam Node.js',
    description: 'From basics to advanced concepts, gain experience in building applications with Node.js.',
    rating: 4.8,
    reviews: 2000,
    language: 'English',
    isPremium: true,
    category: 'Backend',
  },
  {
    id: '3',
    title: 'Salaam React',
    description: 'Learn React from scratch and build modern web applications with hooks, context, and more.',
    rating: 4.9,
    reviews: 1500,
    language: 'English',
    isPremium: true,
    category: 'Frontend',
  },
  {
    id: '4',
    title: 'JavaScript Fundamentals',
    description: 'Master the fundamentals of JavaScript programming language.',
    rating: 4.7,
    reviews: 800,
    language: 'English',
    isPremium: false,
    category: 'Frontend',
  },
  {
    id: '5',
    title: 'System Design',
    description: 'Learn to design scalable systems and ace your system design interviews.',
    rating: 4.8,
    reviews: 1200,
    language: 'English',
    isPremium: true,
    category: 'System Design',
  },
  {
    id: '6',
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python. Learn syntax, data structures, and more.',
    rating: 4.6,
    reviews: 600,
    language: 'English',
    isPremium: false,
    category: 'Programming',
  },
];

type FilterType = 'all' | 'paid' | 'free' | 'bundles' | 'partners';

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [generatedCourses, setGeneratedCourses] = useState<GeneratedCourseSummary[]>([]);
  const [generatedLoading, setGeneratedLoading] = useState(false);
  const [generatedError, setGeneratedError] = useState('');
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    if (!getToken()) return;

    const loadEnrollments = () => {
      void api
        .get<{ enrollments: Array<{ productId: string }> }>('/payments/enrollments')
        .then((data) => {
          const ids = data.enrollments.map((e) => e.productId);
          setEnrolledIds(new Set(ids));
          markLocalEnrollments(ids);
        })
        .catch(() => undefined);
    };

    loadEnrollments();

    const onEnrollment = () => loadEnrollments();
    window.addEventListener('enrollment:updated', onEnrollment);
    window.addEventListener('focus', onEnrollment);
    return () => {
      window.removeEventListener('enrollment:updated', onEnrollment);
      window.removeEventListener('focus', onEnrollment);
    };
  }, []);

  const handlePremiumEnroll = async (courseId: string) => {
    if (!getToken()) {
      window.location.href = `/sign-in?redirect_url=/learn`;
      return;
    }
    if (enrolledIds.has(courseId)) {
      window.location.href = `/learn/${courseId}`;
      return;
    }
    setPayingId(courseId);
    setPayError('');
    try {
      await startRazorpayCheckout(courseId);
      markLocalEnrollment(courseId);
      setEnrolledIds((prev) => new Set(prev).add(courseId));
      window.location.href = `/learn/${courseId}`;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      if (msg !== 'Payment cancelled') setPayError(msg);
    } finally {
      setPayingId(null);
    }
  };
  useEffect(() => {
    if (activeFilter !== 'bundles') return;

    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setGeneratedCourses([]);
        setGeneratedError('Log in to see your generated courses.');
        return;
      }

      setGeneratedLoading(true);
      setGeneratedError('');
      try {
        const data = await api.get<{ courses: GeneratedCourseSummary[] }>('/courses/mine');
        if (!cancelled) setGeneratedCourses(data.courses);
      } catch (e) {
        if (!cancelled) {
          setGeneratedCourses([]);
          setGeneratedError(e instanceof Error ? e.message : 'Failed to load generated courses');
        }
      } finally {
        if (!cancelled) setGeneratedLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  const filteredCourses =
    activeFilter === 'all'
      ? mockCourses
      : activeFilter === 'paid'
        ? mockCourses.filter((c) => c.isPremium)
        : activeFilter === 'free'
          ? mockCourses.filter((c) => !c.isPremium)
          : activeFilter === 'bundles'
            ? []
            : mockCourses;

  const filters: { label: string; value: FilterType; key: string }[] = [
    { label: 'All Courses', value: 'all', key: 'all' },
    { label: 'Paid Courses', value: 'paid', key: 'paid' },
    { label: 'Create Own Course Bundle', value: 'bundles', key: 'create-own' },
    { label: 'Course Bundles', value: 'partners', key: 'bundles-placeholder' },
    { label: 'Free Courses', value: 'free', key: 'free' },
    { label: 'Our Partners', value: 'partners', key: 'partners' },
  ];

  return (
    <DashboardShell navClassName="sticky top-0 z-50" mainClassName="min-h-0 overflow-y-auto p-8">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Courses</h1>
        <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>Learn and master new skills</p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: activeFilter === filter.value ? '#22c55e' : '#2a2a2a',
              color: activeFilter === filter.value ? 'white' : '#b0b0b0',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeFilter === filter.value ? '600' : '400',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter.value) {
                e.currentTarget.style.background = '#333';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter.value) {
                e.currentTarget.style.background = '#2a2a2a';
                e.currentTarget.style.color = '#b0b0b0';
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {activeFilter === 'bundles' && (
        <>
          <Link
            href="/learn/create"
            style={{
              display: 'block',
              marginBottom: '2rem',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px dashed #22c55e',
              background: 'rgba(34, 197, 94, 0.08)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#22c55e' }}>
              + Generate a custom course with AI
            </h2>
            <p style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
              Paste notes, upload a PDF, or enter a topic — get a full notebook with lessons and
              quizzes.
            </p>
          </Link>

          {generatedLoading && <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>Loading your courses…</p>}
          {generatedError && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{generatedError}</p>}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {generatedCourses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/notebook/${course.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', height: '100%' }}
              >
                <div
                  style={{
                    background: '#2a2a2a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '1px solid #3a3a3a',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      height: '140px',
                      flexShrink: 0,
                      background: 'linear-gradient(135deg, #059669, #0ea5e9)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#22c55e',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                      }}
                    >
                      AI GENERATED
                    </div>
                    <div
                      style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      {course.title.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        marginBottom: '0.75rem',
                        color: 'white',
                      }}
                    >
                      {course.title}
                    </h3>
                    <p
                      style={{
                        color: '#b0b0b0',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        marginBottom: '1rem',
                      }}
                    >
                      {course.description}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      {course.unitCount} units · {course.topicCount} topics · {course.estimatedMinutes}{' '}
                      min
                    </p>
                    <button
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: 'auto',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/learn/notebook/${course.id}`;
                      }}
                    >
                      Open Notebook
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!generatedLoading && !generatedError && generatedCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>
              No generated courses yet. Click the green card above to create one.
            </div>
          )}
        </>
      )}

      {activeFilter !== 'bundles' && (
        <>
          {payError && (
            <p style={{ color: '#f87171', marginBottom: '1rem' }}>{payError}</p>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/${course.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', height: '100%' }}
              >
                <div
                  style={{
                    background: '#2a2a2a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '1px solid #3a3a3a',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      height: '200px',
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${
                        course.category === 'DSA'
                          ? '#f59e0b, #ef4444'
                          : course.category === 'Backend'
                            ? '#ef4444, #dc2626'
                            : '#3b82f6, #2563eb'
                      })`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        background:
                          'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: 'rgba(255,255,255,0.9)',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        zIndex: 1,
                      }}
                    >
                      {course.title.split(' ')[0].charAt(0)}
                    </div>
                    {course.isPremium && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: '#f59e0b',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          zIndex: 2,
                        }}
                      >
                        PREMIUM
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '0.75rem',
                        color: 'white',
                      }}
                    >
                      {course.title.toUpperCase()}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <span
                        style={{
                          background: '#3a3a3a',
                          color: '#b0b0b0',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        {course.language}
                      </span>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          color: '#fbbf24',
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>⭐</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{course.rating}</span>
                        <span style={{ fontSize: '0.75rem', color: '#b0b0b0', marginLeft: '0.25rem' }}>
                          (
                          {course.reviews > 1000
                            ? `${(course.reviews / 1000).toFixed(1)}K`
                            : course.reviews}{' '}
                          Reviews)
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        color: '#b0b0b0',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        marginBottom: '1.5rem',
                      }}
                    >
                      {course.description}
                    </p>

                    <button
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginTop: 'auto',
                        background: course.isPremium ? '#f59e0b' : '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = course.isPremium ? '#d97706' : '#16a34a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = course.isPremium ? '#f59e0b' : '#22c55e';
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        if (course.isPremium) {
                          void handlePremiumEnroll(course.id);
                        } else {
                          window.location.href = `/learn/${course.id}`;
                        }
                      }}
                    >
                      {course.isPremium
                        ? enrolledIds.has(course.id)
                          ? 'Open Course'
                          : payingId === course.id
                            ? 'Opening checkout…'
                            : 'Buy & Enroll'
                        : 'Start Learning'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#b0b0b0' }}>
              No courses found in this category.
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}
