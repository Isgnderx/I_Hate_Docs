import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: string | null;
  ai_daily_limit: number | null;
  storage_limit_bytes: number | null;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setLoading(false);
        return;
      }

      if (!data) {
        const { data: created } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null
          })
          .select('*')
          .single();

        if (active) {
          setProfile(created ?? null);
          setLoading(false);
        }
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [user]);

  return { profile, loading };
}
