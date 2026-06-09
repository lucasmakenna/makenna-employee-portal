'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { isInTraining, fullName } from '@/data/employees';
import { LOCATIONS, getLocation } from '@/data/locations';
import { STATIONS, completedSkillsCount, totalSkills } from '@/data/training';
import { useEmployees } from '@/data/store';
import { loadAllTrainingProgress } from '@/lib/training-db';

export default function TrainingHub() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees, update: updateEmployee } = useEmployees();
  const [locFilter, setLocFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  // Load all training progress from Supabase once on mount
  useEffect(() => {
    loadAllTrainingProgress().then((allProgress) => {
      for (const [empId, progress] of Object.entries(allProgress)) {
        if (Object.keys(progress).length > 0) {
          updateEmployee(empId, { trainingProgressByStation: progress });
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  const trainees = employees
    .filter((e) => e.active && isInTraining(e))
    .filter((e) => locFilter === 'all' || e.homeLocationId === locFilter)
    .filter((e) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-ink-600">
          <p className="font-bold text-ink-700 mb-1">Purpose of this training program</p>
          <p>
            This training outlines the mandatory schedule, content, performance standards, and
            documentation required for all new hires across all Makenna Koffee locations. The goal
            is to ensure every employee achieves proficiency in food safety, beverage execution,
            customer service, and compliance with all California labor and retail food laws as
            detailed in the SOP Manual. The sections below are organized by suggested training day
            to provide a structured timeline for completion.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Training</h1>
            <p className="mt-1 text-sm text-ink-400">
              {STATIONS.length} stations · {totalSkills()} skills · 62-page guide
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trainees..."
              className="input w-48"
            />
            <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="input w-48"
            >
              <option value="all">All locations</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            <Link href="/training/content" className="btn-secondary">
              Manage content
            </Link>
          </div>
        </div>

        {/* Sections row */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 mb-3">
            Sections
          </h2>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {STATIONS.map((s) => (
              <Link
                key={s.id}
                href={`/training/stations/${s.id}`}
                className="card flex flex-col gap-1 p-4 transition hover:shadow-card"
              >
                <div className="text-xs uppercase tracking-wider text-ink-400">
                  Section {s.order}
                </div>
                <div className="font-bold text-ink-700">{s.name}</div>
                <div className="text-xs text-ink-400">{s.skills.length} skills</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trainees */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400 mb-3">
            Trainees · {trainees.length}
          </h2>
          <div className="space-y-3">
            {trainees.map((e) => {
              const total = totalSkills();
              const done = completedSkillsCount(e.trainingProgressByStation);
              const pct = Math.round((done / total) * 100);
              return (
                <Link
                  key={e.id}
                  href={`/training/${e.id}`}
                  className="card flex items-center gap-4 p-4 transition hover:shadow-card"
                >
                  <Avatar employee={e} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="font-bold text-ink-700">{fullName(e)}</div>
                        <div className="flex items-center gap-1 text-xs text-ink-400">
                          <MapPin size={11} /> {getLocation(e.homeLocationId)?.name}
                        </div>
                      </div>
                      <span className="pill bg-cyan-50 text-ink-700">
                        {done}/{total} · {pct}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-cyan-50">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {STATIONS.map((s) => {
                        const sp = e.trainingProgressByStation[s.id];
                        const completed = sp?.skillsCompleted.length ?? 0;
                        const stationPct = Math.round((completed / s.skills.length) * 100);
                        const signed = !!sp?.signedOffBy;
                        return (
                          <span
                            key={s.id}
                            className={`pill ${
                              signed
                                ? 'bg-emerald-100 text-emerald-800'
                                : completed > 0
                                ? 'bg-cyan-400/30 text-ink-700'
                                : 'bg-ink-50 text-ink-400'
                            }`}
                          >
                            {s.name.split(' ')[0]} {stationPct}%
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <ChevronRight className="text-ink-400" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
