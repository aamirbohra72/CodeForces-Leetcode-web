'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  ApplicationTrackStatus,
  AppliedStatusFilter,
  CareerJob,
  JobApplication,
} from '@/types/careers';
import {
  APPLICATION_STATUS_LABEL,
  getJobAboutRole,
  getJobRequirements,
  withApplicationStatus,
} from '@/types/careers';
import styles from '@/app/placement/placement.module.css';

type DetailTab = 'timeline' | 'about' | 'requirements';

type Props = {
  jobs: CareerJob[];
  applications: Record<string, JobApplication>;
  onUpdateApplication: (jobId: string, next: JobApplication) => void;
  onWithdraw: (jobId: string) => void;
};

function initials(name: string, fallback?: string) {
  if (fallback?.trim()) return fallback.slice(0, 2).toUpperCase();
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function statusBadgeClass(status: ApplicationTrackStatus): string {
  if (status === 'rejected') return styles.appBadgeRejected;
  if (status === 'under_review') return styles.appBadgeReview;
  if (status === 'offer') return styles.appBadgeOffer;
  return styles.appBadgePending;
}

function reqStatusClass(status: string): string {
  if (status === 'Eligible' || status === 'Added' || status === 'Completed') return styles.reqOk;
  if (status === 'Pending') return styles.reqPending;
  return styles.reqMissing;
}

export function AppliedJobsPanel({ jobs, applications, onUpdateApplication, onWithdraw }: Props) {
  const [statusFilter, setStatusFilter] = useState<AppliedStatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('timeline');

  const appliedJobs = useMemo(() => {
    return jobs
      .filter((j) => applications[j.id] && !applications[j.id].withdrawn)
      .map((job) => ({ job, app: applications[job.id] }))
      .sort((a, b) => +new Date(b.app.appliedAt) - +new Date(a.app.appliedAt));
  }, [jobs, applications]);

  const counts = useMemo(() => {
    const base = { all: 0, pending: 0, under_review: 0, rejected: 0, offer: 0 };
    for (const { app } of appliedJobs) {
      base.all += 1;
      base[app.status] += 1;
    }
    return base;
  }, [appliedJobs]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return appliedJobs;
    return appliedJobs.filter(({ app }) => app.status === statusFilter);
  }, [appliedJobs, statusFilter]);

  const activeId =
    selectedId && filtered.some((x) => x.job.id === selectedId) ? selectedId : filtered[0]?.job.id ?? null;

  const active = filtered.find((x) => x.job.id === activeId) ?? null;

  useEffect(() => {
    setDetailTab('timeline');
  }, [activeId]);

  const about = active ? getJobAboutRole(active.job) : null;
  const requirements = active ? getJobRequirements(active.job) : null;

  return (
    <div className={styles.appliedLayout}>
      <aside className={styles.appliedListPane}>
        <h2 className={styles.appliedListTitle}>Your Job Applications</h2>
        <div className={styles.appliedFilters} role="tablist" aria-label="Application status">
          {(
            [
              ['all', `All (${counts.all})`],
              ['pending', `Pending (${counts.pending})`],
              ['under_review', `Under review (${counts.under_review})`],
              ['rejected', `Rejected (${counts.rejected})`],
              ['offer', `Offers (${counts.offer})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`${styles.appliedFilter} ${statusFilter === id ? styles.appliedFilterActive : ''}`}
              onClick={() => {
                setStatusFilter(id);
                setSelectedId(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>No applications in this status. Apply to jobs from All Jobs.</div>
        )}

        <div className={styles.appliedCards}>
          {filtered.map(({ job, app }) => (
            <button
              key={job.id}
              type="button"
              className={`${styles.appliedCard} ${activeId === job.id ? styles.appliedCardActive : ''}`}
              onClick={() => setSelectedId(job.id)}
            >
              <div className={styles.appliedCardTop}>
                <div className={styles.logo}>{initials(job.company, job.companyInitials)}</div>
                <div className={styles.jobMeta}>
                  <p className={styles.appliedJobTitle}>{job.title}</p>
                  <p className={styles.company}>{job.company}</p>
                  <p className={styles.posted}>
                    {job.location} · {job.ctc}
                  </p>
                </div>
                <span className={`${styles.appBadge} ${statusBadgeClass(app.status)}`}>
                  {APPLICATION_STATUS_LABEL[app.status]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className={styles.appliedDetailPane}>
        {!active && <div className={styles.empty}>Select an application to see resume status tracking.</div>}
        {active && about && requirements && (
          <>
            <div className={styles.appliedDetailHeader}>
              <div className={styles.appliedDetailHeadMain}>
                <div className={styles.logo}>{initials(active.job.company, active.job.companyInitials)}</div>
                <div>
                  <h3 className={styles.appliedDetailTitle}>{active.job.title}</h3>
                  <p className={styles.company}>{active.job.company}</p>
                  <div className={styles.details} style={{ borderTop: 'none', paddingTop: 0, marginTop: '0.35rem' }}>
                    <span>{active.job.location}</span>
                    <span>Exp: {active.job.experience}</span>
                    <span>{active.job.ctc}</span>
                    <span>Notice: {active.job.noticePeriod}</span>
                  </div>
                </div>
              </div>
              <div className={styles.appliedDetailActions}>
                <span className={`${styles.badge} ${styles.badgeEligible}`}>Applied</span>
                <button type="button" className={styles.ghostBtn} onClick={() => onWithdraw(active.job.id)}>
                  Withdraw Application
                </button>
              </div>
            </div>

            <div className={styles.sideCard} style={{ marginTop: '1rem' }}>
              <div className={styles.sideTitle}>Track resume status</div>
              <p className={styles.sideLabel} style={{ marginBottom: '0.65rem' }}>
                Update where your application / resume currently stands
              </p>
              <div className={styles.statusUpdateRow}>
                {(
                  [
                    ['pending', 'Pending'],
                    ['under_review', 'Under Review'],
                    ['rejected', 'Rejected'],
                    ['offer', 'Offer'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.statusChip} ${
                      active.app.status === value ? styles.statusChipActive : ''
                    } ${value === 'rejected' ? styles.statusChipRejected : ''} ${
                      value === 'offer' ? styles.statusChipOffer : ''
                    }`}
                    onClick={() => onUpdateApplication(active.job.id, withApplicationStatus(active.app, value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.detailTabs} role="tablist" aria-label="Application details">
              {(
                [
                  ['timeline', 'Application Timeline'],
                  ['about', 'About Role'],
                  ['requirements', 'Requirements'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={detailTab === id}
                  className={`${styles.detailTab} ${detailTab === id ? styles.detailTabActive : ''}`}
                  onClick={() => setDetailTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>

            {detailTab === 'timeline' && (
              <div className={styles.timelineCard}>
                <h4 className={styles.timelineTitle}>Your Application Status</h4>
                <ol className={styles.timeline}>
                  {active.app.timeline.map((step, idx) => (
                    <li
                      key={step.id}
                      className={`${styles.timelineItem} ${
                        step.state === 'done'
                          ? styles.timelineDone
                          : step.state === 'current'
                            ? styles.timelineCurrent
                            : step.state === 'failed'
                              ? styles.timelineFailed
                              : styles.timelineUpcoming
                      }`}
                    >
                      <span className={styles.timelineDot} aria-hidden>
                        {step.state === 'done' ? '✓' : step.state === 'failed' ? '✕' : idx + 1}
                      </span>
                      {idx < active.app.timeline.length - 1 && (
                        <span className={styles.timelineLine} aria-hidden />
                      )}
                      <div className={styles.timelineBody}>
                        <div className={styles.timelineHead}>
                          <strong>{step.title}</strong>
                          {step.dateLabel ? <span className={styles.timelineDate}>{step.dateLabel}</span> : null}
                        </div>
                        {step.note ? <p className={styles.timelineNote}>{step.note}</p> : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {detailTab === 'about' && (
              <div className={styles.roleCard}>
                <h4 className={styles.timelineTitle}>Job Description</h4>
                <p className={styles.roleCopy}>{about.description}</p>

                <h5 className={styles.roleSubhead}>About {active.job.company}</h5>
                <p className={styles.roleCopy}>{about.aboutCompany}</p>

                <h5 className={styles.roleSubhead}>Office Location</h5>
                <p className={styles.roleCopy}>{about.officeLocation}</p>

                <h5 className={styles.roleSubhead}>Company Category</h5>
                <p className={styles.roleCopy}>{about.companyCategory}</p>

                <h5 className={styles.roleSubhead}>Mandatory Skills</h5>
                <ul className={styles.roleList}>
                  {about.mandatorySkills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>

                <h5 className={styles.roleSubhead}>Responsibilities</h5>
                <ul className={styles.roleList}>
                  {about.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailTab === 'requirements' && (
              <div className={styles.roleCard}>
                <h4 className={styles.timelineTitle}>Job Check-list</h4>

                <h5 className={styles.roleSubhead}>Role requirements</h5>
                <div className={styles.reqTableWrap}>
                  <table className={styles.reqTable}>
                    <thead>
                      <tr>
                        <th>Requirement</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requirements.requirementChecks.map((row) => (
                        <tr key={row.requirement}>
                          <td>{row.requirement}</td>
                          <td>{row.details}</td>
                          <td>
                            <span className={`${styles.reqPill} ${reqStatusClass(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h5 className={styles.roleSubhead}>Skills and Toolsets in your Resume</h5>
                <div className={styles.reqTableWrap}>
                  <table className={styles.reqTable}>
                    <thead>
                      <tr>
                        <th>Stack Type</th>
                        <th>Experience (Yrs)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requirements.resumeSkillChecks.map((row) => (
                        <tr key={row.stack}>
                          <td>{row.stack}</td>
                          <td>{row.experienceYrs}</td>
                          <td>
                            <span className={`${styles.reqPill} ${reqStatusClass(row.status)}`}>
                              {row.status === 'Added' ? '✓ Added' : row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
