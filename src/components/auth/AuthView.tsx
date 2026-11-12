import React, { useState } from 'react';
import { UserProfile, useUser, useClerk } from '@clerk/react';
import {
  Shield,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  LogOut,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface AuthViewProps {
  onNavigateToDashboard?: () => void;
}

/**
 * Student account page. Sign-in itself is handled earlier by `<AuthGate>`, so this
 * view only has to describe an authenticated session.
 */
export const AuthView: React.FC<AuthViewProps> = ({ onNavigateToDashboard }) => {
  const [showManageProfile, setShowManageProfile] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getOverallStats, mockAttempts } = useProgress();

  const stats = getOverallStats();

  if (!isLoaded) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center text-sm font-mono text-[#8C98A6]">
        Loading student session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-xl bg-[#141C24] border border-[#232F3B] text-center space-y-2">
        <Lock className="w-5 h-5 text-[#76B900] mx-auto" />
        <h2 className="text-sm font-bold text-white">No active session</h2>
        <p className="text-xs text-[#9CA3AF]">
          Reload the page to reach the access gate and sign in again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-[#1F2933] pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/30">
            AUTHENTICATION
          </span>
          <span className="text-xs text-[#8C98A6] font-mono">Clerk Identity Cloud</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1.5">
          Student Account &amp; Authentication
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
          Secure, verified authentication for CDAC ITISS Diploma scholars. Save test submissions,
          synchronize question bookmarks, and monitor your preparation across all devices.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main User Card */}
        <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#232F3B] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#76B900]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={user.imageUrl}
                alt={user.fullName || 'Avatar'}
                className="w-16 h-16 rounded-full border-2 border-[#76B900] ring-4 ring-[#76B900]/15 shadow-lg object-cover"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white">
                    {user.fullName || 'CDAC ITISS Scholar'}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
                    AUTHENTICATED
                  </span>
                </div>
                <div className="text-xs text-[#9CA3AF] font-mono flex items-center gap-2 flex-wrap">
                  <span>{user.primaryEmailAddress?.emailAddress}</span>
                  <span>•</span>
                  <span className="text-[#64748B]">ID: {user.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowManageProfile(prev => !prev)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#18232D] hover:bg-[#202E3C] border border-[#2A3848] hover:border-[#76B900] text-xs font-semibold text-white transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-[#76B900]" />
                <span>{showManageProfile ? 'Close Account Profile' : 'Manage Account Settings'}</span>
              </button>

              <button
                onClick={() => signOut()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Synchronized Prep Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1F2933]">
            <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2933]">
              <span className="text-[11px] text-[#8C98A6] block mb-1 font-mono">Attempted</span>
              <span className="text-xl font-bold font-mono text-white">{stats.attempted}</span>
              <span className="text-[10px] text-[#556372] block font-mono">
                / {stats.totalAvailable} Questions
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2933]">
              <span className="text-[11px] text-[#8C98A6] block mb-1 font-mono">Overall Accuracy</span>
              <span
                className={`text-xl font-bold font-mono ${
                  stats.accuracy >= 60 ? 'text-[#76B900]' : 'text-amber-400'
                }`}
              >
                {stats.accuracy}%
              </span>
              <span className="text-[10px] text-[#556372] block font-mono">
                {stats.correct} Correct
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2933]">
              <span className="text-[11px] text-[#8C98A6] block mb-1 font-mono">Mock Exams Taken</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{mockAttempts.length}</span>
              <span className="text-[10px] text-[#556372] block font-mono">40-Question Tests</span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2933]">
              <span className="text-[11px] text-[#8C98A6] block mb-1 font-mono">Cloud Sync Status</span>
              <span className="text-xs font-bold text-[#76B900] flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                Connected &amp; Saved
              </span>
              <span className="text-[10px] text-[#556372] block font-mono mt-0.5">
                Clerk Session Active
              </span>
            </div>
          </div>
        </div>

        {/* Embedded UserProfile View if toggled */}
        {showManageProfile && (
          <div className="p-4 md:p-6 rounded-xl bg-[#141C24] border border-[#232F3B] flex justify-center">
            <UserProfile routing="hash" />
          </div>
        )}

        {/* Identity + plan summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1217] border border-[#1F2933] flex items-start gap-3">
            <Shield className="w-4 h-4 text-[#76B900] mt-0.5 shrink-0" />
            <div>
              <span className="block text-xs font-semibold text-white">Identity provider</span>
              <span className="block text-[11px] text-[#8C98A6]">Clerk Cloud · session tokens</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1217] border border-[#1F2933] flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-[#76B900] mt-0.5 shrink-0" />
            <div>
              <span className="block text-xs font-semibold text-white">Progress storage</span>
              <span className="block text-[11px] text-[#8C98A6]">Local device, scoped to your session</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#0D1217] border border-[#1F2933] flex items-start gap-3">
            <Award className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <span className="block text-xs font-semibold text-white">Exam access</span>
              <span className="block text-[11px] text-[#8C98A6]">FCN live · 11 modules updated soon</span>
            </div>
          </div>
        </div>

        {/* Quick Action Return to Study */}
        {onNavigateToDashboard && (
          <div className="flex justify-end">
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#76B900] hover:bg-[#68a500] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(118,185,0,0.25)]"
            >
              <span>Continue Examination Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
