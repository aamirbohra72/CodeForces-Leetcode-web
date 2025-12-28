'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

interface CertificateCourse {
  id: string;
  title: string;
  status: 'enroll' | 'complete'; // 'enroll' means show "Enroll Now", 'complete' means show "Complete The Course"
}

// Mock certificate courses data - in production, this would come from your API
const certificateCourses: CertificateCourse[] = [
  { id: '1', title: 'Namaste DSA', status: 'enroll' },
  { id: '2', title: 'Namaste Node.js', status: 'enroll' },
  { id: '3', title: 'Namaste Frontend System Design', status: 'enroll' },
  { id: '4', title: 'Namaste React', status: 'enroll' },
  { id: '5', title: 'Namaste JavaScript', status: 'complete' }, // This one shows "Complete The Course"
  { id: '6', title: 'Crack Frontend Interview', status: 'enroll' },
  { id: '7', title: 'Masterclasses', status: 'enroll' },
];

export default function CertificatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleEnroll = (courseId: string) => {
    // In production, this would navigate to the course or handle enrollment
    console.log('Enroll in course:', courseId);
    // You can add navigation logic here, e.g.:
    // router.push(`/learn/${courseId}`);
  };

  const handleComplete = (courseId: string) => {
    // In production, this would navigate to complete the course or claim certificate
    console.log('Complete course:', courseId);
    // You can add navigation logic here
  };

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
            position: 'relative',
          }}
        >
          {/* Page Content (visible when modal is closed) */}
          {!isModalOpen && (
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Certificates</h1>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                View and claim your course certificates
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f97316';
                }}
              >
                Claim Your Certificates
              </button>
            </div>
          )}

          {/* Modal Overlay */}
          {isModalOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem',
              }}
              onClick={(e) => {
                // Close modal when clicking on overlay (not on modal content)
                if (e.target === e.currentTarget) {
                  setIsModalOpen(false);
                }
              }}
            >
              {/* Modal Content */}
              <div
                style={{
                  background: '#2a2a2a',
                  borderRadius: '12px',
                  width: '100%',
                  maxWidth: '600px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.5rem',
                    borderBottom: '1px solid #3a3a3a',
                    position: 'sticky',
                    top: 0,
                    background: '#2a2a2a',
                    zIndex: 10,
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: 0,
                    }}
                  >
                    Claim your certificates
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3a3a3a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body - Course List */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {certificateCourses.map((course) => (
                      <div
                        key={course.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          background: '#1a1a1a',
                          borderRadius: '8px',
                          border: '1px solid #3a3a3a',
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#4a4a4a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#3a3a3a';
                        }}
                      >
                        <span
                          style={{
                            fontSize: '1rem',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          {course.title}
                        </span>
                        <button
                          onClick={() => {
                            if (course.status === 'complete') {
                              handleComplete(course.id);
                            } else {
                              handleEnroll(course.id);
                            }
                          }}
                          style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            ...(course.status === 'complete'
                              ? {
                                  background: '#3b82f6', // Bright blue for "Complete The Course"
                                  color: 'white',
                                }
                              : {
                                  background: '#1e3a8a', // Dark blue for "Enroll Now"
                                  color: 'white',
                                }),
                          }}
                          onMouseEnter={(e) => {
                            if (course.status === 'complete') {
                              e.currentTarget.style.background = '#2563eb';
                            } else {
                              e.currentTarget.style.background = '#1e40af';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (course.status === 'complete') {
                              e.currentTarget.style.background = '#3b82f6';
                            } else {
                              e.currentTarget.style.background = '#1e3a8a';
                            }
                          }}
                        >
                          {course.status === 'complete' ? 'Complete The Course' : 'Enroll Now'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

