import { ContestStatus } from '@codeforces/db';

export function determineStatus(startTime: Date, endTime: Date, now = new Date()): ContestStatus {
  if (now < startTime) return ContestStatus.UPCOMING;
  if (now > endTime) return ContestStatus.ENDED;
  return ContestStatus.LIVE;
}

export function contestRequiresRegistration(kind: string): boolean {
  return kind !== 'PRACTICE';
}

export function canRegisterForContest(opts: {
  kind: string;
  startTime: Date;
  endTime: Date;
  isPublished: boolean;
  now?: Date;
}): boolean {
  if (!opts.isPublished) return false;
  if (!contestRequiresRegistration(opts.kind)) return false;
  const now = opts.now ?? new Date();
  return now < opts.endTime;
}

export function canUnregisterFromContest(opts: {
  kind: string;
  startTime: Date;
  now?: Date;
}): boolean {
  if (!contestRequiresRegistration(opts.kind)) return false;
  const now = opts.now ?? new Date();
  return now < opts.startTime;
}

export function canSubmitToContest(opts: {
  kind: string;
  startTime: Date;
  endTime: Date;
  isRegistered: boolean;
  now?: Date;
}): boolean {
  const now = opts.now ?? new Date();
  if (opts.kind === 'PRACTICE') return true;
  if (!opts.isRegistered) return false;
  return now >= opts.startTime && now <= opts.endTime;
}
