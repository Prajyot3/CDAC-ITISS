import React, { useState, useEffect } from 'react';
import { Question } from '../../types/question';
import { useProgress } from '../../context/ProgressContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Flag, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Info,
  Grid,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface PracticeSessionProps {
  questions: Question[];
  title: string;
  subtitle?: string;
  onExit: () => void;
}

export const PracticeSession: React.FC<PracticeSessionProps> = ({
  questions,
  title,
  subtitle,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);

  const { recordAttempt, toggleBookmark, isBookmarked, toggleRevision, isRevision, attempts } = useProgress();

  const currentQ = questions[currentIndex];

  // If question was previously attempted, prefill or reset on index change
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
  }, [currentIndex]);

  if (!currentQ || questions.length === 0) {
    return (
      <div className="p-8 text-center text-[#9CA3AF] space-y-4">
        <p>No questions found in this selection.</p>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg bg-[#1B242D] text-white text-xs"
        >
          Return to Practice Modes
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(currentQ.id);
  const revision = isRevision(currentQ.id);
  const pastAttempt = attempts[currentQ.id];

  const handleSelectOption = (key: string) => {
    if (isAnswerRevealed) return; // Prevent changing after revealing
    setSelectedOption(key);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerRevealed(true);
    const isCorrect = selectedOption.toUpperCase() === currentQ.correctAnswer.toUpperCase();
    recordAttempt(currentQ.id, currentQ.moduleId, selectedOption, isCorrect);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-[#12181E] border border-[#222E3A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-[#8C98A6] hover:text-white hover:bg-[#1C2732] transition-colors"
            title="Exit Session"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A2530] text-[#76B900] font-mono border border-[#2B3B4B]">
                Q {currentIndex + 1} of {questions.length}
              </span>
            </h2>
            {subtitle && <p className="text-xs text-[#8C98A6]">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentQ.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              bookmarked
                ? 'bg-[#76B900]/15 text-[#76B900] border-[#76B900]/40'
                : 'bg-[#182129] text-[#8C98A6] border-[#253240] hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#76B900]' : ''}`} />
            <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Revision Flag Button */}
          <button
            onClick={() => toggleRevision(currentQ.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              revision
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                : 'bg-[#182129] text-[#8C98A6] border-[#253240] hover:text-white'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${revision ? 'fill-amber-400' : ''}`} />
            <span>{revision ? 'Review Flag' : 'Flag'}</span>
          </button>

          {/* Question Grid / Jump Toggle */}
          <button
            onClick={() => setShowMatrix(prev => !prev)}
            className="p-1.5 rounded-lg bg-[#182129] text-[#8C98A6] hover:text-white border border-[#253240] transition-colors"
            title="Question Navigator Matrix"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Navigator Matrix Modal/Drawer */}
      {showMatrix && (
        <div className="p-4 rounded-xl bg-[#10161C] border border-[#2A3746] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Jump to Question:</span>
            <span className="text-[#8C98A6] font-mono">{questions.length} Questions</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const att = attempts[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowMatrix(false);
                  }}
                  className={`h-8 rounded text-xs font-mono font-medium transition-all ${
                    isCurrent
                      ? 'bg-[#76B900] text-black font-bold ring-2 ring-[#76B900]'
                      : att
                      ? att.isCorrect
                        ? 'bg-[#76B900]/20 text-[#76B900] border border-[#76B900]/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-[#18222A] text-[#8C98A6] hover:bg-[#22303D] hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-6">
        {/* Meta badges: Topic */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#76B900]/10 text-[#76B900] font-mono font-medium border border-[#76B900]/30">
              {currentQ.topic}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#18232C] text-[#8C98A6] font-mono border border-[#243340]">
              {currentQ.id}
            </span>
          </div>
        </div>

        {/* Question Statement */}
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Diagram / Table if present */}
          {currentQ.diagram && (
            <div className="p-4 rounded-lg bg-[#0C1014] border border-[#222E3A] font-mono text-xs text-[#76B900] overflow-x-auto whitespace-pre">
              {currentQ.diagram}
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            const isCorrectOption = opt.key.toUpperCase() === currentQ.correctAnswer.toUpperCase();

            let optionClass = 'bg-[#11171E] border-[#222E3A] hover:bg-[#161F27] hover:border-[#2C3B4A] text-[#C4CDD6]';

            if (isAnswerRevealed) {
              if (isCorrectOption) {
                optionClass = 'bg-[#76B900]/15 border-[#76B900] text-white shadow-[0_0_12px_rgba(118,185,0,0.15)]';
              } else if (isSelected && !isCorrectOption) {
                optionClass = 'bg-red-500/15 border-red-500 text-red-200';
              } else {
                optionClass = 'bg-[#0E1318] border-[#1D2732] opacity-60 text-[#8C98A6]';
              }
            } else if (isSelected) {
              optionClass = 'bg-[#182531] border-[#76B900] text-white ring-1 ring-[#76B900]/50';
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                disabled={isAnswerRevealed}
                className={`w-full text-left p-4 rounded-xl border flex items-start gap-3.5 transition-all ${optionClass}`}
              >
                <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                  isAnswerRevealed && isCorrectOption
                    ? 'bg-[#76B900] text-black'
                    : isAnswerRevealed && isSelected && !isCorrectOption
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-[#76B900] text-black'
                    : 'bg-[#18222A] text-[#8C98A6] border border-[#253240]'
                }`}>
                  {opt.key}
                </span>

                <div className="flex-1 text-xs md:text-sm pt-0.5 leading-relaxed">
                  {opt.text}
                </div>

                {isAnswerRevealed && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-[#76B900] shrink-0 mt-0.5" />
                )}
                {isAnswerRevealed && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit Button before Reveal */}
        {!isAnswerRevealed && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className={`px-6 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                selectedOption
                  ? 'bg-[#76B900] hover:bg-[#87D300] text-black shadow-[0_0_12px_rgba(118,185,0,0.3)]'
                  : 'bg-[#18222A] text-[#616E7D] cursor-not-allowed border border-[#222E3A]'
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Answer Explanation Box (Revealed after Submit) */}
        {isAnswerRevealed && (
          <div className="p-5 rounded-xl bg-[#10171F] border border-[#233140] space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8C98A6] flex items-center gap-1.5 font-sans font-semibold">
                <Info className="w-4 h-4 text-[#76B900]" />
                Technical Explanation & Verification
              </span>
              <span className="text-[#76B900] font-bold">
                Correct Option: ({currentQ.correctAnswer})
              </span>
            </div>

            <p className="text-xs md:text-sm text-[#D1D7DF] leading-relaxed">
              {currentQ.explanation}
            </p>

            <div className="pt-2 border-t border-[#1C2733] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#788696] font-mono">
              <span>Topic: {currentQ.topic}</span>
              <span>Question ID: {currentQ.id}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
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
          Previous Question
        </button>

        <span className="text-xs text-[#8C98A6] font-mono">
          Question {currentIndex + 1} of {questions.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
            currentIndex < questions.length - 1
              ? 'bg-[#76B900] text-black border-[#76B900] hover:bg-[#87D300] shadow-[0_0_12px_rgba(118,185,0,0.25)]'
              : 'bg-[#11171E] text-[#556372] border-[#1B242D] cursor-not-allowed'
          }`}
        >
          Next Question
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

