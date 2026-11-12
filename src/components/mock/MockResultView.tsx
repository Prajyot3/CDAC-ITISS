import React, { useState } from 'react';
import { MockExamAttempt } from '../../types/userProgress';
import { Question } from '../../types/question';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  ArrowLeft, 
  FileText,
  Filter,
  Check,
  X
} from 'lucide-react';

interface MockResultViewProps {
  attempt: MockExamAttempt;
  questions: Question[];
  onRetake: () => void;
  onExit: () => void;
}

export const MockResultView: React.FC<MockResultViewProps> = ({
  attempt,
  questions,
  onRetake,
  onExit
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct' | 'unanswered'>('all');

  const questionMap = new Map(questions.map(q => [q.id, q]));

  const isPassed = attempt.score >= 24; // 60% standard passing score (24 / 40)

  const minutesSpent = Math.floor(attempt.timeSpentSeconds / 60);
  const secondsSpent = attempt.timeSpentSeconds % 60;
  const timeFormatted = `${minutesSpent}m ${secondsSpent}s`;

  // Filter question results
  const filteredResults = attempt.questionResults.filter(res => {
    if (filter === 'incorrect') return res.selectedAnswer !== null && !res.isCorrect;
    if (filter === 'correct') return res.isCorrect;
    if (filter === 'unanswered') return res.selectedAnswer === null;
    return true;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#8C98A6] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Mock Tests
        </button>

        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)]"
        >
          <RotateCcw className="w-4 h-4" />
          Take Another Mock Exam
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C98A6]">
              Examination Performance Result
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              CDAC ITISS – FCN Mock Test
            </h1>
            <p className="text-xs text-[#8C98A6] font-mono">
              Completed on {attempt.dateFormatted} • Module: FCN
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-[#0E141A] border border-[#243342] text-right">
              <span className="text-xs font-mono text-[#8C98A6] block">Final Score</span>
              <div className="text-3xl font-extrabold font-mono text-white">
                <span className={isPassed ? 'text-[#76B900]' : 'text-red-400'}>{attempt.score}</span>
                <span className="text-[#687685] text-lg font-normal"> / {attempt.totalQuestions}</span>
              </div>
              <span className={`inline-block mt-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                isPassed 
                  ? 'bg-[#76B900]/20 text-[#76B900] border border-[#76B900]/40' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                {isPassed ? 'PASSED (≥ 60%)' : 'NEEDS REVISION (< 60%)'}
              </span>
            </div>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[11px] text-[#8C98A6] block mb-1">Correct</span>
            <div className="text-xl font-bold font-mono text-[#76B900] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
              {attempt.correctCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[11px] text-[#8C98A6] block mb-1">Incorrect</span>
            <div className="text-xl font-bold font-mono text-red-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              {attempt.incorrectCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[11px] text-[#8C98A6] block mb-1">Unanswered</span>
            <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              {attempt.unansweredCount}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[11px] text-[#8C98A6] block mb-1">Accuracy</span>
            <div className="text-xl font-bold font-mono text-white">
              {attempt.accuracy}%
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0F151B] border border-[#202C38]">
            <span className="text-[11px] text-[#8C98A6] block mb-1">Time Taken</span>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#76B900]" />
              {timeFormatted}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2833] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#76B900]" />
              Detailed Answer Review
            </h2>
            <p className="text-xs text-[#8C98A6] mt-0.5">
              Review each question with your selected option, the official answer, and technical explanation.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#11171E] border border-[#222E3A] text-xs font-mono">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'all' ? 'bg-[#76B900] text-black font-bold' : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              All ({attempt.totalQuestions})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'incorrect' ? 'bg-red-500 text-white font-bold' : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              Incorrect ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'correct' ? 'bg-[#76B900]/20 text-[#76B900] font-bold' : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              Correct ({attempt.correctCount})
            </button>
            <button
              onClick={() => setFilter('unanswered')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'unanswered' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              Unanswered ({attempt.unansweredCount})
            </button>
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-4">
          {filteredResults.map((res, idx) => {
            const q = questionMap.get(res.questionId);
            if (!q) return null;

            return (
              <div
                key={res.questionId}
                className={`p-5 rounded-xl border space-y-4 ${
                  res.isCorrect
                    ? 'bg-[#131A21] border-[#202E3B]'
                    : res.selectedAnswer === null
                    ? 'bg-[#15191E] border-amber-500/25'
                    : 'bg-[#181517] border-red-500/25'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">
                      Q.{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#10151C] text-[#8C98A6] border border-[#222E3A]">
                      {q.topic}
                    </span>
                  </div>

                  <div>
                    {res.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[#76B900] font-semibold">
                        <Check className="w-3.5 h-3.5" /> Correct (+1)
                      </span>
                    ) : res.selectedAnswer === null ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Unanswered (0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                        <X className="w-3.5 h-3.5" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="text-sm font-medium text-white leading-relaxed">
                  {q.question}
                </div>

                {q.diagram && (
                  <div className="p-3 rounded-lg bg-[#0C1014] border border-[#202B37] font-mono text-xs text-[#76B900] overflow-x-auto whitespace-pre">
                    {q.diagram}
                  </div>
                )}

                {/* Options display */}
                <div className="space-y-2 pt-1">
                  {q.options.map(opt => {
                    const isSelected = res.selectedAnswer === opt.key;
                    const isCorrect = opt.key.toUpperCase() === q.correctAnswer.toUpperCase();

                    let optBg = 'bg-[#10161C] border-[#1E2833] text-[#A0ABB7]';

                    if (isCorrect) {
                      optBg = 'bg-[#76B900]/15 border-[#76B900] text-white font-medium';
                    } else if (isSelected && !isCorrect) {
                      optBg = 'bg-red-500/15 border-red-500/50 text-red-200';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${optBg}`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                          isCorrect ? 'bg-[#76B900] text-black' : isSelected ? 'bg-red-500 text-white' : 'bg-[#182129] text-[#8C98A6]'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="flex-1">
                          {opt.text}
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] font-mono uppercase text-[#76B900] font-bold">
                            Correct Answer
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="text-[10px] font-mono uppercase text-red-400 font-bold">
                            Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Technical Explanation */}
                <div className="p-4 rounded-lg bg-[#0D1217] border border-[#1E2833] text-xs text-[#CBD3DC] space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
                    Explanation:
                  </div>
                  <p className="leading-relaxed pl-3 border-l border-[#243342]">
                    {q.explanation}
                  </p>
                  <div className="text-[10px] text-[#6E7B8B] font-mono pt-1">
                    Source: {q.sourcePdf} • {q.sourceQuestionNumber} • Page {q.pageNumber}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

