import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ToastProvider } from './context/ToastContext';
import { NervelProvider } from './context/NervelContext';
import { CustomerShell } from './components/layout/CustomerShell';
import { OperatorShell } from './components/layout/OperatorShell';
import { LandingShell } from './components/landing/LandingShell';

const AppWorkspaceDispatcher: React.FC = () => {
  const { workspace } = useRouter();

  if (workspace === 'landing') {
    return <LandingShell />;
  }

  if (workspace === 'operator') {
    return <OperatorShell />;
  }

  return <CustomerShell />;
};

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <NervelProvider>
          <AppWorkspaceDispatcher />
        </NervelProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
