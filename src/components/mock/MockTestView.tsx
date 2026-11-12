import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { getQuestionsForModule } from '../../data/moduleRegistry';
import { MockExamSession } from './MockExamSession';
import { MockResultView } from './MockResultView';
import { MockExamAttempt } from '../../types/userProgress';
import { Question } from '../../types/question';
import { 
  Clock, 
  Play, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Eye, 
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const MockTestView: React.FC = () => {
  const { activeModuleId, mockAttempts, saveMockAttempt } = useProgress();
  const allQuestions = getQuestionsForModule(activeModuleId);

  const [activeSessionQuestions, setActiveSessionQuestions] = useState<Question[] | null>(null);
  const [selectedResultAttempt, setSelectedResultAttempt] = useState<MockExamAttempt | null>(null);

  // Generate 40 random questions for a new mock exam
  const handleStartExam = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected40 = shuffled.slice(0, Math.min(40, allQuestions.length));
    setSelectedResultAttempt(null);
    setActiveSessionQuestions(selected40);
  };

  const handleExamComplete = (attempt: MockExamAttempt) => {
    saveMockAttempt(attempt);
    setActiveSessionQuestions(null);
    setSelectedResultAttempt(attempt);
  };

  if (activeSessionQuestions) {
    return (
      <MockExamSession
        questions={activeSessionQuestions}
        moduleId={activeModuleId}
        durationMinutes={40}
        onComplete={handleExamComplete}
        onExit={() => setActiveSessionQuestions(null)}
      />
    );
  }

  if (selectedResultAttempt) {
    return (
      <MockResultView
        attempt={selectedResultAttempt}
        questions={allQuestions}
        onRetake={handleStartExam}
        onExit={() => setSelectedResultAttempt(null)}
      />
    );
  }

  // Filter mock attempts for this module
  const moduleMocks = mockAttempts.filter(m => m.moduleId === activeModuleId);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#1F2933] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
            OFFICIAL SIMULATION
          </span>
          <span className="text-xs text-[#8C98A6] font-mono">40 Questions • 40 Minutes</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1.5">
          FCN Mock Examinations
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
          Simulate official CDAC examination conditions. Questions are dynamically drawn from all 13 syllabus topics with real-time countdown timer and question matrix.
        </p>
      </div>

      {/* Hero Exam Launcher Card */}
      <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#76B900]/35 shadow-[0_0_20px_rgba(118,185,0,0.06)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#76B900]">
              <span className="w-2 h-2 rounded-full bg-[#76B900] animate-pulse" />
              <span>TEST PATTERN: CDAC ITISS DIPLOMA</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Full 40-Question Mock Assessment
            </h2>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Every mock test dynamically samples exactly 40 MCQs from our 309-question repository. During the test, answers remain hidden to ensure realistic evaluation.
            </p>
          </div>

          <button
            onClick={handleStartExam}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#76B900] hover:bg-[#87D300] text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(118,185,0,0.35)] hover:scale-[1.02] shrink-0"
          >
            <Play className="w-5 h-5 fill-black" />
            Start Mock Examination
          </button>
        </div>

        {/* Examination Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#1E2833] text-xs">
          <div className="p-3 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[#8C98A6] block text-[11px]">Question Count</span>
            <span className="font-mono font-bold text-white text-base">40 MCQs</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[#8C98A6] block text-[11px]">Time Allowed</span>
            <span className="font-mono font-bold text-white text-base">40 Minutes</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[#8C98A6] block text-[11px]">Passing Criteria</span>
            <span className="font-mono font-bold text-[#76B900] text-base">≥ 24 / 40 (60%)</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[#8C98A6] block text-[11px]">Marking Scheme</span>
            <span className="font-mono font-bold text-white text-base">+1 Correct, 0 Neg</span>
          </div>
        </div>
      </div>

      {/* Historical Attempts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#76B900]" />
            <h2 className="text-base font-bold text-white">
              Mock Test History
            </h2>
          </div>
          <span className="text-xs text-[#8C98A6] font-mono">
            {moduleMocks.length} Attempt{moduleMocks.length === 1 ? '' : 's'} Logged
          </span>
        </div>

        {moduleMocks.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#12181E] border border-[#1E2732] text-center space-y-2">
            <Clock className="w-8 h-8 text-[#5E6B7A] mx-auto" />
            <p className="text-xs text-[#8C98A6]">No mock test attempts recorded yet.</p>
            <p className="text-[11px] text-[#637180]">Click "Start Mock Examination" above to take your first test.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moduleMocks.map((att) => {
              const passed = att.score >= 24;

              return (
                <div
                  key={att.id}
                  className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2E3C4B] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg shrink-0 ${
                      passed
                        ? 'bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {att.score}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-white">
                          Score: {att.score} / {att.totalQuestions} ({att.percentage}%)
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                          passed ? 'bg-[#76B900]/20 text-[#76B900]' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {passed ? 'PASSED' : 'NEEDS WORK'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#8C98A6] font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#5A6877]" />
                          {att.dateFormatted}
                        </span>
                        <span>•</span>
                        <span>Time: {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s</span>
                        <span>•</span>
                        <span>Accuracy: {att.accuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedResultAttempt(att)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#19242E] hover:bg-[#202E3C] border border-[#2B3947] hover:border-[#76B900] text-xs font-medium text-white transition-all self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#76B900]" />
                    Review Answers
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

