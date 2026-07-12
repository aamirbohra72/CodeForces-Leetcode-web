'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { AppliedJobsPanel } from '@/components/careers/AppliedJobsPanel';
import { CareerHubHome } from '@/components/careers/CareerHubHome';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { api } from '@/lib/api';
import type {
  CareerJob,
  CareerProfile,
  CareersHubPack,
  HubMainTab,
  JobApplication,
  JobFilterTab,
} from '@/types/careers';
import { createJobApplication } from '@/types/careers';
import styles from './placement.module.css';

const STORAGE_KEY = 'careers-hub-local-v1';

type LocalState = {
  savedIds: string[];
  appliedIds: string[];
  applications: Record<string, JobApplication>;
  jobAlerts: boolean;
  notifyMe: boolean;
  profileOverride: Partial<CareerProfile> | null;
};

const defaultLocal: LocalState = {
  savedIds: [],
  appliedIds: [],
  applications: {},
  jobAlerts: true,
  notifyMe: true,
  profileOverride: null,
};

function migrateApplications(parsed: Partial<LocalState>): Record<string, JobApplication> {
  const apps = { ...(parsed.applications ?? {}) };
  const ids = parsed.appliedIds ?? [];
  for (const id of ids) {
    if (!apps[id]) apps[id] = createJobApplication(id);
  }
  return apps;
}

function loadLocal(): LocalState {
  if (typeof window === 'undefined') return defaultLocal;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultLocal;
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    const applications = migrateApplications(parsed);
    return {
      ...defaultLocal,
      ...parsed,
      applications,
      appliedIds: Object.keys(applications).filter((id) => !applications[id]?.withdrawn),
    };
  } catch {
    return defaultLocal;
  }
}

function saveLocal(state: LocalState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initials(name: string, fallback?: string) {
  if (fallback?.trim()) return fallback.slice(0, 2).toUpperCase();
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function PlacementCareerHubPage() {
  const [mainTab, setMainTab] = useState<HubMainTab>('home');
  const [filter, setFilter] = useState<JobFilterTab>('preferred');
  const [sortBy, setSortBy] = useState<'recent' | 'ctc'>('recent');
  const [query, setQuery] = useState('');
  const [pack, setPack] = useState<CareersHubPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [local, setLocal] = useState<LocalState>(defaultLocal);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefDraft, setPrefDraft] = useState('');

  useEffect(() => {
    setLocal(loadLocal());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<CareersHubPack>('/careers/hub');
        if (!cancelled) setPack(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load Career Hub');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateLocal = (patch: Partial<LocalState>) => {
    setLocal((prev) => {
      const next = { ...prev, ...patch };
      saveLocal(next);
      return next;
    });
  };

  const profile: CareerProfile | null = useMemo(() => {
    if (!pack) return null;
    return { ...pack.profile, ...(local.profileOverride ?? {}) };
  }, [pack, local.profileOverride]);

  const counts = useMemo(() => {
    const jobs = pack?.jobs ?? [];
    const appliedCount = Object.values(local.applications).filter((a) => a && !a.withdrawn).length;
    return {
      preferred: jobs.filter((j) => j.preferred).length,
      all: jobs.length,
      saved: local.savedIds.length,
      applied: appliedCount,
    };
  }, [pack, local.savedIds, local.applications]);

  const visibleJobs = useMemo(() => {
    let jobs = [...(pack?.jobs ?? [])];
    if (filter === 'preferred') jobs = jobs.filter((j) => j.preferred);
    if (filter === 'saved') jobs = jobs.filter((j) => local.savedIds.includes(j.id));
    if (filter === 'applied') {
      jobs = jobs.filter((j) => local.applications[j.id] && !local.applications[j.id].withdrawn);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q),
      );
    }

    if (sortBy === 'ctc') {
      jobs.sort((a, b) => extractCtcLow(b.ctc) - extractCtcLow(a.ctc));
    }

    return jobs;
  }, [pack, filter, local.savedIds, local.applications, query, sortBy]);

  const refreshHub = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await api.post<CareersHubPack>('/careers/hub/refresh');
      setPack(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh jobs');
    } finally {
      setRefreshing(false);
    }
  };

  const toggleSaved = (job: CareerJob) => {
    const exists = local.savedIds.includes(job.id);
    updateLocal({
      savedIds: exists ? local.savedIds.filter((id) => id !== job.id) : [...local.savedIds, job.id],
    });
  };

  const applyJob = (job: CareerJob) => {
    if (local.applications[job.id] && !local.applications[job.id].withdrawn) return;
    const app = createJobApplication(job.id);
    const applications = { ...local.applications, [job.id]: app };
    updateLocal({
      applications,
      appliedIds: Object.keys(applications).filter((id) => !applications[id].withdrawn),
    });
    setFilter('applied');
  };

  const updateApplication = (jobId: string, next: JobApplication) => {
    const applications = { ...local.applications, [jobId]: next };
    updateLocal({
      applications,
      appliedIds: Object.keys(applications).filter((id) => !applications[id].withdrawn),
    });
  };

  const withdrawApplication = (jobId: string) => {
    const existing = local.applications[jobId];
    if (!existing) return;
    const applications = {
      ...local.applications,
      [jobId]: { ...existing, withdrawn: true },
    };
    updateLocal({
      applications,
      appliedIds: Object.keys(applications).filter((id) => !applications[id].withdrawn),
    });
  };

  const startEditPrefs = () => {
    if (!profile) return;
    setPrefDraft(profile.preferredLocations.join(', '));
    setEditingPrefs(true);
  };

  const savePrefs = () => {
    if (!profile) return;
    const preferredLocations = prefDraft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateLocal({
      profileOverride: {
        ...(local.profileOverride ?? {}),
        preferredLocations: preferredLocations.length ? preferredLocations : profile.preferredLocations,
      },
    });
    setEditingPrefs(false);
  };

  return (
    <DashboardShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.kicker}>Placement Support</p>
            <h1 className={styles.title}>Career Hub</h1>
            <p className={styles.subtitle}>
              Explore roles matched to your profile. Job listings are generated dynamically via our LLM API.
            </p>
            <div className={styles.mainTabs} role="tablist" aria-label="Career Hub sections">
              {(
                [
                  ['home', 'Home'],
                  ['resume', 'My Resume'],
                  ['preferences', 'My Job Preferences'],
                  ['jobs', 'Jobs'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={mainTab === id}
                  className={`${styles.mainTab} ${mainTab === id ? styles.mainTabActive : ''}`}
                  onClick={() => setMainTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.body}>
          {error && <div className={styles.errorBox}>{error}</div>}

          {mainTab === 'home' && (
            <CareerHubHome
              onNavigateTab={(tab) => {
                setMainTab(tab);
                if (tab === 'jobs') setFilter('preferred');
              }}
            />
          )}

          {mainTab === 'resume' && (
            <ResumeBuilder seedName={profile?.name} seedRole={profile?.role} />
          )}

          {mainTab === 'preferences' && profile && (
            <div className={styles.panelCard}>
              <h2 className={styles.sideTitle}>My Job Preferences</h2>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.fieldLabel} htmlFor="intent">
                    Intent
                  </label>
                  <select
                    id="intent"
                    className={styles.select}
                    value={profile.intent}
                    onChange={(e) =>
                      updateLocal({
                        profileOverride: { ...(local.profileOverride ?? {}), intent: e.target.value },
                      })
                    }
                  >
                    <option>Looking for a job</option>
                    <option>Open to opportunities</option>
                    <option>Not looking right now</option>
                  </select>
                </div>
                <div>
                  <label className={styles.fieldLabel} htmlFor="locations">
                    Preferred locations (comma separated)
                  </label>
                  <input
                    id="locations"
                    className={styles.textInput}
                    value={
                      editingPrefs
                        ? prefDraft
                        : (local.profileOverride?.preferredLocations ?? profile.preferredLocations).join(', ')
                    }
                    onFocus={() => {
                      if (!editingPrefs) startEditPrefs();
                    }}
                    onChange={(e) => setPrefDraft(e.target.value)}
                    onBlur={savePrefs}
                  />
                </div>
                <div>
                  <span className={styles.fieldLabel}>Remote ok?</span>
                  <div className={styles.radioRow}>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        checked={profile.remoteOk}
                        onChange={() =>
                          updateLocal({
                            profileOverride: { ...(local.profileOverride ?? {}), remoteOk: true },
                          })
                        }
                      />
                      Yes
                    </label>
                    <label className={styles.radio}>
                      <input
                        type="radio"
                        checked={!profile.remoteOk}
                        onChange={() =>
                          updateLocal({
                            profileOverride: { ...(local.profileOverride ?? {}), remoteOk: false },
                          })
                        }
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mainTab === 'jobs' && (
            <>
              <div className={styles.toolbar}>
                <div className={styles.filterTabs} role="tablist" aria-label="Job filters">
                  {(
                    [
                      ['preferred', `Preferred Jobs (${counts.preferred})`],
                      ['all', `All Jobs (${counts.all})`],
                      ['saved', `Saved (${counts.saved})`],
                      ['applied', `Applied (${counts.applied})`],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.filterTab} ${filter === id ? styles.filterTabActive : ''}`}
                      onClick={() => setFilter(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className={styles.actions}>
                  <div className={styles.toggleRow}>
                    <button
                      type="button"
                      className={`${styles.toggle} ${local.jobAlerts ? styles.toggleOn : ''}`}
                      aria-pressed={local.jobAlerts}
                      onClick={() => updateLocal({ jobAlerts: !local.jobAlerts })}
                    >
                      <span className={styles.toggleKnob} />
                    </button>
                    Job Alerts
                  </div>
                  <select
                    className={styles.select}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'recent' | 'ctc')}
                    aria-label="Sort jobs"
                  >
                    <option value="recent">Sorted By: Recent</option>
                    <option value="ctc">Sorted By: CTC</option>
                  </select>
                  <input
                    className={styles.searchInput}
                    placeholder="Search jobs"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search jobs"
                  />
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={refreshHub}
                    disabled={refreshing || loading}
                  >
                    {refreshing ? 'Refreshing…' : 'Refresh (LLM)'}
                  </button>
                </div>
              </div>

              {loading && <div className={styles.stateBox}>Loading Career Hub…</div>}

              {!loading && filter === 'applied' && (
                <AppliedJobsPanel
                  jobs={pack?.jobs ?? []}
                  applications={local.applications}
                  onUpdateApplication={updateApplication}
                  onWithdraw={withdrawApplication}
                />
              )}

              {!loading && filter !== 'applied' && (
                <div className={styles.layout}>
                  <div className={styles.jobList}>
                    {visibleJobs.length === 0 && (
                      <div className={styles.empty}>No jobs match this filter. Try All Jobs or refresh.</div>
                    )}
                    {visibleJobs.map((job) => {
                      const saved = local.savedIds.includes(job.id);
                      const applied = Boolean(
                        local.applications[job.id] && !local.applications[job.id].withdrawn,
                      );
                      return (
                        <article key={job.id} className={styles.jobCard}>
                          <div className={styles.jobTop}>
                            <div className={styles.logo}>{initials(job.company, job.companyInitials)}</div>
                            <div className={styles.jobMeta}>
                              <h3 className={styles.jobTitle}>{job.title}</h3>
                              <p className={styles.company}>{job.company}</p>
                              <p className={styles.posted}>{job.postedAgo}</p>
                            </div>
                            <div className={styles.badgeRow}>
                              {applied && (
                                <span className={`${styles.badge} ${styles.badgeEligible}`}>Applied</span>
                              )}
                              {!applied && job.status === 'eligible' && (
                                <span className={`${styles.badge} ${styles.badgeEligible}`}>Eligible</span>
                              )}
                              {!applied && job.status === 'pending' && (
                                <span className={`${styles.badge} ${styles.badgePending}`}>
                                  {job.pendingSteps ?? 1} steps pending
                                </span>
                              )}
                              {!applied && job.status === 'closed' && (
                                <span className={`${styles.badge} ${styles.badgeClosed}`}>Closed</span>
                              )}
                            </div>
                          </div>
                          <div className={styles.details}>
                            <span className={styles.detailItem}>
                              <strong>{job.location}</strong>
                            </span>
                            <span className={styles.detailItem}>
                              Exp: <strong>{job.experience}</strong>
                            </span>
                            <span className={styles.detailItem}>
                              CTC: <strong>{job.ctc}</strong>
                            </span>
                            <span className={styles.detailItem}>
                              Notice: <strong>{job.noticePeriod}</strong>
                            </span>
                          </div>
                          {job.description && (
                            <p className={styles.panelCopy} style={{ marginTop: '0.75rem' }}>
                              {job.description}
                            </p>
                          )}
                          <div className={styles.cardActions}>
                            <button type="button" className={styles.ghostBtn} onClick={() => toggleSaved(job)}>
                              {saved ? 'Saved' : 'Save'}
                            </button>
                            <button
                              type="button"
                              className={styles.primaryBtn}
                              disabled={applied}
                              onClick={() => applyJob(job)}
                            >
                              {applied ? 'Applied' : 'Apply'}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {profile && (
                    <aside className={styles.side}>
                      <div className={styles.sideCard}>
                        <div className={styles.profileHead}>
                          <div className={styles.avatar}>{initials(profile.name)}</div>
                          <div>
                            <p className={styles.profileName}>{profile.name}</p>
                            <p className={styles.profileRole}>
                              {profile.role} · {profile.experience}
                            </p>
                            <button type="button" className={styles.linkBtn} onClick={() => setMainTab('resume')}>
                              View Resume
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className={styles.sideCard}>
                        <p className={styles.sideLabel}>Select your intent in Career Hub</p>
                        <select
                          className={styles.select}
                          style={{ width: '100%' }}
                          value={profile.intent}
                          onChange={(e) =>
                            updateLocal({
                              profileOverride: { ...(local.profileOverride ?? {}), intent: e.target.value },
                            })
                          }
                        >
                          <option>Looking for a job</option>
                          <option>Open to opportunities</option>
                          <option>Not looking right now</option>
                        </select>
                        <div className={styles.toggleRow} style={{ marginTop: '0.85rem' }}>
                          <button
                            type="button"
                            className={`${styles.toggle} ${local.notifyMe ? styles.toggleOn : ''}`}
                            aria-pressed={local.notifyMe}
                            onClick={() => updateLocal({ notifyMe: !local.notifyMe })}
                          >
                            <span className={styles.toggleKnob} />
                          </button>
                          Notify me
                        </div>
                      </div>

                      <div className={styles.sideCard}>
                        <div className={styles.sideTitle}>
                          Preferences
                          <button type="button" className={styles.ghostBtn} onClick={startEditPrefs}>
                            Edit
                          </button>
                        </div>
                        <p className={styles.sideLabel}>Locations</p>
                        {editingPrefs ? (
                          <div className={styles.formGrid}>
                            <input
                              className={styles.textInput}
                              value={prefDraft}
                              onChange={(e) => setPrefDraft(e.target.value)}
                              placeholder="Remote, Bangalore, …"
                            />
                            <button type="button" className={styles.primaryBtn} onClick={savePrefs}>
                              Save locations
                            </button>
                          </div>
                        ) : (
                          <div className={styles.tags}>
                            {profile.preferredLocations.map((loc) => (
                              <span key={loc} className={styles.tag}>
                                {loc}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className={styles.sideLabel} style={{ marginTop: '0.85rem' }}>
                          Are you open to remote jobs?
                        </p>
                        <div className={styles.radioRow}>
                          <label className={styles.radio}>
                            <input
                              type="radio"
                              checked={profile.remoteOk}
                              onChange={() =>
                                updateLocal({
                                  profileOverride: { ...(local.profileOverride ?? {}), remoteOk: true },
                                })
                              }
                            />
                            Yes
                          </label>
                          <label className={styles.radio}>
                            <input
                              type="radio"
                              checked={!profile.remoteOk}
                              onChange={() =>
                                updateLocal({
                                  profileOverride: { ...(local.profileOverride ?? {}), remoteOk: false },
                                })
                              }
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </aside>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function extractCtcLow(ctc: string): number {
  const m = ctc.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}
