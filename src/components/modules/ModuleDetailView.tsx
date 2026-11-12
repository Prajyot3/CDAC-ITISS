import React from 'react';
import { getModuleById, ITISS_MODULES } from '../../config/modules';
import { UpdatedSoonScreen } from './UpdatedSoonScreen';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { useProgress } from '../../context/ProgressContext';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Target, 
  Layers, 
  FileCheck2, 
  ArrowLeft,
  BookOpen,
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { NavItem } from '../layout/Sidebar';
import { FCN_TOPICS } from '../../config/topics';

interface ModuleDetailViewProps {
  moduleId: string;
  onBack: () => void;
  onNavigate: (tab: NavItem) => void;
  onOpenAudit: () => void;
}

export const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({
  moduleId,
  onBack,
  onNavigate,
  onOpenAudit
}) => {
  const module = getModuleById(moduleId);
  const { getModuleStats, getTopicStats } = useProgress();

  if (!module) {
    return (
      <div className="p-8 text-center text-[#9CA3AF] space-y-4">
        <p>Module not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-[#1B242D] text-white text-xs"
        >
          Back to All Modules
        </button>
      </div>
    );
  }

  // If not AVAILABLE, show UpdatedSoonScreen
  if (module.status !== 'AVAILABLE') {
    return <UpdatedSoonScreen module={module} onBack={onBack} />;
  }

  const stats = getModuleStats(module.id);
  const topicStats = getTopicStats(module.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#8C98A6] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Modules
      </button>

      {/* Main Module Card */}
      <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#76B900]/40 shadow-[0_0_25px_rgba(118,185,0,0.06)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#10151B] border border-[#232F3B] text-[#8C98A6]">
              {module.sectionName}
            </span>
            <span className="text-xs font-mono text-[#76B900] px-2.5 py-1 rounded bg-[#76B900]/10 border border-[#76B900]/30 font-semibold">
              Module #{module.number.toString().padStart(2, '0')} • {module.code}
            </span>
          </div>
          <StatusBadge status="AVAILABLE" size="md" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {module.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#8C98A6] font-mono">
            <span className="flex items-center gap-1.5 text-white">
              <Clock className="w-4 h-4 text-[#76B900]" />
              Duration: {module.duration}
            </span>
            <span>•</span>
            <span className="text-[#76B900] font-semibold">
              {stats.totalAvailable} Verified MCQs
            </span>
            <span>•</span>
            <span>13 Curricular Topics</span>
          </div>
          <p className="text-sm text-[#9CA3AF] mt-4 leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Progress & Quick Stats */}
        <div className="p-4 rounded-lg bg-[#0F151B] border border-[#222E3A] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8C98A6]">Module Overall Progress:</span>
            <span className="font-mono text-white font-medium">
              {stats.attempted} of {stats.totalAvailable} questions attempted ({stats.progressPercent}%)
            </span>
          </div>
          <ProgressBar value={stats.progressPercent} showPercent={false} size="md" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="text-xs">
              <span className="text-[#7C8898] block">Attempted:</span>
              <span className="font-mono font-bold text-white text-base">{stats.attempted}</span>
            </div>
            <div className="text-xs">
              <span className="text-[#7C8898] block">Correct:</span>
              <span className="font-mono font-bold text-[#76B900] text-base">{stats.correct}</span>
            </div>
            <div className="text-xs">
              <span className="text-[#7C8898] block">Accuracy:</span>
              <span className="font-mono font-bold text-white text-base">{stats.accuracy}%</span>
            </div>
            <div className="text-xs">
              <span className="text-[#7C8898] block">Mock Tests:</span>
              <span className="font-mono font-bold text-white text-base">{stats.mockTestsCount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('practice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(118,185,0,0.3)] hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-black" />
            Start Practice Session
          </button>
          <button
            onClick={() => onNavigate('mock')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#19242F] hover:bg-[#202E3C] border border-[#2B3B4B] hover:border-[#76B900] text-white font-medium text-xs transition-all"
          >
            <Clock className="w-4 h-4 text-[#76B900]" />
            Take 40-Q Mock Exam
          </button>
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#11171D] hover:bg-[#161F27] border border-[#232F3B] text-[#9CA3AF] hover:text-white text-xs transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-[#76B900]" />
            View Extraction Audit Report
          </button>
        </div>
      </div>

      {/* Topics Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#76B900]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Topic-wise Question Breakdown (13 Topics)
            </h2>
          </div>
          <span className="text-xs text-[#8C98A6] font-mono">
            {stats.totalAvailable} Total MCQs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {FCN_TOPICS.map((topic) => {
            const tStat = topicStats[topic.name] || { total: 0, attempted: 0, correct: 0, accuracy: 0 };

            return (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4B] transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-white">
                      {topic.name}
                    </h3>
                    <p className="text-[11px] text-[#8C98A6] line-clamp-1">
                      {topic.shortDescription}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#10151B] border border-[#222C35] text-[#76B900]">
                    {tStat.total} Qs
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#7C8898]">Attempted: {tStat.attempted}/{tStat.total}</span>
                    <span className={tStat.accuracy >= 60 ? 'text-[#76B900]' : tStat.attempted > 0 ? 'text-amber-400' : 'text-[#7C8898]'}>
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

      {/* PDF Provenance Card */}
      <div className="p-6 rounded-xl bg-[#11171E] border border-[#1F2B37] space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#76B900]" />
          Verified Source PDF Materials
        </h3>
        <p className="text-xs text-[#8C98A6] leading-relaxed">
          Questions in this module were systematically extracted and verified from the five official CDAC examination papers: 
          <code className="text-[#76B900] font-mono mx-1">FCN01.pdf (159 Q)</code>, 
          <code className="text-[#76B900] font-mono mx-1">FCN02.pdf (31 Q)</code>, 
          <code className="text-[#76B900] font-mono mx-1">FCN03.pdf (40 Q)</code>, 
          <code className="text-[#76B900] font-mono mx-1">FCN04.pdf (40 Q)</code>, and 
          <code className="text-[#76B900] font-mono mx-1">FCN05.pdf (39 Q)</code>.
        </p>
      </div>
    </div>
  );
};

