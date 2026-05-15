'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Save, Calendar, Users, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { useAvailability, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { DAYS, BLOCKS, nextStatus } from '@/data/availability';
import type { Availability, AvailabilityStatus, DayOfWeek, TimeBlock, Employee } from '@/types';
import { format, parseISO } from 'date-fns';
import { can } from '@/data/permissions';

export default function AvailabilityPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { user, loaded } = useCurrentUser();
  const { get, upsert } = useAvailability();
  const { employees, getById } = useEmployees();

  // Admin/manager/lead can edit/view someone else via ?employee=...
  const targetId = sp.get('employee') ?? user?.id ?? '';
  const target = getById(targetId);
  const isViewingSelf = target?.id === user?.id;
  const canViewOthers = user ? can(user.role, 'schedule.view_team') : false;

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const seed = useMemo<Availability>(
    () =>
      get(targetId) ?? {
        employeeId: targetId,
        weekly: {},
        preferredMinHours: 20,
        preferredMaxHours: 30,
        notes: '',
        updatedAt: new Date().toISOString(),
      },
    [get, targetId],
  );

  const [draft, setDraft] = useState<Availability>(seed);
  useEffect(() => setDraft(seed), [targetId, seed.updatedAt]);

  if (!user || !target) {
    return (
      <AppShell>
        <p>Employee not found.</p>
      </AppShell>
    );
  }

  const cycle = (day: DayOfWeek, block: TimeBlock) => {
    const cur = draft.weekly[day]?.[block];
    const next = nextStatus(cur);
    setDraft({
      ...draft,
      weekly: {
        ...draft.weekly,
        [day]: { ...(draft.weekly[day] ?? {}), [block]: next },
      },
    });
  };

  const save = () => {
    upsert(draft);
  };

  // Manager view: same store
  const teamAtLocation = employees.filter(
    (e) => e.active && e.homeLocationId === user.homeLocationId,
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {!isViewingSelf && (
              <Link
                href="/availability"
                className="mb-2 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
              >
                <ArrowLeft size={16} /> Back to my availability
              </Link>
            )}
            <h1 className="text-3xl font-bold text-ink-700">
              {isViewingSelf ? 'Your availability' : `${fullName(target)}'s availability`}
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              Tap a slot to cycle: <span className="font-semibold text-emerald-700">Available</span>{' '}
              → <span className="font-semibold text-cyan-500">Preferred</span> →{' '}
              <span className="font-semibold text-hibiscus-500">Unavailable</span>.
            </p>
          </div>
          <button onClick={save} className="btn-cyan">
            <Save size={16} /> Save availability
          </button>
        </div>

        {/* Grid */}
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-cyan-50/40">
                <th className="border-b border-ink-100 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-ink-500">
                  Time
                </th>
                {DAYS.map((d) => (
                  <th
                    key={d.id}
                    className="border-b border-ink-100 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-ink-500"
                  >
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((b) => (
                <tr key={b.id}>
                  <td className="border-b border-ink-100 px-3 py-3">
                    <div className="font-semibold text-ink-700 text-sm">{b.label}</div>
                    <div className="text-xs text-ink-400">{b.range}</div>
                  </td>
                  {DAYS.map((d) => {
                    const status = draft.weekly[d.id]?.[b.id];
                    return (
                      <td key={d.id} className="border-b border-ink-100 p-1.5">
                        <button
                          onClick={() => cycle(d.id, b.id)}
                          className={`block h-12 w-full rounded-md border-2 text-xs font-semibold transition ${classFor(status)}`}
                        >
                          {labelFor(status)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hours + notes */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-2">
              Preferred weekly hours
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Min</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  className="input"
                  value={draft.preferredMinHours}
                  onChange={(e) =>
                    setDraft({ ...draft, preferredMinHours: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="label">Max</label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  className="input"
                  value={draft.preferredMaxHours}
                  onChange={(e) =>
                    setDraft({ ...draft, preferredMaxHours: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-2">
              Notes
            </h3>
            <textarea
              className="input min-h-[80px]"
              placeholder="Anything your manager should know — class schedule, second job, etc."
              value={draft.notes ?? ''}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-400">
          Last saved {format(parseISO(seed.updatedAt), 'MMM d, h:mm a')}.
        </p>

        {/* Manager: see whole team at this location */}
        {canViewOthers && isViewingSelf && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-ink-700 flex items-center gap-2">
              <Users size={18} /> Your store's availability
            </h2>
            <p className="text-sm text-ink-400 mb-4">
              Click any teammate to view or edit their availability.
            </p>
            <div className="card overflow-hidden">
              {teamAtLocation.map((e, i) => (
                <TeamRow key={e.id} employee={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TeamRow({ employee }: { employee: Employee }) {
  const { get } = useAvailability();
  const a = get(employee.id);
  const filledDays = a ? Object.keys(a.weekly).length : 0;
  return (
    <Link
      href={`/availability?employee=${employee.id}`}
      className="flex items-center gap-3 border-b border-ink-100 p-3 hover:bg-cyan-50/50"
    >
      <Avatar employee={employee} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink-700">{fullName(employee)}</div>
        <div className="text-xs text-ink-400">
          {a
            ? `${a.preferredMinHours}–${a.preferredMaxHours} hrs preferred · ${filledDays}/7 days set`
            : 'No availability set'}
        </div>
      </div>
      <Calendar size={16} className="text-ink-400" />
    </Link>
  );
}

function classFor(s?: AvailabilityStatus) {
  if (s === 'preferred') return 'border-cyan-400 bg-cyan-100 text-cyan-600';
  if (s === 'unavailable') return 'border-hibiscus-200 bg-hibiscus-50 text-hibiscus-500 line-through';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
}
function labelFor(s?: AvailabilityStatus) {
  if (s === 'preferred') return 'Prefer';
  if (s === 'unavailable') return 'Off';
  return 'OK';
}
