export type PlanTier = 'free' | 'pro' | 'team';

export const PLAN_LIMITS: Record<PlanTier, { maxDocuments: number; maxAiDaily: number; maxFileBytes: number }> = {
  free: {
    maxDocuments: 5,
    maxAiDaily: 10,
    maxFileBytes: 25 * 1024 * 1024
  },
  pro: {
    maxDocuments: 100,
    maxAiDaily: 500,
    maxFileBytes: 100 * 1024 * 1024
  },
  team: {
    maxDocuments: 1000,
    maxAiDaily: 2000,
    maxFileBytes: 250 * 1024 * 1024
  }
};

export const STORAGE_BUCKET = 'documents';
