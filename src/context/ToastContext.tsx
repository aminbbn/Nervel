import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  description?: string;
  action?: ToastAction;
  duration?: number; // ms, default 3000ms
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  action?: ToastAction;
  duration: number;
  createdAt: number;
  isExiting?: boolean;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, title: string, options?: ToastOptions | string) => string;
  dismissToast: (id: string) => void;
  toast: {
    success: (title: string, options?: ToastOptions | string) => string;
    error: (title: string, options?: ToastOptions | string) => string;
    warning: (title: string, options?: ToastOptions | string) => string;
    info: (title: string, options?: ToastOptions | string) => string;
    dismiss: (id?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global dispatcher so non-React/outside-hook code can also trigger toasts cleanly
type ToastDispatcher = (type: ToastType, title: string, options?: ToastOptions | string) => string;
type DismissDispatcher = (id?: string) => void;

let globalShowToast: ToastDispatcher = () => '';
let globalDismissToast: DismissDispatcher = () => {};

export const toast = {
  success: (title: string, options?: ToastOptions | string) =>
    globalShowToast('success', title, options),
  error: (title: string, options?: ToastOptions | string) =>
    globalShowToast('error', title, options),
  warning: (title: string, options?: ToastOptions | string) =>
    globalShowToast('warning', title, options),
  info: (title: string, options?: ToastOptions | string) =>
    globalShowToast('info', title, options),
  dismiss: (id?: string) => globalDismissToast(id),
};

const DEFAULT_DURATION = 3000;
const MAX_VISIBLE_TOASTS = 3;
const EXIT_ANIMATION_DURATION = 120; // ms, guarantees 100ms keyframe finishes before DOM removal

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToastImmediately = useCallback((id: string) => {
    const existingTimeout = timeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissToast = useCallback((id: string) => {
    // Clear auto-dismiss timer if running
    const existingTimeout = timeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      timeoutsRef.current.delete(id);
    }

    // Set isExiting flag to trigger the exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // Safety fallback: remove from state after exit animation completes (120ms)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_DURATION);
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions | string): string => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const normalizedOptions: ToastOptions =
        typeof options === 'string' ? { description: options } : options || {};

      const duration = normalizedOptions.duration ?? DEFAULT_DURATION;

      const newToast: ToastItem = {
        id,
        type,
        title,
        description: normalizedOptions.description,
        action: normalizedOptions.action,
        duration,
        createdAt: Date.now(),
        isExiting: false,
      };

      setToasts((prev) => {
        // Enforce max visible toasts: if we already have >= MAX_VISIBLE_TOASTS,
        // mark the oldest non-exiting toast to exit
        const activeToasts = prev.filter((t) => !t.isExiting);
        if (activeToasts.length >= MAX_VISIBLE_TOASTS) {
          const oldest = activeToasts[0];
          setTimeout(() => dismissToast(oldest.id), 0);
        }
        return [...prev, newToast];
      });

      // If duration is greater than 0, schedule automatic dismissal
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutsRef.current.set(id, timer);
      }

      return id;
    },
    [dismissToast]
  );

  // Sync global dispatchers
  useEffect(() => {
    globalShowToast = showToast;
    globalDismissToast = (id?: string) => {
      if (id) {
        dismissToast(id);
      } else {
        // Dismiss all
        setToasts((prev) =>
          prev.map((t) => ({ ...t, isExiting: true }))
        );
        setTimeout(() => setToasts([]), EXIT_ANIMATION_DURATION);
      }
    };

    return () => {
      globalShowToast = () => '';
      globalDismissToast = () => {};
    };
  }, [showToast, dismissToast]);

  const toastMethods = {
    success: (title: string, options?: ToastOptions | string) =>
      showToast('success', title, options),
    error: (title: string, options?: ToastOptions | string) =>
      showToast('error', title, options),
    warning: (title: string, options?: ToastOptions | string) =>
      showToast('warning', title, options),
    info: (title: string, options?: ToastOptions | string) =>
      showToast('info', title, options),
    dismiss: (id?: string) => {
      if (id) dismissToast(id);
      else {
        setToasts((prev) => prev.map((t) => ({ ...t, isExiting: true })));
        setTimeout(() => setToasts([]), EXIT_ANIMATION_DURATION);
      }
    },
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        toast: toastMethods,
      }}
    >
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissToast}
        onDismissComplete={removeToastImmediately}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ============================================================================
// Viewport & Single Toast Component
// Renders strictly at the BOTTOM LEFT of the viewport
// Minimal, refined, quiet NERVEL design language
// ============================================================================
interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  onDismissComplete: (id: string) => void;
}

const ToastViewport: React.FC<ToastViewportProps> = ({
  toasts,
  onDismiss,
  onDismissComplete,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-[340px] w-[calc(100vw-2.5rem)] sm:w-auto pointer-events-none select-none"
      dir="rtl"
      aria-label="اعلان‌های سیستم"
    >
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          item={item}
          onDismiss={onDismiss}
          onDismissComplete={onDismissComplete}
        />
      ))}
    </div>
  );
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
  onDismissComplete: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  item,
  onDismiss,
  onDismissComplete,
}) => {
  const isError = item.type === 'error';

  // Small, refined semantic icon - subtle color on icon only
  let iconNode = <Info className="h-3.5 w-3.5 text-[#A855F7] shrink-0" />;

  if (item.type === 'success') {
    iconNode = <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />;
  } else if (item.type === 'error') {
    iconNode = <AlertCircle className="h-3.5 w-3.5 text-[#EF4444] shrink-0" />;
  } else if (item.type === 'warning') {
    iconNode = <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />;
  }

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      tabIndex={-1}
      onAnimationEnd={() => {
        if (item.isExiting) {
          onDismissComplete(item.id);
        }
      }}
      className={`pointer-events-auto w-auto min-w-[230px] max-w-[320px] sm:max-w-[340px] bg-[#0D0D10]/95 backdrop-blur-md border border-[#222226] rounded-md shadow-lg shadow-black/40 px-3 py-2 sm:px-3 sm:py-2.5 flex items-start justify-between gap-2.5 text-right focus:outline-none transition-colors ${
        item.isExiting ? 'animate-toast-exit' : 'animate-toast-enter'
      }`}
    >
      {/* Semantic Icon + Compact Content */}
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <div className="mt-0.5">{iconNode}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-[13px] font-medium text-[#F4F4F5] leading-snug">
            {item.title}
          </div>
          {item.description && (
            <p className="text-[11px] sm:text-xs text-[#A1A1AA] mt-0.5 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}
          {item.action && (
            <div className="mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action?.onClick();
                  onDismiss(item.id);
                }}
                className="text-[11px] font-medium text-[#A855F7] hover:text-[#C084FC] hover:underline cursor-pointer transition-colors"
              >
                [{item.action.label}]
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Close Button */}
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="p-0.5 -mr-0.5 text-[#52525B] hover:text-[#A1A1AA] rounded transition-colors cursor-pointer shrink-0"
        aria-label="بستن اعلان"
      >
        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      </button>
    </div>
  );
};
