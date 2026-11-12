import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  Bookmark, 
  BarChart3, 
  Settings,
  Shield,
  ChevronRight,
  LogIn
} from 'lucide-react';
import { Show, SignInButton, UserButton, useUser } from '@clerk/react';
import { useProgress } from '../../context/ProgressContext';

export type NavItem = 
  | 'dashboard' 
  | 'modules' 
  | 'practice' 
  | 'mock' 
  | 'incorrect' 
  | 'bookmarks' 
  | 'performance' 
  | 'settings';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const UserSidebarProfile: React.FC = () => {
  const { user } = useUser();
  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || 'ITISS Scholar';

  return (
    <div className="flex items-center gap-2.5">
      <UserButton 
        appearance={{
          elements: {
            userButtonAvatarBox: 'w-7 h-7 border border-[#76B900]/60 rounded-full ring-2 ring-[#76B900]/20',
          }
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-white truncate">
          {displayName}
        </div>
        <div className="text-[10px] text-[#76B900] flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
          <span>Clerk Verified</span>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const { bookmarks, attempts, activeModuleId } = useProgress();

  const incorrectCount = Object.values(attempts).filter(
    a => a.moduleId === activeModuleId && !a.isCorrect
  ).length;

  const bookmarkCount = bookmarks.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'modules', label: 'All ITISS Modules', icon: Layers, badge: '5 Sections' },
    { id: 'practice', label: 'Practice MCQs', icon: BookOpen },
    { id: 'mock', label: 'Mock Tests', icon: Clock, badge: '40 Q' },
    { id: 'incorrect', label: 'Incorrect Questions', icon: AlertCircle, count: incorrectCount },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarkCount },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id as NavItem);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0E1317] border-r border-[#1F2933] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#1F2933] bg-[#0A0D10]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#141C22] border border-[#76B900]/40 flex items-center justify-center text-[#76B900] shadow-[0_0_12px_rgba(118,185,0,0.2)]">
              <Shield className="w-5 h-5 fill-[#76B900]/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-wider text-white">CDAC ITISS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#76B900]" />
              </div>
              <div className="text-[11px] text-[#7E8B9B] tracking-tight">Exam Prep Platform</div>
            </div>
          </div>
        </div>

        {/* Active Module Indicator Card */}
        <div className="p-3 mx-3 mt-3 rounded-lg bg-[#141C24] border border-[#232F3B]">
          <div className="flex items-center justify-between text-[11px] text-[#8C98A6] mb-1">
            <span className="font-mono uppercase tracking-wider">Active Module</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#76B900] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#76B900] animate-pulse" />
              READY
            </span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            Fundamentals of Networks
          </div>
          <div className="text-[11px] text-[#76B900] font-mono mt-0.5">
            FCN • 120 Hours
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#18232D] text-white border border-[#76B900]/40 shadow-[0_0_12px_rgba(118,185,0,0.1)]'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#141A20] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#76B900]' : 'text-[#6C7989]'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C2732] text-[#8B98A7] border border-[#263544]">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                      item.id === 'incorrect' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : 'bg-[#76B900]/10 text-[#76B900] border border-[#76B900]/20'
                    }`}>
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#76B900]" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Account / Clerk State in Sidebar */}
        <div className="p-3 border-t border-[#1F2933] bg-[#0B0F13]">
          <Show when="signed-in">
            <UserSidebarProfile />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#141C24] hover:bg-[#18232D] border border-[#232F3D] hover:border-[#76B900] text-xs font-medium text-white transition-all shadow-sm">
                <LogIn className="w-3.5 h-3.5 text-[#76B900]" />
                <span>Sign In with Clerk</span>
              </button>
            </SignInButton>
          </Show>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#1F2933] bg-[#0A0D10] text-[11px] text-[#6E7B8B] space-y-1">
          <div className="flex justify-between items-center font-mono">
            <span>Modules Active:</span>
            <span className="text-[#76B900] font-semibold">1 / 12</span>
          </div>
          <div className="flex justify-between items-center font-mono">
            <span>Bank Status:</span>
            <span className="text-white">309 MCQs</span>
          </div>
        </div>
      </aside>
    </>
  );
};
