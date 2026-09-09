'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Lock, Pencil, StickyNote } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser, isAnyRole } from '@/lib/auth';
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
                  {sk.criteriaChecklist ? 'Policy checklist — check each off as you cover it' : 'Competency criteria'}
                </div>
                {sk.criteriaChecklist ? (
                  <ChecklistCriteria
                    criteria={sk.competencyCriteria}
                    skillId={sk.id}
                    signOff={sk.signOff}
                    trainerNotes={
                      isAnyRole(user?.role, ['admin', 'manager', 'trainer'])
                        ? sk.trainerNotes
                        : undefined
                    }
                  />
                ) : (
                  <ul className="space-y-1">
                    {sk.competencyCriteria.map((c, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {sk.videoUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-ink-100">
                  <iframe
                    src={sk.videoUrl}
                    title={sk.name}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {sk.images && sk.images.length > 0 && (
                <div className="mt-4 space-y-4">
                  {sk.images.map((img, j) => (
                    <figure key={j} className="overflow-hidden rounded-xl border border-ink-100">
                      <img
                        src={img.src}
                        alt={img.caption ?? ''}
                        className="w-full object-contain bg-white"
                      />
                      {img.caption && (
                        <figcaption className="border-t border-ink-100 bg-cyan-50/40 px-3 py-2 text-xs text-ink-500 leading-relaxed">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
              {isAnyRole(user?.role, ['admin', 'manager', 'trainer']) && (
                <TrainerNotepad skillId={sk.id} />
              )}
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

function TrainerNotepad({ skillId }: { skillId: string }) {
  const [note, setNote] = useState('');

  return (
    <div className="mt-4 border-t border-ink-100 pt-4">
      <div className="flex items-center gap-1.5 mb-2">
        <StickyNote size={13} className="text-ink-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Trainer notes</span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add session notes for this skill…"
        rows={2}
        className="w-full resize-none rounded-lg border border-ink-200 bg-cyan-50/30 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}

function ChecklistCriteria({
  criteria,
  skillId,
  trainerNotes,
  signOff,
}: {
  criteria: string[];
  skillId: string;
  trainerNotes?: string[];
  signOff?: boolean;
}) {
  const [checked, setChecked] = useState<boolean[]>(() => criteria.map(() => false));
  const [signedOff, setSignedOff] = useState(false);

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const doneCount = checked.filter(Boolean).length;
  const allDone = doneCount === criteria.length;

  return (
    <div className="space-y-1">
      {allDone && (
        <div className="mb-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700">
          ✓ All points covered!
        </div>
      )}
      <ul className="space-y-2">
        {criteria.map((c, i) => (
          <li key={`${skillId}-${i}`}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-ink-300 accent-cyan-500 cursor-pointer"
              />
              <span className={`text-sm leading-snug transition-colors ${checked[i] ? 'line-through text-ink-400' : 'text-ink-700'}`}>
                {c}
              </span>
            </label>
            {trainerNotes?.[i] && (
              <p className="ml-6 mt-1 text-xs italic text-hibiscus-600">
                Trainer note: {trainerNotes[i]}
              </p>
            )}
          </li>
        ))}
      </ul>
      {doneCount > 0 && !allDone && (
        <p className="mt-2 text-xs text-ink-400">{doneCount} of {criteria.length} completed</p>
      )}

      {signOff && (
        <div className="mt-5 border-t border-ink-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-ink-700">Trainer Sign-Off</p>
              <p className="text-xs text-ink-400">Complete once all {criteria.length} drinks are checked off</p>
            </div>
            {allDone && !signedOff ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                ✓ Ready
              </span>
            ) : !signedOff ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-50 border border-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-400">
                <Lock size={10} /> Locked
              </span>
            ) : null}
          </div>

          {signedOff ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
              ✓ Sign-off complete
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[
                  { id: `${skillId}-barista`, label: 'New Barista Name', placeholder: 'Full name', type: 'text' },
                  { id: `${skillId}-store`,   label: 'Store',            placeholder: 'Location',  type: 'text' },
                  { id: `${skillId}-trainer`, label: 'Trainer Name',     placeholder: 'Full name', type: 'text' },
                  { id: `${skillId}-date`,    label: 'Date',             placeholder: '',          type: 'date' },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs font-bold uppercase tracking-wide text-ink-400 mb-1">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={f.placeholder}
                      disabled={!allDone}
                      className="w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-cyan-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>
              <button
                disabled={!allDone}
                onClick={() => setSignedOff(true)}
                className="w-full rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Complete Sign-Off
              </button>
              {!allDone && (
                <p className="mt-2 text-center text-xs italic text-ink-300">
                  Check off all {criteria.length} drinks to unlock
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
