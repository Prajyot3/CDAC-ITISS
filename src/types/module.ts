export type ModuleStatus = 'AVAILABLE' | 'UPDATED SOON';

export interface CourseSection {
  id: string;
  number: string; // 'SECTION A', 'SECTION B', etc.
  title: string;
  description: string;
}

export interface ITISSModule {
  id: string; // 'fcn', 'os', 'programming', etc.
  number: number; // 1 to 12
  code: string; // 'FCN', 'OS-ADMIN', 'APC', etc.
  name: string;
  sectionId: string;
  sectionName: string;
  duration: string; // '120 Hours', '210 Hours', etc.
  status: ModuleStatus;
  slug: string; // 'fcn', 'os', 'programming', etc.
  route: string; // '/modules/fcn', etc.
  description: string;
  topics?: string[];
  syllabusPoints?: string[];
}

