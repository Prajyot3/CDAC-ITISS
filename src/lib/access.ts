/**
 * Per-student portal access, decided by an administrator.
 * Stored on the Clerk user as `publicMetadata.access = { level, maxDevices }`.
 */

export type AccessLevel = 'full' | 'study' | 'fcn' | 'none';

export interface AccessConfig {
  level: AccessLevel;
  maxDevices: number;
}

export const ACCESS_LEVELS: AccessLevel[] = ['full', 'study', 'fcn', 'none'];

export const DEFAULT_ACCESS: AccessConfig = { level: 'full', maxDevices: 2 };

export const ACCESS_LABELS: Record<AccessLevel, string> = {
  full: 'Full access',
  study: 'Study only (no mock exams)',
  fcn: 'FCN module only',
  none: 'Blocked',
};

export const ACCESS_DESCRIPTIONS: Record<AccessLevel, string> = {
  full: 'Every module, practice, mock exams and analytics.',
  study: 'Modules, practice, bookmarks and performance — mock exams locked.',
  fcn: 'Only Fundamentals of Computer Networks opens; other modules locked.',
  none: 'Signs in but the portal stays locked (suspended account).',
};

const isAccessLevel = (value: unknown): value is AccessLevel =>
  typeof value === 'string' && (ACCESS_LEVELS as string[]).includes(value);

export const resolveAccess = (metadata: unknown): AccessConfig => {
  const access = (metadata as { access?: Partial<AccessConfig> } | null | undefined)?.access;
  const level = isAccessLevel(access?.level) ? access.level : DEFAULT_ACCESS.level;
  const rawDevices = Number(access?.maxDevices);
  const maxDevices = Number.isFinite(rawDevices) && rawDevices > 0
    ? Math.min(Math.max(Math.round(rawDevices), 1), 5)
    : DEFAULT_ACCESS.maxDevices;
  return { level, maxDevices };
};

const STUDY_TABS = [
  'dashboard',
  'modules',
  'notes',
  'practice',
  'incorrect',
  'bookmarks',
  'performance',
  'settings',
  'auth',
];

const FULL_TABS = [...STUDY_TABS, 'mock'];

export const allowedTabs = (level: AccessLevel): string[] => {
  if (level === 'none') return [];
  if (level === 'study' || level === 'fcn') return STUDY_TABS;
  return FULL_TABS;
};

export const canOpenModule = (level: AccessLevel, moduleId: string): boolean => {
  if (level === 'full' || level === 'study') return true;
  if (level === 'fcn') return moduleId === 'fcn';
  return false;
};

export const canUseMockExams = (level: AccessLevel): boolean => level === 'full';
