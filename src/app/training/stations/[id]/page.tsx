'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Pencil } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { getStation, STATIONS } from '@/data/training';
import { isInTraining, fullName } from '@/data/employees';
import { useEmployees } from '@/data/store';
import { loadAllTrainingProgress } from '@/lib/training-db';

export default function StationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees, update: updateEmployee } = useEmployees();
  const station = getStation(params.id);

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

  if (!station) {
    return (
      <AppShell>
        <p>Station not found.</p>
      </AppShell>
    );
  }

  const trainees = employees.filter((e) => e.active && isInTraining(e));

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <Link
          href="/training"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Training
        </Link>

        <div className="card mb-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400">
                Section {station.order} · v{station.contentVersion}
              </div>
              <h1 className="text-3xl font-bold text-ink-700">{station.name}</h1>
              <p className="mt-2 text-ink-600">{station.description}</p>
            </div>
            <Link href={`/training/content`} className="btn-secondary">
              <Pencil size={14} /> Edit content
            </Link>
          </div>
        </div>

        {/* Skills */}
        <h2 className="text-xl font-bold text-ink-700 mb-3">Skills</h2>
        <div className="space-y-3 mb-8">
          {station.skills.map((sk, i) => (
            <div key={sk.id} className="card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">
                    Skill {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-ink-700">{sk.name}</h3>
                </div>
                <span className="pill bg-cyan-50 text-ink-700">
                  <Clock size={12} /> ~{sk.estimatedMinutes} min
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-600">{sk.description}</p>
              <div className="mt-3 rounded-lg bg-cyan-50/40 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                  Competency criteria
                </div>
                <ul className="space-y-1">
                  {sk.competencyCriteria.map((c, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-ink-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trainee progress for this station */}
        <h2 className="text-xl font-bold text-ink-700 mb-3">
          Trainee progress on this station
        </h2>
        <div className="card overflow-hidden">
          {trainees.map((e, i) => {
            const sp = e.trainingProgressByStation[station.id];
            const completed = sp?.skillsCompleted.length ?? 0;
            const pct = Math.round((completed / station.skills.length) * 100);
            const signed = !!sp?.signedOffBy;
            return (
              <Link
                key={e.id}
                href={`/training/${e.id}`}
                className={`flex items-center gap-3 p-4 hover:bg-cyan-50/50 ${
                  i > 0 ? 'border-t border-ink-100' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-ink-700">{fullName(e)}</div>
                  <div className="mt-1 h-1.5 w-48 overflow-hidden rounded-full bg-cyan-50">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`pill ${
                    signed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-cyan-50 text-ink-700'
                  }`}
                >
                  {completed}/{station.skills.length} · {pct}%
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
