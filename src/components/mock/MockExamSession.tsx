import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../../types/question';
import { MockExamAttempt, MockQuestionResult } from '../../types/userProgress';
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText,
  Send
} from 'lucide-react';

interface MockExamSessionProps {
  questions: Question[]; // Exactly 40 questions
  moduleId: string;
  durationMinutes?: number; // Default 40
  onComplete: (attempt: MockExamAttempt) => void;
  onExit: () => void;
}

export const MockExamSession: React.FC<MockExamSessionProps> = ({
  questions,
  moduleId,
  durationMinutes = 40,
  onComplete,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [startTime] = useState<number>(Date.now());

  const timerRef = useRef<number | null>(null);

  // Timer countdown
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (key: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentQ.id];
      return updated;
    });
  };

  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionResults: MockQuestionResult[] = questions.map(q => {
      const selected = userAnswers[q.id] || null;
      const isAns = selected !== null;
      const isCorr = isAns && selected.toUpperCase() === q.correctAnswer.toUpperCase();

      if (!isAns) {
        unansweredCount++;
      } else if (isCorr) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorr,
        markedForReview: !!markedForReview[q.id]
      };
    });

    const score = correctCount;
    const percentage = Math.round((score / questions.length) * 100);
    const answeredCount = correctCount + incorrectCount;
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const attempt: MockExamAttempt = {
      id: `mock-${Date.now()}`,
      moduleId,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      totalQuestions: questions.length,
      score,
      percentage,
      accuracy,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeSpentSeconds,
      questionResults
    };

    onComplete(attempt);
  };

  // Timer format
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = remainingSeconds <= 300; // < 5 mins

  // Summary counts
  const answeredTotal = Object.keys(userAnswers).length;
  const unansweredTotal = questions.length - answeredTotal;
  const reviewTotal = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Test Banner */}
      <div className="sticky top-16 z-20 p-4 rounded-xl bg-[#11171E] border border-[#222E3A] flex flex-wrap items-center justify-between gap-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30">
            OFFICIAL MOCK EXAM
          </span>
          <div>
            <h2 className="text-sm font-bold text-white">
              CDAC ITISS – FCN Examination
            </h2>
            <span className="text-xs text-[#8C98A6] font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-bold ${
            isTimeCritical
              ? 'bg-red-500/15 border-red-500 text-red-400 animate-pulse'
              : 'bg-[#16202A] border-[#293847] text-[#76B900]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{timeFormatted}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)]"
          >
            <Send className="w-3.5 h-3.5 fill-black" />
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Examination Grid: Question on left, Navigator on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Question Card (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-6">
            {/* Meta row */}
            <div className="flex items-center justify-between text-xs font-mono border-b border-[#1E2833] pb-3">
              <span className="text-[#8C98A6]">
                Topic: <strong className="text-white font-sans">{currentQ.topic}</strong>
              </span>
              <span className="text-[#788594]">
                Question #{currentIndex + 1}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h3 className="text-base md:text-lg font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {currentQ.diagram && (
                <div className="p-4 rounded-lg bg-[#0C1014] border border-[#222E3A] font-mono text-xs text-[#76B900] overflow-x-auto whitespace-pre">
                  {currentQ.diagram}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = userAnswers[currentQ.id] === opt.key;

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-[#182531] border-[#76B900] text-white shadow-[0_0_10px_rgba(118,185,0,0.15)] ring-1 ring-[#76B900]/50'
                        : 'bg-[#11171E] border-[#222E3A] hover:bg-[#161F27] hover:border-[#2C3B4A] text-[#C4CDD6]'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                      isSelected
                        ? 'bg-[#76B900] text-black'
                        : 'bg-[#18222A] text-[#8C98A6] border border-[#253240]'
                    }`}>
                      {opt.key}
                    </span>

                    <div className="flex-1 text-xs md:text-sm pt-0.5 leading-relaxed">
                      {opt.text}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Question action toolbar */}
            <div className="pt-3 border-t border-[#1E2833] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    markedForReview[currentQ.id]
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-[#182129] border-[#253240] text-[#8C98A6] hover:text-white'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${markedForReview[currentQ.id] ? 'fill-amber-400' : ''}`} />
                  <span>{markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {userAnswers[currentQ.id] && (
                  <button
                    onClick={handleClearResponse}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182129] border border-[#253240] text-[#8C98A6] hover:text-red-400 hover:border-red-500/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Selection</span>
                  </button>
                )}
              </div>

              <div className="text-[11px] text-[#718090] font-mono">
                {userAnswers[currentQ.id] ? 'Status: Answered' : 'Status: Unanswered'}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                currentIndex > 0
                  ? 'bg-[#141C24] text-white border-[#243240] hover:border-[#76B900]'
                  : 'bg-[#11171E] text-[#556372] border-[#1B242D] cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="text-xs text-[#8C98A6] font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                currentIndex < questions.length - 1
                  ? 'bg-[#18232D] text-white border-[#2B3B4B] hover:border-[#76B900]'
                  : 'bg-[#11171E] text-[#556372] border-[#1B242D] cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: 40-Question Navigation Matrix (1 col) */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Examination Navigator
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-b border-[#1E2833] pb-3">
              <div className="flex items-center gap-1.5 text-[#8C98A6]">
                <span className="w-2.5 h-2.5 rounded bg-[#76B900]" />
                <span>Answered ({answeredTotal})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8C98A6]">
                <span className="w-2.5 h-2.5 rounded bg-[#18222A] border border-[#2E3C4B]" />
                <span>Unanswered ({unansweredTotal})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8C98A6]">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>Review ({reviewTotal})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8C98A6]">
                <span className="w-2.5 h-2.5 rounded border border-white" />
                <span>Current</span>
              </div>
            </div>

            {/* 40 Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAns = !!userAnswers[q.id];
                const isRev = !!markedForReview[q.id];

                let btnStyle = 'bg-[#11171E] text-[#8C98A6] border border-[#1E2833] hover:border-[#2C3B4A]';

                if (isAns && isRev) {
                  btnStyle = 'bg-amber-500/20 text-amber-300 border border-amber-500/50';
                } else if (isRev) {
                  btnStyle = 'bg-amber-500/25 text-amber-300 border border-amber-500/50';
                } else if (isAns) {
                  btnStyle = 'bg-[#76B900]/20 text-[#76B900] border border-[#76B900]/40 font-bold';
                }

                if (isCurrent) {
                  btnStyle += ' ring-2 ring-white font-extrabold text-white';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-mono transition-all flex items-center justify-center relative ${btnStyle}`}
                  >
                    {idx + 1}
                    {isRev && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1E2833]">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)]"
              >
                Submit Examination
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-xl bg-[#141C24] border border-[#2E3C4B] shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#76B900]/10 border border-[#76B900]/30 text-[#76B900]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Examination Submission
                </h3>
                <p className="text-xs text-[#8C98A6]">
                  Are you ready to submit your exam and view your score?
                </p>
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38] space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#8C98A6]">Total Questions:</span>
                <span className="text-white font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8C98A6]">Questions Answered:</span>
                <span className="text-[#76B900] font-bold">{answeredTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8C98A6]">Unanswered:</span>
                <span className={unansweredTotal > 0 ? 'text-amber-400 font-bold' : 'text-white'}>
                  {unansweredTotal}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8C98A6]">Marked for Review:</span>
                <span className="text-amber-400 font-bold">{reviewTotal}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg bg-[#182129] border border-[#253240] hover:bg-[#202B36] text-xs font-medium text-white transition-colors"
              >
                Back to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.3)]"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

