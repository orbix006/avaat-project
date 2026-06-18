'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { signOut as serverSignOut } from '@/lib/auth';

export function useAdminSession() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await serverSignOut();
      setUser(null);
      setSession(null);
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    } catch (err) {
      console.error('Session refresh error:', err);
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial check of the active session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (err) {
        console.error('Initial session retrieval error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listen to authentication state shifts (sign ins, sign outs, token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        router.push('/admin/login');
        router.refresh();
      } else if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return {
    user,
    session,
    loading,
    logout,
    refresh,
  };
}
