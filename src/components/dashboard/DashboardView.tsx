import React from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Flame
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { COURSE_SECTIONS, ITISS_MODULES } from '../../config/modules';
import { StatusBadge } from '../common/StatusBadge';
import { getQuestionCountForModule, getActiveModules } from '../../data/moduleRegistry';
import { ProgressBar } from '../common/ProgressBar';
import { NavItem } from '../layout/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavItem) => void;
  onSelectModule: (moduleId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectModule
}) => {
  const { getOverallStats, getModuleStats } = useProgress();
  const overallStats = getOverallStats();
  const fcnStats = getModuleStats('fcn');

  const fcnModule = ITISS_MODULES.find(m => m.id === 'fcn')!;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-[#222E3A] bg-gradient-to-r from-[#121920] via-[#151F27] to-[#10161C] p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#76B900]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#76B900]/10 border border-[#76B900]/30 text-xs text-[#76B900] font-mono">
              <Zap className="w-3.5 h-3.5 fill-[#76B900]" />
              <span>STUDENT PREPARATION PORTAL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              ITISS Examination Preparation
            </h1>
            <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
              Welcome to the Post Graduate Diploma in IT Infrastructure, Systems & Security student preparation platform. Prepare systematically with comprehensive MCQ banks, timed mock examinations, and real-time performance diagnostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(118,185,0,0.3)] hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-black" />
              Start Practice
            </button>
            <button
              onClick={() => onNavigate('mock')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#19242F] hover:bg-[#202E3C] border border-[#2B3B4B] hover:border-[#76B900] text-white font-medium text-xs transition-all"
            >
              <Clock className="w-4 h-4 text-[#76B900]" />
              40-Q Mock Test
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards (Calculated from actual activity) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Questions Available */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Available MCQs</span>
            <BookOpen className="w-4 h-4 text-[#76B900]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overallStats.totalAvailable}
          </div>
          <div className="text-[11px] text-[#7E8B9A] mt-1 font-mono">
            {getActiveModules().length} Active Modules
          </div>
        </div>

        {/* Questions Attempted */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Attempted</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overallStats.attempted}
          </div>
          <div className="text-[11px] text-[#7E8B9A] mt-1 font-mono">
            {overallStats.totalAvailable - overallStats.attempted} unattempted
          </div>
        </div>

        {/* Correct Answers */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Correct</span>
            <CheckCircle2 className="w-4 h-4 text-[#76B900]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#76B900]">
            {overallStats.correct}
          </div>
          <div className="text-[11px] text-[#7E8B9A] mt-1 font-mono">
            Accurate answers
          </div>
        </div>

        {/* Incorrect Answers */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Incorrect</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {overallStats.incorrect}
          </div>
          <div className="text-[11px] text-[#7E8B9A] mt-1 font-mono">
            Needs review
          </div>
        </div>

        {/* Accuracy Percentage */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Accuracy</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overallStats.accuracy}%
          </div>
          <div className="text-[11px] text-[#7E8B9A] mt-1 font-mono">
            Target: â‰¥ 70%
          </div>
        </div>

        {/* Study Progress */}
        <div className="p-4 rounded-xl bg-[#141C24] border border-[#222E3A] hover:border-[#2C3B4A] transition-all">
          <div className="flex items-center justify-between text-xs text-[#8C98A6] mb-1.5">
            <span>Study Progress</span>
            <TrendingUp className="w-4 h-4 text-[#76B900]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {overallStats.progressPercent}%
          </div>
          <div className="w-full mt-2">
            <ProgressBar value={overallStats.progressPercent} showPercent={false} size="sm" />
          </div>
        </div>
      </div>

      {/* SECTION: Continue Your Preparation (Active FCN Module) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#76B900]" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Continue Your Preparation
            </h2>
          </div>
          <button
            onClick={() => onSelectModule('fcn')}
            className="text-xs text-[#76B900] hover:text-[#88D600] flex items-center gap-1 font-medium transition-colors"
          >
            Module Overview <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-xl bg-[#151D25] border border-[#76B900]/30 hover:border-[#76B900]/60 transition-all shadow-[0_0_20px_rgba(118,185,0,0.06)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status="AVAILABLE" size="md" />
                <span className="text-xs font-mono text-[#8C98A6] px-2.5 py-0.5 rounded bg-[#10161C] border border-[#222C35]">
                  Module Duration: {fcnModule.duration}
                </span>
                <span className="text-xs font-mono text-[#76B900] px-2.5 py-0.5 rounded bg-[#76B900]/10 border border-[#76B900]/20 font-semibold">
                  {fcnStats.totalAvailable} Extracted MCQs
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {fcnModule.name}
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
                  {fcnModule.description}
                </p>
              </div>

              {/* Progress metrics */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8C98A6]">Module Completion Progress:</span>
                  <span className="font-mono text-white font-medium">
                    {fcnStats.attempted} / {fcnStats.totalAvailable} questions attempted ({fcnStats.progressPercent}%)
                  </span>
                </div>
                <ProgressBar value={fcnStats.progressPercent} showPercent={false} size="md" />
              </div>
            </div>

            {/* Quick Actions for FCN */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[200px]">
              <button
                onClick={() => onNavigate('practice')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#87D300] text-black font-semibold text-xs transition-all shadow-[0_0_12px_rgba(118,185,0,0.25)] hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-black" />
                Practice All MCQs
              </button>
              <button
                onClick={() => onNavigate('mock')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B252E] hover:bg-[#232F3A] border border-[#2F3D4D] hover:border-[#76B900] text-white font-medium text-xs transition-all"
              >
                <Clock className="w-4 h-4 text-[#76B900]" />
                Launch Mock Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Explore ITISS Modules (All 5 Sections + 12 Modules) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2933] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#76B900]" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Explore ITISS Modules
              </h2>
            </div>
            <p className="text-xs text-[#8C98A6] mt-0.5">
              CDAC Course Curriculum organized into 5 independent sections.
            </p>
          </div>
          <button
            onClick={() => onNavigate('modules')}
            className="text-xs text-[#76B900] hover:text-[#88D600] flex items-center gap-1 font-medium transition-colors"
          >
            View Complete Syllabus Matrix <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Five Course Sections */}
        <div className="space-y-6">
          {COURSE_SECTIONS.map((sec) => {
            const secModules = ITISS_MODULES.filter(m => m.sectionId === sec.id);

            return (
              <div key={sec.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#76B900] tracking-wider px-2 py-0.5 rounded bg-[#76B900]/10 border border-[#76B900]/20">
                      {sec.number}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {sec.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#717E8E] font-mono">
                    {secModules.length} {secModules.length === 1 ? 'Module' : 'Modules'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {secModules.map((mod) => {
                    const isAvailable = mod.status === 'AVAILABLE';

                    return (
                      <div
                        key={mod.id}
                        onClick={() => onSelectModule(mod.id)}
                        className={`group relative p-4 rounded-xl transition-all cursor-pointer ${
                          isAvailable
                            ? 'bg-[#151D25] border border-[#76B900]/40 hover:border-[#76B900] shadow-[0_0_15px_rgba(118,185,0,0.08)]'
                            : 'bg-[#12181E] border border-[#1F2934] hover:border-[#2C3A48]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <span className="text-xs font-mono text-[#8C98A6]">
                            #{mod.number.toString().padStart(2, '0')} • {mod.code}
                          </span>
                          <StatusBadge status={mod.status} />
                        </div>

                        <h4 className="text-sm font-semibold text-white group-hover:text-[#76B900] transition-colors line-clamp-2 min-h-[40px]">
                          {mod.name}
                        </h4>

                        <div className="mt-3 pt-3 border-t border-[#1C2630] flex items-center justify-between text-xs">
                          <span className="text-[#8C98A6] font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#5D6B7B]" />
                            {mod.duration}
                          </span>

                          {isAvailable ? (
                            <span className="text-[#76B900] font-mono font-semibold flex items-center gap-1">
                              {getQuestionCountForModule(mod.id)} MCQs <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[#657383] text-[11px]">
                              Question Bank Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};



