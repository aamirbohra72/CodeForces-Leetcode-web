'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { getUser } from '@/lib/auth';

const mockStreakData = { currentStreak: 0, longestStreak: 1 };
const mockContributions = {
  year: 2025,
  totalContributions: 2,
  contributions: Array.from({ length: 365 }, (_, i) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      count: Math.random() > 0.95 ? Math.floor(Math.random() * 5) + 1 : 0,
    };
  }),
};

const mockStats = {
  interviewPractice: {
    total: { solved: 1, total: 188 },
    easy: { solved: 0, total: 74 },
    medium: { solved: 1, total: 89 },
    hard: { solved: 0, total: 25 },
  },
  courseWatchTime: [{ course: 'Namaste React', time: 0.068 }],
};

export default function LeaderboardPage() {
  const currentUser = getUser();
  const username = currentUser?.username ?? 'leaderboard';
  const [selectedYear, setSelectedYear] = useState(mockContributions.year);

  const getContributionLevel = (count: number) => {
    if (count === 0) return '#161b22';
    if (count === 1) return '#0e4429';
    if (count === 2) return '#006d32';
    if (count === 3) return '#26a641';
    return '#39d353';
  };

  const weeks: { [key: string]: typeof mockContributions.contributions } = {};
  mockContributions.contributions.forEach((contrib) => {
    const date = new Date(contrib.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(contrib);
  });

  const weekKeys = Object.keys(weeks).sort().slice(-52);
  const getPercentage = (solved: number, total: number) => (total > 0 ? Math.round((solved / total) * 100) : 0);

  const colors = ['#14b8a6', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarColor = colors[hash % colors.length];

  return (
    <>
      <Navbar />
      <div style={{ background: '#1a1a1a', color: 'white', minHeight: 'calc(100vh - 60px)', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, textTransform: 'capitalize' }}>
                Leaderboard
              </h1>
            </div>

            <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🚀</span>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Your Streak</h3>
              </div>
              <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '1rem', border: '1px solid #3a3a3a' }}>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Current Streak</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{mockStreakData.currentStreak} days</div>
              </div>
              <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '1rem', border: '1px solid #3a3a3a' }}>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Longest Streak</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{mockStreakData.longestStreak} day</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>☰</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Contributions</h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{mockContributions.totalContributions} contributions in</span>
                <span>🔥</span>
                <span>ℹ️</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  style={{ background: '#1a1a1a', border: '1px solid #3a3a3a', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
              <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginRight: '0.5rem' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} style={{ width: '12px', height: '12px', fontSize: '0.7rem', color: '#9ca3af' }}>
                        {day === 'Sun' || day === 'Wed' || day === 'Fri' ? day[0] : ''}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', width: 'calc(100% - 50px)' }}>
                    {weekKeys.map((weekKey) => {
                      const weekContribs = weeks[weekKey];
                      return weekContribs.map((contrib, dayIndex) => (
                        <div
                          key={`${weekKey}-${dayIndex}`}
                          style={{ width: '12px', height: '12px', borderRadius: '2px', background: getContributionLevel(contrib.count), border: '1px solid #161b22' }}
                          title={`${contrib.count} contributions on ${contrib.date}`}
                        />
                      ));
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#2a2a2a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span>🔗</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Interview Practice Platform Questions</h3>
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
                      <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(#22c55e ${percentage * 3.6}deg, #3a3a3a 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#2a2a2a', display: 'grid', placeItems: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                            {percentage}%
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{stat.label}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{stat.solved} / {stat.total}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span>📊</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Course Watch Time</h3>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>(Time Invested In Upskilling Yourself)</div>
                <div style={{ height: '150px', background: '#1a1a1a', borderRadius: '6px', padding: '1rem', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2rem' }}>
                  {mockStats.courseWatchTime.map((item) => (
                    <div key={item.course} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      <div style={{ width: '100%', height: `${(item.time / 0.1) * 100}%`, background: '#22c55e', borderRadius: '4px 4px 0 0', minHeight: '20px' }} />
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>{item.course}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
