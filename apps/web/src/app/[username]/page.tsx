'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { getUser } from '@/lib/auth';

// Mock data - in production, fetch from API
const mockStreakData = {
  currentStreak: 0,
  longestStreak: 1,
  streakPublic: true,
};

const mockContributions = {
  year: 2025,
  totalContributions: 2,
  contributionsPublic: true,
  // Generate contribution data (GitHub-style grid)
  // This is a simplified version - in production, you'd have actual contribution data
  contributions: Array.from({ length: 365 }, (_, i) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.random() > 0.95 ? Math.floor(Math.random() * 5) + 1 : 0, // Random contributions
    };
  }),
};

const mockStats = {
  interviewPractice: {
    public: true,
    total: { solved: 1, total: 188 },
    easy: { solved: 0, total: 74 },
    medium: { solved: 1, total: 89 },
    hard: { solved: 0, total: 25 },
  },
  courseWatchTime: {
    public: true,
    data: [
      { course: 'Namaste React', time: 0.068 },
    ],
  },
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const currentUser = getUser();
  const isOwnProfile = currentUser?.username === username;

  const [streakPublic, setStreakPublic] = useState(mockStreakData.streakPublic);
  const [contributionsPublic, setContributionsPublic] = useState(mockContributions.contributionsPublic);
  const [interviewPracticePublic, setInterviewPracticePublic] = useState(mockStats.interviewPractice.public);
  const [courseWatchTimePublic, setCourseWatchTimePublic] = useState(mockStats.courseWatchTime.public);
  const [selectedYear, setSelectedYear] = useState(mockContributions.year);

  // Generate contribution graph data
  const getContributionLevel = (count: number) => {
    if (count === 0) return '#161b22'; // Dark gray
    if (count === 1) return '#0e4429'; // Light green
    if (count === 2) return '#006d32'; // Medium green
    if (count === 3) return '#26a641'; // Bright green
    return '#39d353'; // Very bright green
  };

  // Group contributions by week
  const weeks: { [key: string]: typeof mockContributions.contributions } = {};
  mockContributions.contributions.forEach((contrib) => {
    const date = new Date(contrib.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(contrib);
  });

  const weekKeys = Object.keys(weeks).sort().slice(-52); // Last 52 weeks

  const getPercentage = (solved: number, total: number) => {
    return total > 0 ? Math.round((solved / total) * 100) : 0;
  };

  const getAvatarColor = (username: string) => {
    const colors = ['#14b8a6', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarColor = getAvatarColor(username);

  return (
    <>
      <Navbar />
      <div
        style={{
          background: '#1a1a1a',
          color: 'white',
          minHeight: 'calc(100vh - 60px)',
          padding: '2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '2rem',
          }}
        >
          {/* Left Column - Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* User Avatar */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: avatarColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  margin: '0 auto',
                }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              {isOwnProfile && (
                <button
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#2a2a2a',
                    border: '2px solid #3a3a3a',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2a2a2a';
                  }}
                >
                  ✏️
                </button>
              )}
            </div>

            {/* User Name */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>
                {username.replace(/([A-Z])/g, ' $1').trim()}
              </h1>
              {isOwnProfile && (
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                  }}
                >
                  ✏️
                </button>
              )}
            </div>

            {/* Your Streak Section */}
            <div
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🚀</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Your Streak</h3>
                </div>
                {isOwnProfile && (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                    }}
                  >
                    <span>Public</span>
                    <input
                      type="checkbox"
                      checked={streakPublic}
                      onChange={(e) => setStreakPublic(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    padding: '1rem',
                    border: '1px solid #3a3a3a',
                  }}
                >
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    Current Streak
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                    {mockStreakData.currentStreak} days
                  </div>
                </div>
                <div
                  style={{
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    padding: '1rem',
                    border: '1px solid #3a3a3a',
                  }}
                >
                  <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    Longest Streak
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>
                    {mockStreakData.longestStreak} day
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contributions and Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Contributions Section */}
            <div
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>☰</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Contributions</h3>
                </div>
                {isOwnProfile && (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#9ca3af',
                    }}
                  >
                    <span>Public</span>
                    <input
                      type="checkbox"
                      checked={contributionsPublic}
                      onChange={(e) => setContributionsPublic(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                )}
              </div>
              {isOwnProfile && (
                <button
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #3a3a3a',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1a1a1a';
                  }}
                >
                  Connect with Platforms
                </button>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {mockContributions.totalContributions} contributions in
                </span>
                <span>🔥</span>
                <span>ℹ️</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #3a3a3a',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
              {/* Contribution Graph */}
              <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
                  {/* Day labels */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '0.5rem' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        style={{
                          width: '12px',
                          height: '12px',
                          fontSize: '0.7rem',
                          color: '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {day === 'Sun' || day === 'Wed' || day === 'Fri' ? day[0] : ''}
                      </div>
                    ))}
                  </div>
                  {/* Contribution squares */}
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', width: 'calc(100% - 50px)' }}>
                    {weekKeys.map((weekKey) => {
                      const weekContribs = weeks[weekKey];
                      return weekContribs.map((contrib, dayIndex) => (
                        <div
                          key={`${weekKey}-${dayIndex}`}
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '2px',
                            background: getContributionLevel(contrib.count),
                            border: '1px solid #161b22',
                          }}
                          title={`${contrib.count} contributions on ${contrib.date}`}
                        />
                      ));
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* Interview Practice Platform Questions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔗</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>
                      Interview Practice Platform Questions
                    </h3>
                  </div>
                  {isOwnProfile && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                      }}
                    >
                      <span>Public</span>
                      <input
                        type="checkbox"
                        checked={interviewPracticePublic}
                        onChange={(e) => setInterviewPracticePublic(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                    </label>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {[
                    { label: 'Total Solved', ...mockStats.interviewPractice.total },
                    { label: 'Easy Solved', ...mockStats.interviewPractice.easy },
                    { label: 'Medium Solved', ...mockStats.interviewPractice.medium },
                    { label: 'Hard Solved', ...mockStats.interviewPractice.hard },
                  ].map((stat) => {
                    const percentage = getPercentage(stat.solved, stat.total);
                    return (
                      <div
                        key={stat.label}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `conic-gradient(#22c55e ${percentage * 3.6}deg, #3a3a3a 0deg)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              background: '#2a2a2a',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                              {percentage}%
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{stat.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {stat.solved} / {stat.total}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Course Watch Time */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📊</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Course Watch Time</h3>
                  </div>
                  {isOwnProfile && (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                      }}
                    >
                      <span>Public</span>
                      <input
                        type="checkbox"
                        checked={courseWatchTimePublic}
                        onChange={(e) => setCourseWatchTimePublic(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                    </label>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
                  (Time Invested In Upskilling Yourself)
                </div>
                {/* Simple Line Graph */}
                <div
                  style={{
                    height: '150px',
                    background: '#1a1a1a',
                    borderRadius: '6px',
                    padding: '1rem',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: '2rem',
                  }}
                >
                  {mockStats.courseWatchTime.data.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: `${(item.time / 0.1) * 100}%`,
                          background: '#22c55e',
                          borderRadius: '4px 4px 0 0',
                          minHeight: '20px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-1.5rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.time.toFixed(3)}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
                        {item.course}
                      </div>
                    </div>
                  ))}
                  {/* Y-axis labels */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '0.5rem',
                      top: '1rem',
                      bottom: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontSize: '0.7rem',
                      color: '#6b7280',
                    }}
                  >
                    <span>0.08</span>
                    <span>0.06</span>
                    <span>0.04</span>
                    <span>0.02</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

