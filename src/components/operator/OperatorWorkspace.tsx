import React from 'react';
import { useRouter } from '../../context/RouterContext';
import { OperatorTab } from '../../types';
import { OperatorOverviewTab } from './tabs/OperatorOverviewTab';
import { OperatorActiveJobsTab } from './tabs/OperatorActiveJobsTab';
import { OperatorHistoryTab } from './tabs/OperatorHistoryTab';
import { OperatorWorkerTab } from './tabs/OperatorWorkerTab';
import { OperatorEarningsTab } from './tabs/OperatorEarningsTab';
import { OperatorWithdrawalsTab } from './tabs/OperatorWithdrawalsTab';
import { OperatorSettingsTab } from './tabs/OperatorSettingsTab';

export const OperatorWorkspace: React.FC = () => {
  const { parsedRoute } = useRouter();
  const activeTab: OperatorTab = parsedRoute.operatorTab || 'overview';

  return (
    <div className="w-full">
      {activeTab === 'overview' && <OperatorOverviewTab />}
      {activeTab === 'active_jobs' && <OperatorActiveJobsTab />}
      {activeTab === 'history' && <OperatorHistoryTab />}
      {activeTab === 'worker' && <OperatorWorkerTab />}
      {activeTab === 'earnings' && <OperatorEarningsTab />}
      {activeTab === 'withdrawals' && <OperatorWithdrawalsTab />}
      {activeTab === 'settings' && <OperatorSettingsTab />}
    </div>
  );
};
