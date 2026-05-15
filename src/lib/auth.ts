'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { employeeFromRow } from '@/data/store';
import type { Employee } from '@/types';

// Read/write the session directly from localStorage to avoid the Supabase
// auth SDK's navigator.locks deadlock in Next.js App Router production builds.
const PROJECT_REF =
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').split('//')[1]?.split('.')[0] ?? '';
const SESSION_KEY = `sb-${PROJECT_REF}-auth-token`;

function readSessionEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.email ?? null;
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  const [user, setUser] = useState<Employee | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const email = readSessionEmail();
    if (!email) {
      setLoaded(true);
      return;
    }
    supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single()
      .then(
        ({ data }) => {
          setUser(data ? employeeFromRow(data as Record<string, unknown>) : null);
          setLoaded(true);
        },
        () => setLoaded(true),
      );
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, loaded, signOut };
}

export function isAnyRole(role: Employee['role'] | undefined, allowed: Employee['role'][]) {
  return !!role && allowed.includes(role);
}
