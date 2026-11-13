import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Database,
  User,
  LogIn,
  ExternalLink
} from 'lucide-react';
import { Show, SignInButton, useUser, useClerk } from '@clerk/react';

const ClerkAccountSection: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#76B900] border-t-transparent animate-spin" />
        <span className="text-xs text-[#9CA3AF]">Loading authentication status...</span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-[#141C24] border border-[#222E3A] space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#76B900]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Student Identity & Clerk Authentication
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30 font-semibold">
          Clerk CLI Integrated
        </span>
      </div>

      <Show when="signed-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0C1014] border border-[#202C38]">
          <div className="flex items-center gap-3.5">
            <img 
              src={user?.imageUrl} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border border-[#76B900]/50 ring-2 ring-[#76B900]/20"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{user?.fullName || 'ITISS Scholar'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#76B900]/20 text-[#76B900] font-mono">
                  ACTIVE
                </span>
              </div>
              <div className="text-xs text-[#8A97A7] font-mono">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
              <div className="text-[10px] text-[#556372] font-mono mt-0.5">
                ID: {user?.id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openUserProfile()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#18232D] hover:bg-[#202E3C] border border-[#2A3848] hover:border-[#76B900] text-xs font-medium text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#76B900]" />
              <span>Manage Profile</span>
            </button>
            <button
              onClick={() => signOut()}
              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-300 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Show>

      <Show when="signed-out">
        <div className="p-4 rounded-lg bg-[#0C1014] border border-[#202C38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">
              No account linked to this device
            </div>
            <div className="text-[11px] text-[#8C98A6]">
              Sign in with your Clerk account (GitHub, Google, or Email) to sync your examination progress, bookmarks, and mock test scores.
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#76B900] hover:bg-[#68a500] text-black font-semibold text-xs transition-all shadow-md shadow-[#76B900]/20 shrink-0">
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Clerk</span>
            </button>
          </SignInButton>
        </div>
      </Show>
    </div>
  );
};

export const SettingsView: React.FC = () => {
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

      {/* SECTION 0: Clerk Authentication & Student Profile */}
      <ClerkAccountSection />

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
            Reset Active Module Answers
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


