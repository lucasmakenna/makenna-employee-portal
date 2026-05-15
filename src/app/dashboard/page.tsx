'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { useCurrentUser } from '@/lib/auth';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { fullName } from '@/data/employees';
import { useEmployees, useCandidates, usePackets } from '@/data/store';
import { LOCATIONS, getLocation } from '@/data/locations';
import { STATIONS, completedSkillsCount, totalSkills } from '@/data/training';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees } = useEmployees();
  const { candidates } = useCandidates();
  const { packets } = usePackets();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  const openCandidates = candidates.filter((c) => c.stage !== 'hired' && c.stage !== 'rejected').length;
  const inProgressOnboarding = Object.values(packets).filter(
    (p) => p.tasks.some((t) => !t.signed),
  ).length;
  const trainees = employees.filter((e) =>
    Object.values(e.trainingProgressByStation).some((s) => !s.signedOffAt),
  ).length;
  const expiringCerts = employees.flatMap((e) =>
    e.certifications.map((c) => ({ employee: e, cert: c })),
  ).filter((x) => {
    const days = (new Date(x.cert.expiresOn).getTime() - Date.now()) / 86400000;
    return days < 90 && days > -30;
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-700">
            Good morning, {user.firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Here's what's happening across the {LOCATIONS.length} locations today.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            icon={<Users size={18} />}
            label="Open candidates"
            value={openCandidates}
            href="/hiring"
          />
          <StatCard
            icon={<ClipboardCheck size={18} />}
            label="Active onboarding"
            value={inProgressOnboarding}
            href="/onboarding"
          />
          <StatCard
            icon={<GraduationCap size={18} />}
            label="Trainees in progress"
            value={trainees}
            href="/training"
          />
          <StatCard
            icon={<AlertTriangle size={18} />}
            label="Certs expiring < 90d"
            value={expiringCerts.length}
            href="/team"
            warn={expiringCerts.length > 0}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline at a glance */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink-700">Hiring at a glance</h2>
                <Link href="/hiring" className="text-sm font-semibold text-ink-700 underline">
                  View pipeline →
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  { stage: 'applied', label: 'Applied' },
                  { stage: 'phone_screen', label: 'Phone' },
                  { stage: 'in_person', label: 'In-person' },
                  { stage: 'offer', label: 'Offer' },
                  { stage: 'hired', label: 'Hired' },
                ].map((s) => {
                  const n = candidates.filter((c) => c.stage === s.stage).length;
                  return (
                    <div key={s.stage} className="rounded-lg bg-cyan-50 p-3 text-center">
                      <div className="text-2xl font-bold text-ink-700">{n}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-ink-400">
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trainee progress */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink-700">Trainee progress</h2>
                <Link href="/training" className="text-sm font-semibold text-ink-700 underline">
                  Open dashboard →
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {employees.filter((e) => Object.keys(e.trainingProgressByStation).length > 0 && Object.values(e.trainingProgressByStation).some((s) => !s.signedOffAt)).map((e) => {
                  const total = totalSkills();
                  const done = completedSkillsCount(e.trainingProgressByStation);
                  const pct = Math.round((done / total) * 100);
                  return (
                    <Link
                      key={e.id}
                      href={`/training/${e.id}`}
                      className="flex items-center gap-4 rounded-lg p-2 hover:bg-cyan-50"
                    >
                      <Avatar employee={e} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <div className="truncate font-semibold text-ink-700">{fullName(e)}</div>
                          <div className="text-xs text-ink-400">
                            {done}/{total} skills · {pct}%
                          </div>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cyan-50">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-ink-400">
                          {getLocation(e.homeLocationId)?.name} · started{' '}
                          {formatDistanceToNow(parseISO(e.hiredOn), { addSuffix: true })}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Cert expirations */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink-700">Cert renewals</h2>
              <p className="mt-1 text-xs text-ink-400">
                Food handler & SB 1343 harassment training expirations.
              </p>
              {expiringCerts.length === 0 ? (
                <p className="mt-4 text-sm text-ink-400">All caught up.</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {expiringCerts.slice(0, 5).map(({ employee, cert }) => {
                    const days = Math.round(
                      (new Date(cert.expiresOn).getTime() - Date.now()) / 86400000,
                    );
                    return (
                      <div
                        key={employee.id + cert.id}
                        className="rounded-lg border border-ink-100 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-ink-700">
                              {fullName(employee)}
                            </div>
                            <div className="truncate text-xs text-ink-400">{cert.name}</div>
                          </div>
                          <span
                            className={
                              days < 0
                                ? 'pill bg-red-100 text-red-800'
                                : days < 30
                                ? 'pill bg-amber-100 text-amber-800'
                                : 'pill bg-cyan-50 text-ink-700'
                            }
                          >
                            {days < 0 ? 'Expired' : `${days}d`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Today */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink-700">Today</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2 text-ink-700">
                  <Calendar size={14} className="text-cyan-500" />
                  Diego R. — Day 5, Espresso skill #3 due
                </li>
                <li className="flex items-center gap-2 text-ink-700">
                  <Calendar size={14} className="text-cyan-500" />
                  Priya S. — start date Monday
                </li>
                <li className="flex items-center gap-2 text-ink-700">
                  <TrendingUp size={14} className="text-cyan-500" />
                  Weekly labor report ready
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card flex flex-col gap-2 p-5 transition hover:shadow-card"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className={warn ? 'text-amber-600' : 'text-ink-400'}>{icon}</span>
        {label}
      </div>
      <div className="text-3xl font-bold text-ink-700">{value}</div>
    </Link>
  );
}
