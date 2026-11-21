export interface QuestionAttempt {
  questionId: string;
  moduleId: string;
  selectedAnswer: string;
  answeredQuestionId?: string;
  isCorrect: boolean;
  timestamp: number;
  attemptsCount: number;
}

export interface MockQuestionResult {
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  markedForReview: boolean;
}

export interface MockExamAttempt {
  id: string;
  moduleId: string;
  timestamp: number;
  dateFormatted: string;
  totalQuestions: number; // 40
  score: number; // out of 40
  percentage: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  questionResults: MockQuestionResult[];
}

export interface UserStats {
  totalAvailable: number;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  progressPercent: number;
  bookmarkedCount: number;
  mockTestsCount: number;
  averageMockScore: number;
}

