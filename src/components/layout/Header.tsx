import React from 'react';
import { Menu, ShieldCheck, LogIn, UserCheck } from 'lucide-react';
import { Show, UserButton } from '@clerk/react';
import { useProgress } from '../../context/ProgressContext';
import { ITISS_MODULES } from '../../config/modules';

interface HeaderProps {
  onToggleMobile: () => void;
  onOpenAudit: () => void;
  onNavigateAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleMobile, 
  onOpenAudit,
  onNavigateAuth 
}) => {
  const { activeModuleId, getOverallStats } = useProgress();
  const stats = getOverallStats();

  const currentModule = ITISS_MODULES.find(m => m.id === activeModuleId) || ITISS_MODULES[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0E1317]/95 backdrop-blur-md border-b border-[#1F2933] px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile toggle + Module pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#18232C] md:hidden transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141C23] border border-[#232F3B]">
            <span className="text-[11px] text-[#8A97A7] uppercase font-mono font-medium">Exam:</span>
            <span className="text-xs font-semibold text-white">CDAC ITISS Diploma</span>
          </div>

          {/* Module Selector Pill */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151E27] border border-[#76B900]/30 hover:border-[#76B900] text-xs font-medium text-white transition-all cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-[#76B900] animate-pulse" />
              <span className="max-w-[140px] md:max-w-[220px] truncate">{currentModule.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Real Activity Stats + Audit Button + Clerk Auth */}
      <div className="flex items-center gap-3">
        {/* Quick activity badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-md bg-[#131A21] border border-[#232E3A] flex items-center gap-1.5">
            <span className="text-[#8794A3]">Attempted:</span>
            <span className="text-white font-semibold">{stats.attempted}</span>
            <span className="text-[#556372]">/ {stats.totalAvailable}</span>
          </div>
          <div className="px-3 py-1 rounded-md bg-[#131A21] border border-[#232E3A] flex items-center gap-1.5">
            <span className="text-[#8794A3]">Accuracy:</span>
            <span className={`font-semibold ${stats.accuracy >= 60 ? 'text-[#76B900]' : stats.accuracy > 0 ? 'text-amber-400' : 'text-[#8794A3]'}`}>
              {stats.accuracy}%
            </span>
          </div>
        </div>

        {/* Audit Report Button */}
        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162028] hover:bg-[#1C2833] border border-[#2A3848] hover:border-[#76B900] text-xs font-medium text-[#C4CDD6] hover:text-white transition-all shadow-sm"
          title="Open Extraction Audit Report"
        >
          <ShieldCheck className="w-4 h-4 text-[#76B900]" />
          <span className="hidden sm:inline">Extraction Audit</span>
          <span className="text-[10px] px-1 rounded bg-[#76B900]/20 text-[#76B900] font-mono">309 MCQs</span>
        </button>

        {/* Clerk Auth Integration */}
        <div className="flex items-center pl-2 border-l border-[#1F2933]">
          <Show when="signed-out">
            <button 
              onClick={onNavigateAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#76B900] hover:bg-[#68a500] text-black font-semibold text-xs transition-all shadow-sm shadow-[#76B900]/20 hover:scale-[1.02] active:scale-[0.98]"
              title="Sign in or Register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-8 h-8 border border-[#76B900]/60 hover:border-[#76B900] transition-colors rounded-full ring-2 ring-[#76B900]/20',
                  }
                }}
              />
              {onNavigateAuth && (
                <button
                  onClick={onNavigateAuth}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141C24] hover:bg-[#1A2530] border border-[#243240] text-[11px] text-[#A2AFBD] hover:text-white font-medium transition-colors"
                  title="View Student Account Dashboard"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#76B900]" />
                  <span>Account</span>
                </button>
              )}
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};
