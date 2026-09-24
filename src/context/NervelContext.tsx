import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TaskItem,
  TaskStatus,
  Transaction,
  OperatorNode,
  ActivityEvent,
  ViewMode,
  InputSourceType,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_OPERATOR_NODE,
  INITIAL_ACTIVITIES,
} from '../data/initialData';

interface NervelContextType {
  // Navigation & View
  view: ViewMode;
  setView: (view: ViewMode) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  navigateToTask: (id: string) => void;
  activeRole: 'customer' | 'operator';
  setActiveRole: (role: 'customer' | 'operator') => void;

  // Data
  tasks: TaskItem[];
  transactions: Transaction[];
  operatorNode: OperatorNode;
  activities: ActivityEvent[];
  walletBalance: number; // Available
  reservedBalance: number; // Reserved

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
  }) => string;

  topUpWallet: (amountToman: number) => void;
  respondToWaitingWorker: (taskId: string, responseText: string) => void;
  triggerReassignNow: (taskId: string) => void;
  fileTaskDispute: (taskId: string, reason: string) => void;
  cancelTask: (taskId: string) => void;
  simulateStateTransition: (taskId: string, newStatus: TaskStatus) => void;

  // Operator Actions
  toggleOperatorStatus: () => void;
  setOperatorCapacityLimit: (limit: number) => void;
  requestOperatorWithdrawal: (amountToman: number, iban: string) => boolean;
}

const NervelContext = createContext<NervelContextType | undefined>(undefined);

export const NervelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>('tsk_8f920a1');
  const [activeRole, setActiveRole] = useState<'customer' | 'operator'>('customer');

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [operatorNode, setOperatorNode] = useState<OperatorNode>(INITIAL_OPERATOR_NODE);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  const [walletBalance, setWalletBalance] = useState<number>(540000);
  const [reservedBalance, setReservedBalance] = useState<number>(200000); // 120000 for tsk_8f920a1 + 80000 for tsk_7b319c4

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);

  const navigateToTask = (id: string) => {
    setSelectedTaskId(id);
    setView('task_detail');
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
    setView('task_detail');
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

  // Cancel task
  const cancelTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Refund reserved balance
    setReservedBalance((prev) => Math.max(0, prev - task.reservedCap));
    setWalletBalance((prev) => prev + task.reservedCap);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'cancelled',
            updatedAt: '۱۴۰۵/۰۷/۰۱ - ۱۲:۳۰',
            logs: [
              ...t.logs,
              {
                id: `l_${Date.now()}`,
                timestamp: '12:30:00',
                level: 'warn',
                message: `Task cancelled by customer. Reserved cap (${task.reservedCap.toLocaleString()} Toman) refunded in full.`,
              },
            ],
          };
        }
        return t;
      })
    );

    const newTx: Transaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      type: 'refund',
      amount: task.reservedCap,
      date: '۱۴۰۵/۰۷/۰۱ - ۱۲:۳۰',
      title: 'بازگشت وجه سقف رزرو به دلیل لغو تسک',
      taskId,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);
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
    setOperatorNode((prev) => ({
      ...prev,
      status: prev.status === 'online' ? 'offline' : 'online',
    }));
  };

  const setOperatorCapacityLimit = (limit: number) => {
    setOperatorNode((prev) => ({
      ...prev,
      operatorCapacityLimit: Math.min(prev.maxAllowedCapacity, Math.max(1, limit)),
    }));
  };

  const requestOperatorWithdrawal = (amountToman: number, iban: string) => {
    if (amountToman < 500000 || amountToman > operatorNode.withdrawableBalanceToman) {
      return false;
    }

    setOperatorNode((prev) => ({
      ...prev,
      withdrawableBalanceToman: prev.withdrawableBalanceToman - amountToman,
    }));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        timestamp: '۱۲:۳۵:۰۰',
        category: 'worker',
        title: 'درخواست برداشت اپراتور',
        description: `درخواست تسویه ${amountToman.toLocaleString()} تومان به شماره شبا ${iban} ثبت شد (پردازش دستی ظرف حداکثر ۲۴ ساعت).`,
      },
      ...prev,
    ]);

    return true;
  };

  return (
    <NervelContext.Provider
      value={{
        view,
        setView,
        selectedTaskId,
        setSelectedTaskId,
        navigateToTask,
        activeRole,
        setActiveRole,
        tasks,
        transactions,
        operatorNode,
        activities,
        walletBalance,
        reservedBalance,
        isTopUpModalOpen,
        setIsTopUpModalOpen,
        createNewTask,
        topUpWallet,
        respondToWaitingWorker,
        triggerReassignNow,
        fileTaskDispute,
        cancelTask,
        simulateStateTransition,
        toggleOperatorStatus,
        setOperatorCapacityLimit,
        requestOperatorWithdrawal,
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
