import React, { useState } from 'react';
import { useNervel } from '../../context/NervelContext';
import { AppNotification, NotificationType } from '../../types';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FolderGit2,
  RefreshCw,
  Wallet,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    navigateToTask,
    setView,
    setIsTopUpModalOpen,
  } = useNervel();

  const [filterMode, setFilterMode] = useState<'all' | 'needs_action' | 'unread'>('all');

  if (!isOpen) return null;

  // Filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filterMode === 'needs_action') return notif.isActionRequired;
    if (filterMode === 'unread') return !notif.isRead;
    return true;
  });

  const needsActionCount = notifications.filter((n) => n.isActionRequired).length;

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    onClose();

    if (notif.taskId) {
      navigateToTask(notif.taskId);
    } else if (notif.type === 'wallet_issue') {
      setView('wallet');
      setIsTopUpModalOpen(true);
    } else if (notif.type === 'repo_access_issue') {
      setView('settings');
    } else if (notif.type === 'dispute_update') {
      setView('wallet');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-[#10B981]" />;
      case 'customer_input_required':
        return <AlertCircle className="w-4 h-4 text-[#7C3AED]" />;
      case 'reserve_limit_reached':
        return <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />;
      case 'worker_failure':
        return <AlertTriangle className="w-4 h-4 text-[#EF4444]" />;
      case 'reassignment':
        return <RefreshCw className="w-4 h-4 text-[#A1A1AA]" />;
      case 'repo_access_issue':
        return <FolderGit2 className="w-4 h-4 text-[#EF4444]" />;
      case 'dispute_update':
        return <ShieldAlert className="w-4 h-4 text-[#3B82F6]" />;
      case 'wallet_issue':
        return <Wallet className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Bell className="w-4 h-4 text-[#71717A]" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Sliding in from Left in RTL so it feels natural alongside user chrome) */}
      <aside
        aria-label="مرکز اعلانات"
        className="fixed inset-y-0 left-0 z-50 w-full sm:w-[440px] bg-[#09090C] border-r border-[#1E1E22] flex flex-col shadow-2xl animate-nervel-enter text-right text-sm"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1A1A1E] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#7C3AED]" />
            <span className="font-bold text-base text-[#F4F4F5]">
              مرکز اعلانات و رویدادها
            </span>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs font-medium text-[#7C3AED] bg-[#7C3AED]/15 px-2 py-0.5 rounded-full tabular-nums">
                {unreadNotificationsCount} جدید
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#141418] transition-colors"
            aria-label="بستن اعلانات"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Segmented Controls */}
        <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-[#16161A] flex items-center justify-between gap-2 flex-wrap text-sm">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              همه ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('needs_action')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                filterMode === 'needs_action'
                  ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              <span>نیازمند اقدام</span>
              {needsActionCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unread')}
              className={`px-3 py-1 rounded transition-colors ${
                filterMode === 'unread'
                  ? 'bg-[#18181D] text-[#F4F4F5] font-medium'
                  : 'text-[#71717A] hover:text-[#D4D4D8]'
              }`}
            >
              خوانده‌نشده
            </button>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="text-xs text-[#A1A1AA] hover:text-[#F4F4F5] flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>خواندن همه</span>
            </button>
          )}
        </div>

        {/* Chronological Notification Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#141418] p-2 sm:p-3">
          {filteredNotifications.length === 0 ? (
            <div className="py-20 text-center text-sm text-[#71717A] space-y-2">
              <Bell className="w-6 h-6 mx-auto text-[#2E2E34]" />
              <p>هیچ اعلانی در این بخش وجود ندارد.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-lg transition-colors group relative ${
                  !notif.isRead ? 'bg-[#0E0E12]' : 'hover:bg-[#0D0D11]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-0.5 shrink-0 p-1.5 rounded bg-[#141419] border border-[#222228]">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium leading-tight ${
                        !notif.isRead ? 'text-[#F4F4F5]' : 'text-[#D4D4D8]'
                      }`}>
                        {notif.title}
                      </span>
                      <span className="text-xs text-[#71717A] shrink-0 tabular-nums">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-[#A1A1AA] leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action Bar */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      {notif.actionLabel ? (
                        <button
                          type="button"
                          onClick={() => handleActionClick(notif)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#7C3AED] hover:text-[#9055FF] transition-colors"
                        >
                          <span>{notif.actionLabel}</span>
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      ) : notif.taskId ? (
                        <button
                          type="button"
                          onClick={() => handleActionClick(notif)}
                          className="text-xs text-[#7C3AED] hover:underline"
                          dir="ltr"
                        >
                          تسک: {notif.taskId}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            type="button"
                            onClick={() => markNotificationAsRead(notif.id)}
                            title="علامت‌گذاری به عنوان خوانده شده"
                            className="p-1 rounded text-[#71717A] hover:text-[#F4F4F5] hover:bg-[#1A1A22]"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => dismissNotification(notif.id)}
                          title="حذف اعلان"
                          className="p-1 rounded text-[#71717A] hover:text-[#EF4444] hover:bg-[#1A1A22]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unread dot */}
                {!notif.isRead && (
                  <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-[#16161A] bg-[#070709] text-xs text-[#71717A] flex items-center justify-between">
          <span>اعلانات نیازمند اقدام پس از پاسخگویی بایگانی می‌شوند.</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              setView('settings');
            }}
            className="text-[#71717A] hover:text-[#D4D4D8] underline underline-offset-2"
          >
            تنظیمات اعلان
          </button>
        </div>
      </aside>
    </>
  );
};
