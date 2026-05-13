import { useEffect, useState } from 'react';
import { useProfile } from './useProfile';
import { supabase } from '../lib/supabase';
import { PLAN_LIMITS } from '../lib/constants';
import { startOfUtcDay } from '../lib/utils';
import { useAuth } from './useAuth';

export function useUsageLimits() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [aiUsedToday, setAiUsedToday] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const start = startOfUtcDay();
    const { count } = await supabase
      .from('usage_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('event_type', 'ai_chat')
      .gte('created_at', start.toISOString());
    setAiUsedToday(count ?? 0);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [user?.id]);

  const plan = (profile?.plan ?? 'free') as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  return {
    plan,
    limits,
    aiUsedToday,
    loading,
    refresh
  };
}
