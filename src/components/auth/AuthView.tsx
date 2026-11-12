import React, { useState } from 'react';
import { SignIn, SignUp, UserProfile, Show, useUser, useClerk } from '@clerk/react';
import { 
  Shield, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  UserCheck, 
  BookOpen, 
  Award, 
  ArrowRight,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

interface AuthViewProps {
  onNavigateToDashboard?: () => void;
  defaultMode?: 'sign-in' | 'sign-up';
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  onNavigateToDashboard,
  defaultMode = 'sign-in'
}) => {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(defaultMode);
  const [showManageProfile, setShowManageProfile] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getOverallStats, mockAttempts } = useProgress();

  const stats = getOverallStats();

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
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1.5 flex items-center gap-3">
          <span>Student Account & Authentication</span>
        </h1>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
          Secure, verified authentication for CDAC ITISS Diploma scholars. Save test submissions, synchronize question bookmarks, and monitor your preparation across all devices.
        </p>
      </div>

      {/* SIGNED IN STATE: Full Student Profile Dashboard */}
      <Show when="signed-in">
        <div className="space-y-6">
          {/* Main User Card */}
          <div className="p-6 md:p-8 rounded-xl bg-[#141C24] border border-[#232F3B] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#76B900]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <img 
                  src={user?.imageUrl} 
                  alt={user?.fullName || 'Avatar'} 
                  className="w-16 h-16 rounded-full border-2 border-[#76B900] ring-4 ring-[#76B900]/15 shadow-lg object-cover"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-white">
                      {user?.fullName || 'CDAC ITISS Scholar'}
                    </h2>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
                      AUTHENTICATED
                    </span>
                  </div>
                  <div className="text-xs text-[#9CA3AF] font-mono flex items-center gap-2">
                    <span>{user?.primaryEmailAddress?.emailAddress}</span>
                    <span>•</span>
                    <span className="text-[#64748B]">ID: {user?.id}</span>
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
                <span className="text-[10px] text-[#556372] block font-mono">/ {stats.totalAvailable} Questions</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0C1014] border border-[#1E2933]">
                <span className="text-[11px] text-[#8C98A6] block mb-1 font-mono">Overall Accuracy</span>
                <span className={`text-xl font-bold font-mono ${stats.accuracy >= 60 ? 'text-[#76B900]' : 'text-amber-400'}`}>
                  {stats.accuracy}%
                </span>
                <span className="text-[10px] text-[#556372] block font-mono">{stats.correct} Correct</span>
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
                  Connected & Saved
                </span>
                <span className="text-[10px] text-[#556372] block font-mono mt-0.5">Clerk Session Active</span>
              </div>
            </div>
          </div>

          {/* Embedded UserProfile View if toggled */}
          {showManageProfile && (
            <div className="p-4 md:p-6 rounded-xl bg-[#141C24] border border-[#232F3B] flex justify-center">
              <UserProfile routing="hash" />
            </div>
          )}

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
      </Show>

      {/* SIGNED OUT STATE: Interactive Sign In / Sign Up Screen */}
      <Show when="signed-out">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Platform Features & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl bg-[#141C24] border border-[#232F3B] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#18232C] border border-[#76B900]/40 flex items-center justify-center text-[#76B900]">
                  <Shield className="w-5 h-5 fill-[#76B900]/20" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">CDAC ITISS Preparation</h3>
                  <div className="text-xs text-[#8A97A7]">Diploma Examination Platform</div>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0C1014] border border-[#1E2933]">
                  <BookOpen className="w-4 h-4 text-[#76B900] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">309 Verified Questions</span>
                    <span className="text-[#8C98A6]">Extracts from FCN01 to FCN05 with 100% verified answers & provenance.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0C1014] border border-[#1E2933]">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">40-Question Mock Test Simulator</span>
                    <span className="text-[#8C98A6]">Real examination conditions with 60-minute countdown timer and instant score review.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0C1014] border border-[#1E2933]">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Full 12-Module Course Structure</span>
                    <span className="text-[#8C98A6]">5 sections covering FCN, OS, Programming, DevOps, NDC, PKI, Forensics, and Audit.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0C1014] border border-[#1E2933]">
                  <Sparkles className="w-4 h-4 text-[#76B900] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Multi-Device Cloud Sync</span>
                    <span className="text-[#8C98A6]">Authenticate via GitHub, Google, or Email to keep your study record synchronized.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D1217] border border-[#1F2933] text-[11px] text-[#718092] font-mono space-y-1">
              <div className="flex justify-between items-center">
                <span>Identity Provider:</span>
                <span className="text-white font-semibold">Clerk Cloud</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Domain:</span>
                <span className="text-[#76B900]">cdacitissacademy.tech</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Authentication Mode:</span>
                <span className="text-white">OAuth & Passwordless</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clerk Form (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Segmented Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#121820] border border-[#232F3D] rounded-xl mb-6 w-full max-w-md">
              <button
                onClick={() => setMode('sign-in')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'sign-in'
                    ? 'bg-[#1D2733] text-white shadow-sm border border-[#76B900]/40 text-[#76B900]'
                    : 'text-[#8C98A6] hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('sign-up')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'sign-up'
                    ? 'bg-[#1D2733] text-white shadow-sm border border-[#76B900]/40 text-[#76B900]'
                    : 'text-[#8C98A6] hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Clerk Sign In / Sign Up Component */}
            <div className="w-full flex justify-center">
              {mode === 'sign-in' ? (
                <SignIn routing="hash" />
              ) : (
                <SignUp routing="hash" />
              )}
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

