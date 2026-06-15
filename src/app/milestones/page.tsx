'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PartyPopper,
  Cake,
  Star,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import {
  format,
  parseISO,
  addYears,
  differenceInYears,
  setYear,
  getMonth,
  getDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';

type MilestoneEvent = {
  date: Date; // actual date this year
  type: 'birthday' | 'anniversary';
  employee: { id: string; firstName: string; lastName: string; homeLocationId: string };
  years?: number; // for anniversaries
  label: string;
};

const ANNIVERSARY_MILESTONES = [1, 2, 3, 5, 10, 15, 20];

function buildEvents(employees: ReturnType<typeof useEmployees>['employees'], baseYear: number): MilestoneEvent[] {
  const events: MilestoneEvent[] = [];
  const now = new Date();

  for (const emp of employees) {
    if (!emp.active) continue;

    // Birthdays
    if (emp.birthday) {
      const [mm, dd] = emp.birthday.split('-').map(Number);
      const thisYearBirthday = new Date(baseYear, mm - 1, dd);
      events.push({
        date: thisYearBirthday,
        type: 'birthday',
        employee: emp,
        label: `🎂 Birthday — ${fullName(emp)}`,
      });
    }

    // Work anniversaries
    if (emp.hiredOn) {
      const hireDate = parseISO(emp.hiredOn);
      const yearsCompleted = differenceInYears(now, hireDate);

      // Show upcoming milestones for this year and next
      for (const milestone of ANNIVERSARY_MILESTONES) {
        const anniversaryDate = addYears(hireDate, milestone);
        if (getDate(anniversaryDate) > 0 && new Date(anniversaryDate).getFullYear() === baseYear) {
          events.push({
            date: anniversaryDate,
            type: 'anniversary',
            employee: emp,
            years: milestone,
            label: `⭐ ${milestone}-Year Anniversary — ${fullName(emp)}`,
          });
        }
      }

      // Also show every-year anniversary (non-milestone) if it falls this year
      const thisYearAnniversary = setYear(hireDate, baseYear);
      if (thisYearAnniversary > hireDate && !ANNIVERSARY_MILESTONES.includes(differenceInYears(thisYearAnniversary, hireDate))) {
        const yrs = differenceInYears(thisYearAnniversary, hireDate);
        if (yrs > 0) {
          events.push({
            date: thisYearAnniversary,
            type: 'anniversary',
            employee: emp,
            years: yrs,
            label: `🎉 ${yrs}-Year Work Anniversary — ${fullName(emp)}`,
          });
        }
      }
    }
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export default function MilestonesPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees } = useEmployees();
  const [viewMonth, setViewMonth] = useState(new Date());

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const today = new Date();
  const currentYear = viewMonth.getFullYear();

  // Baristas only see milestones for teammates at their own location(s).
  const myLocs = user ? [user.homeLocationId, ...(user.additionalLocationIds ?? [])] : [];
  const visibleEmployees = user?.role === 'barista'
    ? employees.filter((e) => [e.homeLocationId, ...(e.additionalLocationIds ?? [])].some((l) => myLocs.includes(l)))
    : employees;

  const allEvents = useMemo(
    () => buildEvents(visibleEmployees, currentYear),
    [visibleEmployees, currentYear],
  );

  // Events in the current view month
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Leading blank days for calendar grid
  const leadingBlanks = monthStart.getDay(); // 0 = Sunday

  // Upcoming events (next 30 days from today)
  const upcomingCutoff = new Date(today);
  upcomingCutoff.setDate(today.getDate() + 60);
  const upcoming = allEvents.filter(
    (e) => e.date >= today && e.date <= upcomingCutoff,
  );

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ink-700">Milestones</h1>
          <p className="mt-1 text-sm text-ink-400">
            Birthdays and work anniversaries across all team members.
          </p>
        </div>

        {/* Upcoming strip */}
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-700 mb-4">
            <PartyPopper size={16} /> Coming up in the next 60 days
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-ink-400">No milestones in the next 60 days.</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((ev, i) => {
                const loc = getLocation(ev.employee.homeLocationId);
                const daysAway = Math.ceil((ev.date.getTime() - today.getTime()) / 86400000);
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-cyan-100 px-4 py-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${ev.type === 'birthday' ? 'bg-pink-100' : 'bg-amber-100'}`}>
                      {ev.type === 'birthday' ? '🎂' : '⭐'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/team/${ev.employee.id}`} className="font-semibold text-ink-700 hover:text-cyan-600">
                        {fullName(ev.employee)}
                      </Link>
                      <p className="text-xs text-ink-400">
                        {ev.type === 'birthday' ? 'Birthday' : `${ev.years}-Year Anniversary`}
                        {loc ? ` · ${loc.name}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-ink-700">
                        {format(ev.date, 'MMM d')}
                      </div>
                      <div className={`text-xs font-semibold ${daysAway <= 7 ? 'text-hibiscus-500' : 'text-ink-400'}`}>
                        {daysAway === 0 ? 'Today! 🎉' : daysAway === 1 ? 'Tomorrow' : `in ${daysAway} days`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6">
          {/* Month nav */}
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
              className="rounded-full p-2 hover:bg-ink-100 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-bold text-ink-700">
              {format(viewMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="rounded-full p-2 hover:bg-ink-100 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1 text-center text-xs font-semibold text-ink-400">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Leading blanks */}
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {daysInMonth.map((day) => {
              const dayEvents = allEvents.filter((e) => isSameDay(e.date, day));
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[72px] rounded-xl border p-1.5 transition ${
                    isToday
                      ? 'border-cyan-400 bg-cyan-50'
                      : dayEvents.length > 0
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-transparent'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-cyan-600' : 'text-ink-500'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.map((ev, i) => (
                      <Link
                        key={i}
                        href={`/team/${ev.employee.id}`}
                        className={`block rounded px-1 py-0.5 text-[10px] font-semibold leading-tight truncate ${
                          ev.type === 'birthday'
                            ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                        title={ev.label}
                      >
                        {ev.type === 'birthday' ? '🎂' : '⭐'} {ev.employee.firstName}
                        {ev.type === 'anniversary' && ev.years ? ` (${ev.years}yr)` : ''}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 border-t border-ink-100 pt-4 text-xs text-ink-500">
            <span className="flex items-center gap-1.5"><span className="rounded px-1.5 py-0.5 bg-pink-100 text-pink-700 font-semibold">🎂</span> Birthday</span>
            <span className="flex items-center gap-1.5"><span className="rounded px-1.5 py-0.5 bg-amber-100 text-amber-700 font-semibold">⭐</span> Work Anniversary</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
