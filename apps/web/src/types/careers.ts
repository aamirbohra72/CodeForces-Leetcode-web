export type CareerJobStatus = 'eligible' | 'pending' | 'closed';

export interface CareerJob {
  id: string;
  title: string;
  company: string;
  companyInitials?: string;
  postedAgo: string;
  location: string;
  experience: string;
  ctc: string;
  noticePeriod: string;
  status: CareerJobStatus;
  pendingSteps?: number;
  preferred: boolean;
  tags?: string[];
  description?: string;
  /** About Role tab */
  aboutCompany?: string;
  companyCategory?: string;
  mandatorySkills?: string[];
  responsibilities?: string[];
  /** Requirements tab */
  requirementChecks?: Array<{
    requirement: string;
    details: string;
    status: 'Eligible' | 'Pending' | 'Missing';
  }>;
  resumeSkillChecks?: Array<{
    stack: string;
    experienceYrs: string;
    status: 'Added' | 'Missing';
  }>;
}

export interface CareerProfile {
  name: string;
  role: string;
  experience: string;
  intent: string;
  remoteOk: boolean;
  preferredLocations: string[];
}

export interface CareersHubPack {
  source: 'llm';
  generatedAt?: string;
  profile: CareerProfile;
  jobs: CareerJob[];
}

export type JobFilterTab = 'preferred' | 'all' | 'saved' | 'applied';
export type HubMainTab = 'home' | 'resume' | 'preferences' | 'jobs';

/** Tracking status for an applied job / resume */
export type ApplicationTrackStatus = 'pending' | 'under_review' | 'rejected' | 'offer';

export type TimelineStepState = 'done' | 'current' | 'upcoming' | 'failed';

export interface ApplicationTimelineStep {
  id: string;
  title: string;
  state: TimelineStepState;
  dateLabel?: string;
  note?: string;
}

export interface JobApplication {
  jobId: string;
  status: ApplicationTrackStatus;
  appliedAt: string;
  timeline: ApplicationTimelineStep[];
  withdrawn?: boolean;
}

export type AppliedStatusFilter = 'all' | ApplicationTrackStatus;

export const APPLICATION_STATUS_LABEL: Record<ApplicationTrackStatus, string> = {
  pending: 'Application Pending',
  under_review: 'Under Review',
  rejected: 'Rejected',
  offer: 'Offer',
};

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function buildApplicationTimeline(
  status: ApplicationTrackStatus,
  appliedAt: string,
): ApplicationTimelineStep[] {
  const appliedLabel = formatShortDate(appliedAt);
  const base: ApplicationTimelineStep[] = [
    {
      id: 'submitted',
      title: 'Application Submitted',
      state: 'done',
      dateLabel: appliedLabel,
      note: 'Your resume was submitted successfully.',
    },
    {
      id: 'review',
      title: 'Application in Review',
      state: 'upcoming',
      note: 'Recruiters are screening your profile.',
    },
    {
      id: 'sent',
      title: 'Resume Sent to Company',
      state: 'upcoming',
      note: 'Resume shared with the hiring team.',
    },
    {
      id: 'shortlist',
      title: 'Resume Shortlist',
      state: 'upcoming',
      note: 'Awaiting shortlist decision.',
    },
    {
      id: 'tech',
      title: 'Technical Rounds',
      state: 'upcoming',
      note: 'Skills tested: DSA, System Design, Frontend.',
    },
  ];

  if (status === 'pending') {
    return base.map((step, i) =>
      i === 1 ? { ...step, state: 'current' as const, dateLabel: appliedLabel } : step,
    );
  }

  if (status === 'under_review') {
    return base.map((step, i) => {
      if (i === 0) return step;
      if (i === 1) return { ...step, state: 'done', dateLabel: appliedLabel, note: 'Screening completed.' };
      if (i === 2) return { ...step, state: 'current', dateLabel: appliedLabel };
      return step;
    });
  }

  if (status === 'rejected') {
    return [
      base[0],
      {
        ...base[1],
        state: 'done',
        dateLabel: appliedLabel,
        note: 'Application was reviewed.',
      },
      {
        id: 'rejected',
        title: 'Resume Rejected',
        state: 'failed',
        dateLabel: formatShortDate(new Date().toISOString()),
        note: 'We received your application, but the role is no longer available. Apply to other open jobs.',
      },
    ];
  }

  // offer
  return [
    ...base.map((step, i) =>
      i < 4
        ? { ...step, state: 'done' as const, dateLabel: appliedLabel }
        : { ...step, state: 'done' as const, dateLabel: appliedLabel, note: 'All rounds completed.' },
    ),
    {
      id: 'offer',
      title: 'Offer Extended',
      state: 'current',
      dateLabel: formatShortDate(new Date().toISOString()),
      note: 'Congratulations! An offer has been shared with you.',
    },
  ];
}

export function createJobApplication(jobId: string): JobApplication {
  const appliedAt = new Date().toISOString();
  return {
    jobId,
    status: 'pending',
    appliedAt,
    timeline: buildApplicationTimeline('pending', appliedAt),
    withdrawn: false,
  };
}

export function withApplicationStatus(
  app: JobApplication,
  status: ApplicationTrackStatus,
): JobApplication {
  return {
    ...app,
    status,
    withdrawn: false,
    timeline: buildApplicationTimeline(status, app.appliedAt),
  };
}

/** Fill About Role / Requirements content when LLM fields are missing */
export function getJobAboutRole(job: CareerJob) {
  const skills = job.mandatorySkills?.length
    ? job.mandatorySkills
    : job.tags?.length
      ? job.tags
      : ['JavaScript', 'TypeScript', 'React', 'Node.js'];

  return {
    description:
      job.description?.trim() ||
      `We are hiring a ${job.title} to build and ship high-quality product features in a fast-paced engineering team.`,
    aboutCompany:
      job.aboutCompany?.trim() ||
      `${job.company} is a product-focused technology company building scalable web platforms for customers across India.`,
    officeLocation: job.location,
    companyCategory: job.companyCategory?.trim() || 'Software / Product Engineering',
    mandatorySkills: skills,
    responsibilities: job.responsibilities?.length
      ? job.responsibilities
      : [
          `Own end-to-end delivery for ${job.title} initiatives.`,
          'Collaborate with design and backend teams on reliable releases.',
          'Write clean, tested, production-ready code and improve performance.',
          'Participate in code reviews and mentoring within the squad.',
        ],
  };
}

export function getJobRequirements(job: CareerJob) {
  const requirementChecks = job.requirementChecks?.length
    ? job.requirementChecks
    : [
        { requirement: 'Experience', details: job.experience, status: 'Eligible' as const },
        { requirement: 'Notice Period', details: job.noticePeriod, status: 'Eligible' as const },
        { requirement: 'Location', details: job.location, status: 'Eligible' as const },
        { requirement: 'CTC Band', details: job.ctc, status: 'Eligible' as const },
      ];

  const skills = job.mandatorySkills?.length ? job.mandatorySkills : job.tags?.length ? job.tags : ['React', 'Node.js', 'TypeScript'];
  const resumeSkillChecks = job.resumeSkillChecks?.length
    ? job.resumeSkillChecks
    : skills.map((stack) => ({
        stack,
        experienceYrs: '2+',
        status: 'Added' as const,
      }));

  return { requirementChecks, resumeSkillChecks };
}
