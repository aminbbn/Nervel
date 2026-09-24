export type TaskStatus =
  | 'queued'
  | 'assigning'
  | 'running'
  | 'waiting_for_customer'
  | 'validating'
  | 'reassigning'
  | 'completed'
  | 'cancelled';

export type InputSourceType = 'github' | 'zip' | 'direct';

export interface ChangedFile {
  filename: string;
  additions: number;
  deletions: number;
  status: 'modified' | 'added' | 'deleted';
  diffContent?: string;
}

export interface QaReport {
  filesChangedCount: number;
  buildStatus: 'passed' | 'failed' | 'skipped';
  testStatus: 'passed' | 'failed' | 'skipped';
  testSummary?: string;
  lintStatus: 'passed' | 'failed' | 'skipped';
  changedFiles: ChangedFile[];
}

export interface TaskLog {
  id: string;
  timestamp: string;
  level: 'info' | 'step' | 'warn' | 'success';
  message: string;
}

export interface TaskItem {
  id: string; // e.g. tsk_9f4b82
  title: string;
  description: string;
  acceptanceCriteria: string[];
  inputType: InputSourceType;
  repoUrl?: string;
  branch?: string;
  targetBranch?: string;
  uploadedFiles?: string[];
  
  // AI Model
  modelId: string;
  modelName: string;
  isSystemRecommended: boolean;
  
  // State & Timing
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // Financials (in Toman)
  estimatedCost: number;
  reservedCap: number;
  actualCost?: number;
  tokenStats?: {
    inputTokens: number;
    cachedTokens: number;
    outputTokens: number;
  };

  // Worker Infrastructure
  workerId?: string;
  workerHostname?: string;
  workerPlan?: string;

  // Waiting for response state
  waitingData?: {
    question: string;
    askedAt: string;
    customerResponse?: string;
    expiresAt: string; // 24h limit
  };

  // Reassignment state (worker offline)
  reassignData?: {
    failedWorkerId: string;
    reason: string;
    missedHeartbeats: number; // e.g. 3 of 3
    secondsLeftBeforeAuto: number; // 5 min default fallback
  };

  // QA & Output
  qaReport?: QaReport;
  deliverables?: {
    prUrl?: string;
    patchFilename?: string;
    zipFilename?: string;
  };

  // Dispute / Objection
  dispute?: {
    reason: string;
    submittedAt: string;
    status: 'pending' | 'reviewed' | 'resolved';
  };

  logs: TaskLog[];
}

export interface Transaction {
  id: string; // tx_...
  type: 'topup' | 'reserve' | 'settlement' | 'refund';
  amount: number; // in Toman
  date: string;
  title: string;
  taskId?: string;
  status: 'completed' | 'pending' | 'failed';
  trackingCode?: string;
}

export interface OperatorNode {
  workerId: string;
  status: 'online' | 'busy' | 'offline';
  hostname: string;
  os: string;
  daemonVersion: string;
  codexPlan: string;
  maxAllowedCapacity: number;
  currentAssignedCount: number;
  operatorCapacityLimit: number;
  totalEarningsToman: number;
  withdrawableBalanceToman: number;
  uptimeRate: number; // e.g. 99.8
  totalJobsExecuted: number;
  lastHeartbeat: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  category: 'task' | 'wallet' | 'worker' | 'system';
  title: string;
  description: string;
  taskId?: string;
  metadata?: string;
}

export type ViewMode =
  | 'dashboard'
  | 'new_task'
  | 'tasks_list'
  | 'task_detail'
  | 'wallet'
  | 'activity'
  | 'settings'
  | 'operator';
