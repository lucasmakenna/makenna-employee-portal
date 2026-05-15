'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { employeeFromRow } from '@/data/store';
import type { Employee } from '@/types';

export function useCurrentUser() {
  const [user, setUser] = useState<Employee | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.email) {
        const { data } = await supabase
          .from('employees')
          .select('*')
          .eq('email', session.user.email)
          .single();
        setUser(data ? employeeFromRow(data as Record<string, unknown>) : null);
      }
      setLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        const { data } = await supabase
          .from('employees')
          .select('*')
          .eq('email', session.user.email)
          .single();
        setUser(data ? employeeFromRow(data as Record<string, unknown>) : null);
      } else {
        setUser(null);
      }
      setLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loaded, signIn, signOut };
}

export function isAnyRole(role: Employee['role'] | undefined, allowed: Employee['role'][]) {
  return !!role && allowed.includes(role);
}
