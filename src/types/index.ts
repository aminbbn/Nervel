export type TaskStatus =
  | 'queued'
  | 'assigning'
  | 'running'
  | 'waiting_for_customer'
  | 'validating'
  | 'reassigning'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type InputSourceType = 'github' | 'zip' | 'direct';

export type ActionRequiredType =
  | 'clarification'
  | 'increase_reserve'
  | 'worker_reassignment'
  | 'repo_access';

export interface TaskActionRequired {
  type: ActionRequiredType;
  title: string;
  description: string;
  actionLabel: string;
  createdAt: string;
  expiresAt?: string;
  question?: string;
  customerResponse?: string;
  failedWorkerId?: string;
  reason?: string;
  missedHeartbeats?: number;
  secondsLeftBeforeAuto?: number;
  requiredReserveAmount?: number;
  missingPermissions?: string[];
}

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
  projectId?: string;
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

  // Generalized Action Required Structure (clarification, increase_reserve, worker_reassignment, repo_access)
  actionRequired?: TaskActionRequired;

  // Backward compatibility fields
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
    prFailed?: boolean;
    prErrorReason?: string;
  };

  // Dispute / Objection
  dispute?: {
    reason: string;
    submittedAt: string;
    status: 'pending' | 'reviewed' | 'resolved';
  };

  isPinned?: boolean;
  logs: TaskLog[];
}

export interface Transaction {
  id: string; // tx_...
  type: 'topup' | 'reserve' | 'release' | 'charge' | 'settlement' | 'refund';
  amount: number; // in Toman
  date: string;
  title: string;
  taskId?: string;
  status: 'completed' | 'pending' | 'failed';
  trackingCode?: string;
}

export type NotificationType =
  | 'task_completed'
  | 'customer_input_required'
  | 'reserve_limit_reached'
  | 'worker_failure'
  | 'reassignment'
  | 'repo_access_issue'
  | 'dispute_update'
  | 'wallet_issue';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isActionRequired?: boolean;
  taskId?: string;
  actionLabel?: string;
}

export type OperatorTab =
  | 'overview'
  | 'active_jobs'
  | 'history'
  | 'worker'
  | 'earnings'
  | 'withdrawals'
  | 'settings';

export interface OperatorWithdrawal {
  id: string; // e.g. wdr_81920
  amount: number;
  iban: string;
  bankName?: string;
  requestedAt: string;
  status: 'pending_review' | 'processing_paya' | 'completed' | 'rejected';
  processedAt?: string;
  trackingCode?: string;
  note?: string;
}

export type OnboardingStepId =
  | 'register'
  | 'download_agent'
  | 'install'
  | 'pair_auth'
  | 'detect_provider'
  | 'system_health'
  | 'connectivity_test'
  | 'sandbox_check'
  | 'worker_online';

export interface OnboardingStep {
  id: OnboardingStepId;
  stepNumber: number;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  details?: string;
}

export interface OperatorNode {
  workerId: string;
  status: 'online' | 'busy' | 'offline';
  hostname: string;
  os: string;
  daemonVersion: string;
  activeProvider: string;
  providerPlan: string;
  codexPlan: string;
  remainingProviderQuotaPercent: number;
  supportedModels: string[];
  maxAllowedCapacity: number; // system maximum determined by plan, models, resources, reliability
  currentAssignedCount: number;
  operatorCapacityLimit: number; // voluntary chosen concurrency
  totalEarningsToman: number;
  withdrawableBalanceToman: number;
  settledEarningsToman: number;
  uptimeRate: number; // e.g. 99.8
  totalJobsExecuted: number;
  lastHeartbeat: string;
  lastHeartbeatSecondsAgo: number;
  missedHeartbeats: number;
  latencyMs: number;
  dockerStatus: 'healthy' | 'degraded' | 'offline';
  isolationType: string;
  cpuCores: number;
  memoryGb: number;
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

export interface Project {
  id: string; // e.g. prj_payment_gw
  name: string;
  sourceType: InputSourceType;
  repoUrl?: string;
  defaultBranch?: string;
  zipFilename?: string;
  uploadedFilesCount?: number;
  instructions: string;
  isPinned: boolean;
  createdAt: string;
  lastActivityAt: string;
}

export type ViewMode =
  | 'dashboard'
  | 'projects'
  | 'project_detail'
  | 'new_task'
  | 'tasks_list'
  | 'task_detail'
  | 'wallet'
  | 'settings'
  | 'operator';
