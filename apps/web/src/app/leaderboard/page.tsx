'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { LeaderboardOverviewResponse } from '@/lib/leaderboard-overview';

function getContributionLevel(count: number) {
  if (count === 0) return '#161b22';
  if (count === 1) return '#0e4429';
  if (count === 2) return '#006d32';
  if (count === 3) return '#26a641';
  return '#39d353';
}

function buildWeeksFromDays(days: { date: string; count: number }[]) {
  const weeks: Record<string, typeof days> = {};
  days.forEach((contrib) => {
    const date = new Date(contrib.date + 'T12:00:00');
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(contrib);
  });
  return weeks;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

export default function LeaderboardPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [data, setData] = useState<LeaderboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<LeaderboardOverviewResponse>(`/leaderboard/overview?year=${year}`);
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const clientUser = getUser();
  const displayName = data?.me?.username ?? clientUser?.username ?? 'Guest';
  const meId = data?.me?.userId ?? clientUser?.id;

  const colors = ['#14b8a6', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308'];
  const hash = displayName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarColor = colors[hash % colors.length];

  const contributionDays = data?.me?.contributions.days ?? [];
  const weeks = useMemo(() => buildWeeksFromDays(contributionDays), [contributionDays]);
  const weekKeys = useMemo(() => Object.keys(weeks).sort().slice(-52), [weeks]);

  const practice = data?.me?.practiceByDifficulty;
  const getPercentage = (solved: number, total: number) => (total > 0 ? Math.round((solved / total) * 100) : 0);

  const statRings = practice
    ? [
        { label: 'Total Solved', ...practice.total },
        { label: 'Easy Solved', ...practice.easy },
        { label: 'Medium Solved', ...practice.medium },
        { label: 'Hard Solved', ...practice.hard },
      ]
    : [];

  const watch = data?.courseWatchTime ?? [];
  const maxWatch = Math.max(...watch.map((w) => w.hours), 0.01);

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl text-white">
        {error ? (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}{' '}
            <button type="button" className="underline" onClick={() => void refresh()}>
              Retry
            </button>
          </div>
        ) : null}

        {loading && !data ? (
          <p className="text-white/60">Loading leaderboard…</p>
        ) : null}

        {data ? (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="flex flex-col gap-6">
              <div
                className="mx-auto flex h-36 w-36 items-center justify-center rounded-full text-4xl font-bold text-white shadow-lg"
                style={{ background: avatarColor }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <h1 className="font-nav-brand text-xl font-semibold capitalize">{displayName}</h1>
                {data.me?.rank != null ? (
                  <p className="mt-1 text-sm text-green-400">Platform rank #{data.me.rank}</p>
                ) : data.me ? (
                  <p className="mt-1 text-sm text-white/45">Outside top 100 — keep solving!</p>
                ) : (
                  <p className="mt-1 text-sm text-white/45">
                    <Link href="/login" className="text-green-400 hover:underline">
                      Sign in
                    </Link>{' '}
                    for your stats
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span aria-hidden>🚀</span>
                  <h2 className="text-base font-semibold">Your streak</h2>
                </div>
                <div className="space-y-3">
                  <div className="rounded-md border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                    <div className="text-xs text-[#9ca3af]">Current streak</div>
                    <div className="text-2xl font-bold text-green-400">
                      {data.me ? `${data.me.streak.current} days` : '—'}
                    </div>
                  </div>
                  <div className="rounded-md border border-[#3a3a3a] bg-[#1a1a1a] p-3">
                    <div className="text-xs text-[#9ca3af]">Longest streak</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {data.me ? `${data.me.streak.longest} days` : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <div className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden>🏆</span>
                    <h2 className="text-base font-semibold">Platform leaderboard</h2>
                  </div>
                  <span className="text-xs text-white/45">By unique problems solved (AC)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/55">
                        <th className="py-2 pr-3 font-medium">#</th>
                        <th className="py-2 pr-3 font-medium">User</th>
                        <th className="py-2 pr-3 font-medium">Solved</th>
                        <th className="py-2 pr-3 font-medium">AC subs</th>
                        <th className="py-2 font-medium">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.globalLeaderboard.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-white/50">
                            No accepted submissions yet. Be the first on the board.
                          </td>
                        </tr>
                      ) : (
                        data.globalLeaderboard.map((row) => (
                          <tr
                            key={row.userId}
                            className={
                              meId && row.userId === meId
                                ? 'border-b border-white/5 bg-green-500/10'
                                : 'border-b border-white/5 hover:bg-white/[0.03]'
                            }
                          >
                            <td className="py-2.5 pr-3 font-mono text-white/80">{row.rank}</td>
                            <td className="py-2.5 pr-3 font-medium text-white">{row.username}</td>
                            <td className="py-2.5 pr-3 text-green-400">{row.uniqueSolved}</td>
                            <td className="py-2.5 pr-3 text-white/60">{row.acceptedSubmissions}</td>
                            <td className="py-2.5 text-white/60">{row.scoreSum}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span aria-hidden>☰</span>
                    <h2 className="text-base font-semibold">Activity</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#9ca3af]">
                    <span>
                      {data.me ? `${data.me.contributions.totalSubmissions} submissions in` : 'Sign in to track'}{' '}
                    </span>
                    <span aria-hidden>🔥</span>
                    <label htmlFor="lb-year" className="sr-only">
                      Year
                    </label>
                    <select
                      id="lb-year"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10))}
                      disabled={loading}
                      className="rounded border border-[#3a3a3a] bg-[#1a1a1a] px-2 py-1 text-sm text-white"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {!data.me ? (
                  <p className="text-sm text-white/50">Log in to see your submission heatmap for {year}.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="flex gap-0.5">
                      <div className="mr-2 flex flex-col gap-0.5">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="h-3 w-3 text-[0.65rem] leading-3 text-[#9ca3af]">
                            {day === 'Sun' || day === 'Wed' || day === 'Fri' ? day[0] : ''}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-0.5" style={{ maxWidth: 'calc(100% - 2rem)' }}>
                        {weekKeys.map((weekKey) => {
                          const weekContribs = weeks[weekKey];
                          return weekContribs.map((contrib, dayIndex) => (
                            <div
                              key={`${weekKey}-${dayIndex}`}
                              className="h-3 w-3 rounded-sm border border-[#161b22]"
                              style={{ background: getContributionLevel(contrib.count) }}
                              title={`${contrib.count} submission(s) on ${contrib.date}`}
                            />
                          ));
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {practice && data.me ? (
                <div className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span aria-hidden>🔗</span>
                    <h2 className="text-base font-semibold">Practice by difficulty</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {statRings.map((stat) => {
                      const percentage = getPercentage(stat.solved, stat.total);
                      return (
                        <div key={stat.label} className="flex flex-col items-center gap-2">
                          <div
                            className="flex h-20 w-20 items-center justify-center rounded-full"
                            style={{
                              background: `conic-gradient(#22c55e ${percentage * 3.6}deg, #3a3a3a 0deg)`,
                            }}
                          >
                            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#2a2a2a] text-sm font-bold">
                              {percentage}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-[#9ca3af]">{stat.label}</div>
                            <div className="text-xs text-[#6b7280]">
                              {stat.solved} / {stat.total}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {watch.length > 0 ? (
                    <div className="mt-8">
                      <div className="mb-3 flex items-center gap-2">
                        <span aria-hidden>📊</span>
                        <h3 className="text-base font-semibold">Course watch time</h3>
                      </div>
                      <p className="mb-3 text-xs text-[#9ca3af]">Time invested in courses (hours)</p>
                      <div className="flex h-40 items-end justify-center gap-8 rounded-md bg-[#1a1a1a] p-4">
                        {watch.map((item) => (
                          <div key={item.course} className="flex flex-1 flex-col items-center gap-2">
                            <div
                              className="w-full min-h-[20px] rounded-t bg-green-500 transition-all"
                              style={{ height: `${Math.max(8, (item.hours / maxWatch) * 100)}%` }}
                            />
                            <div className="text-center text-xs text-[#9ca3af]">{item.course}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {loading && data ? <p className="mt-4 text-xs text-white/40">Refreshing…</p> : null}
      </div>
    </DashboardShell>
  );
}
