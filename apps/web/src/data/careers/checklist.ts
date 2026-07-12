export type ChecklistTaskStatus = 'done' | 'todo' | 'active';

export type ChecklistSectionStatus = 'pending' | 'complete' | 'urgent';

export interface ChecklistTask {
  id: string;
  label: string;
  status: ChecklistTaskStatus;
  detailTitle: string;
  detailPoints: string[];
  ctaLabel: string;
  /** Where the CTA should navigate inside Career Hub / app */
  action:
    | { type: 'tab'; tab: 'resume' | 'preferences' | 'jobs' }
    | { type: 'href'; href: string };
}

export interface ChecklistSection {
  id: string;
  title: string;
  status: ChecklistSectionStatus;
  tasks: ChecklistTask[];
}

export const CAREER_CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: 'certification',
    title: 'Earn your certification',
    status: 'pending',
    tasks: [
      {
        id: 'cert-video',
        label: 'Watch video to learn about certifications',
        status: 'done',
        detailTitle: 'Learn how certifications unlock interview calls',
        detailPoints: [
          'Understand which modules matter for Frontend / Full-stack roles',
          'Know how mock interviews map to company hiring rounds',
          'Track remaining certification tasks before applying',
        ],
        ctaLabel: 'Open Courses',
        action: { type: 'href', href: '/learn' },
      },
      {
        id: 'cert-js-test',
        label: 'Javascript Module Test',
        status: 'todo',
        detailTitle: 'Clear the Javascript module test',
        detailPoints: [
          'Tests core JS fundamentals used in interviews',
          'Evaluates speed, logic and code accuracy',
          'Builds confidence for company screening rounds',
        ],
        ctaLabel: 'Attempt Practice',
        action: { type: 'href', href: '/practice' },
      },
      {
        id: 'cert-backend-mock',
        label: 'Backend / LLD mock interview',
        status: 'todo',
        detailTitle: 'Attempt a backend / LLD style mock interview',
        detailPoints: [
          'Practice explaining design trade-offs clearly',
          'Get structured feedback on communication and depth',
          'Prepare for real hiring manager conversations',
        ],
        ctaLabel: 'Start Interview',
        action: { type: 'href', href: '/interview' },
      },
      {
        id: 'cert-sql',
        label: 'Databases & SQL Expert mock interview',
        status: 'todo',
        detailTitle: 'Practice SQL and database interview questions',
        detailPoints: [
          'Covers joins, indexing, and query optimization basics',
          'Helps you explain data modeling decisions',
          'Useful for fullstack and backend screening rounds',
        ],
        ctaLabel: 'Open DSA Sheet',
        action: { type: 'href', href: '/dsa-sheet' },
      },
    ],
  },
  {
    id: 'resume',
    title: 'Build & review resume',
    status: 'complete',
    tasks: [
      {
        id: 'resume-importance',
        label: 'Importance of building a resume',
        status: 'done',
        detailTitle: 'Why an ATS-friendly resume matters',
        detailPoints: [
          'Recruiters scan for keywords and measurable impact',
          'Clean single-column layouts pass ATS parsers more reliably',
          'A strong resume unlocks more preferred job matches',
        ],
        ctaLabel: 'Open Resume Builder',
        action: { type: 'tab', tab: 'resume' },
      },
      {
        id: 'resume-builder',
        label: 'Resume builder',
        status: 'done',
        detailTitle: 'Build and download your ATS resume',
        detailPoints: [
          'Pick an ATS template and fill experience, projects, achievements',
          'Use Get Suggestions to improve wording with AI',
          'Download a clean PDF before applying to roles',
        ],
        ctaLabel: 'Open Resume Builder',
        action: { type: 'tab', tab: 'resume' },
      },
    ],
  },
  {
    id: 'readiness',
    title: 'Job Readiness',
    status: 'urgent',
    tasks: [
      {
        id: 'ready-challenge-1',
        label: 'Coding challenge round 1',
        status: 'active',
        detailTitle: 'Prepare by practising for the coding challenge round',
        detailPoints: [
          'Tests your fundamentals in subjects like DSA, SQL, etc',
          'Evaluate your speed, logic and code accuracy',
          'Brings out candidates with strong real time coding skills',
          'Builds confidence for time-bound challenges',
        ],
        ctaLabel: 'Attempt Test',
        action: { type: 'href', href: '/practice' },
      },
      {
        id: 'ready-challenge-2',
        label: 'Coding challenge round 2',
        status: 'todo',
        detailTitle: 'Advance to coding challenge round 2',
        detailPoints: [
          'Harder problems focused on patterns and edge cases',
          'Simulates multi-question company assessments',
          'Improves consistency under timed pressure',
        ],
        ctaLabel: 'Open Practice Arena',
        action: { type: 'href', href: '/practice' },
      },
      {
        id: 'ready-resume-interview',
        label: 'Resume Interview',
        status: 'todo',
        detailTitle: 'Practice explaining your resume end-to-end',
        detailPoints: [
          'Walk through projects with impact metrics',
          'Handle deep-dives on tech choices and trade-offs',
          'Get ready for recruiter and hiring manager screens',
        ],
        ctaLabel: 'Start Interview',
        action: { type: 'href', href: '/interview' },
      },
      {
        id: 'ready-prefs',
        label: 'Set job preferences',
        status: 'todo',
        detailTitle: 'Complete your job preferences',
        detailPoints: [
          'Set preferred locations and remote preference',
          'Choose your current job search intent',
          'Improve matching quality for Preferred Jobs',
        ],
        ctaLabel: 'Edit Preferences',
        action: { type: 'tab', tab: 'preferences' },
      },
      {
        id: 'ready-apply',
        label: 'Apply to preferred jobs',
        status: 'todo',
        detailTitle: 'Start applying to unlocked opportunities',
        detailPoints: [
          'Browse Preferred Jobs matched to your profile',
          'Track resume status after you apply',
          'Move applications through review, reject, or offer states',
        ],
        ctaLabel: 'Browse Jobs',
        action: { type: 'tab', tab: 'jobs' },
      },
    ],
  },
];

export function flattenChecklistTasks(sections: ChecklistSection[] = CAREER_CHECKLIST_SECTIONS) {
  return sections.flatMap((s) => s.tasks);
}
