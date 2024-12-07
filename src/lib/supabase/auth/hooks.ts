import { useEffect } from 'react';
import { supabase } from '../client';
import { useAuthStore } from '../../../store/useAuthStore';
import type { User } from './types';

export function useAuthStateChange() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        try {
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || '',
              picture: session.user.user_metadata?.avatar_url
            };
            setUser(user);
          } else {
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);
}