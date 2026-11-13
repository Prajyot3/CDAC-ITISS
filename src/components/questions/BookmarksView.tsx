import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { PracticeSession } from '../practice/PracticeSession';
import { ModuleSelector } from '../common/ModuleSelector';
import { getModuleById } from '../../config/modules';
import { 
  Bookmark, 
  Play, 
  Trash2, 
  BookOpen, 
  FileText, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { getAllBookmarkedQuestions, toggleBookmark } = useProgress();
  const [moduleFilter, setModuleFilter] = useState('all');
  const allBookmarks = getAllBookmarkedQuestions();
  const bookmarkedQuestions =
    moduleFilter === 'all'
      ? allBookmarks
      : allBookmarks.filter(question => question.moduleId === moduleFilter);

  const [isPracticing, setIsPracticing] = useState(false);

  if (isPracticing && bookmarkedQuestions.length > 0) {
    return (
      <PracticeSession
        questions={bookmarkedQuestions}
        title="Bookmarked Questions Practice"
        subtitle={`Reviewing ${bookmarkedQuestions.length} saved questions`}
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
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
              SAVED QUESTIONS
            </span>
            <span className="text-xs text-[#8C98A6] font-mono">
              {bookmarkedQuestions.length} of {allBookmarks.length} Bookmarked Item{allBookmarks.length === 1 ? '' : 's'}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5">
            Bookmarked Questions
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Questions you saved from practice sessions and mock reviews, across every module.
          </p>
          <div className="mt-3">
            <ModuleSelector value={moduleFilter} onChange={setModuleFilter} includeAll label="Filter module" />
          </div>
        </div>

        {bookmarkedQuestions.length > 0 && (
          <button
            onClick={() => setIsPracticing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)] self-start sm:self-auto"
          >
            <Play className="w-4 h-4 fill-black" />
            Practice Bookmarks ({bookmarkedQuestions.length})
          </button>
        )}
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#12181E] border border-[#1E2732] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#18232C] text-[#8C98A6] border border-[#243342] flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-white">
            No Bookmarks Saved Yet
          </h2>
          <p className="text-xs text-[#8C98A6] max-w-sm mx-auto">
            Click the "Bookmark" icon on any question during your practice sessions or mock test reviews to save key items here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#76B900] font-bold">#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
                    {getModuleById(q.moduleId)?.code || q.moduleId.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10151C] text-[#8C98A6] border border-[#222E3A]">
                    {q.topic}
                  </span>
                  <span className="text-[#6D7A88] text-[11px]">{q.id}</span>
                </div>

                <button
                  onClick={() => toggleBookmark(q.id)}
                  className="flex items-center gap-1 text-[11px] text-[#7C8998] hover:text-red-400 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove</span>
                </button>
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
                          ? 'bg-[#76B900]/10 border-[#76B900]/40 text-white font-medium'
                          : 'bg-[#10151B] border-[#1D2732] text-[#8C98A6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] ${
                          isCorrect ? 'bg-[#76B900] text-black' : 'bg-[#182129] text-[#8C98A6]'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isCorrect && (
                        <span className="text-[10px] font-mono text-[#76B900] font-bold">
                          Official Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Technical Explanation */}
              <div className="p-3.5 rounded-lg bg-[#0E1318] border border-[#1E2833] text-xs text-[#CBD3DC] space-y-1">
                <div className="font-semibold text-white flex items-center gap-1 font-mono text-[11px]">
                  <Info className="w-3.5 h-3.5 text-[#76B900]" />
                  Explanation:
                </div>
                <p className="leading-relaxed pl-2.5 border-l border-[#243342]">
                  {q.explanation}
                </p>
                <div className="text-[10px] text-[#6E7B8B] font-mono pt-1">
                  Source: {q.sourcePdf} • {q.sourceQuestionNumber} • Page {q.pageNumber}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

