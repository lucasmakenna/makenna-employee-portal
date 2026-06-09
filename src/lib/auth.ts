'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { employeeFromRow } from '@/data/store';
import { EMPLOYEES as SEED_EMPLOYEES } from '@/data/employees';
import type { Employee } from '@/types';

export function useCurrentUser() {
  const [user, setUser] = useState<Employee | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function loadUser(email: string | undefined) {
    if (!email) { setUser(null); setLoaded(true); return; }
    const normalizedEmail = email.trim().toLowerCase();

    // Try Supabase first
    const { data } = await supabase
      .from('employees')
      .select('*')
      .ilike('email', normalizedEmail)
      .single();

    if (data) {
      setUser(employeeFromRow(data as Record<string, unknown>));
      setLoaded(true);
      return;
    }

    // Fall back to seed data (covers employees not yet synced to Supabase)
    const seed = SEED_EMPLOYEES.find(
      (e) => e.email.toLowerCase() === normalizedEmail,
    );
    setUser(seed ?? null);
    setLoaded(true);
  }

  useEffect(() => {
    // Load on mount from current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUser(session?.user?.email ?? undefined);
    });

    // Keep in sync when auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user?.email ?? undefined);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loaded, signOut };
}

export function isAnyRole(role: Employee['role'] | undefined, allowed: Employee['role'][]) {
  return !!role && allowed.includes(role);
}
