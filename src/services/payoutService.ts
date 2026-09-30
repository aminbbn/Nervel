import { TaskItem } from '../types';

/**
 * Isolated Operator Payout Service.
 * Decouples operator remuneration from retail customer task pricing (eliminates customer price * 0.7).
 * Computes compensation using internal token execution accounting and sandbox compute baselines.
 */
export function calculateOperatorPayout(task: TaskItem): number {
  if (task.tokenStats) {
    const inputTokenCost = Math.round((task.tokenStats.inputTokens / 1000) * 12);
    const cachedTokenCost = Math.round((task.tokenStats.cachedTokens / 1000) * 3);
    const outputTokenCost = Math.round((task.tokenStats.outputTokens / 1000) * 32);
    const sandboxBaseAllowance = 24000;
    return sandboxBaseAllowance + inputTokenCost + cachedTokenCost + outputTokenCost;
  }

  // Fallback estimation based on model complexity and execution compute duration
  if (task.modelId === 'claude-3-7-sonnet') return 58000;
  if (task.modelId === 'o3-mini') return 42000;
  return 48000;
}
