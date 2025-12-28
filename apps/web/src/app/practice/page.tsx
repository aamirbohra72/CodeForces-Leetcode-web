'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import type { Challenge } from '@codeforces/types';

interface ProblemFilters {
  language: string;
  difficulty: string;
  search: string;
  tags: string[];
}

export default function PracticePage() {
  const [problems, setProblems] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProblemFilters>({
    language: 'All',
    difficulty: 'All',
    search: '',
    tags: [],
  });

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      
      const data = await api.get<Challenge[]>(`/challenges?${params.toString()}`);
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Practice Problems</h1>
            <p style={{ color: '#6b7280' }}>Solve coding challenges to improve your skills</p>
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search problems..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Languages</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
          </div>

          {/* Problems List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading problems...</div>
          ) : problems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              No problems found. Try adjusting your filters.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {problems.map((problem) => (
                <Link
                  key={problem.id}
                  href={`/practice/${problem.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div
                    className="card"
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: '1px solid #e5e7eb',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{problem.title}</h3>
                          <span
                            style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              background: getDifficultyColor(problem.difficulty),
                              color: 'white',
                            }}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <p
                          style={{
                            color: '#6b7280',
                            marginBottom: '0.75rem',
                            lineHeight: '1.5',
                          }}
                        >
                          {problem.description.substring(0, 150)}
                          {problem.description.length > 150 ? '...' : ''}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#f3f4f6',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              color: '#374151',
                            }}
                          >
                            React.js
                          </span>
                        </div>
                      </div>
                      <div style={{ marginLeft: '1rem', textAlign: 'right', color: '#6b7280', fontSize: '0.875rem' }}>
                        <div>30 mins</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


