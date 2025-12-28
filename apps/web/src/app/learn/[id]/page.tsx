'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

// Mock course data - in production, fetch from API
const courseData: Record<string, any> = {
  '1': {
    title: 'Namaste DSA',
    description: 'Master Data Structures and Algorithms with hands-on coding, clear explanations, and real-world problem-solving.',
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
    title: 'Namaste Node.js',
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
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courseData[courseId];
  const [enrolled, setEnrolled] = useState(false);

  if (!course) {
    return (
      <>
        <Navbar />
        <div style={{ marginLeft: '240px', padding: '2rem' }}>
          <h1>Course not found</h1>
          <Link href="/learn">Back to Courses</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        <Sidebar />
        <main
          style={{
            marginLeft: '240px',
            flex: 1,
            background: '#1a1a1a',
            color: 'white',
            padding: '2rem',
          }}
        >
          <Link
            href="/learn"
            style={{
              display: 'inline-block',
              marginBottom: '1.5rem',
              color: '#22c55e',
              textDecoration: 'none',
            }}
          >
            ← Back to Courses
          </Link>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            {/* Course Header */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                {course.isPremium && (
                  <span
                    style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
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
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                  }}
                >
                  {course.language}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                  <span>⭐</span>
                  <span style={{ fontWeight: '600' }}>{course.rating}</span>
                  <span style={{ fontSize: '0.875rem', color: '#b0b0b0', marginLeft: '0.25rem' }}>
                    ({course.reviews > 1000 ? `${(course.reviews / 1000).toFixed(1)}K` : course.reviews} Reviews)
                  </span>
                </div>
              </div>

              <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>
                {course.title.toUpperCase()}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#b0b0b0', lineHeight: '1.6', marginBottom: '2rem' }}>
                {course.description}
              </p>

              <button
                onClick={() => setEnrolled(true)}
                style={{
                  padding: '1rem 2rem',
                  background: enrolled ? '#22c55e' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!enrolled) {
                    e.currentTarget.style.background = '#d97706';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!enrolled) {
                    e.currentTarget.style.background = '#f59e0b';
                  }
                }}
              >
                {enrolled ? '✓ Enrolled' : 'Enroll Now'}
              </button>
            </div>

            {/* Course Image/Preview */}
            <div
              style={{
                width: '400px',
                height: '300px',
                background: `linear-gradient(135deg, ${
                  course.category === 'DSA' ? '#f59e0b, #ef4444' : '#ef4444, #dc2626'
                })`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                }}
              />
              <div
                style={{
                  fontSize: '6rem',
                  fontWeight: 'bold',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  zIndex: 1,
                }}
              >
                {course.title.split(' ')[0].charAt(0)}
              </div>
            </div>
          </div>

          {/* Course Modules */}
          {enrolled && (
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Course Modules</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.modules?.map((module: any, index: number) => (
                  <div
                    key={module.id}
                    style={{
                      background: '#2a2a2a',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid #3a3a3a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: module.completed ? '#22c55e' : '#3a3a3a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {module.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{module.title}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#b0b0b0' }}>{module.duration}</p>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '0.5rem 1.5rem',
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                      }}
                    >
                      {module.completed ? 'Review' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}


