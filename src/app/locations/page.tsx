'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';
import AppShell from '@/components/AppShell';
import SquareStatusPanel from '@/components/SquareStatusPanel';
import { useCurrentUser } from '@/lib/auth';
import { LOCATIONS } from '@/data/locations';
import { fullName } from '@/data/employees';
import { useEmployees } from '@/data/store';

export default function LocationsPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees } = useEmployees();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink-700">Locations</h1>
          <p className="mt-1 text-sm text-ink-400">
            {LOCATIONS.length} stores. Each location's team, manager, and onboarding pipeline.
          </p>
        </div>

        <div className="mb-6">
          <SquareStatusPanel />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => {
            const team = employees.filter((e) => e.homeLocationId === loc.id);
            const manager = team.find((e) => e.role === 'manager');
            return (
              <div key={loc.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs uppercase tracking-wider text-ink-400">
                      <MapPin size={12} />
                      {loc.city}
                    </div>
                    <h2 className="text-lg font-bold text-ink-700">{loc.name}</h2>
                  </div>
                  <span className="pill bg-cyan-50 text-ink-700">
                    <Users size={12} /> {team.length}
                  </span>
                </div>
                {manager && (
                  <div className="mt-3 rounded-lg bg-cyan-50/50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      Manager
                    </div>
                    <div className="font-semibold text-ink-700">{fullName(manager)}</div>
                  </div>
                )}
                {loc.pin && (
                  <div className="mt-3 rounded-lg bg-ink-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                      Store PIN
                    </div>
                    <div className="font-semibold text-ink-700 tracking-widest">{loc.pin}</div>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {team.slice(0, 6).map((e) => (
                    <Link
                      key={e.id}
                      href={`/team/${e.id}`}
                      className="pill bg-ink-50 text-ink-700 hover:bg-cyan-50"
                    >
                      {e.firstName}
                    </Link>
                  ))}
                  {team.length > 6 && (
                    <span className="pill bg-ink-50 text-ink-400">
                      +{team.length - 6}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
