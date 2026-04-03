'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
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

  return (
    <>
      <Navbar />
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={styles.title}>Practice Problems</h1>
            <p className={styles.subtitle}>Solve coding challenges to improve your skills</p>
          </div>
        </header>

        <div className={styles.main}>
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
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
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
                        <div className={styles.time}>30 mins</div>
                      </div>
                      <p className={styles.desc}>{preview}</p>
                      <div className={styles.tags}>
                        <span className={styles.tag}>React.js</span>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
