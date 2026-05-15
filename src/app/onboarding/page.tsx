'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { useEmployees, usePackets } from '@/data/store';
import { format, parseISO } from 'date-fns';

export default function OnboardingHub() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { packets } = usePackets();
  const { getById } = useEmployees();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  const packetList = Object.values(packets).sort((a, b) =>
    a.startDate < b.startDate ? 1 : -1,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Onboarding</h1>
            <p className="mt-1 text-sm text-ink-400">
              Day-One paperwork and compliance for new hires.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {packetList.length === 0 && (
            <div className="card p-8 text-center text-sm text-ink-400">
              No active onboarding. Hire a candidate from the Hiring tab to start a packet.
            </div>
          )}
          {packetList.map((p) => {
            const emp = getById(p.employeeId);
            if (!emp) return null;
            const total = p.tasks.length;
            const done = p.tasks.filter((t) => t.signed).length;
            const pct = Math.round((done / total) * 100);
            const complete = done === total;
            return (
              <Link
                key={p.employeeId}
                href={`/onboarding/${p.employeeId}`}
                className="card flex flex-col gap-4 p-5 transition hover:shadow-card sm:flex-row sm:items-center"
              >
                <Avatar employee={emp} size="lg" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="font-bold text-ink-700 text-lg">{fullName(emp)}</div>
                      <div className="text-xs text-ink-400">
                        {getLocation(emp.homeLocationId)?.name} · started{' '}
                        {format(parseISO(p.startDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    {complete ? (
                      <span className="pill bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    ) : (
                      <span className="pill bg-amber-100 text-amber-800">
                        <Clock size={12} /> {done}/{total} signed
                      </span>
                    )}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cyan-50">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="text-ink-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
