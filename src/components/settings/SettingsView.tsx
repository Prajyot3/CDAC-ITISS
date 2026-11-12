import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Layers,
  Database
} from 'lucide-react';

interface SettingsViewProps {
  onOpenAudit: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAudit }) => {
  const { 
    activeModuleId, 
    resetModuleProgress, 
    resetMockHistory, 
    resetAllData, 
    exportData, 
    importData 
  } = useProgress();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itiss_progress_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Progress data exported successfully!' });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importData(content);
      if (ok) {
        setMessage({ type: 'success', text: 'Progress data imported successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Invalid backup file format.' });
      }
    };
    reader.readAsText(file);
  };

  const handleResetModule = () => {
    if (window.confirm('Reset all practice progress for the active module?')) {
      resetModuleProgress(activeModuleId);
      setMessage({ type: 'success', text: 'Module practice attempts reset.' });
    }
  };

  const handleResetMocks = () => {
    if (window.confirm('Clear all mock examination history for this module?')) {
      resetMockHistory(activeModuleId);
      setMessage({ type: 'success', text: 'Mock test history cleared.' });
    }
  };

  const handleResetAll = () => {
    if (window.confirm('WARNING: Reset all student data, bookmarks, practice records, and mock tests across all modules? This cannot be undone.')) {
      resetAllData();
      setMessage({ type: 'success', text: 'All platform records reset to initial state.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#1F2933] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
            SYSTEM PREFERENCES
          </span>
          <span className="text-xs text-[#8C98A6] font-mono">Platform Configuration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1.5">
          Settings & Module Architecture
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Manage local storage records, export backups, view verification audits, and review the future module activation framework.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
          message.type === 'success'
            ? 'bg-[#76B900]/10 border-[#76B900]/40 text-[#76B900]'
            : 'bg-red-500/10 border-red-500/40 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 1: Future Module Activation Architecture */}
      <div className="p-6 rounded-xl bg-[#141C24] border border-[#76B900]/35 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#76B900]" />
          <h2 className="text-base font-bold text-white">
            Future Module Activation Architecture
          </h2>
        </div>
        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          The platform was engineered so that upcoming modules (Operating Systems, Advanced Programming, NDC, PKI, DevOps, etc.) can be activated independently without modifying existing question banks or rebuilding the application.
        </p>

        <div className="p-4 rounded-lg bg-[#0C1014] border border-[#202C38] font-mono text-xs text-[#CBD5E1] space-y-3">
          <div className="text-[#76B900] font-semibold">// How to activate a new module in 2 simple steps:</div>
          <div>
            <span className="text-[#8C98A6]">1. Place questions JSON in </span>
            <code className="text-white bg-[#162029] px-1.5 py-0.5 rounded">src/data/osQuestions.json</code>
          </div>
          <div>
            <span className="text-[#8C98A6]">2. Register in </span>
            <code className="text-white bg-[#162029] px-1.5 py-0.5 rounded">src/data/moduleRegistry.ts</code>
            <span className="text-[#8C98A6]"> and set </span>
            <code className="text-[#76B900] bg-[#162029] px-1.5 py-0.5 rounded">status: 'AVAILABLE'</code>
            <span className="text-[#8C98A6]"> in </span>
            <code className="text-white bg-[#162029] px-1.5 py-0.5 rounded">src/config/modules.ts</code>
          </div>
          <div className="text-[11px] text-[#788594] pt-1">
            → The module instantly receives its own Practice MCQs, 40-Q Mock Exams, Incorrect Questions Tracker, Bookmarks, and Performance Dashboard automatically.
          </div>
        </div>
      </div>

      {/* SECTION 2: Extraction Audit Access */}
      <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#76B900]" />
            <h3 className="text-sm font-bold text-white">
              PDF Extraction Audit Report
            </h3>
          </div>
          <p className="text-xs text-[#8C98A6]">
            Inspect the exact provenance of all 309 questions extracted from FCN01.pdf through FCN05.pdf.
          </p>
        </div>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18232D] hover:bg-[#202E3C] border border-[#2A3848] hover:border-[#76B900] text-xs font-semibold text-white transition-all shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-[#76B900]" />
          View Full Audit
        </button>
      </div>

      {/* SECTION 3: Data Backup and Restore */}
      <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#76B900]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Data Backup & Migration
          </h2>
        </div>
        <p className="text-xs text-[#8C98A6]">
          Your study activity is saved in your browser's local storage. You can export a JSON backup or transfer your records to another device.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18232D] hover:bg-[#202E3C] border border-[#2A3848] text-xs font-medium text-white transition-all"
          >
            <Download className="w-4 h-4 text-[#76B900]" />
            Export Backup (.json)
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18232D] hover:bg-[#202E3C] border border-[#2A3848] text-xs font-medium text-white transition-all cursor-pointer">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* SECTION 4: Reset Controls */}
      <div className="p-6 rounded-xl bg-[#181316] border border-red-500/25 space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Reset Data & Progress
          </h2>
        </div>
        <p className="text-xs text-[#8C98A6]">
          Reset specific activity histories or purge all saved local data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleResetModule}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#22161A] hover:bg-[#2C1A20] border border-red-500/30 text-xs text-red-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset FCN Practice Answers
          </button>

          <button
            onClick={handleResetMocks}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#22161A] hover:bg-[#2C1A20] border border-red-500/30 text-xs text-red-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Mock Test History
          </button>

          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-xs text-red-200 font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge All Data
          </button>
        </div>
      </div>
    </div>
  );
};

