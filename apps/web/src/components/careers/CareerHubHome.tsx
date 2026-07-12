'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  CAREER_CHECKLIST_SECTIONS,
  flattenChecklistTasks,
  type ChecklistSection,
  type ChecklistTask,
} from '@/data/careers/checklist';
import styles from '@/app/placement/placement.module.css';

const HOME_STORAGE_KEY = 'career-hub-home-v1';

type HomeState = {
  completedIds: string[];
  designation: string;
  readiness: string;
  openSections: string[];
};

const defaultHome: HomeState = {
  completedIds: ['cert-video', 'resume-importance', 'resume-builder'],
  designation: 'Frontend/Full-stack',
  readiness: 'Interested; Ready to Interview',
  openSections: ['certification', 'readiness'],
};

function loadHome(): HomeState {
  if (typeof window === 'undefined') return defaultHome;
  try {
    const raw = localStorage.getItem(HOME_STORAGE_KEY);
    if (!raw) return defaultHome;
    return { ...defaultHome, ...JSON.parse(raw) };
  } catch {
    return defaultHome;
  }
}

type Props = {
  onNavigateTab: (tab: 'resume' | 'preferences' | 'jobs') => void;
};

function sectionBadgeClass(status: ChecklistSection['status']) {
  if (status === 'complete') return styles.homeBadgeComplete;
  if (status === 'urgent') return styles.homeBadgeUrgent;
  return styles.homeBadgePending;
}

function sectionBadgeLabel(status: ChecklistSection['status']) {
  if (status === 'complete') return 'Complete';
  if (status === 'urgent') return 'Urgent';
  return 'Pending';
}

export function CareerHubHome({ onNavigateTab }: Props) {
  const [home, setHome] = useState<HomeState>(defaultHome);
  const [selectedId, setSelectedId] = useState('ready-challenge-1');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadHome();
    setHome(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(home));
  }, [home, hydrated]);

  const sections = useMemo(() => {
    return CAREER_CHECKLIST_SECTIONS.map((section) => {
      const tasks = section.tasks.map((task) => {
        const done = home.completedIds.includes(task.id);
        return {
          ...task,
          status: (done ? 'done' : task.id === selectedId ? 'active' : 'todo') as ChecklistTask['status'],
        };
      });
      const allDone = tasks.every((t) => home.completedIds.includes(t.id));
      return {
        ...section,
        status: allDone ? ('complete' as const) : section.status === 'urgent' ? ('urgent' as const) : ('pending' as const),
        tasks,
      };
    });
  }, [home.completedIds, selectedId]);

  const selected =
    flattenChecklistTasks(sections).find((t) => t.id === selectedId) ??
    flattenChecklistTasks(sections)[0];

  const toggleSection = (id: string) => {
    setHome((prev) => ({
      ...prev,
      openSections: prev.openSections.includes(id)
        ? prev.openSections.filter((x) => x !== id)
        : [...prev.openSections, id],
    }));
  };

  const markDone = (id: string) => {
    setHome((prev) => ({
      ...prev,
      completedIds: prev.completedIds.includes(id) ? prev.completedIds : [...prev.completedIds, id],
    }));
  };

  const runCta = (task: ChecklistTask) => {
    markDone(task.id);
    if (task.action.type === 'tab') onNavigateTab(task.action.tab);
  };

  const taskIndex = flattenChecklistTasks(sections).findIndex((t) => t.id === selected?.id);
  const allTasks = flattenChecklistTasks(sections);

  const goPrev = () => {
    if (taskIndex <= 0) return;
    setSelectedId(allTasks[taskIndex - 1].id);
  };

  const goNext = () => {
    if (taskIndex < 0 || taskIndex >= allTasks.length - 1) return;
    setSelectedId(allTasks[taskIndex + 1].id);
  };

  return (
    <div className={styles.homeWrap}>
      <div className={styles.homeBanner}>
        <div>
          <p className={styles.homeBannerEyebrow}>Introducing Practice Arena</p>
          <p className={styles.homeBannerTitle}>
            Get ready to ace your job interviews with our practice assets.
          </p>
        </div>
        <Link href="/practice" className={styles.homeBannerCta}>
          Open Practice Arena ↗
        </Link>
      </div>

      <div className={styles.homeHeaderRow}>
        <div>
          <h2 className={styles.homeTitle}>Job Application Checklist</h2>
          <p className={styles.homeSubtitle}>Complete the following tasks to unlock job opportunities.</p>
        </div>
        <div className={styles.homeMeta}>
          <label className={styles.homeMetaLabel}>
            Current designation
            <input
              className={styles.textInput}
              value={home.designation}
              onChange={(e) => setHome((prev) => ({ ...prev, designation: e.target.value }))}
            />
          </label>
          <label className={styles.homeMetaLabel}>
            Readiness
            <select
              className={styles.select}
              value={home.readiness}
              onChange={(e) => setHome((prev) => ({ ...prev, readiness: e.target.value }))}
            >
              <option>Interested; Ready to Interview</option>
              <option>Looking for a job</option>
              <option>Open to opportunities</option>
              <option>Not looking right now</option>
            </select>
          </label>
        </div>
      </div>

      <div className={styles.homeLayout}>
        <aside className={styles.homeSidebar}>
          {sections.map((section) => {
            const open = home.openSections.includes(section.id);
            return (
              <div key={section.id} className={styles.homeAccordion}>
                <button
                  type="button"
                  className={styles.homeAccordionHead}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={open}
                >
                  <span>{section.title}</span>
                  <span className={styles.homeAccordionRight}>
                    <span className={`${styles.homeBadge} ${sectionBadgeClass(section.status)}`}>
                      {sectionBadgeLabel(section.status)}
                    </span>
                    <span className={styles.homeChevron}>{open ? '▾' : '▸'}</span>
                  </span>
                </button>
                {open && (
                  <ul className={styles.homeTaskList}>
                    {section.tasks.map((task) => {
                      const done = home.completedIds.includes(task.id);
                      const active = selectedId === task.id;
                      return (
                        <li key={task.id}>
                          <button
                            type="button"
                            className={`${styles.homeTask} ${active ? styles.homeTaskActive : ''} ${
                              done ? styles.homeTaskDone : ''
                            }`}
                            onClick={() => setSelectedId(task.id)}
                          >
                            <span className={styles.homeTaskIcon} aria-hidden>
                              {done ? '✓' : active ? '●' : '○'}
                            </span>
                            <span>{task.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </aside>

        <div className={styles.homeDetailShell}>
          <button
            type="button"
            className={`${styles.homeNavArrow} ${styles.homeNavLeft}`}
            onClick={goPrev}
            disabled={taskIndex <= 0}
            aria-label="Previous task"
          >
            ‹
          </button>

          {selected && (
            <article className={styles.homeDetailCard}>
              <h3 className={styles.homeDetailTitle}>{selected.detailTitle}</h3>
              <ul className={styles.homeDetailPoints}>
                {selected.detailPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className={styles.homeDetailActions}>
                {selected.action.type === 'href' ? (
                  <Link
                    href={selected.action.href}
                    className={styles.primaryBtn}
                    onClick={() => markDone(selected.id)}
                  >
                    {selected.ctaLabel}
                  </Link>
                ) : (
                  <button type="button" className={styles.primaryBtn} onClick={() => runCta(selected)}>
                    {selected.ctaLabel}
                  </button>
                )}
                {!home.completedIds.includes(selected.id) && (
                  <button type="button" className={styles.ghostBtn} onClick={() => markDone(selected.id)}>
                    Mark complete
                  </button>
                )}
              </div>
            </article>
          )}

          <button
            type="button"
            className={`${styles.homeNavArrow} ${styles.homeNavRight}`}
            onClick={goNext}
            disabled={taskIndex < 0 || taskIndex >= allTasks.length - 1}
            aria-label="Next task"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
