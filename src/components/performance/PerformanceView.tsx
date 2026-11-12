import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { ITISS_MODULES, getModuleById } from '../../config/modules';
import { FCN_TOPICS } from '../../config/topics';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge } from '../common/StatusBadge';
import { 
  BarChart3, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Bookmark, 
  AlertCircle, 
  Layers, 
  TrendingUp,
  History,
  Info
} from 'lucide-react';
import { NavItem } from '../layout/Sidebar';

interface PerformanceViewProps {
  onNavigate: (tab: NavItem) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ onNavigate }) => {
  const { activeModuleId, setActiveModuleId, getModuleStats, getTopicStats, mockAttempts } = useProgress();
  const [selectedModId, setSelectedModId] = useState<string>(activeModuleId);

  const selectedModule = getModuleById(selectedModId) || ITISS_MODULES[0];
  const isAvailable = selectedModule.status === 'AVAILABLE';

  const stats = getModuleStats(selectedModId);
  const topicStats = getTopicStats(selectedModId);
  const modMocks = mockAttempts.filter(m => m.moduleId === selectedModId);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header + Module Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2933] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
              ANALYTICS & DIAGNOSTICS
            </span>
            <span className="text-xs text-[#8C98A6] font-mono">Independent Module Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5">
            Student Performance Dashboard
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
            Real-time analytics evaluated from your actual practice question responses and timed 40-question mock examination attempts.
          </p>
        </div>

        {/* Module Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#8C98A6] font-mono">Select Module:</label>
          <select
            value={selectedModId}
            onChange={(e) => setSelectedModId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#141C24] border border-[#2B3948] hover:border-[#76B900] text-xs font-medium text-white focus:outline-none focus:border-[#76B900] transition-colors"
          >
            {ITISS_MODULES.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* If module is NOT AVAILABLE, show clean empty state */}
      {!isAvailable ? (
        <div className="p-12 rounded-xl bg-[#12181E] border border-[#1E2833] text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#18232C] text-[#8C98A6] border border-[#243342] flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              No Performance Statistics Available
            </h2>
            <div className="mt-2 inline-block">
              <StatusBadge status="UPDATED SOON" size="md" />
            </div>
          </div>
          <p className="text-xs text-[#8C98A6] leading-relaxed">
            The question bank for <strong className="text-white">{selectedModule.name}</strong> has not yet been activated. Once question papers are imported, performance diagnostics and mock history will track independently here.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSelectedModId('fcn')}
              className="px-4 py-2 rounded-lg bg-[#76B900] text-black text-xs font-semibold hover:bg-[#87D300] transition-colors"
            >
              Switch to Active Module (FCN)
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Module Banner */}
          <div className="p-6 rounded-xl bg-[#141C24] border border-[#76B900]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status="AVAILABLE" size="sm" />
                <span className="text-xs text-[#8C98A6] font-mono">Module #{selectedModule.number} • {selectedModule.duration}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {selectedModule.name}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('incorrect')}
                className="px-3.5 py-1.5 rounded-lg bg-[#18222A] hover:bg-[#202C38] border border-[#2A3745] text-xs font-medium text-white transition-colors flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Incorrect ({stats.incorrect})</span>
              </button>
              <button
                onClick={() => onNavigate('bookmarks')}
                className="px-3.5 py-1.5 rounded-lg bg-[#18222A] hover:bg-[#202C38] border border-[#2A3745] text-xs font-medium text-white transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Bookmarks ({stats.bookmarkedCount})</span>
              </button>
            </div>
          </div>

          {/* KPI Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Total MCQs</div>
              <div className="text-2xl font-bold font-mono text-white">
                {stats.totalAvailable}
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">5 PDF Sources</div>
            </div>

            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Attempted</div>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                {stats.attempted}
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">
                {stats.totalAvailable - stats.attempted} remaining
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Correct Answers</div>
              <div className="text-2xl font-bold font-mono text-[#76B900]">
                {stats.correct}
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">
                Accurate solutions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Incorrect Answers</div>
              <div className="text-2xl font-bold font-mono text-red-400">
                {stats.incorrect}
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">
                Needs review
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Accuracy</div>
              <div className="text-2xl font-bold font-mono text-white">
                {stats.accuracy}%
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">
                Target: ≥ 70%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A]">
              <div className="text-xs text-[#8C98A6] mb-1">Mock Exams Taken</div>
              <div className="text-2xl font-bold font-mono text-[#76B900]">
                {stats.mockTestsCount}
              </div>
              <div className="text-[11px] text-[#788594] font-mono mt-0.5">
                Avg: {stats.averageMockScore} / 40
              </div>
            </div>
          </div>

          {/* Topic-wise Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#76B900]" />
                <h2 className="text-base font-bold text-white">
                  Topic-wise Mastery Breakdown (13 Topics)
                </h2>
              </div>
              <span className="text-xs text-[#8C98A6] font-mono">
                Real Question Bank Analytics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {FCN_TOPICS.map((topic) => {
                const tStat = topicStats[topic.name] || { total: 0, attempted: 0, correct: 0, accuracy: 0 };

                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-white">
                          {topic.name}
                        </h3>
                        <p className="text-[11px] text-[#8C98A6]">
                          {topic.shortDescription}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#10151B] border border-[#222C35] text-[#76B900]">
                        {tStat.total} Qs
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-[#8C98A6]">
                          Attempted: {tStat.attempted} / {tStat.total}
                        </span>
                        <span className={tStat.accuracy >= 60 ? 'text-[#76B900] font-bold' : tStat.attempted > 0 ? 'text-amber-400 font-bold' : 'text-[#8C98A6]'}>
                          Accuracy: {tStat.accuracy}%
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

          {/* Historical Mock Exams Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#76B900]" />
                <h2 className="text-base font-bold text-white">
                  Mock Examination Records
                </h2>
              </div>
              <span className="text-xs text-[#8C98A6] font-mono">
                {modMocks.length} Tests
              </span>
            </div>

            {modMocks.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#12181E] border border-[#1E2732] text-center text-xs text-[#8C98A6]">
                No mock examinations taken yet for this module.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#222E3A] bg-[#10161C]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#161E25] text-[#8C98A6] border-b border-[#222E3A]">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-3">Score</th>
                      <th className="py-3 px-3">Percentage</th>
                      <th className="py-3 px-3">Accuracy</th>
                      <th className="py-3 px-3">Time Spent</th>
                      <th className="py-3 px-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D2731]">
                    {modMocks.map(m => {
                      const passed = m.score >= 24;
                      return (
                        <tr key={m.id} className="hover:bg-[#141C24] transition-colors">
                          <td className="py-3 px-4 text-white font-sans font-medium">{m.dateFormatted}</td>
                          <td className="py-3 px-3 font-bold text-white">{m.score} / {m.totalQuestions}</td>
                          <td className="py-3 px-3 text-[#76B900]">{m.percentage}%</td>
                          <td className="py-3 px-3 text-[#C5CAD1]">{m.accuracy}%</td>
                          <td className="py-3 px-3 text-[#8C98A6]">{Math.floor(m.timeSpentSeconds / 60)}m {m.timeSpentSeconds % 60}s</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              passed ? 'bg-[#76B900]/20 text-[#76B900]' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

