'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flower } from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import { EMPLOYEES, fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import Avatar from '@/components/Avatar';
import { BRAND } from '@/lib/brand';
import { ROLE_LABELS } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { user, loaded, signIn } = useCurrentUser();

  useEffect(() => {
    if (loaded && user) router.replace('/dashboard');
  }, [loaded, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="w-full max-w-2xl">
        {/* Tri-stripe banner echoing the website */}
        <div className="tri-stripe rounded-full mb-6" />
        <div className="mb-8 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            srcSet="/logo.png 1x, /logo@2x.png 2x"
            alt="Makenna Koffee Company"
            className="h-24 w-auto"
          />
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-royal-400">
            Team Portal
          </div>
          <p className="text-sm text-ink-400">Sign in as a demo user</p>
        </div>

        <div className="card p-2">
          <div className="border-b border-ink-100 px-4 py-3 text-xs uppercase tracking-wider text-ink-400">
            Choose a role to preview
          </div>
          <ul>
            {EMPLOYEES.map((e) => (
              <li
                key={e.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-cyan-50"
                onClick={() => {
                  signIn(e.id);
                  router.push('/dashboard');
                }}
              >
                <Avatar employee={e} />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-semibold text-ink-700">{fullName(e)}</div>
                  <div className="truncate text-xs text-ink-400">
                    {ROLE_LABELS[e.role]} · {getLocation(e.homeLocationId)?.name}
                  </div>
                </div>
                <span className="pill bg-cyan-50 text-ink-700">{ROLE_LABELS[e.role]}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-ink-400">
          In production this is replaced with SSO (Google) or magic-link email. The role-based
          access pattern stays the same.
        </p>
      </div>
    </div>
  );
}
