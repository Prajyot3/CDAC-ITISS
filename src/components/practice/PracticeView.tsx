import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { getQuestionsForModule } from '../../data/moduleRegistry';
import { FCN_TOPICS } from '../../config/topics';
import { PracticeSession } from './PracticeSession';
import { Question } from '../../types/question';
import { 
  BookOpen, 
  Shuffle, 
  Layers, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const PracticeView: React.FC = () => {
  const { activeModuleId, getTopicStats } = useProgress();
  const allQuestions = getQuestionsForModule(activeModuleId);
  const topicStats = getTopicStats(activeModuleId);

  const [activeSession, setActiveSession] = useState<{
    questions: Question[];
    title: string;
    subtitle?: string;
  } | null>(null);

  const [randomCount, setRandomCount] = useState<number>(20);

  // Mode A: All Questions
  const handleStartAll = () => {
    setActiveSession({
      questions: allQuestions,
      title: 'FCN Complete Practice Bank',
      subtitle: `All ${allQuestions.length} Questions in sequential curriculum order`
    });
  };

  // Mode B: Random Practice
  const handleStartRandom = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(randomCount, allQuestions.length));
    setActiveSession({
      questions: selected,
      title: `Random Practice Session (${selected.length} Questions)`,
      subtitle: `Shuffled across all 13 FCN topics`
    });
  };

  // Mode C: Topic-wise Practice
  const handleStartTopic = (topicName: string) => {
    const filtered = allQuestions.filter(q => q.topic.toLowerCase() === topicName.toLowerCase());
    setActiveSession({
      questions: filtered,
      title: `Topic: ${topicName}`,
      subtitle: `${filtered.length} Curated Questions for focused mastery`
    });
  };

  if (activeSession) {
    return (
      <PracticeSession
        questions={activeSession.questions}
        title={activeSession.title}
        subtitle={activeSession.subtitle}
        onExit={() => setActiveSession(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#1F2933] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
            FCN PRACTICE ENGINE
          </span>
          <span className="text-xs text-[#8C98A6] font-mono">{allQuestions.length} Total MCQs Available</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1.5">
          Practice Examination MCQs
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
          Select your preparation mode. Experience instant answer reveals, in-depth technical explanations, and source provenance across all questions.
        </p>
      </div>

      {/* Modes Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* MODE A: All Questions */}
        <div className="p-6 rounded-xl bg-[#141C24] border border-[#76B900]/30 hover:border-[#76B900]/60 transition-all shadow-[0_0_20px_rgba(118,185,0,0.06)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#76B900]/10 border border-[#76B900]/30 flex items-center justify-center text-[#76B900]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#76B900] uppercase font-bold tracking-wider">Mode A</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Complete Question Bank</h2>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Access the complete FCN question bank without the 40-question restriction. Navigate sequentially through all 309 extracted questions with immediate explanations.
            </p>
          </div>

          <div className="pt-2 border-t border-[#1F2A36] flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C98A6]">
              {allQuestions.length} Questions
            </span>
            <button
              onClick={handleStartAll}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_10px_rgba(118,185,0,0.25)] hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Practice All
            </button>
          </div>
        </div>

        {/* MODE B: Random Practice */}
        <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2E3D4D] transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Mode B</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Random Practice</h2>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Generate a randomized question set to test your cross-topic retention. Select the exact question quantity that fits your study session.
            </p>

            {/* Quantity Selector */}
            <div className="pt-1">
              <label className="text-[11px] text-[#8C98A6] block mb-1.5 font-medium">Select Question Quantity:</label>
              <div className="flex flex-wrap gap-2">
                {[10, 20, 30, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => setRandomCount(count)}
                    className={`px-3 py-1 rounded text-xs font-mono font-medium border transition-all ${
                      randomCount === count
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                        : 'bg-[#10151C] text-[#8C98A6] border-[#202B37] hover:text-white'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1F2A36] flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C98A6]">
              {randomCount} Randomized Qs
            </span>
            <button
              onClick={handleStartRandom}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B252F] hover:bg-[#23303D] border border-[#2D3E4F] hover:border-cyan-400 text-white font-semibold text-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              Launch Random
            </button>
          </div>
        </div>
      </div>

      {/* MODE C: Topic-wise Practice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#76B900] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#76B900]/10 border border-[#76B900]/25">
                Mode C
              </span>
              <h2 className="text-lg font-bold text-white">
                Topic-wise Focused Practice
              </h2>
            </div>
            <p className="text-xs text-[#8C98A6] mt-0.5">
              Practice questions rigorously classified into the 13 official networking topic domains.
            </p>
          </div>
          <span className="text-xs text-[#8C98A6] font-mono">13 Topics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FCN_TOPICS.map((topic) => {
            const tStat = topicStats[topic.name] || { total: 0, attempted: 0, correct: 0, accuracy: 0 };

            return (
              <div
                key={topic.id}
                onClick={() => handleStartTopic(topic.name)}
                className="group p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#76B900]/50 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-white group-hover:text-[#76B900] transition-colors">
                      {topic.name}
                    </h3>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#10151B] border border-[#222C35] text-[#76B900]">
                      {tStat.total} Qs
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8C98A6] line-clamp-2 mt-1">
                    {topic.shortDescription}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#1C2632]">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#7A8796]">{tStat.attempted}/{tStat.total} done</span>
                    <span className={tStat.accuracy >= 60 ? 'text-[#76B900]' : tStat.attempted > 0 ? 'text-amber-400' : 'text-[#7A8796]'}>
                      {tStat.accuracy}% Acc
                    </span>
                  </div>
                  <ProgressBar 
                    value={tStat.total > 0 ? (tStat.attempted / tStat.total) * 100 : 0} 
                    showPercent={false} 
                    size="sm" 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

