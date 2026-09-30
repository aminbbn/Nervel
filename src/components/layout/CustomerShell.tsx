import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { CustomerSidebar } from './CustomerSidebar';
import { CustomerTopBar } from './CustomerTopBar';
import { WorkspaceContainer } from './WorkspaceContainer';
import { TopUpModal } from '../common/TopUpModal';
import { CustomerDashboard } from '../dashboard/CustomerDashboard';
import { ProjectsView } from '../projects/ProjectsView';
import { ProjectDetailView } from '../projects/ProjectDetailView';
import { CreateTaskView } from '../tasks/CreateTaskView';
import { TaskDetailView } from '../tasks/TaskDetailView';
import { TasksListView } from '../tasks/TasksListView';
import { WalletView } from '../wallet/WalletView';
import { SettingsView } from '../settings/SettingsView';

const CustomerMainContent: React.FC = () => {
  const { parsedRoute } = useRouter();
  const view = parsedRoute.customerView || 'dashboard';

  return (
    <WorkspaceContainer>
      {view === 'dashboard' && <CustomerDashboard />}
      {view === 'projects' && <ProjectsView />}
      {view === 'project_detail' && <ProjectDetailView />}
      {view === 'new_task' && <CreateTaskView />}
      {view === 'tasks_list' && <TasksListView />}
      {view === 'task_detail' && <TaskDetailView />}
      {view === 'wallet' && <WalletView />}
      {view === 'settings' && <SettingsView />}
    </WorkspaceContainer>
  );
};

export const CustomerShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-[#050506] text-[#F4F4F5] flex selection:bg-[#7C3AED]/25 selection:text-[#F4F4F5]">
      
      {/* Customer Sidebar (Primary Navigation) */}
      <CustomerSidebar
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace (Fills available width after 256px right sidebar) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:mr-64 transition-all">
        
        {/* Customer Top Utility Bar */}
        <CustomerTopBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic View Workspace */}
        <main className="flex-1 w-full bg-[#050506]">
          <CustomerMainContent />
        </main>

      </div>

      {/* TopUp Modal */}
      <TopUpModal />
    </div>
  );
};
