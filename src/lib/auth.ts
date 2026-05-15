'use client';

// Sandbox auth. In production, swap for Clerk, NextAuth, or Supabase Auth
// — the rest of the app reads through useCurrentUser() so the swap is
// localized to this file.

import { useEffect, useState } from 'react';
import { Employee } from '@/types';
import { EMPLOYEES } from '@/data/employees';

const KEY = 'makenna-portal-current-user';

export function useCurrentUser() {
  const [user, setUser] = useState<Employee | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = window.localStorage.getItem(KEY);
    if (id) setUser(EMPLOYEES.find((e) => e.id === id) ?? null);
    setLoaded(true);
  }, []);

  return {
    user,
    loaded,
    signIn: (id: string) => {
      window.localStorage.setItem(KEY, id);
      setUser(EMPLOYEES.find((e) => e.id === id) ?? null);
    },
    signOut: () => {
      window.localStorage.removeItem(KEY);
      setUser(null);
    },
  };
}

// Use `can(role, capability)` from @/data/permissions instead of role lists.
// This helper is kept for back-compat in case any future callers want a simple
// role-list check (e.g. "is this user any of these roles?").
export function isAnyRole(role: Employee['role'] | undefined, allowed: Employee['role'][]) {
  return !!role && allowed.includes(role);
}
