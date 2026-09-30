import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ViewMode, OperatorTab } from '../types';

export type WorkspaceType = 'landing' | 'customer' | 'operator';

export interface ParsedRoute {
  workspace: WorkspaceType;
  pathname: string;
  // Customer route details
  customerView?: ViewMode;
  paramId?: string;
  // Operator route details
  operatorTab?: OperatorTab;
}

export function parseRoute(path: string): ParsedRoute {
  const cleanPath = path.split('?')[0].split('#')[0] || '/';

  if (cleanPath === '/' || cleanPath === '' || cleanPath === '/landing') {
    return {
      workspace: 'landing',
      pathname: cleanPath || '/',
    };
  }

  if (cleanPath.startsWith('/operator')) {
    const sub = cleanPath.replace('/operator', '').replace(/^\//, '');
    let tab: OperatorTab = 'overview';
    if (sub === 'jobs') tab = 'active_jobs';
    else if (sub === 'history') tab = 'history';
    else if (sub === 'worker') tab = 'worker';
    else if (sub === 'earnings') tab = 'earnings';
    else if (sub === 'withdrawals') tab = 'withdrawals';
    else if (sub === 'settings') tab = 'settings';
    else tab = 'overview';

    return {
      workspace: 'operator',
      pathname: cleanPath,
      operatorTab: tab,
    };
  }

  let view: ViewMode = 'dashboard';
  let paramId: string | undefined;

  if (cleanPath === '/dashboard') {
    view = 'dashboard';
  } else if (cleanPath === '/projects') {
    view = 'projects';
  } else if (cleanPath.startsWith('/projects/')) {
    view = 'project_detail';
    paramId = cleanPath.replace('/projects/', '');
  } else if (cleanPath === '/tasks') {
    view = 'tasks_list';
  } else if (cleanPath === '/tasks/new') {
    view = 'new_task';
  } else if (cleanPath.startsWith('/tasks/')) {
    view = 'task_detail';
    paramId = cleanPath.replace('/tasks/', '');
  } else if (cleanPath === '/wallet') {
    view = 'wallet';
  } else if (cleanPath === '/settings') {
    view = 'settings';
  } else {
    view = 'dashboard';
  }

  return {
    workspace: 'customer',
    pathname: cleanPath,
    customerView: view,
    paramId,
  };
}

interface RouterContextType {
  pathname: string;
  workspace: WorkspaceType;
  parsedRoute: ParsedRoute;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  switchToWorkspace: (targetWorkspace: WorkspaceType) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname;
      return initialPath || '/';
    }
    return '/';
  });

  // Keep window.history in sync if initial path was empty
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.location.pathname) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, []);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const current = window.location.pathname || '/';
      setPathname(current);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const normalizedTo = to.startsWith('/') ? to : `/${to}`;
    if (typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState(null, '', normalizedTo);
      } else if (window.location.pathname !== normalizedTo) {
        window.history.pushState(null, '', normalizedTo);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    setPathname(normalizedTo);
  }, []);

  const switchToWorkspace = useCallback(
    (targetWorkspace: WorkspaceType) => {
      if (targetWorkspace === 'landing') {
        navigate('/');
      } else if (targetWorkspace === 'customer') {
        navigate('/dashboard');
      } else {
        navigate('/operator');
      }
    },
    [navigate]
  );

  const parsedRoute = parseRoute(pathname);

  return (
    <RouterContext.Provider
      value={{
        pathname,
        workspace: parsedRoute.workspace,
        parsedRoute,
        navigate,
        switchToWorkspace,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
