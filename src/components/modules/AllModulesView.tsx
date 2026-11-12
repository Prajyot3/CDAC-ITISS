import React from 'react';
import { COURSE_SECTIONS, ITISS_MODULES } from '../../config/modules';
import { ITISSModule } from '../../types/module';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, Layers, ArrowRight, ShieldCheck, CheckCircle2, BookOpen } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface AllModulesViewProps {
  onSelectModule: (moduleId: string) => void;
  onOpenAudit: () => void;
}

export const AllModulesView: React.FC<AllModulesViewProps> = ({
  onSelectModule,
  onOpenAudit
}) => {
  const { getModuleStats } = useProgress();
  const fcnStats = getModuleStats('fcn');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2933] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
              COURSE MATRIX
            </span>
            <span className="text-xs text-[#8C98A6] font-mono">12 Total Modules • 1170 Total Course Hours</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1.5">
            All ITISS Curriculum Modules
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
            Complete syllabus structure for the CDAC Post Graduate Diploma in IT Infrastructure, Systems & Security, organized across all 5 official sections.
          </p>
        </div>

        <button
          onClick={onOpenAudit}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141C24] border border-[#2B3947] hover:border-[#76B900] text-xs font-medium text-white transition-all shadow-sm"
        >
          <ShieldCheck className="w-4 h-4 text-[#76B900]" />
          <span>Extraction Audit Report</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-8">
        {COURSE_SECTIONS.map((sec) => {
          const secModules = ITISS_MODULES.filter(m => m.sectionId === sec.id);

          return (
            <div key={sec.id} className="space-y-4">
              {/* Section Header */}
              <div className="p-4 rounded-xl bg-[#11171E] border border-[#1E2833] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#76B900] px-2 py-0.5 rounded bg-[#76B900]/10 border border-[#76B900]/25">
                      {sec.number}
                    </span>
                    <h2 className="text-base font-bold text-white">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-xs text-[#8C98A6] max-w-3xl">
                    {sec.description}
                  </p>
                </div>

                <div className="text-xs font-mono text-[#718090] shrink-0">
                  {secModules.reduce((acc, m) => acc + parseInt(m.duration.replace(/\D/g, '') || '0'), 0)} Total Hours
                </div>
              </div>

              {/* Modules in this Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {secModules.map((mod) => {
                  const isAvailable = mod.status === 'AVAILABLE';

                  return (
                    <div
                      key={mod.id}
                      onClick={() => onSelectModule(mod.id)}
                      className={`group relative p-5 rounded-xl flex flex-col justify-between transition-all cursor-pointer ${
                        isAvailable
                          ? 'bg-[#151D25] border border-[#76B900]/40 hover:border-[#76B900] shadow-[0_0_18px_rgba(118,185,0,0.08)]'
                          : 'bg-[#12181F] border border-[#1F2935] hover:border-[#2E3C4B]'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-medium text-[#7D8A99]">
                            Module #{mod.number.toString().padStart(2, '0')} • {mod.code}
                          </span>
                          <StatusBadge status={mod.status} />
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white group-hover:text-[#76B900] transition-colors leading-snug">
                          {mod.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[#8C98A6] line-clamp-3 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      {/* Footer Stats & Actions */}
                      <div className="mt-5 pt-3.5 border-t border-[#1D2732] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#8C98A6] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#5D6B7B]" />
                          {mod.duration}
                        </span>

                        {isAvailable ? (
                          <div className="flex items-center gap-1 text-[#76B900] font-semibold">
                            <span>{fcnStats.totalAvailable} Questions</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        ) : (
                          <span className="text-[#5E6B7A] text-[11px]">
                            Updated Soon
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
  );
};

