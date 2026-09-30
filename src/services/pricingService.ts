import { getModelById } from './modelRegistry';

export interface TaskPricingEstimate {
  estimatedCost: number;
  reservedCap: number;
  currency: 'تومان';
}

/**
 * Isolated pricing service that calculates estimated cost and reserve cap.
 * Replaces hardcoded component formulas (baseCost * multiplier * 1.3) with an
 * isolated service that can be swapped for a real remote Pricing Engine without UI redesign.
 */
export function estimateTaskPricing(modelId: string, _promptLength?: number): TaskPricingEstimate {
  const model = getModelById(modelId);
  return {
    estimatedCost: model.baseEstimatedCost,
    reservedCap: model.reservedCap,
    currency: 'تومان',
  };
}
