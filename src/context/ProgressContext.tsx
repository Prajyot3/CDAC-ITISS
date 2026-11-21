import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { QuestionAttempt, MockExamAttempt, UserStats } from '../types/userProgress';
import { Question } from '../types/question';
import { getQuestionsForModule, getActiveModules, getCanonicalQuestionId } from '../data/moduleRegistry';

interface ProgressContextType {
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  attempts: Record<string, QuestionAttempt>;
  bookmarks: string[];
  revisions: string[];
  mockAttempts: MockExamAttempt[];
  recordAttempt: (questionId: string, moduleId: string, selectedAnswer: string, isCorrect: boolean) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  toggleRevision: (questionId: string) => void;
  isRevision: (questionId: string) => boolean;
  saveMockAttempt: (attempt: MockExamAttempt) => void;
  clearIncorrectAttempt: (questionId: string) => void;
  resetModuleProgress: (moduleId: string) => void;
  resetMockHistory: (moduleId: string) => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  getModuleStats: (moduleId: string) => UserStats;
  getOverallStats: () => UserStats;
  getIncorrectQuestions: (moduleId: string) => Question[];
  getCorrectQuestions: (moduleId: string) => Question[];
  getBookmarkedQuestions: (moduleId: string) => Question[];
  getAllIncorrectQuestions: () => Question[];
  getAllCorrectQuestions: () => Question[];
  getAllBookmarkedQuestions: () => Question[];
  getTopicStats: (moduleId: string) => Record<string, { total: number; attempted: number; correct: number; accuracy: number }>;
}

const STORAGE_KEYS = {
  ATTEMPTS: 'itiss_attempts_v1',
  BOOKMARKS: 'itiss_bookmarks_v1',
  REVISIONS: 'itiss_revisions_v1',
  MOCK_ATTEMPTS: 'itiss_mocks_v1',
  ACTIVE_MODULE: 'itiss_active_module_v1'
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const mergeDuplicateAttempts = (saved: Record<string, QuestionAttempt>): Record<string, QuestionAttempt> => {
  const merged: Record<string, QuestionAttempt> = {};
  for (const attempt of Object.values(saved)) {
    const canonicalId = getCanonicalQuestionId(attempt.questionId);
    const canonicalAttempt = canonicalId === attempt.questionId ? attempt : {
      ...attempt,
      questionId: canonicalId,
      answeredQuestionId: attempt.answeredQuestionId ?? attempt.questionId
    };
    const previous = merged[canonicalId];
    if (!previous) {
      merged[canonicalId] = canonicalAttempt;
      continue;
    }
    const latest = previous.timestamp > canonicalAttempt.timestamp ? previous : canonicalAttempt;
    merged[canonicalId] = {
      ...latest,
      attemptsCount: previous.attemptsCount + canonicalAttempt.attemptsCount
    };
  }
  return merged;
};

const mergeDuplicateQuestionIds = (ids: string[]): string[] =>
  [...new Set(ids.map(getCanonicalQuestionId))];

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModuleId, setActiveModuleIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_MODULE) || 'fcn';
  });

  const [attempts, setAttempts] = useState<Record<string, QuestionAttempt>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? mergeDuplicateAttempts(JSON.parse(saved)) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? mergeDuplicateQuestionIds(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });

  const [revisions, setRevisions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVISIONS);
      return saved ? mergeDuplicateQuestionIds(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });

  const [mockAttempts, setMockAttempts] = useState<MockExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOCK_ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVISIONS, JSON.stringify(revisions));
  }, [revisions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOCK_ATTEMPTS, JSON.stringify(mockAttempts));
  }, [mockAttempts]);

  const setActiveModuleId = (id: string) => {
    setActiveModuleIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_MODULE, id);
  };

  const recordAttempt = (questionId: string, moduleId: string, selectedAnswer: string, isCorrect: boolean) => {
    setAttempts(prev => {
      const existing = prev[questionId];
      return {
        ...prev,
        [questionId]: {
          questionId,
          moduleId,
          selectedAnswer,
          isCorrect,
          timestamp: Date.now(),
          attemptsCount: (existing?.attemptsCount || 0) + 1
        }
      };
    });
  };

  const toggleBookmark = (questionId: string) => {
    const canonicalId = getCanonicalQuestionId(questionId);
    setBookmarks(prev => 
      prev.includes(canonicalId)
        ? prev.filter(id => id !== canonicalId)
        : [...prev, canonicalId]
    );
  };

  const isBookmarked = (questionId: string) => bookmarks.includes(getCanonicalQuestionId(questionId));

  const toggleRevision = (questionId: string) => {
    setRevisions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const isRevision = (questionId: string) => revisions.includes(questionId);

  const saveMockAttempt = (attempt: MockExamAttempt) => {
    setMockAttempts(prev => [attempt, ...prev]);
  };

  const clearIncorrectAttempt = (questionId: string) => {
    setAttempts(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const resetModuleProgress = (moduleId: string) => {
    setAttempts(prev => {
      const updated: Record<string, QuestionAttempt> = {};
      Object.entries(prev).forEach(([qId, att]) => {
        if (att.moduleId !== moduleId) {
          updated[qId] = att;
        }
      });
      return updated;
    });
  };

  const resetMockHistory = (moduleId: string) => {
    setMockAttempts(prev => prev.filter(m => m.moduleId !== moduleId));
  };

  const resetAllData = () => {
    setAttempts({});
    setBookmarks([]);
    setRevisions([]);
    setMockAttempts([]);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.REVISIONS);
    localStorage.removeItem(STORAGE_KEYS.MOCK_ATTEMPTS);
  };

  const exportData = () => {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      attempts,
      bookmarks,
      revisions,
      mockAttempts
    }, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      const importedAttempts = data.attempts && mergeDuplicateAttempts(data.attempts);
      const importedBookmarks = data.bookmarks && mergeDuplicateQuestionIds(data.bookmarks);
      const importedRevisions = data.revisions && mergeDuplicateQuestionIds(data.revisions);
      if (importedAttempts) setAttempts(importedAttempts);
      if (importedBookmarks) setBookmarks(importedBookmarks);
      if (importedRevisions) setRevisions(importedRevisions);
      if (data.mockAttempts) setMockAttempts(data.mockAttempts);
      return true;
    } catch {
      return false;
    }
  };

  const getModuleStats = (moduleId: string): UserStats => {
    const questions = getQuestionsForModule(moduleId);
    const totalAvailable = questions.length;
    if (totalAvailable === 0) {
      return {
        totalAvailable: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        progressPercent: 0,
        bookmarkedCount: 0,
        mockTestsCount: 0,
        averageMockScore: 0
      };
    }

    const questionIds = new Set(questions.map(q => q.id));
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;

    Object.values(attempts).forEach(att => {
      if (questionIds.has(att.questionId)) {
        attempted++;
        if (att.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const bookmarkedCount = bookmarks.filter(id => questionIds.has(id)).length;
    const modMocks = mockAttempts.filter(m => m.moduleId === moduleId);
    const mockTestsCount = modMocks.length;
    const averageMockScore = mockTestsCount > 0 
      ? Math.round(modMocks.reduce((sum, m) => sum + m.score, 0) / mockTestsCount)
      : 0;

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const progressPercent = Math.round((attempted / totalAvailable) * 100);

    return {
      totalAvailable,
      attempted,
      correct,
      incorrect,
      accuracy,
      progressPercent,
      bookmarkedCount,
      mockTestsCount,
      averageMockScore
    };
  };

  const getOverallStats = (): UserStats => {
    const activeMods = getActiveModules();
    let totalAvailable = 0;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;

    activeMods.forEach(m => {
      const stats = getModuleStats(m.id);
      totalAvailable += stats.totalAvailable;
      attempted += stats.attempted;
      correct += stats.correct;
      incorrect += stats.incorrect;
    });

    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const progressPercent = totalAvailable > 0 ? Math.round((attempted / totalAvailable) * 100) : 0;
    const mockTestsCount = mockAttempts.length;
    const averageMockScore = mockTestsCount > 0 
      ? Math.round(mockAttempts.reduce((sum, m) => sum + m.score, 0) / mockTestsCount)
      : 0;

    return {
      totalAvailable,
      attempted,
      correct,
      incorrect,
      accuracy,
      progressPercent,
      bookmarkedCount: bookmarks.length,
      mockTestsCount,
      averageMockScore
    };
  };

  const getIncorrectQuestions = (moduleId: string): Question[] => {
    const questions = getQuestionsForModule(moduleId);
    const incorrectIds = new Set(
      Object.values(attempts)
        .filter(att => att.moduleId === moduleId && !att.isCorrect)
        .map(att => att.questionId)
    );
    return questions.filter(q => incorrectIds.has(q.id));
  };

  const getCorrectQuestions = (moduleId: string): Question[] => {
    const questions = getQuestionsForModule(moduleId);
    const correctIds = new Set(
      Object.values(attempts)
        .filter(att => att.moduleId === moduleId && att.isCorrect)
        .map(att => att.questionId)
    );
    return questions.filter(q => correctIds.has(q.id));
  };

  const getBookmarkedQuestions = (moduleId: string): Question[] => {
    const questions = getQuestionsForModule(moduleId);
    const bookmarkSet = new Set(bookmarks);
    return questions.filter(q => bookmarkSet.has(q.id));
  };

  /** Incorrect questions across every active module (each keeps its own moduleId). */
  const getAllIncorrectQuestions = (): Question[] => {
    const incorrectIds = new Set(
      Object.values(attempts)
        .filter(att => !att.isCorrect)
        .map(att => att.questionId)
    );
    return getActiveModules().flatMap(module =>
      getQuestionsForModule(module.id).filter(q => incorrectIds.has(q.id))
    );
  };

  /** Correct questions across every active module (each keeps its own moduleId). */
  const getAllCorrectQuestions = (): Question[] => {
    const correctIds = new Set(
      Object.values(attempts)
        .filter(att => att.isCorrect)
        .map(att => att.questionId)
    );
    return getActiveModules().flatMap(module =>
      getQuestionsForModule(module.id).filter(q => correctIds.has(q.id))
    );
  };

  /** Bookmarked questions across every active module. */
  const getAllBookmarkedQuestions = (): Question[] => {
    const bookmarkSet = new Set(bookmarks);
    return getActiveModules().flatMap(module =>
      getQuestionsForModule(module.id).filter(q => bookmarkSet.has(q.id))
    );
  };

  const getTopicStats = (moduleId: string) => {
    const questions = getQuestionsForModule(moduleId);
    const result: Record<string, { total: number; attempted: number; correct: number; accuracy: number }> = {};

    questions.forEach(q => {
      if (!result[q.topic]) {
        result[q.topic] = { total: 0, attempted: 0, correct: 0, accuracy: 0 };
      }
      result[q.topic].total++;

      const att = attempts[q.id];
      if (att) {
        result[q.topic].attempted++;
        if (att.isCorrect) {
          result[q.topic].correct++;
        }
      }
    });

    Object.keys(result).forEach(t => {
      const item = result[t];
      item.accuracy = item.attempted > 0 ? Math.round((item.correct / item.attempted) * 100) : 0;
    });

    return result;
  };

  return (
    <ProgressContext.Provider value={{
      activeModuleId,
      setActiveModuleId,
      attempts,
      bookmarks,
      revisions,
      mockAttempts,
      recordAttempt,
      toggleBookmark,
      isBookmarked,
      toggleRevision,
      isRevision,
      saveMockAttempt,
      clearIncorrectAttempt,
      resetModuleProgress,
      resetMockHistory,
      resetAllData,
      exportData,
      importData,
      getModuleStats,
      getOverallStats,
      getIncorrectQuestions,
      getCorrectQuestions,
      getBookmarkedQuestions,
      getAllIncorrectQuestions,
      getAllCorrectQuestions,
      getAllBookmarkedQuestions,
      getTopicStats
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

