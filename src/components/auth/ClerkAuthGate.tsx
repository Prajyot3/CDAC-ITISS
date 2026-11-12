import React, { useState, useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { 
  Shield, 
  Lock, 
  BookOpen, 
  Award, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const ClerkAuthGate: React.FC = () => {
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>(
    window.location.hash === '#sign-up' ? 'sign-up' : 'sign-in'
  );

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#sign-up') {
        setAuthMode('sign-up');
      } else if (window.location.hash === '#sign-in' || window.location.hash === '#auth') {
        setAuthMode('sign-in');
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleModeSwitch = (mode: 'sign-in' | 'sign-up') => {
    setAuthMode(mode);
    window.location.hash = mode;
  };

  return (
    <div className="min-h-screen bg-[#070A0D] text-[#F3F4F6] flex flex-col justify-between selection:bg-[#76B900] selection:text-black">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#1A232E] bg-[#0C1116]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#141C24] border border-[#76B900]/40 flex items-center justify-center text-[#76B900] shadow-[0_0_15px_rgba(118,185,0,0.15)]">
              <Shield className="w-5 h-5 fill-[#76B900]/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  CDAC ITISS ACADEMY
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30">
                  DIPLOMA 2026
                </span>
              </div>
              <p className="text-[11px] text-[#718092] font-mono leading-none">
                Official Examination Preparation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111820] border border-[#232F3D] text-[11px] font-mono text-[#8C98A6]">
              <Lock className="w-3.5 h-3.5 text-[#76B900]" />
              <span className="hidden sm:inline">Clerk Auth Gate</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Auth Gate Body */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#76B900]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Platform Presentation & Value Pillars (7 cols on lg) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A22] border border-[#76B900]/40 text-[#76B900] text-xs font-mono font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTHENTICATION GATEWAY</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#76B900] via-[#94E016] to-[#A3E635]">
                  CDAC ITISS Success
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl">
                Access the complete 309-question verified bank, timed mock examination simulator, and curriculum architecture. Sign in with your student account to sync progress and save mock exam scores.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0E141B] border border-[#1C2632] space-y-1.5 hover:border-[#76B900]/50 transition-colors">
                <div className="flex items-center gap-2 text-[#76B900]">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase">309 Verified MCQs</span>
                </div>
                <p className="text-xs text-[#7E8B9B] leading-relaxed">
                  Extracted from official modules FCN01 to FCN05 with exact line provenance and explanation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141B] border border-[#1C2632] space-y-1.5 hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase">Timed Mock Tests</span>
                </div>
                <p className="text-xs text-[#7E8B9B] leading-relaxed">
                  40-question randomized examination simulator with 60-minute timer and instant grading.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141B] border border-[#1C2632] space-y-1.5 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase">12 Module Syllabus</span>
                </div>
                <p className="text-xs text-[#7E8B9B] leading-relaxed">
                  Comprehensive coverage of Fundamentals, OS, Forensics, PKI, DevOps, and Audit standards.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0E141B] border border-[#1C2632] space-y-1.5 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center gap-2 text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono tracking-wider uppercase">Cloud Sync</span>
                </div>
                <p className="text-xs text-[#7E8B9B] leading-relaxed">
                  Saved test attempts, question bookmarks, and performance statistics across all devices.
                </p>
              </div>
            </div>

            {/* Trust Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#6B7888] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                Clerk Identity Protected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                Zero Setup Fee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                Instant Access
              </span>
            </div>
          </div>

          {/* Right Column: Clerk Native Auth Component (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md bg-[#10171E] border border-[#232F3E] rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/80 space-y-5">
              
              {/* Gate Notice Header */}
              <div className="text-center space-y-1 border-b border-[#1C2733] pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16212B] border border-[#76B900]/40 text-[#76B900] text-[11px] font-mono font-bold tracking-wider uppercase mb-1">
                  <Lock className="w-3 h-3 text-[#76B900]" />
                  <span>Student Authentication</span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {authMode === 'sign-in' ? 'Sign In to Your Account' : 'Create Student Account'}
                </h2>
                <p className="text-xs text-[#8C98A6]">
                  {authMode === 'sign-in' 
                    ? 'Enter your credentials to unlock the learning workspace' 
                    : 'Register for full access to mock tests and question banks'}
                </p>
              </div>

              {/* Segmented Mode Selector */}
              <div className="flex items-center gap-1 p-1 bg-[#0A0D10] border border-[#1E2936] rounded-xl">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('sign-in')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'sign-in'
                      ? 'bg-[#18232F] text-white shadow-sm border border-[#76B900]/50 text-[#76B900]'
                      : 'text-[#8C98A6] hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('sign-up')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'sign-up'
                      ? 'bg-[#18232F] text-white shadow-sm border border-[#76B900]/50 text-[#76B900]'
                      : 'text-[#8C98A6] hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Embedded Clerk Component */}
              <div className="flex justify-center w-full min-h-[380px] overflow-hidden">
                {authMode === 'sign-in' ? (
                  <SignIn routing="hash" />
                ) : (
                  <SignUp routing="hash" />
                )}
              </div>

              {/* Security Footnote */}
              <div className="pt-3 border-t border-[#1B2530] text-center">
                <div className="text-[11px] text-[#637282] font-mono flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>256-Bit SSL Encryption • Clerk Identity System</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#19222B] py-5 px-4 text-center text-xs text-[#6B7888] font-mono bg-[#0A0D10]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#76B900]" />
            <span className="text-[#A2AFBD] font-sans font-medium">CDAC ITISS Preparation Platform</span>
            <span>• Built with Clerk Auth</span>
          </div>
          <div>
            <span>Official Domain: cdacitissacademy.tech</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
