import React from 'react';
import { ITISSModule } from '../../types/module';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, Layers, BookOpen, AlertCircle, ArrowLeft, Upload, CheckCircle2, Shield } from 'lucide-react';

interface UpdatedSoonScreenProps {
  module: ITISSModule;
  onBack: () => void;
}

export const UpdatedSoonScreen: React.FC<UpdatedSoonScreenProps> = ({ module, onBack }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#8C98A6] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Modules
      </button>

      {/* Hero Module Card */}
      <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#10151B] border border-[#232F3B] text-[#8C98A6]">
              {module.sectionName}
            </span>
            <span className="text-xs font-mono text-[#76B900] px-2 py-1 rounded bg-[#76B900]/10 border border-[#76B900]/20">
              Module #{module.number.toString().padStart(2, '0')}
            </span>
          </div>
          <StatusBadge status="UPDATED SOON" size="md" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {module.name}
          </h1>
          <div className="flex items-center gap-4 mt-3 text-xs text-[#8C98A6] font-mono">
            <span className="flex items-center gap-1.5 text-white">
              <Clock className="w-4 h-4 text-[#76B900]" />
              Course Duration: {module.duration}
            </span>
            <span>•</span>
            <span>Code: {module.code}</span>
            <span>•</span>
            <span>Route: {module.route}</span>
          </div>
          <p className="text-sm text-[#9CA3AF] mt-4 leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Notice Banner */}
        <div className="p-4 rounded-lg bg-[#11161C] border border-[#26323F] flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Question Bank In Active Preparation
            </h3>
            <p className="text-xs text-[#8C98A6] leading-relaxed">
              In accordance with Phase 1 release specifications, only <strong className="text-white">Fundamentals of Computer Networks (FCN)</strong> is currently functional with imported examination questions. The question bank for this module will be enabled independently once source question papers are uploaded.
            </p>
          </div>
        </div>
      </div>

      {/* Syllabus / Curriculum Preview */}
      {module.syllabusPoints && module.syllabusPoints.length > 0 && (
        <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#76B900]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Curriculum Core Competencies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {module.syllabusPoints.map((point, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg bg-[#10151B] border border-[#1E2833] flex items-start gap-2.5 text-xs text-[#C5CCD6]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] mt-1.5 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scalable Architecture Information */}
      <div className="p-6 rounded-xl bg-[#11171E] border border-[#1F2B37] space-y-3">
        <h3 className="text-xs font-bold text-[#8C98A6] uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#76B900]" />
          Independent Activation Architecture
        </h3>
        <p className="text-xs text-[#8C98A6] leading-relaxed">
          The platform software architecture allows this module (<code className="text-[#76B900] font-mono">{module.id}</code>) to be activated at any time without rebuilding or modifying other modules. Once question papers are imported and registered in <code className="text-white font-mono">src/data/moduleRegistry.ts</code>, switching its status to <code className="text-[#76B900] font-mono">AVAILABLE</code> automatically provisions its practice sessions, timed 40-question mock exams, incorrect tracker, and performance analytics.
        </p>
      </div>
    </div>
  );
};

