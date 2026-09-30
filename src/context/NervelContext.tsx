import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TaskItem,
  TaskStatus,
  Transaction,
  OperatorNode,
  ActivityEvent,
  ViewMode,
  InputSourceType,
  Project,
  AppNotification,
  OperatorTab,
  OperatorWithdrawal,
  OnboardingStep,
  OnboardingStepId,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_OPERATOR_NODE,
  INITIAL_ACTIVITIES,
  INITIAL_PROJECTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPERATOR_WITHDRAWALS,
  INITIAL_ONBOARDING_STEPS,
} from '../data/initialData';
import { useRouter } from './RouterContext';
import { toast } from './ToastContext';

interface NervelContextType {
  // Navigation & View
  view: ViewMode;
  setView: (view: ViewMode) => void;
  operatorTab: OperatorTab;
  setOperatorTab: (tab: OperatorTab) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  navigateToTask: (id: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  navigateToProject: (id: string) => void;
  activeRole: 'customer' | 'operator';
  setActiveRole: (role: 'customer' | 'operator') => void;

  // Data
  tasks: TaskItem[];
  projects: Project[];
  transactions: Transaction[];
  operatorNode: OperatorNode;
  operatorWithdrawals: OperatorWithdrawal[];
  onboardingSteps: OnboardingStep[];
  activities: ActivityEvent[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  walletBalance: number; // Available
  reservedBalance: number; // Reserved

  // Notification Actions
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;

  // Modals
  isTopUpModalOpen: boolean;
  setIsTopUpModalOpen: (open: boolean) => void;

  // Actions
  createNewTask: (params: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    inputType: InputSourceType;
    repoUrl?: string;
    branch?: string;
    targetBranch?: string;
    uploadedFiles?: string[];
    modelId: string;
    modelName: string;
    isSystemRecommended: boolean;
    estimatedCost: number;
    reservedCap: number;
    reassignStrategy: 'ask_then_auto' | 'instant' | 'wait_forever';
    projectId?: string;
  }) => string;

  topUpWallet: (amountToman: number) => void;
  respondToWaitingWorker: (taskId: string, responseText: string) => void;
  triggerReassignNow: (taskId: string) => void;
  increaseTaskReserve: (taskId: string, additionalAmount: number) => boolean;
  resolveRepoAccess: (taskId: string) => void;
  fileTaskDispute: (taskId: string, reason: string) => void;
  cancelTask: (taskId: string) => void;
  simulateStateTransition: (taskId: string, newStatus: TaskStatus) => void;
  togglePinTask: (taskId: string) => void;
  retryPrCreation: (taskId: string) => void;

  // Project Actions
  togglePinProject: (id: string) => void;
  createProject: (params: {
    name: string;
    sourceType: InputSourceType;
    repoUrl?: string;
    defaultBranch?: string;
    zipFilename?: string;
    uploadedFilesCount?: number;
    instructions?: string;
  }) => string;
  updateProjectInstructions: (projectId: string, instructions: string) => void;
  updateProjectSettings: (projectId: string, updates: Partial<Project>) => void;

  // Operator Actions
  toggleOperatorStatus: () => void;
  setOperatorCapacityLimit: (limit: number) => void;
  requestOperatorWithdrawal: (amountToman: number, iban: string, bankName?: string) => boolean;
  runDiagnosticPing: () => void;
  runSandboxTest: () => void;
  runSystemHealthCheck: () => void;
  simulateHeartbeatProbeFail: () => void;
  resetHeartbeatHealth: () => void;
}

const NervelContext = createContext<NervelContextType | undefined>(undefined);

export const NervelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [view, setViewInternal] = useState<ViewMode>(() => router.parsedRoute.customerView || 'dashboard');
  const [operatorTab, setOperatorTabInternal] = useState<OperatorTab>(() => router.parsedRoute.operatorTab || 'overview');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(() => {
    if (router.parsedRoute.customerView === 'task_detail' && router.parsedRoute.paramId) {
      return router.parsedRoute.paramId;
    }
    return 'tsk_8f920a1';
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    if (router.parsedRoute.customerView === 'project_detail' && router.parsedRoute.paramId) {
      return router.parsedRoute.paramId;
    }
    return 'prj_payment_gw';
  });
  const [activeRole, setActiveRole] = useState<'customer' | 'operator'>(() =>
    router.parsedRoute.workspace === 'operator' ? 'operator' : 'customer'
  );

  // Synchronize route changes from router into context state
  useEffect(() => {
    if (router.parsedRoute.workspace === 'operator') {
      setActiveRole('operator');
      setViewInternal('operator');
      if (router.parsedRoute.operatorTab) {
        setOperatorTabInternal(router.parsedRoute.operatorTab);
      }
    } else {
      setActiveRole('customer');
      if (router.parsedRoute.customerView) {
        setViewInternal(router.parsedRoute.customerView);
      }
      if (router.parsedRoute.paramId) {
        if (router.parsedRoute.customerView === 'task_detail') {
          setSelectedTaskId(router.parsedRoute.paramId);
        } else if (router.parsedRoute.customerView === 'project_detail') {
          setSelectedProjectId(router.parsedRoute.paramId);
        }
      }
    }
  }, [router.parsedRoute]);

  const setView = (v: ViewMode) => {
    setViewInternal(v);
    if (v === 'dashboard') router.navigate('/dashboard');
    else if (v === 'projects') router.navigate('/projects');
    else if (v === 'project_detail') router.navigate(`/projects/${selectedProjectId || 'prj_payment_gw'}`);
    else if (v === 'tasks_list') router.navigate('/tasks');
    else if (v === 'new_task') router.navigate('/tasks/new');
    else if (v === 'task_detail') router.navigate(`/tasks/${selectedTaskId || 'tsk_8f920a1'}`);
    else if (v === 'wallet') router.navigate('/wallet');
    else if (v === 'settings') router.navigate('/settings');
    else if (v === 'operator') router.navigate('/operator');
  };

  const setOperatorTab = (tab: OperatorTab) => {
    setOperatorTabInternal(tab);
    if (tab === 'overview') router.navigate('/operator');
    else if (tab === 'active_jobs') router.navigate('/operator/jobs');
    else if (tab === 'history') router.navigate('/operator/history');
    else if (tab === 'worker') router.navigate('/operator/worker');
    else if (tab === 'earnings') router.navigate('/operator/earnings');
    else if (tab === 'withdrawals') router.navigate('/operator/withdrawals');
    else if (tab === 'settings') router.navigate('/operator/settings');
  };

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [operatorNode, setOperatorNode] = useState<OperatorNode>(INITIAL_OPERATOR_NODE);
  const [operatorWithdrawals, setOperatorWithdrawals] = useState<OperatorWithdrawal[]>(INITIAL_OPERATOR_WITHDRAWALS);
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(INITIAL_ONBOARDING_STEPS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const [walletBalance, setWalletBalance] = useState<number>(540000);
  const [reservedBalance, setReservedBalance] = useState<number>(200000); // 120000 for tsk_8f920a1 + 80000 for tsk_7b319c4

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);

  const navigateToTask = (id: string) => {
    setSelectedTaskId(id);
    router.navigate(`/tasks/${id}`);
  };

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    router.navigate(`/projects/${id}`);
  };

  const togglePinProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const createProject = (params: {
    name: string;
    sourceType: InputSourceType;
    repoUrl?: string;
    defaultBranch?: string;
    zipFilename?: string;
    uploadedFilesCount?: number;
    instructions?: string;
  }) => {
    const newId = `prj_${Math.random().toString(36).substring(2, 9)}`;
    const now = '۱۴۰۵/۰۷/۰۱ - ۱۲:۳۰';

    const newProject: Project = {
      id: newId,
      name: params.name,
      sourceType: params.sourceType,
      repoUrl: params.repoUrl,
      defaultBranch: params.defaultBranch || 'main',
      zipFilename: params.zipFilename,
      uploadedFilesCount: params.uploadedFilesCount,
      instructions: params.instructions || '',
      isPinned: false,
      createdAt: now,
      lastActivityAt: now,
    };

    setProjects((prev) => [newProject, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۳۰:۰۰',
        category: 'system',
        title: 'ایجاد پروژه پایدار جدید',
        description: `پروژه "${params.name}" با اتصال به ${params.repoUrl || 'سورس فایل'} ایجاد شد.`,
      },
      ...prev,
    ]);

    setSelectedProjectId(newId);
    toast.success('پروژه با موفقیت ایجاد شد', {
      description: `پروژه "${params.name}" آماده ثبت و اجرای تسک‌های مهندسی است.`,
    });
    router.navigate(`/projects/${newId}`);
    return newId;
  };

  const updateProjectInstructions = (projectId: string, instructions: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, instructions, lastActivityAt: 'هم‌اکنون' }
          : p
      )
    );
    toast.success('دستورالعمل‌های پروژه ذخیره شد');
  };

  const updateProjectSettings = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, ...updates, lastActivityAt: 'هم‌اکنون' }
          : p
      )
    );
    toast.success('تنظیمات پروژه با موفقیت ذخیره شد');
  };

  // Create new task
  const createNewTask = (params: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    inputType: InputSourceType;
    repoUrl?: string;
    branch?: string;
    targetBranch?: string;
    uploadedFiles?: string[];
    modelId: string;
    modelName: string;
    isSystemRecommended: boolean;
    estimatedCost: number;
    reservedCap: number;
    reassignStrategy: 'ask_then_auto' | 'instant' | 'wait_forever';
    projectId?: string;
  }) => {
    const newId = `tsk_${Math.random().toString(36).substring(2, 9)}`;
    const now = '۱۴۰۵/۰۷/۰۱ - ۱۲:۱۵';

    // Reserve cap from wallet
    setWalletBalance((prev) => prev - params.reservedCap);
    setReservedBalance((prev) => prev + params.reservedCap);

    // Record reserve transaction
    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      type: 'reserve',
      amount: -params.reservedCap,
      date: now,
      title: `رزرو سقف اعتبار تسک ${params.title.substring(0, 24)}...`,
      taskId: newId,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newTask: TaskItem = {
      id: newId,
      projectId: params.projectId,
      title: params.title,
      description: params.description,
      acceptanceCriteria: params.acceptanceCriteria,
      inputType: params.inputType,
      repoUrl: params.repoUrl,
      branch: params.branch,
      targetBranch: params.targetBranch,
      uploadedFiles: params.uploadedFiles,
      modelId: params.modelId,
      modelName: params.modelName,
      isSystemRecommended: params.isSystemRecommended,
      status: 'queued',
      createdAt: now,
      updatedAt: now,
      estimatedCost: params.estimatedCost,
      reservedCap: params.reservedCap,
      logs: [
        {
          id: `l_${Date.now()}`,
          timestamp: '12:15:00',
          level: 'info',
          message: `Task created. Reserved cap: ${params.reservedCap.toLocaleString()} Toman. Placed in scheduling queue.`,
        },
      ],
    };

    setTasks((prev) => [newTask, ...prev]);

    // Add activity
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۱۵:۰۰',
        category: 'task',
        title: 'ثبت تسک جدید در شبکه',
        description: `تسک "${params.title}" با سقف ${params.reservedCap.toLocaleString()} تومان ایجاد شد.`,
        taskId: newId,
      },
      ...prev,
    ]);

    setSelectedTaskId(newId);
    if (params.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === params.projectId
            ? { ...p, lastActivityAt: 'هم‌اکنون' }
            : p
        )
      );
    }
    toast.success('تسک با موفقیت ثبت شد', {
      description: `تسک "${params.title}" در صف زمان‌بندی و اختصاص به ورکر قرار گرفت.`,
    });
    router.navigate(`/tasks/${newId}`);
    return newId;
  };

  // Top up wallet
  const topUpWallet = (amountToman: number) => {
    if (amountToman < 50000) return;

    setWalletBalance((prev) => prev + amountToman);

    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      type: 'topup',
      amount: amountToman,
      date: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۰',
      title: 'شارژ آنلاین کیف پول',
      status: 'completed',
      trackingCode: `TRK_${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۰:۰۰',
        category: 'wallet',
        title: 'شارژ موفق کیف پول',
        description: `مبلغ ${amountToman.toLocaleString()} تومان به موجودی آزاد اضافه گردید.`,
      },
      ...prev,
    ]);

    toast.success('افزایش موجودی با موفقیت انجام شد', {
      description: `مبلغ ${amountToman.toLocaleString('fa-IR')} تومان به کیف پول افزوده شد.`,
    });
  };

  // Customer responds to worker prompt
  const respondToWaitingWorker = (taskId: string, responseText: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'running',
            updatedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۲',
            actionRequired: undefined,
            waitingData: task.waitingData
              ? { ...task.waitingData, customerResponse: responseText }
              : undefined,
            logs: [
              ...task.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:22:10',
                level: 'info',
                message: `Customer response submitted: "${responseText.substring(0, 40)}..."`,
              },
              {
                id: `l_${Date.now() + 1}`,
                timestamp: '12:22:15',
                level: 'step',
                message: 'Worker received customer clarification. Resuming execution in sandbox container.',
              },
            ],
          };
        }
        return task;
      })
    );

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۲:۱۰',
        category: 'task',
        title: 'ارسال پاسخ به ورکر',
        description: `پاسخ شما برای تسک ${taskId} ثبت و اجرای ورکر ادامه یافت.`,
        taskId,
      },
      ...prev,
    ]);

    toast.info('پاسخ ابهام ارسال شد', {
      description: 'ورکر پاسخ را دریافت کرد و ادامه اجرای کد را پیگیری می‌کند.',
    });
  };

  // Trigger immediate reassignment
  const triggerReassignNow = (taskId: string) => {
    const newWorkerId = 'wrk_ir_isf_09';
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'running',
            workerId: newWorkerId,
            workerHostname: 'node-worker-isf-09',
            actionRequired: undefined,
            reassignData: undefined,
            updatedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۵',
            logs: [
              ...task.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:25:00',
                level: 'step',
                message: `Reassignment approved. Workspace transferred securely to ${newWorkerId}. Resuming from last verified checkpoint.`,
              },
            ],
          };
        }
        return task;
      })
    );

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۵:۰۰',
        category: 'system',
        title: 'انتقال موفق به ورکر جدید',
        description: `تسک ${taskId} بدون اتلاف پیشرفت به ورکر ${newWorkerId} واگذار شد.`,
        taskId,
      },
      ...prev,
    ]);

    toast.info('انتقال ورکر تایید شد', {
      description: `تسک بدون وقفه به گره ${newWorkerId} واگذار گردید.`,
    });
  };

  // Increase task reserve cap when reserve limit is reached
  const increaseTaskReserve = (taskId: string, additionalAmount: number): boolean => {
    if (walletBalance < additionalAmount) {
      setIsTopUpModalOpen(true);
      return false;
    }

    setWalletBalance((prev) => prev - additionalAmount);
    setReservedBalance((prev) => prev + additionalAmount);

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            reservedCap: task.reservedCap + additionalAmount,
            status: 'running',
            actionRequired: undefined,
            updatedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۶',
            logs: [
              ...task.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:26:00',
                level: 'info',
                message: `Customer approved reserve increase: +${additionalAmount.toLocaleString()} Toman. New cap: ${(task.reservedCap + additionalAmount).toLocaleString()} Toman. Execution resumed.`,
              },
            ],
          };
        }
        return task;
      })
    );

    const reserveTx: Transaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      type: 'reserve',
      amount: -additionalAmount,
      date: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۶',
      title: 'افزایش سقف رزرو اعتبار تسک',
      taskId,
      status: 'completed',
    };
    setTransactions((prev) => [reserveTx, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۶:۰۰',
        category: 'wallet',
        title: 'افزایش سقف رزرو تسک',
        description: `مبلغ ${additionalAmount.toLocaleString()} تومان به سقف تسک ${taskId} افزوده و فرآیند اجرا ادامه یافت.`,
        taskId,
      },
      ...prev,
    ]);

    toast.success('سقف رزرو تسک افزایش یافت', {
      description: `مبلغ ${additionalAmount.toLocaleString('fa-IR')} تومان به سقف تسک افزوده شد.`,
    });

    return true;
  };

  // Resolve repo access issue
  const resolveRepoAccess = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: 'running',
            actionRequired: undefined,
            updatedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۷',
            logs: [
              ...task.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:27:00',
                level: 'step',
                message: 'Repository access credentials refreshed and verified. Worker resuming git push / sync operations.',
              },
            ],
          };
        }
        return task;
      })
    );

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۷:۰۰',
        category: 'task',
        title: 'تایید دسترسی مخزن گیت',
        description: `دسترسی مخزن برای تسک ${taskId} به‌روزرسانی و اجرای ورکر از سر گرفته شد.`,
        taskId,
      },
      ...prev,
    ]);

    toast.success('دسترسی مخزن تایید شد', {
      description: 'ورکر عملیات همگام‌سازی و اعمال تغییرات گیت را آغاز کرد.',
    });
  };

  // File dispute
  const fileTaskDispute = (taskId: string, reason: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            dispute: {
              reason,
              submittedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۲۸',
              status: 'pending',
            },
            logs: [
              ...task.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:28:00',
                level: 'warn',
                message: `Dispute filed by client: "${reason.substring(0, 50)}...". Flagged for QA technical review.`,
              },
            ],
          };
        }
        return task;
      })
    );

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۲۸:۰۰',
        category: 'task',
        title: 'ثبت اعتراض فنی',
        description: `اعتراض فنی برای تسک ${taskId} به صف بررسی کارشناسان ارسال شد.`,
        taskId,
      },
      ...prev,
    ]);
  };

  // Cancel task with fixed billing logic:
  // - Before execution: release full reservation.
  // - After execution has started: charge actual consumed usage, release only unused reservation.
  const cancelTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const executionStarted = task.status !== 'queued';
    const now = '۱۴۰۵/۰۷/۰۱ - ۱۲:۳۰';

    if (!executionStarted) {
      // Before execution: release full reservation
      setReservedBalance((prev) => Math.max(0, prev - task.reservedCap));
      setWalletBalance((prev) => prev + task.reservedCap);

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'cancelled',
              actualCost: 0,
              actionRequired: undefined,
              updatedAt: now,
              logs: [
                ...t.logs,
                {
                  id: `l_${Date.now()}`,
                  timestamp: '12:30:00',
                  level: 'warn',
                  message: `Task cancelled before execution started. Reserved cap (${task.reservedCap.toLocaleString()} Toman) released in full to available balance.`,
                },
              ],
            };
          }
          return t;
        })
      );

      const refundTx: Transaction = {
        id: `tx_${Math.random().toString(36).substring(2, 9)}`,
        type: 'refund',
        amount: task.reservedCap,
        date: now,
        title: 'آزادسازی کامل سقف رزرو به دلیل لغو تسک قبل از شروع اجرا',
        taskId,
        status: 'completed',
      };
      setTransactions((prev) => [refundTx, ...prev]);

      setActivities((prev) => [
        {
          id: `act_${Date.now()}`,
          timestamp: '۱۲:۳۰:۰۰',
          category: 'task',
          title: 'لغو تسک پیش از اجرا',
          description: `تسک "${task.title}" لغو شد و کل مبلغ رزرو (${task.reservedCap.toLocaleString()} تومان) آزاد شد.`,
          taskId,
        },
        ...prev,
      ]);

      toast.success('تسک با موفقیت لغو شد', {
        description: `کل سقف رزرو (${task.reservedCap.toLocaleString('fa-IR')} تومان) به کیف پول بازگردانده شد.`,
      });
    } else {
      // After execution has started: charge actual consumed usage, release only unused reservation
      let consumedUsage = task.actualCost;
      if (!consumedUsage) {
        if (task.tokenStats) {
          const inputCost = Math.round((task.tokenStats.inputTokens / 1000) * 14);
          const cachedCost = Math.round((task.tokenStats.cachedTokens / 1000) * 4);
          const outputCost = Math.round((task.tokenStats.outputTokens / 1000) * 38);
          consumedUsage = Math.min(task.reservedCap, inputCost + cachedCost + outputCost + 20000);
        } else {
          consumedUsage = Math.min(task.reservedCap, Math.round(task.estimatedCost * 0.45));
        }
      }
      consumedUsage = Math.min(task.reservedCap, Math.max(10000, consumedUsage));
      const unusedReservation = Math.max(0, task.reservedCap - consumedUsage);

      // Deduct reservedCap from reservedBalance
      setReservedBalance((prev) => Math.max(0, prev - task.reservedCap));
      // Release only unused portion back to available balance (consumedUsage was charged)
      setWalletBalance((prev) => prev + unusedReservation);

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'cancelled',
              actualCost: consumedUsage,
              actionRequired: undefined,
              updatedAt: now,
              logs: [
                ...t.logs,
                {
                  id: `l_${Date.now()}`,
                  timestamp: '12:30:00',
                  level: 'warn',
                  message: `Task cancelled by customer after execution started. Consumed usage: ${consumedUsage.toLocaleString()} Toman charged. Unused reservation: ${unusedReservation.toLocaleString()} Toman released to wallet.`,
                },
              ],
            };
          }
          return t;
        })
      );

      const chargeTx: Transaction = {
        id: `tx_${Math.random().toString(36).substring(2, 9)}`,
        type: 'charge',
        amount: -consumedUsage,
        date: now,
        title: 'تسویه هزینه پردازش انجام‌شده تا زمان لغو تسک',
        taskId,
        status: 'completed',
      };

      const releaseTx: Transaction = {
        id: `tx_${Math.random().toString(36).substring(2, 9)}`,
        type: 'refund',
        amount: unusedReservation,
        date: now,
        title: 'آزادسازی باقیمانده سقف رزرو پس از لغو تسک',
        taskId,
        status: 'completed',
      };

      setTransactions((prev) => [releaseTx, chargeTx, ...prev]);

      setActivities((prev) => [
        {
          id: `act_${Date.now()}`,
          timestamp: '۱۲:۳۰:۰۰',
          category: 'task',
          title: 'لغو تسک حین اجرا و تسویه مصرف',
          description: `تسک "${task.title}" متوقف شد. مبلغ ${consumedUsage.toLocaleString()} تومان هزینه مصرفی کسر و ${unusedReservation.toLocaleString()} تومان باقیمانده رزرو آزاد شد.`,
          taskId,
        },
        ...prev,
      ]);

      toast.success('تسک متوقف و تسویه شد', {
        description: `هزینه پردازش (${consumedUsage.toLocaleString('fa-IR')} تومان) کسر و باقیمانده (${unusedReservation.toLocaleString('fa-IR')} تومان) آزاد گردید.`,
      });
    }
  };

  // Simulator helper: lets user test any state transition on the active task
  const simulateStateTransition = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: TaskItem = { ...t, status: newStatus, updatedAt: 'اکنون' };
          if (newStatus === 'waiting_for_customer' && !updated.waitingData) {
            updated.waitingData = {
              question: 'آیا برای پیکربندی دیتابیس در محیط تست، متغیر DB_CONNECTION_TIMEOUT مقدار پیش‌فرض ۳۰ ثانیه باقی بماند؟',
              askedAt: 'لحظاتی قبل',
              expiresAt: 'مهلت ۲۴ ساعت',
            };
          }
          if (newStatus === 'reassigning' && !updated.reassignData) {
            updated.reassignData = {
              failedWorkerId: t.workerId || 'wrk_ir_shz_02',
              reason: '۳ درخواست پایش وضعیت متوالی بی‌پاسخ ماند (قطع اتصال ورکر)',
              missedHeartbeats: 3,
              secondsLeftBeforeAuto: 240,
            };
          }
          if (newStatus === 'completed' && !updated.deliverables) {
            updated.actualCost = Math.round(t.estimatedCost * 0.9);
            updated.deliverables = {
              prUrl: 'https://github.com/parsa-tech/payment-gateway-service/pull/49',
              patchFilename: `nervel_patch_${taskId}.patch`,
              zipFilename: 'nervel_deliverable.zip',
            };
            updated.qaReport = {
              filesChangedCount: 3,
              buildStatus: 'passed',
              testStatus: 'passed',
              testSummary: 'تمام تست‌های واحد با موفقیت پاس شدند.',
              lintStatus: 'passed',
              changedFiles: [
                {
                  filename: 'src/payment/gateway.ts',
                  additions: 42,
                  deletions: 6,
                  status: 'modified',
                },
                {
                  filename: 'tests/payment.spec.ts',
                  additions: 68,
                  deletions: 0,
                  status: 'added',
                },
              ],
            };
          }
          return updated;
        }
        return t;
      })
    );
  };

  // Operator Actions
  const toggleOperatorStatus = () => {
    setOperatorNode((prev) => {
      const nextStatus = prev.status === 'online' ? 'offline' : 'online';
      if (nextStatus === 'online') {
        toast.success('گره ورکر فعال شد', 'آماده دریافت و اجرای کانتینرهای کدنویسی.');
      } else {
        toast.warning('گره ورکر موقتاً متوقف شد', 'تسک جدیدی به این گره واگذار نخواهد شد.');
      }
      return {
        ...prev,
        status: nextStatus,
        lastHeartbeat: nextStatus === 'online' ? 'لحظاتی قبل' : 'متوقف شده توسط کاربر',
        lastHeartbeatSecondsAgo: nextStatus === 'online' ? 2 : 120,
        missedHeartbeats: nextStatus === 'online' ? 0 : 3,
      };
    });
  };

  const setOperatorCapacityLimit = (limit: number) => {
    setOperatorNode((prev) => ({
      ...prev,
      operatorCapacityLimit: Math.min(prev.maxAllowedCapacity, Math.max(1, limit)),
    }));
  };

  const requestOperatorWithdrawal = (amountToman: number, iban: string, bankName?: string) => {
    if (amountToman < 500000 || amountToman > operatorNode.withdrawableBalanceToman) {
      return false;
    }

    const newWithdrawal: OperatorWithdrawal = {
      id: `wdr_${Math.floor(10000 + Math.random() * 90000)}`,
      amount: amountToman,
      iban,
      bankName: bankName || (iban.startsWith('IR12') ? 'بانک پاسارگاد' : 'بانک مقصد'),
      requestedAt: 'هم‌اکنون',
      status: 'pending_review',
      note: 'در نوبت پردازش دستی (حداکثر ۲۴ ساعت کاری)',
    };

    setOperatorWithdrawals((prev) => [newWithdrawal, ...prev]);

    setOperatorNode((prev) => ({
      ...prev,
      withdrawableBalanceToman: prev.withdrawableBalanceToman - amountToman,
    }));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: 'هم‌اکنون',
        category: 'worker',
        title: 'ثبت درخواست تسویه اپراتور',
        description: `درخواست تسویه ${amountToman.toLocaleString('fa-IR')} تومان به شماره شبا ${iban} ثبت شد و در چرخه بررسی دستی ۲۴ ساعته قرار گرفت.`,
      },
      ...prev,
    ]);

    toast.success('درخواست تسویه با موفقیت ثبت شد', {
      description: 'درخواست شما در نوبت بررسی ۲۴ ساعته و حواله پایا قرار گرفت.',
    });

    return true;
  };

  const runDiagnosticPing = () => {
    setOperatorNode((prev) => ({
      ...prev,
      latencyMs: Math.floor(21 + Math.random() * 8),
      lastHeartbeat: 'هم‌اکنون (پینگ تایید شد)',
      lastHeartbeatSecondsAgo: 0,
      missedHeartbeats: 0,
      status: 'online',
    }));
  };

  const runSandboxTest = () => {
    setOperatorNode((prev) => ({
      ...prev,
      dockerStatus: 'healthy',
      isolationType: 'container_gvisor (تست موفق)',
    }));
  };

  const runSystemHealthCheck = () => {
    setOperatorNode((prev) => ({
      ...prev,
      dockerStatus: 'healthy',
      latencyMs: 22,
      lastHeartbeat: 'هم‌اکنون (سلامت کامل)',
      lastHeartbeatSecondsAgo: 0,
      missedHeartbeats: 0,
    }));
  };

  const simulateHeartbeatProbeFail = () => {
    setOperatorNode((prev) => {
      const nextFails = Math.min(3, prev.missedHeartbeats + 1);
      return {
        ...prev,
        missedHeartbeats: nextFails,
        status: nextFails >= 3 ? 'offline' : prev.status,
        lastHeartbeat: `${nextFails} تلاش بی‌پاسخ مانده است`,
      };
    });
  };

  const resetHeartbeatHealth = () => {
    setOperatorNode((prev) => ({
      ...prev,
      status: 'online',
      missedHeartbeats: 0,
      lastHeartbeat: 'هم‌اکنون (بازیابی شد)',
      lastHeartbeatSecondsAgo: 2,
    }));
  };

  const togglePinTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const retryPrCreation = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            deliverables: {
              ...(t.deliverables || {}),
              prFailed: false,
              prUrl: `https://github.com/${t.repoUrl || 'parsa-tech/payment-gateway-service'}/pull/${Math.floor(100 + Math.random() * 900)}`,
            },
            logs: [
              ...t.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: 'لحظاتی قبل',
                level: 'success' as const,
                message: 'Platform retry succeeded: Pull Request created successfully via GitHub API without additional cost.',
              },
            ],
          };
        }
        return t;
      })
    );
  };

  return (
    <NervelContext.Provider
      value={{
        view,
        setView,
        operatorTab,
        setOperatorTab,
        selectedTaskId,
        setSelectedTaskId,
        navigateToTask,
        selectedProjectId,
        setSelectedProjectId,
        navigateToProject,
        activeRole,
        setActiveRole,
        tasks,
        projects,
        transactions,
        operatorNode,
        operatorWithdrawals,
        onboardingSteps,
        activities,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        walletBalance,
        reservedBalance,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        createNewTask,
        topUpWallet,
        respondToWaitingWorker,
        triggerReassignNow,
        increaseTaskReserve,
        resolveRepoAccess,
        fileTaskDispute,
        cancelTask,
        simulateStateTransition,
        togglePinTask,
        retryPrCreation,
        togglePinProject,
        createProject,
        updateProjectInstructions,
        updateProjectSettings,
        toggleOperatorStatus,
        setOperatorCapacityLimit,
        requestOperatorWithdrawal,
        runDiagnosticPing,
        runSandboxTest,
        runSystemHealthCheck,
        simulateHeartbeatProbeFail,
        resetHeartbeatHealth,
      }}
    >
      {children}
    </NervelContext.Provider>
  );
};

export const useNervel = () => {
  const context = useContext(NervelContext);
  if (!context) {
    throw new Error('useNervel must be used within a NervelProvider');
  }
  return context;
};
