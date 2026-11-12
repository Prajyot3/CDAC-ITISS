import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/react';
import { Shield, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthGateModal: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  // Don't render until Clerk is loaded or if already signed in
  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#070A0D]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300"
      style={{ touchAction: 'none' }}
    >
      <div className="relative w-full max-w-lg my-auto py-6">
        {/* Glow backdrop behind modal */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#76B900]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative bg-[#10171E] border border-[#232F3E] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16212B] border border-[#76B900]/40 text-[#76B900] text-[11px] font-mono font-semibold tracking-wider uppercase mb-1">
              <Shield className="w-3.5 h-3.5 fill-[#76B900]/20" />
              <span>CDAC ITISS Diploma • Student Access Gate</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-[#76B900]" />
              <span>Authentication Required</span>
            </h2>

            <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto leading-relaxed">
              Please sign in with your student account to unlock the full examination preparation platform, 309 verified MCQs, and 40-question mock exams.
            </p>
          </div>

          {/* Quick value props */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-[#0A0E12] border border-[#1C2632] text-center font-mono">
            <div>
              <span className="text-xs font-bold text-white block">309 MCQs</span>
              <span className="text-[10px] text-[#718092]">FCN Bank</span>
            </div>
            <div className="border-x border-[#1C2632]">
              <span className="text-xs font-bold text-[#76B900] block">40-Q Mock</span>
              <span className="text-[10px] text-[#718092]">Timed Exams</span>
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 block">12 Modules</span>
              <span className="text-[10px] text-[#718092]">Architecture</span>
            </div>
          </div>

          {/* Segmented Auth Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#0A0D10] border border-[#1E2936] rounded-xl">
            <button
              onClick={() => setAuthMode('sign-in')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'sign-in'
                  ? 'bg-[#18232F] text-white shadow-sm border border-[#76B900]/50 text-[#76B900]'
                  : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('sign-up')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'sign-up'
                  ? 'bg-[#18232F] text-white shadow-sm border border-[#76B900]/50 text-[#76B900]'
                  : 'text-[#8C98A6] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Embedded Clerk Component */}
          <div className="flex justify-center w-full">
            {authMode === 'sign-in' ? (
              <SignIn routing="hash" />
            ) : (
              <SignUp routing="hash" />
            )}
          </div>

          {/* Bottom Security Info */}
          <div className="text-center pt-2 border-t border-[#1B2530] text-[11px] text-[#637282] font-mono flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#76B900]" />
            <span>Secure 256-Bit SSL • Verified by Clerk Identity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
