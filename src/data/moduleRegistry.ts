import { Question } from '../types/question';
import { ITISS_MODULES } from '../config/modules';
import fcnQuestionsRaw from './fcnQuestions.json';
import osQuestionsRaw from './osQuestions.json';
import programmingQuestionsRaw from './programmingQuestions.json';
import infraQuestionsRaw from './infraQuestions.json';

// Cast imported raw JSON to strongly-typed Question array
const fcnQuestions: Question[] = fcnQuestionsRaw as Question[];
const osQuestions: Question[] = osQuestionsRaw as Question[];
const programmingQuestions: Question[] = programmingQuestionsRaw as Question[];
const infraQuestions: Question[] = infraQuestionsRaw as Question[];

/**
 * MODULE QUESTION BANK REGISTRY
 *
 * To activate a new module in the future:
 * 1. Create a question bank JSON file (e.g. `src/data/osQuestions.json`)
 * 2. Add it to this registry dictionary below
 * 3. In `src/config/modules.ts`, change the module's status from 'UPDATED SOON' to 'AVAILABLE'
 *
 * The platform will IMMEDIATELY and AUTOMATICALLY provision:
 * - Practice MCQs (All, Random, Topic-wise)
 * - 40-question Mock Examinations with timer & navigation matrix
 * - Incorrect Questions tracker & retry session
 * - Bookmarked Questions bank
 * - Independent Performance dashboard & analytics
 */
const QUESTION_BANKS: Record<string, Question[]> = {
  fcn: fcnQuestions,
  os: osQuestions,
  programming: programmingQuestions,
  'it-infrastructure': infraQuestions,
  // Future question banks:
  // programming: programmingQuestions,
  // 'it-infrastructure': itInfrastructureQuestions,
  // 'cyber-forensics': cyberForensicsQuestions,
  // pki: pkiQuestions,
  // ndc: ndcQuestions,
  // 'compliance-audit': complianceAuditQuestions,
  // 'security-concepts': securityConceptsQuestions,
  // aptitude: aptitudeQuestions,
  // communication: communicationQuestions,
  // project: projectQuestions,
};

/**
 * Retrieve questions for any module
 */
export const getQuestionsForModule = (moduleId: string): Question[] => {
  const normalizedId = moduleId.toLowerCase();
  return QUESTION_BANKS[normalizedId] || [];
};

/**
 * Get question count for any module
 */
export const getQuestionCountForModule = (moduleId: string): number => {
  return getQuestionsForModule(moduleId).length;
};

/**
 * Get list of currently active modules that have question banks
 */
export const getActiveModules = () => {
  return ITISS_MODULES.filter(m => m.status === 'AVAILABLE');
};

/** Total number of questions across every active module. */
export const getTotalQuestionCount = (): number =>
  Object.values(QUESTION_BANKS).reduce((total, bank) => total + bank.length, 0);

/**
 * Check if a module is currently functional
 */
export const isModuleFunctional = (moduleId: string): boolean => {
  const mod = ITISS_MODULES.find(m => m.id.toLowerCase() === moduleId.toLowerCase());
  return mod?.status === 'AVAILABLE' && (QUESTION_BANKS[moduleId.toLowerCase()]?.length || 0) > 0;
};

