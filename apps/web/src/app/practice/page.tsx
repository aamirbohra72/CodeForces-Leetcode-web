'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/DashboardShell';
import type { Challenge } from '@codeforces/types';
import styles from './practice.module.css';

interface ProblemFilters {
  language: string;
  difficulty: string;
  search: string;
  tags: string[];
}

export default function PracticePage() {
  const [problems, setProblems] = useState<Challenge[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProblemFilters>({
    language: 'All',
    difficulty: 'All',
    search: '',
    tags: [],
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  useEffect(() => {
    fetchProblems();
  }, [selectedCompanies]);

  const fetchCompanies = async () => {
    try {
      const data = await api.get<string[]>('/challenges/companies');
      setCompanies(data);
    } catch (error) {
      // Non-blocking: practice list can still work without sidebar
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
      if (filters.language !== 'All') params.append('language', filters.language);
      if (filters.search) params.append('search', filters.search);
      if (selectedCompanies.length > 0) params.append('companies', selectedCompanies.join(','));

      const data = await api.get<Challenge[]>(`/challenges?${params.toString()}`);
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return styles.badgeEasy;
      case 'medium':
        return styles.badgeMedium;
      case 'hard':
        return styles.badgeHard;
      default:
        return styles.badgeDefault;
    }
  };

  const filteredCompanies = companies.filter((c) => c.toLowerCase().includes(companySearch.trim().toLowerCase()));

  const toggleCompany = (name: string) => {
    setSelectedCompanies((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  return (
    <DashboardShell mainClassName="min-h-0 overflow-y-auto p-0">
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>Practice Problems</h1>
            <p className={styles.subtitle}>Solve coding challenges to improve your skills</p>
          </div>
        </header>

        <div className={styles.main}>
          <div className={styles.content}>
            <section className={styles.left}>
              <div className={styles.filters}>
                <div className={styles.searchWrap}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search problems..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    aria-label="Search problems"
                  />
                </div>
                <select
                  className={styles.select}
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  aria-label="Difficulty filter"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select
                  className={styles.select}
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  aria-label="Language filter"
                >
                  <option value="All">All Languages</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="React.js">React.js</option>
                </select>
              </div>

              {loading ? (
                <div className={styles.state}>Loading problems...</div>
              ) : problems.length === 0 ? (
                <div className={styles.state}>No problems found. Try adjusting your filters.</div>
              ) : (
                <div className={styles.list}>
                  {problems.map((problem) => {
                    const preview =
                      problem.description.length > 150
                        ? `${problem.description.substring(0, 150)}...`
                        : problem.description;

                    const languageTag = problem.practiceLanguage ?? 'General';
                    const time = problem.estimatedTime ?? '30 mins';
                    const topCompanies = (problem.companies ?? []).slice(0, 6);

                    return (
                      <Link key={problem.id} href={`/practice/${problem.id}`} className={styles.cardLink}>
                        <article className={styles.card}>
                          <div className={styles.cardTop}>
                            <div className={styles.titleRow}>
                              <h2 className={styles.problemTitle}>{problem.title}</h2>
                              <span className={`${styles.badge} ${difficultyClass(problem.difficulty)}`}>
                                {problem.difficulty}
                              </span>
                            </div>
                            <div className={styles.time}>{time}</div>
                          </div>
                          <p className={styles.desc}>{preview}</p>
                          <div className={styles.tags}>
                            <span className={styles.tag}>{languageTag}</span>
                            {topCompanies.map((c) => (
                              <span key={c} className={styles.tagMuted}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <aside className={styles.rightPanel} aria-label="Filter by company">
              <div className={styles.panelHeader}>
                <div className={styles.panelTitleRow}>
                  <h3 className={styles.panelTitle}>Filter by Company</h3>
                  {selectedCompanies.length > 0 ? (
                    <button className={styles.clearBtn} onClick={() => setSelectedCompanies([])} type="button">
                      Clear
                    </button>
                  ) : null}
                </div>
                <input
                  className={styles.companySearch}
                  placeholder="Search companies..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  aria-label="Search companies"
                />
              </div>

              <div className={styles.companyList} role="list">
                {filteredCompanies.length === 0 ? (
                  <div className={styles.companyEmpty}>No companies found.</div>
                ) : (
                  filteredCompanies.map((name) => {
                    const checked = selectedCompanies.includes(name);
                    return (
                      <label key={name} className={styles.companyItem}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCompany(name)}
                          className={styles.companyCheckbox}
                        />
                        <span className={styles.companyName}>{name}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
