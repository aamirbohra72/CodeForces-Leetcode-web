'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/DashboardShell';
import { getAssignmentById } from '@/data/assignments';
import { flattenAssignmentQuestions, type FlatQuestion } from '@/types/assignment';
import styles from '../assignment.module.css';

type AnswerMap = Record<string, string>;
type ResultMap = Record<string, { correct: boolean; awarded: number }>;

function gradeQuestion(q: FlatQuestion, answer: string): { correct: boolean; awarded: number } {
  const trimmed = answer.trim();
  if (!trimmed) return { correct: false, awarded: 0 };

  if (q.type === 'multiple_choice') {
    const ok = trimmed === (q.correct_answer ?? '');
    return { correct: ok, awarded: ok ? q.marks : 0 };
  }

  // Short/long answers: keyword overlap heuristic for demo grading
  const expected = (q.expected_answer ?? '').toLowerCase();
  if (!expected) return { correct: false, awarded: 0 };

  const tokens = expected
    .split(/[^a-z0-9+./-]+/i)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 3);

  const unique = [...new Set(tokens)].slice(0, 12);
  if (unique.length === 0) return { correct: false, awarded: 0 };

  const hit = unique.filter((t) => trimmed.toLowerCase().includes(t)).length;
  const ratio = hit / unique.length;

  if (ratio >= 0.55) return { correct: true, awarded: q.marks };
  if (ratio >= 0.3) return { correct: false, awarded: Math.ceil(q.marks * 0.5) };
  return { correct: false, awarded: 0 };
}

export default function AssignmentAttemptPage() {
  const params = useParams();
  const courseId = params.id as string;
  const assignmentId = params.assignmentId as string;
  const assignment = getAssignmentById(assignmentId);

  const questions = useMemo(
    () => (assignment ? flattenAssignmentQuestions(assignment) : []),
    [assignment],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [results, setResults] = useState<ResultMap>({});
  const [activeTab, setActiveTab] = useState<'assignment' | 'topics' | 'rubric'>('assignment');

  if (!assignment || assignment.courseId !== courseId) {
    return (
      <DashboardShell mainClassName="p-8">
        <div>Assignment not found.</div>
        <Link href={`/learn/${courseId}/assignments`}>Back to assignments</Link>
      </DashboardShell>
    );
  }

  const current = questions[activeIndex];
  const answeredCount = questions.filter((q) => Boolean(answers[q.id]?.trim())).length;
  const totalScore = Object.values(results).reduce((sum, r) => sum + r.awarded, 0);
  const currentResult = results[current.id];
  const currentAnswer = answers[current.id] ?? '';

  const submitCurrent = () => {
    const graded = gradeQuestion(current, currentAnswer);
    setResults((prev) => ({ ...prev, [current.id]: graded }));
  };

  const optionClass = (option: string) => {
    const selected = currentAnswer === option;
    if (!currentResult) {
      return selected ? `${styles.option} ${styles.optionSelected}` : styles.option;
    }
    if (option === current.correct_answer) {
      return `${styles.option} ${styles.optionCorrect}`;
    }
    if (selected && !currentResult.correct) {
      return `${styles.option} ${styles.optionWrong}`;
    }
    return selected ? `${styles.option} ${styles.optionSelected}` : styles.option;
  };

  return (
    <DashboardShell mainClassName="min-h-0 overflow-hidden p-0">
      <div className={styles.wrap}>
        <header className={styles.topBar}>
          <div className={styles.titleBlock}>
            <Link href={`/learn/${courseId}/assignments`} className={styles.backLink}>
              ← Assignments
            </Link>
            <h1 className={styles.title}>{assignment.title}</h1>
            <span className={`${styles.badge} ${styles.badgeMandatory}`}>Mandatory</span>
          </div>
          <div className={styles.metaRow}>
            <span>{assignment.estimated_time}</span>
            <span>
              Progress {answeredCount}/{questions.length}
            </span>
            <span>
              Score{' '}
              <strong className={styles.scoreValue}>
                {totalScore}/{assignment.total_marks}
              </strong>
            </span>
          </div>
        </header>

        <nav className={styles.tabs} aria-label="Assignment tabs">
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'assignment' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('assignment')}
          >
            Assignment {answeredCount}/{questions.length}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'topics' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'rubric' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('rubric')}
          >
            Grading Rubric
          </button>
        </nav>

        {activeTab === 'topics' ? (
          <div className={styles.listWrap}>
            <h2 className={styles.listTitle}>Topics covered</h2>
            <div className={styles.cardMeta}>
              {(assignment.topics_covered ?? []).map((t) => (
                <span key={t} className={styles.chip}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ) : activeTab === 'rubric' ? (
          <div className={styles.listWrap}>
            <h2 className={styles.listTitle}>Grading rubric</h2>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                background: '#1c1c1e',
                border: '1px solid #2c2c2e',
                borderRadius: 12,
                padding: '1rem',
                color: '#d1d5db',
                fontSize: '0.9rem',
                lineHeight: 1.55,
              }}
            >
              {JSON.stringify(assignment.grading_rubric, null, 2)}
            </pre>
          </div>
        ) : (
          <div className={styles.workspace}>
            <aside className={styles.qNav} aria-label="Question navigation">
              {questions.map((q, idx) => {
                const solved = results[q.id]?.correct;
                const wrong = results[q.id] && !results[q.id].correct;
                const classes = [
                  styles.qPill,
                  idx === activeIndex ? styles.qPillActive : '',
                  solved ? styles.qPillSolved : '',
                  wrong ? styles.qPillWrong : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={classes}
                    onClick={() => setActiveIndex(idx)}
                    title={q.id}
                  >
                    {solved ? '✓' : q.id.replace('Q', '')}
                  </button>
                );
              })}
            </aside>

            <section className={styles.questionPane}>
              <div className={styles.qHeader}>
                <h2 className={styles.qId}>
                  {current.id}. {current.sectionTitle}
                </h2>
                {currentResult ? (
                  <span className={currentResult.correct ? styles.statusSolved : styles.statusPending}>
                    {currentResult.correct ? 'Solved' : 'Attempted'}
                  </span>
                ) : (
                  <span className={styles.statusPending}>Unsolved</span>
                )}
                <span className={styles.sectionChip}>{current.marks} marks</span>
                <span className={styles.sectionChip}>{current.type.replace('_', ' ')}</span>
              </div>
              <p className={styles.questionText}>{current.question}</p>
            </section>

            <section className={styles.answerPane}>
              <div className={styles.answerHeader}>
                <p className={styles.answerPrompt}>
                  {current.type === 'multiple_choice'
                    ? 'Choose the correct answer from below:'
                    : 'Write your answer below:'}
                </p>
                <div className={styles.scoreBox}>
                  <div>
                    Your Score:{' '}
                    <span className={styles.scoreValue}>{currentResult?.awarded ?? 0}</span>
                  </div>
                  <div>Max Score: {current.marks}</div>
                </div>
              </div>

              {current.type === 'multiple_choice' ? (
                <div className={styles.options}>
                  {(current.options ?? []).map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={optionClass(option)}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [current.id]: option,
                        }))
                      }
                      disabled={Boolean(currentResult)}
                    >
                      <input
                        className={styles.radio}
                        type="radio"
                        checked={currentAnswer === option}
                        readOnly
                      />
                      <span className={styles.optionText}>{option}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  className={styles.textarea}
                  value={currentAnswer}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [current.id]: e.target.value,
                    }))
                  }
                  placeholder="Type your answer here..."
                  disabled={Boolean(currentResult)}
                />
              )}

              <p className={styles.hint}>
                Feel free to submit your answer. Score uses best of your attempts for this session.
              </p>

              {currentResult && current.explanation ? (
                <div className={styles.feedback}>
                  <p className={styles.feedbackTitle}>Explanation</p>
                  {current.explanation}
                </div>
              ) : null}

              <div className={styles.footer}>
                <div className={styles.navBtns}>
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className={styles.btn}
                    disabled={activeIndex >= questions.length - 1}
                    onClick={() => setActiveIndex((i) => Math.min(questions.length - 1, i + 1))}
                  >
                    Next
                  </button>
                </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={submitCurrent}
                  disabled={!currentAnswer.trim() || Boolean(currentResult)}
                >
                  Submit
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
