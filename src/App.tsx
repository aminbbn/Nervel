import React, { useState } from 'react';
import { NervelProvider, useNervel } from './context/NervelContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { TopUpModal } from './components/common/TopUpModal';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { CreateTaskView } from './components/tasks/CreateTaskView';
import { TaskDetailView } from './components/tasks/TaskDetailView';
import { TasksListView } from './components/tasks/TasksListView';
import { WalletView } from './components/wallet/WalletView';
import { ActivityView } from './components/activity/ActivityView';
import { SettingsView } from './components/settings/SettingsView';
import { OperatorView } from './components/operator/OperatorView';

const MainContent: React.FC = () => {
  const { view } = useNervel();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-16">
      {view === 'dashboard' && <CustomerDashboard />}
      {view === 'new_task' && <CreateTaskView />}
      {view === 'tasks_list' && <TasksListView />}
      {view === 'task_detail' && <TaskDetailView />}
      {view === 'wallet' && <WalletView />}
      {view === 'activity' && <ActivityView />}
      {view === 'settings' && <SettingsView />}
      {view === 'operator' && <OperatorView />}
    </div>
  );
};

const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-[#020202] text-[#F4F4F5] flex selection:bg-[#7C3AED]/30 selection:text-[#F4F4F5]">
      
      {/* Persistent RTL Sidebar on Right */}
      <Sidebar
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Control Plane Workspace (Offset by sidebar width on desktop) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:mr-64">
        
        {/* Utility Top Bar */}
        <TopBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic View Workspace */}
        <main className="flex-1 w-full">
          <MainContent />
        </main>

        {/* Minimal Engineering Utility Footer */}
        <footer className="border-t border-[#17171A] bg-[#020202] py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#71717A]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#8E8E93] tracking-wide text-xs">NERVEL</span>
              <span>— پلتفرم توزیع‌شده اجرای تسک‌های مهندسی نرم‌افزار</span>
            </div>
            <div className="flex items-center gap-3 text-xs" dir="ltr">
              <span className="text-[#34D399]">Operational</span>
              <span className="text-[#27272A]">·</span>
              <span>parsa-tech</span>
              <span className="text-[#27272A]">·</span>
              <span className="tabular-nums">v0.3.0</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modal Dialogs */}
      <TopUpModal />
    </div>
  );
};

export default function App() {
  return (
    <NervelProvider>
      <AppShell />
    </NervelProvider>
  );
}
