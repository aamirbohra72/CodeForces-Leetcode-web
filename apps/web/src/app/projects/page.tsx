'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api } from '@/lib/api';
import { FEATURED_PROJECTS, FEATURED_TRACK } from '@/data/featured-projects';
import type {
  ProjectDifficulty,
  ProjectIdea,
  ProjectsHub,
  ProjectTrackId,
} from '@/types/projects-hub';
import styles from './projects.module.css';

const FALLBACK_TRACKS: ProjectsHub['tracks'] = [
  FEATURED_TRACK,
  {
    id: 'colosseum',
    title: 'Solana Colosseum',
    blurb: 'On-chain products, DeFi, infra & consumer crypto for Colosseum-style hackathons.',
    accent: '#14F195',
  },
  {
    id: 'genai',
    title: 'GenAI Hackathon',
    blurb: 'RAG, multimodal apps, evals & production GenAI products.',
    accent: '#38BDF8',
  },
  {
    id: 'agentic',
    title: 'Agentic AI',
    blurb: 'Tool-using agents, multi-agent systems, MCP & autonomous workflows.',
    accent: '#A78BFA',
  },
];

function diffClass(d: ProjectDifficulty) {
  switch (d) {
    case 'Easy':
      return styles.diffEasy;
    case 'Medium':
      return styles.diffMedium;
    default:
      return styles.diffHard;
  }
}

export default function ProjectsPage() {
  const [hub, setHub] = useState<ProjectsHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [track, setTrack] = useState<ProjectTrackId | 'all'>('all');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(FEATURED_PROJECTS[0]?.id ?? '');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const data = refresh
        ? await api.post<ProjectsHub>('/projects/refresh', {})
        : await api.get<ProjectsHub>('/projects');
      setHub(data);
      setSelectedId((prev) => {
        const mergedIds = new Set([
          ...FEATURED_PROJECTS.map((p) => p.id),
          ...data.projects.map((p) => p.id),
        ]);
        return mergedIds.has(prev) ? prev : FEATURED_PROJECTS[0]?.id || data.projects[0]?.id || prev;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects from Mistral');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const projects = useMemo(() => {
    const live = hub?.projects ?? [];
    const ids = new Set(FEATURED_PROJECTS.map((p) => p.id));
    return [...FEATURED_PROJECTS, ...live.filter((p) => !ids.has(p.id))];
  }, [hub]);

  const tracks = useMemo(() => {
    const live = hub?.tracks?.length ? hub.tracks : FALLBACK_TRACKS.filter((t) => t.id !== 'featured');
    const withoutFeatured = live.filter((t) => t.id !== 'featured');
    return [FEATURED_TRACK, ...withoutFeatured];
  }, [hub]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (track !== 'all' && p.track !== track) return false;
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.title} ${p.shortDesc} ${p.hackathon} ${p.domains.join(' ')} ${p.technologies.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, track, difficulty, search]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((p) => p.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected: ProjectIdea | undefined =
    filtered.find((p) => p.id === selectedId) ?? filtered[0];

  const selectedTrackAccent =
    tracks.find((t) => t.id === selected?.track)?.accent || '#34d399';

  return (
    <DashboardShell mainClassName="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>Live via Mistral · Hackathon Lab</div>
            <h1 className={styles.heroTitle}>
              {hub?.headline || 'Colosseum, GenAI & Agentic AI project ideas'}
            </h1>
            <p className={styles.heroSummary}>
              {hub?.summary ||
                'Real-time project briefs for Solana Colosseum / blockchain hackathons and modern GenAI + AI agent competitions.'}
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.metaChip}>
                {hub?.generatedAt
                  ? `Updated ${new Date(hub.generatedAt).toLocaleString()}`
                  : 'Fetching live ideas...'}
              </span>
              <span className={styles.metaChip}>{projects.length || '—'} ideas</span>
              <button
                type="button"
                className={styles.refreshBtn}
                disabled={loading || refreshing}
                onClick={() => void load(true)}
              >
                {refreshing ? 'Regenerating...' : 'Regenerate with Mistral'}
              </button>
            </div>

            <div className={styles.tracks}>
              <button
                type="button"
                className={`${styles.trackCard} ${track === 'all' ? styles.trackCardActive : ''}`}
                style={{ ['--track-accent' as string]: '#34d399' }}
                onClick={() => setTrack('all')}
              >
                <div className={styles.trackLabel}>All tracks</div>
                <div className={styles.trackTitle}>Full board</div>
                <p className={styles.trackBlurb}>Browse every live idea across blockchain & AI.</p>
              </button>
              {tracks.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.trackCard} ${track === t.id ? styles.trackCardActive : ''}`}
                  style={{ ['--track-accent' as string]: t.accent }}
                  onClick={() => setTrack(t.id)}
                >
                  <div className={styles.trackLabel}>
                    {t.id}
                  </div>
                  <div className={styles.trackTitle}>{t.title}</div>
                  <p className={styles.trackBlurb}>{t.blurb}</p>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.filtersRow}>
            <select
              className={styles.select}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              aria-label="Difficulty"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon} aria-hidden>
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search Colosseum, agents, RAG..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search projects"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className={`${styles.stateBox} ${styles.stateError}`} style={{ padding: '0.75rem 1.5rem' }}>
            Live Mistral ideas unavailable: {error}{' '}
            <button type="button" className={styles.refreshBtn} onClick={() => void load(true)}>
              Retry
            </button>
          </div>
        ) : null}
        {loading && !hub ? (
          <div className={styles.stateBox} style={{ padding: '0.75rem 1.5rem' }}>
            <div className={styles.spinner} style={{ margin: '0 auto 0.5rem' }} />
            Loading Colosseum / GenAI / Agentic ideas from Mistral — featured projects are ready below.
          </div>
        ) : null}

        <div className={styles.layout}>
            <div className={styles.listCol} role="list">
              {filtered.length === 0 ? (
                <p className={styles.stateBox}>No projects match your filters.</p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="listitem"
                    className={`${styles.card} ${p.id === selected?.id ? styles.cardSelected : ''}`}
                    onClick={() => setSelectedId(p.id)}
                  >
                    <div className={styles.hackathonPill}>{p.hackathon}</div>
                    <div className={styles.cardTop}>
                      <h2 className={styles.cardTitle}>{p.title}</h2>
                      <span className={`${styles.diffBadge} ${diffClass(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <p className={styles.cardDesc}>{p.shortDesc}</p>
                    <div className={styles.tagRow}>
                      {p.domains.slice(0, 3).map((d) => (
                        <span key={d} className={styles.tagDomain}>
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className={styles.tagRow} style={{ marginTop: 6 }}>
                      {p.technologies.slice(0, 4).map((t) => (
                        <span key={t} className={styles.tagTech}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>

            <article className={styles.detail}>
              {!selected ? (
                <p className={styles.stateBox}>Select a project to see the full brief.</p>
              ) : (
                <>
                  <div className={styles.detailHeader}>
                    <h2 className={styles.detailTitle}>{selected.title}</h2>
                  </div>
                  <div className={styles.detailMeta}>
                    <span className={styles.metaItem}>{selected.hackathon}</span>
                    <span className={`${styles.diffBadge} ${diffClass(selected.difficulty)}`}>
                      {selected.difficulty}
                    </span>
                    <span
                      className={styles.metaItem}
                      style={{ color: selectedTrackAccent }}
                    >
                      Track · {selected.track}
                    </span>
                  </div>
                  <p className={styles.detailIntro}>{selected.shortDesc}</p>

                  <div className={styles.prizeBox}>
                    <h4>Prize / judge angle</h4>
                    <p>{selected.prizeAngle}</p>
                  </div>

                  <div className={styles.boxes}>
                    <div className={styles.box}>
                      <h4>Domains</h4>
                      <div className={styles.tagRow}>
                        {selected.domains.map((d) => (
                          <span key={d} className={styles.tagDomain}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.box}>
                      <h4>Technologies</h4>
                      <div className={styles.tagRow}>
                        {selected.technologies.map((t) => (
                          <span key={t} className={styles.tagTech}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <section className={styles.section}>
                    <h3>MVP features</h3>
                    <ul>
                      {selected.mvpFeatures.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.section}>
                    <h3>Stretch goals</h3>
                    <ul>
                      {selected.stretchGoals.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </section>

                  <section className={styles.section}>
                    <h3>Why this stands out</h3>
                    <ul>
                      {selected.whyUnique.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </section>

                  {selected.resources && selected.resources.length > 0 ? (
                    <section className={styles.section}>
                      <h3>Resources</h3>
                      <ul className={styles.resourceList}>
                        {selected.resources.map((r) => (
                          <li key={r.url}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer">
                              {r.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </>
              )}
            </article>
          </div>
      </div>
    </DashboardShell>
  );
}
