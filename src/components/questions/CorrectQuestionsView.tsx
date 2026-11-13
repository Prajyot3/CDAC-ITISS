import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { PracticeSession } from '../practice/PracticeSession';
import { ModuleSelector } from '../common/ModuleSelector';
import { getModuleById } from '../../config/modules';
import { 
  CheckCircle2, 
  Play, 
  FileText,
  Bookmark,
  Sparkles,
  Award
} from 'lucide-react';

export const CorrectQuestionsView: React.FC = () => {
  const { getAllCorrectQuestions, toggleBookmark, isBookmarked } = useProgress();
  const [moduleFilter, setModuleFilter] = useState('all');
  const allCorrect = getAllCorrectQuestions();
  const correctQuestions =
    moduleFilter === 'all'
      ? allCorrect
      : allCorrect.filter(question => question.moduleId === moduleFilter);

  const [isPracticing, setIsPracticing] = useState(false);

  if (isPracticing && correctQuestions.length > 0) {
    return (
      <PracticeSession
        questions={correctQuestions}
        title="Correct Questions Practice"
        subtitle={`Reviewing ${correctQuestions.length} questions you answered correctly`}
        onExit={() => setIsPracticing(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2933] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
              MASTERED BANK
            </span>
            <span className="text-xs text-[#8C98A6] font-mono">
              {correctQuestions.length} of {allCorrect.length} Correct Question{allCorrect.length === 1 ? '' : 's'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>Correct Questions</span>
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Questions you solved accurately across practice and mock exam sessions — review key explanations and reinforce concepts.
          </p>
          <div className="mt-3">
            <ModuleSelector value={moduleFilter} onChange={setModuleFilter} includeAll label="Filter module" />
          </div>
        </div>

        {correctQuestions.length > 0 && (
          <button
            onClick={() => setIsPracticing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)] self-start sm:self-auto hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-black" />
            Practice Solved ({correctQuestions.length})
          </button>
        )}
      </div>

      {correctQuestions.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#12181E] border border-[#1E2732] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#18232C] text-[#8C98A6] border border-[#243342] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-[#76B900]" />
          </div>
          <h2 className="text-sm font-bold text-white">
            No Correct Answers Recorded Yet
          </h2>
          <p className="text-xs text-[#8C98A6] max-w-sm mx-auto leading-relaxed">
            As you practice MCQs and complete timed mock examinations, all questions you solve correctly will be archived here for easy revision.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {correctQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#76B900] font-bold">#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30 font-semibold">
                    MODULE {getModuleById(q.moduleId)?.number ?? q.moduleId.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10151C] text-[#8C98A6] border border-[#222E3A]">
                    {q.topic}
                  </span>
                  <span className="text-[#6D7A88] text-[11px]">{q.id}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className={`flex items-center gap-1 text-[11px] transition-colors ${
                      isBookmarked(q.id) ? 'text-[#76B900]' : 'text-[#7C8998] hover:text-[#76B900]'
                    }`}
                    title={isBookmarked(q.id) ? 'Remove bookmark' : 'Bookmark this question'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(q.id) ? 'fill-[#76B900]' : ''}`} />
                    <span>{isBookmarked(q.id) ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  <div className="inline-flex items-center gap-1 text-[11px] font-mono text-[#76B900] bg-[#76B900]/10 border border-[#76B900]/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#76B900]" />
                    <span>Solved</span>
                  </div>
                </div>
              </div>

              <div className="text-sm font-medium text-white leading-relaxed">
                {q.question}
              </div>

              {q.diagram && (
                <div className="p-3 rounded-lg bg-[#0C1014] border border-[#202B37] font-mono text-xs text-[#76B900] overflow-x-auto whitespace-pre">
                  {q.diagram}
                </div>
              )}

              {/* Options */}
              <div className="space-y-1.5 pt-1">
                {q.options.map(opt => {
                  const isCorrect = opt.key.toUpperCase() === q.correctAnswer.toUpperCase();
                  return (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        isCorrect
                          ? 'bg-[#76B900]/10 border-[#76B900]/40 text-white font-medium shadow-sm'
                          : 'bg-[#10151B] border-[#1D2732] text-[#8C98A6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[11px] ${
                            isCorrect
                              ? 'bg-[#76B900] text-black'
                              : 'bg-[#18232C] text-[#8C98A6]'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isCorrect && (
                        <span className="text-[11px] text-[#76B900] font-mono font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct Option
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Technical Explanation */}
              {q.explanation && (
                <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2833] text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#76B900] font-mono font-semibold text-[11px] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Technical Explanation</span>
                  </div>
                  <p className="text-[#A2AFBD] leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

