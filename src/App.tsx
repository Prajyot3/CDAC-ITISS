import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/react';
import { Sidebar, NavItem } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { AllModulesView } from './components/modules/AllModulesView';
import { ModuleDetailView } from './components/modules/ModuleDetailView';
import { PracticeView } from './components/practice/PracticeView';
import { NotesView } from './components/notes/NotesView';
import { MockTestView } from './components/mock/MockTestView';
import { IncorrectQuestionsView } from './components/questions/IncorrectQuestionsView';
import { CorrectQuestionsView } from './components/questions/CorrectQuestionsView';
import { BookmarksView } from './components/questions/BookmarksView';
import { PerformanceView } from './components/performance/PerformanceView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthView } from './components/auth/AuthView';
import { AdminView } from './components/admin/AdminView';
import { AccessBlocked, AccessRestricted } from './components/common/AccessScreens';
import { useProgress } from './context/ProgressContext';
import { getTotalQuestionCount, getActiveModules, getQuestionCountForModule } from './data/moduleRegistry';
import { allowedTabs, canOpenModule, resolveAccess } from './lib/access';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItem>('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { setActiveModuleId } = useProgress();
  const { user } = useUser();
  const access = resolveAccess(user?.publicMetadata);
  const permittedTabs = allowedTabs(access.level);
  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() === 'pujariprajyot00@gmail.com';

  const tabBlocked = currentTab !== 'admin' && !permittedTabs.includes(currentTab);
  const moduleBlocked =
    currentTab === 'modules' && Boolean(selectedModuleId) && !canOpenModule(access.level, selectedModuleId as string);

  // Simple hash route listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;

      if (hash.startsWith('/modules/')) {
        const modSlug = hash.replace('/modules/', '');
        setSelectedModuleId(modSlug);
        setCurrentTab('modules');
      } else if (['sign-in', 'sign-up', 'auth'].includes(hash)) {
        setCurrentTab('auth');
        setSelectedModuleId(null);
      } else if (['dashboard', 'modules', 'notes', 'practice', 'mock', 'incorrect', 'correct', 'bookmarks', 'performance', 'settings', 'auth', 'admin'].includes(hash)) {
        setCurrentTab(hash as NavItem);
        setSelectedModuleId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTab = (tab: NavItem) => {
    setCurrentTab(tab);
    setSelectedModuleId(null);
    window.location.hash = tab;
  };

  const handleSelectModule = (modId: string) => {
    setSelectedModuleId(modId);
    setCurrentTab('modules');
    window.location.hash = `/modules/${modId}`;
    // Opening a module that has an imported bank makes it the active module for
    // Practice, Mock Tests and Performance.
    if (getQuestionCountForModule(modId) > 0) {
      setActiveModuleId(modId);
    }
  };

  const handleBackToModules = () => {
    setSelectedModuleId(null);
    window.location.hash = 'modules';
  };

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-[#F3F4F6] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          onToggleMobile={() => setIsMobileMenuOpen(prev => !prev)}
          onNavigateAuth={() => handleSelectTab('auth')}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {access.level === 'none' ? (
            <AccessBlocked />
          ) : tabBlocked || moduleBlocked ? (
            <AccessRestricted
              level={access.level}
              isAdmin={isAdmin}
              onBack={() => handleSelectTab('dashboard')}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  onNavigate={handleSelectTab}
                  onSelectModule={handleSelectModule}
                />
              )}

              {currentTab === 'modules' && (
                selectedModuleId ? (
                  <ModuleDetailView
                    moduleId={selectedModuleId}
                    onBack={handleBackToModules}
                    onNavigate={handleSelectTab}
                  />
                ) : (
                  <AllModulesView onSelectModule={handleSelectModule} />
                )
              )}

              {currentTab === 'practice' && <PracticeView />}

              {currentTab === 'notes' && <NotesView />}

              {currentTab === 'mock' && <MockTestView />}

              {currentTab === 'incorrect' && <IncorrectQuestionsView />}

              {currentTab === 'correct' && <CorrectQuestionsView />}

              {currentTab === 'bookmarks' && <BookmarksView />}

              {currentTab === 'performance' && (
                <PerformanceView onNavigate={handleSelectTab} />
              )}

              {currentTab === 'settings' && <SettingsView />}

              {currentTab === 'auth' && (
                <AuthView onNavigateToDashboard={() => handleSelectTab('dashboard')} />
              )}

              {currentTab === 'admin' && <AdminView />}
            </>
          )}
        </main>

        {/* Platform Footer */}
        <footer className="border-t border-[#19222B] py-6 px-4 md:px-8 text-center text-xs text-[#6B7888] font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#76B900]" />
              <span className="text-[#A2AFBD] font-sans font-medium">CDAC ITISS Preparation Platform</span>
              <span>• Version 1.0</span>
            </div>
            <div>
              <span>{getTotalQuestionCount()} Questions Verified • {getActiveModules().length} of 12 Modules Active</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
