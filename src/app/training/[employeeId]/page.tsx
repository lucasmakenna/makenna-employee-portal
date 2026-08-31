'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, FileText, PenLine, Stamp, ClipboardList, NotebookPen, StickyNote } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import TrainingDocumentModal from '@/components/TrainingDocumentModal';
import OnboardingDocModal from '@/components/OnboardingDocModal';
import EndOfDayQuizModal from '@/components/EndOfDayQuizModal';
import type { OnboardingDocId } from '@/types';
import { useCurrentUser } from '@/lib/auth';
import { can } from '@/data/permissions';
import { getEmployee, fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { STATIONS, totalSkills, completedSkillsCount } from '@/data/training';
import { stampSignature, tryGetGeolocation } from '@/lib/signature-audit';
import { appendSignature, getMostRecentRecord } from '@/data/signatures';
import { loadTrainingProgress, saveStationProgress } from '@/lib/training-db';
import { useEmployees, usePackets, useTrainingNotes } from '@/data/store';

function SkillNotepad({ skillId }: { skillId: string }) {
  const [note, setNote] = useState('');
  return (
    <div className="mt-3 border-t border-ink-100 pt-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <StickyNote size={12} className="text-ink-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Trainer notes</span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notes for this skill…"
        rows={2}
        className="w-full resize-none rounded-lg border border-ink-200 bg-cyan-50/30 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}

/** Convert a skill name to Title Case, respecting em-dashes as phrase separators. */
function toTitleCase(str: string): string {
  const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor',
    'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'vs', 'via']);
  return str
    .split(/(—|–)/)
    .map((segment, segIdx) => {
      if (segment === '—' || segment === '–') return segment;
      return segment
        .split(' ')
        .map((word, wordIdx) => {
          const lower = word.toLowerCase();
          // Always capitalize first word of each phrase segment
          if (wordIdx === 0 || segIdx === 0) return word.charAt(0).toUpperCase() + word.slice(1);
          // Leave minor words lowercase unless first in segment
          if (minorWords.has(lower)) return lower;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    })
    .join('');
}

/**
 * iPad-optimized trainee progress view.
 *
 * Layout:
 *   - Left rail: stations (vertical tabs)
 *   - Right pane: skills inside the active station, with a sign-off button
 *     and trainer signature pad
 *
 * On phone (mobile companion app), the trainee gets a stacked view of the
 * same data with their own checkmarks but no sign-off authority.
 */
export default function TraineeProgress() {
  const params = useParams<{ employeeId: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  const { getById, update: updateEmployee } = useEmployees();
  const { get: getPacket } = usePackets();
  const { notes, loading: notesLoading, add: addNote } = useTrainingNotes(params.employeeId);
  const [noteText, setNoteText] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const notesEndRef = useRef<HTMLDivElement>(null);
  const [activeStationId, setActiveStationId] = useState(STATIONS[0].id);
  const [signoffStationId, setSignoffStationId] = useState<string | null>(null);
  /** documentModal: { skillId, documentId, stationId } when the PDF modal is open */
  const [documentModal, setDocumentModal] = useState<{ skillId: string; documentId: string; stationId: string } | null>(null);
  /** onboardingDocModal: { skillId, docId } when an onboarding doc is opened inline */
  const [onboardingDocModal, setOnboardingDocModal] = useState<{ skillId: string; docId: OnboardingDocId } | null>(null);
  /** quizModal: skillId of the End-of-Day quiz currently open */
  const [quizSkillId, setQuizSkillId] = useState<string | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  // Overlay Supabase progress on mount (when configured) — writes back to the
  // localStorage store so it persists without a separate local state.
  useEffect(() => {
    loadTrainingProgress(params.employeeId).then((progress) => {
      if (Object.keys(progress).length > 0) {
        updateEmployee(params.employeeId, { trainingProgressByStation: progress });
      }
    });
  }, [params.employeeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Read from the reactive store (localStorage-backed). Falls back to static
  // seed data until the store hydrates — covers the first render flash.
  const employee = getById(params.employeeId) ?? getEmployee(params.employeeId);

  if (!employee || !user) {
    return (
      <AppShell>
        <p>Trainee not found.</p>
      </AppShell>
    );
  }

  const canSignOff = can(user.role, 'training.signoff_skills');
  const canSignOffStation = can(user.role, 'training.signoff_station');
  const station = STATIONS.find((s) => s.id === activeStationId)!;
  const progress = employee.trainingProgressByStation[station.id];
  const skillsCompleted = progress?.skillsCompleted ?? [];

  // Derive which onboarding docs are signed so we can auto-check linked skills
  const packet = getPacket(params.employeeId);
  const signedOnboardingDocIds = new Set(
    (packet?.tasks ?? []).filter((t) => t.signed).map((t) => t.id),
  );
  // Merge manual completions with auto-completions from onboarding
  const effectiveSkillsCompleted = [
    ...skillsCompleted,
    ...station.skills
      .filter(
        (sk) =>
          sk.onboardingDocId &&
          signedOnboardingDocIds.has(sk.onboardingDocId as OnboardingDocId) &&
          !skillsCompleted.includes(sk.id),
      )
      .map((sk) => sk.id),
  ];

  const toggleSkill = async (skillId: string) => {
    if (!canSignOff) return;
    const current = employee.trainingProgressByStation[station.id]?.skillsCompleted ?? [];
    const currentSignoffs = employee.trainingProgressByStation[station.id]?.skillSignoffs ?? {};
    const isChecking = !current.includes(skillId);
    const next = isChecking ? [...current, skillId] : current.filter((s) => s !== skillId);
    const nextSignoffs = { ...currentSignoffs };
    if (isChecking) {
      nextSignoffs[skillId] = {
        trainerId: user.id,
        trainerName: fullName(user),
        completedAt: new Date().toISOString(),
      };
    } else {
      delete nextSignoffs[skillId];
    }
    const updated = {
      stationId: station.id,
      skillsCompleted: next,
      skillSignoffs: nextSignoffs,
      signedOffBy: progress?.signedOffBy,
      signedOffAt: progress?.signedOffAt,
    };
    const nextTrainingProgress = {
      ...employee.trainingProgressByStation,
      [station.id]: updated,
    };
    updateEmployee(employee.id, { trainingProgressByStation: nextTrainingProgress });
    await saveStationProgress(employee.id, updated);
  };

  const allStationSkillsDone = effectiveSkillsCompleted.length === station.skills.length;
  const stationSigned = !!progress?.signedOffBy;

  const handleSignOff = async (result: SignaturePadResult) => {
    const documentBody = [
      `Trainer sign-off for station: ${station.name}`,
      `Trainee: ${fullName(employee)} (${employee.id})`,
      `Skills demonstrated:`,
      ...station.skills.map((sk) => `  - ${sk.name}`),
      `Competency criteria certified met for each skill above.`,
    ].join('\n');

    const geo = await tryGetGeolocation();
    const prior = await getMostRecentRecord();

    const record = await stampSignature({
      context: { kind: 'training_station', employeeId: employee.id, stationId: station.id },
      signerEmployeeId: user.id,
      signerLegalName: result.signerLegalName,
      documentTitle: `Training Sign-off — ${station.name}`,
      documentBody,
      signatureImagePngDataUrl: result.signaturePngDataUrl,
      consentAcknowledged: true,
      priorRecord: prior,
      geo,
    });
    appendSignature(record);

    const signedProgress = {
      stationId: station.id,
      skillsCompleted: effectiveSkillsCompleted,
      signedOffBy: user.id,
      signedOffAt: record.signedAtIso,
    };
    const nextTrainingProgress = {
      ...employee.trainingProgressByStation,
      [station.id]: signedProgress,
    };
    updateEmployee(employee.id, { trainingProgressByStation: nextTrainingProgress });
    await saveStationProgress(employee.id, signedProgress);
    setSignoffStationId(null);
  };

  /** Called when the TrainingDocumentModal successfully captures a signature. */
  const handleDocumentSigned = async (skillId: string) => {
    if (!employee) return;
    const current = employee.trainingProgressByStation[station.id]?.skillsCompleted ?? [];
    if (current.includes(skillId)) return; // already marked
    const updated = {
      stationId: station.id,
      skillsCompleted: [...current, skillId],
      signedOffBy: progress?.signedOffBy,
      signedOffAt: progress?.signedOffAt,
    };
    const nextTrainingProgress = {
      ...employee.trainingProgressByStation,
      [station.id]: updated,
    };
    updateEmployee(employee.id, { trainingProgressByStation: nextTrainingProgress });
    await saveStationProgress(employee.id, updated);
    setDocumentModal(null);
  };

  const total = totalSkills();
  const done = completedSkillsCount(employee.trainingProgressByStation);
  const overallPct = Math.round((done / total) * 100);

  const handleAddNote = async () => {
    if (!noteText.trim() || !user) return;
    setNoteSubmitting(true);
    addNote({ authorId: user.id, authorName: fullName(user), body: noteText });
    setNoteText('');
    setNoteSubmitting(false);
    setTimeout(() => notesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <AppShell>
      {/* Training document modal — opens when a skill has a documentId */}
      {documentModal && employee && user && (
        <TrainingDocumentModal
          documentId={documentModal.documentId}
          stationId={documentModal.stationId}
          employee={employee}
          signerEmployee={employee}
          skillName={station.skills.find((s) => s.id === documentModal.skillId)?.name ?? ''}
          onSigned={() => handleDocumentSigned(documentModal.skillId)}
          onClose={() => setDocumentModal(null)}
        />
      )}
      {/* End-of-Day Quiz modal */}
      {quizSkillId && (() => {
        const quizSkill = station.skills.find((s) => s.id === quizSkillId);
        return quizSkill?.quiz ? (
          <EndOfDayQuizModal
            skillName={quizSkill.name}
            questions={quizSkill.quiz.questions}
            answers={quizSkill.quiz.answers}
            passingScore={quizSkill.quiz.passingScore}
            onPass={async () => { await toggleSkill(quizSkillId); setQuizSkillId(null); }}
            onClose={() => setQuizSkillId(null)}
          />
        ) : null;
      })()}
      {/* Onboarding doc modal — opens inline when a skill has an onboardingDocId */}
      {onboardingDocModal && employee && user && (
        <OnboardingDocModal
          employeeId={params.employeeId}
          docId={onboardingDocModal.docId}
          employee={employee}
          user={user}
          onSigned={() => { handleDocumentSigned(onboardingDocModal.skillId); setOnboardingDocModal(null); }}
          onClose={() => setOnboardingDocModal(null)}
        />
      )}
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/training"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Training dashboard
        </Link>

        {/* Header */}
        <div className="card mb-6 flex items-center gap-5 p-5">
          <Avatar employee={employee} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-ink-400">Trainee</div>
            <h1 className="text-2xl font-bold text-ink-700">{fullName(employee)}</h1>
            <p className="text-sm text-ink-400">
              {getLocation(employee.homeLocationId)?.name} ·{' '}
              {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs uppercase tracking-wider text-ink-400">Overall</div>
            <div className="text-3xl font-bold text-ink-700">{overallPct}%</div>
            <div className="text-xs text-ink-400">
              {done} / {total} skills
            </div>
          </div>
        </div>

        {/* Two-column iPad-friendly layout */}
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          {/* Sections rail */}
          <div className="card p-2">
            {STATIONS.map((s) => {
              const sp = employee.trainingProgressByStation[s.id];
              const sCompleted = sp?.skillsCompleted.length ?? 0;
              const sPct = Math.round((sCompleted / s.skills.length) * 100);
              const signed = !!sp?.signedOffBy;
              const active = s.id === activeStationId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStationId(s.id)}
                  className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                    active ? 'bg-ink-700 text-white' : 'hover:bg-cyan-50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      signed
                        ? 'bg-emerald-100 text-emerald-700'
                        : active
                        ? 'bg-cyan-400 text-white'
                        : 'bg-cyan-50 text-ink-400'
                    }`}
                  >
                    {signed ? <CheckCircle2 size={14} /> : s.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold ${active ? 'text-white' : 'text-ink-700'}`}
                    >
                      {s.name}
                    </div>
                    <div
                      className={`text-xs ${
                        active ? 'text-white/70' : 'text-ink-400'
                      }`}
                    >
                      {sCompleted}/{s.skills.length} · {sPct}%
                    </div>
                    <div
                      className={`mt-1 h-1 overflow-hidden rounded-full ${
                        active ? 'bg-ink-600' : 'bg-cyan-50'
                      }`}
                    >
                      <div
                        className={`h-full ${active ? 'bg-cyan-400' : 'bg-cyan-400'}`}
                        style={{ width: `${sPct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active station */}
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-400">
                  Section {station.order}
                </div>
                <h2 className="text-2xl font-bold text-ink-700">{station.name}</h2>
                <p className="mt-1 text-sm text-ink-400">{station.description}</p>
                <p className="mt-1 text-xs text-ink-400">
                  Content v{station.contentVersion} · last updated{' '}
                  {new Date(station.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {stationSigned ? (
                  <span className="pill bg-emerald-100 text-emerald-800">
                    <CheckCircle2 size={12} /> Signed off
                  </span>
                ) : allStationSkillsDone ? (
                  <span className="pill bg-amber-100 text-amber-800">
                    <Clock size={12} /> Ready for sign-off
                  </span>
                ) : (
                  <span className="pill bg-cyan-50 text-ink-700">
                    <Clock size={12} /> In progress
                  </span>
                )}
                {progress?.signedOffAt && progress.signedOffBy && (
                  <span className="text-[11px] text-ink-400">
                    by {getEmployee(progress.signedOffBy)?.firstName} on{' '}
                    {new Date(progress.signedOffAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {station.skills.map((sk) => {
                const checked = effectiveSkillsCompleted.includes(sk.id);
                const autoCheckedFromOnboarding =
                  sk.onboardingDocId &&
                  signedOnboardingDocIds.has(sk.onboardingDocId as OnboardingDocId) &&
                  !skillsCompleted.includes(sk.id);
                return (
                  <div
                    key={sk.id}
                    className={`rounded-xl border p-4 transition ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-ink-100'
                    } ${stationSigned ? 'opacity-90' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox — quiz skills open a modal; onboarding-linked are auto-filled; others toggle directly */}
                      <button
                        onClick={() => {
                          if (sk.quiz && canSignOff && !stationSigned && !checked) {
                            setQuizSkillId(sk.id);
                          } else if (!sk.onboardingDocId && !sk.quiz) {
                            toggleSkill(sk.id);
                          }
                        }}
                        disabled={!canSignOff || stationSigned || (!!sk.onboardingDocId && !sk.quiz)}
                        title={
                          sk.onboardingDocId
                            ? 'Complete the onboarding document to mark this done'
                            : sk.quiz && !checked
                            ? 'Open End of Day Review quiz'
                            : undefined
                        }
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                          checked
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : sk.onboardingDocId
                            ? 'border-cyan-300 bg-cyan-50'
                            : sk.quiz
                            ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                            : 'border-ink-300 bg-white hover:border-ink-500'
                        } ${(!canSignOff || stationSigned || (!!sk.onboardingDocId && !sk.quiz)) ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {checked ? (
                          <CheckCircle2 size={16} />
                        ) : sk.quiz ? (
                          <ClipboardList size={12} className="text-amber-500" />
                        ) : sk.onboardingDocId ? (
                          <FileText size={12} className="text-cyan-400" />
                        ) : null}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="font-semibold text-ink-700 capitalize-words">{toTitleCase(sk.name)}</div>
                          <span className="text-xs text-ink-400">~{sk.estimatedMinutes} min</span>
                        </div>
                        {(() => {
                          const signoff = progress?.skillSignoffs?.[sk.id];
                          return signoff ? (
                            <div className="mt-0.5 text-xs text-emerald-600">
                              ✓ {signoff.trainerName} · {new Date(signoff.completedAt).toLocaleDateString()}
                            </div>
                          ) : null;
                        })()}
                        <p className="mt-1 text-sm text-ink-600">{sk.description}</p>
                        <ul className="mt-2 space-y-1">
                          {sk.competencyCriteria.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                              {c}
                            </li>
                          ))}
                        </ul>

                        {/* Video embed */}
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

                        {/* Reference images from Brain Blend */}
                        {sk.images && sk.images.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {sk.images.map((img, imgIdx) => (
                              <figure key={imgIdx} className="overflow-hidden rounded-xl border border-ink-100">
                                <img
                                  src={img.src}
                                  alt={img.caption ?? sk.name}
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

                        {/* End-of-Day Quiz button */}
                        {sk.quiz && !stationSigned && !checked && canSignOff && (
                          <div className="mt-3">
                            <button
                              onClick={() => setQuizSkillId(sk.id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition"
                            >
                              <ClipboardList size={12} />
                              Start End of Day Review ({sk.quiz.passingScore}/{sk.quiz.questions.length} to pass)
                            </button>
                          </div>
                        )}

                        {/* Training document — shown when skill requires signing a training-specific doc */}
                        {sk.documentId && !stationSigned && !checked && canSignOff && (
                          <div className="mt-3">
                            <button
                              onClick={() => setDocumentModal({ skillId: sk.id, documentId: sk.documentId!, stationId: station.id })}
                              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                            >
                              <FileText size={12} />
                              View &amp; sign document
                            </button>
                          </div>
                        )}

                        {/* Onboarding doc link — shown when skill is tied to an onboarding document */}
                        {sk.onboardingDocId && !stationSigned && (
                          <div className="mt-3">
                            {autoCheckedFromOnboarding ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 size={12} /> Signed in onboarding
                              </span>
                            ) : (
                              <button
                                onClick={() => setOnboardingDocModal({ skillId: sk.id, docId: sk.onboardingDocId as OnboardingDocId })}
                                className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                              >
                                <FileText size={12} />
                                Sign onboarding document
                              </button>
                            )}
                          </div>
                        )}

                        {/* Per-skill trainer note */}
                        {canSignOff && <SkillNotepad skillId={sk.id} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sign-off zone */}
            {canSignOffStation && allStationSkillsDone && !stationSigned && (
              <div className="mt-6 border-t border-ink-100 pt-6">
                {signoffStationId === station.id ? (
                  <>
                    <h3 className="text-lg font-bold text-ink-700 flex items-center gap-2">
                      <PenLine size={18} /> Trainer sign-off — {station.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-600">
                      You are vouching that {employee.firstName} has demonstrated competency in
                      every skill above.
                    </p>
                    <div className="mt-4">
                      <SignaturePad
                        onSubmit={handleSignOff}
                        signerName={fullName(user)}
                      />
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setSignoffStationId(station.id)}
                    className="btn-primary w-full"
                  >
                    <Stamp size={16} /> Sign off — {station.name}
                  </button>
                )}
              </div>
            )}

            {!canSignOff && (
              <div className="mt-6 rounded-lg bg-cyan-50/50 p-4 text-sm text-ink-600">
                You can mark your own progress on the mobile app during shifts. A trainer, lead, or
                manager signs off here from an iPad once the competency criteria are met.
              </div>
            )}
            {canSignOff && !canSignOffStation && allStationSkillsDone && !stationSigned && (
              <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                All skills checked. Final station sign-off requires a trainer or manager.
              </div>
            )}
          </div>
        </div>

        {/* Trainer Handoff Notes — visible to anyone who can sign off training */}
        {canSignOff && (
          <div className="card mt-4 p-6">
            <div className="mb-4 flex items-center gap-2">
              <NotebookPen size={18} className="text-ink-400" />
              <h2 className="text-lg font-bold text-ink-700">Trainer Notes</h2>
              <span className="text-xs text-ink-400">— leave a note for the next trainer</span>
            </div>

            {/* Notes list */}
            <div className="space-y-4">
              {notesLoading && (
                <p className="text-sm text-ink-400">Loading notes…</p>
              )}
              {!notesLoading && notes.length === 0 && (
                <p className="text-sm text-ink-400 italic">No notes yet.</p>
              )}
              {notes.map((note) => (
                <div key={note.id} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">
                    {note.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold text-ink-700">{note.authorName}</span>
                      <span className="text-xs text-ink-400">
                        {format(parseISO(note.createdAt), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink-600">{note.body}</p>
                  </div>
                </div>
              ))}
              <div ref={notesEndRef} />
            </div>

            {/* Add note */}
            <div className="mt-4 border-t border-ink-100 pt-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddNote();
                }}
                placeholder="Leave a note for the next trainer… (⌘↵ to submit)"
                rows={3}
                className="input w-full resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || noteSubmitting}
                  className="btn-primary"
                >
                  Add note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
