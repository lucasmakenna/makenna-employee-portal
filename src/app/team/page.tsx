'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { EMPLOYEES, fullName } from '@/data/employees';
import { LOCATIONS, getLocation } from '@/data/locations';
import { ROLES, ROLE_LABELS } from '@/types';

export default function TeamPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [loc, setLoc] = useState<string>('all');

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  const filtered = EMPLOYEES.filter((e) => {
    if (role !== 'all' && e.role !== role) return false;
    if (loc !== 'all' && e.homeLocationId !== loc) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Team</h1>
            <p className="mt-1 text-sm text-ink-400">
              {filtered.length} of {EMPLOYEES.length} team members
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="input pl-9 w-56"
              />
            </div>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-36">
              <option value="all">All roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <select value={loc} onChange={(e) => setLoc(e.target.value)} className="input w-44">
              <option value="all">All locations</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <Link
              key={e.id}
              href={`/team/${e.id}`}
              className="card flex items-center gap-4 p-4 transition hover:shadow-card"
            >
              <Avatar employee={e} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold text-ink-700">{fullName(e)}</div>
                <div className="truncate text-xs text-ink-400">
                  {ROLE_LABELS[e.role]} · {getLocation(e.homeLocationId)?.name}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {e.certifications.map((c) => {
                    const days = Math.round(
                      (new Date(c.expiresOn).getTime() - Date.now()) / 86400000,
                    );
                    return (
                      <span
                        key={c.id}
                        className={`pill text-[10px] ${
                          days < 0
                            ? 'bg-red-100 text-red-800'
                            : days < 30
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-cyan-50 text-ink-700'
                        }`}
                      >
                        {c.name.split(' ')[0]} {days < 0 ? 'Expired' : `${days}d`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
