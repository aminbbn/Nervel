import React, { useState } from 'react';
import { OperatorSidebar } from './OperatorSidebar';
import { OperatorTopBar } from './OperatorTopBar';
import { WorkspaceContainer } from './WorkspaceContainer';
import { OperatorWorkspace } from '../operator/OperatorWorkspace';
import { TopUpModal } from '../common/TopUpModal';

export const OperatorShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-[#050506] text-[#F4F4F5] flex selection:bg-[#7C3AED]/25 selection:text-[#F4F4F5]">
      
      {/* Operator Sidebar (The ONLY primary navigation mechanism) */}
      <OperatorSidebar
        isOpenOnMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace (Fills available width after 256px right sidebar) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:mr-64 transition-all">
        
        {/* Simplified Operator Top Utility Bar */}
        <OperatorTopBar onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Operator View Workspace */}
        <main className="flex-1 w-full bg-[#050506]">
          <WorkspaceContainer>
            <OperatorWorkspace />
          </WorkspaceContainer>
        </main>

      </div>

      {/* TopUp Modal */}
      <TopUpModal />
    </div>
  );
};
