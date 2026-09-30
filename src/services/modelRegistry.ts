export interface AIModel {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  baseEstimatedCost: number; // in Toman
  reservedCap: number; // in Toman
  category: 'architecture' | 'algorithm' | 'general' | 'balanced';
  supportedByWorker: boolean;
}

export const MODEL_REGISTRY: AIModel[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    tagline: 'بهترین استدلال معماری، منطق عمیق الگوریتمی و رفکتورینگ کد',
    recommended: true,
    baseEstimatedCost: 90000,
    reservedCap: 120000,
    category: 'architecture',
    supportedByWorker: true,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    tagline: 'سرعت و دقت بالا در منطق محاسباتی و تست‌های واحد',
    recommended: false,
    baseEstimatedCost: 65000,
    reservedCap: 85000,
    category: 'algorithm',
    supportedByWorker: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    tagline: 'مدل استاندارد و متوازن برای وب و فول‌استک',
    recommended: false,
    baseEstimatedCost: 75000,
    reservedCap: 100000,
    category: 'general',
    supportedByWorker: true,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    tagline: 'پایدار برای کارهای روزمره و کامپوننت‌نویسی',
    recommended: false,
    baseEstimatedCost: 75000,
    reservedCap: 100000,
    category: 'balanced',
    supportedByWorker: true,
  },
];

export function getModelById(modelId: string): AIModel {
  return MODEL_REGISTRY.find((m) => m.id === modelId) || MODEL_REGISTRY[0];
}

export function getAllModels(): AIModel[] {
  return MODEL_REGISTRY;
}

export function getOperatorSupportedModels(): AIModel[] {
  return MODEL_REGISTRY.filter((m) => m.supportedByWorker);
}
