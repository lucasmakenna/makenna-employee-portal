'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, FileText, PenLine, Stamp } from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';
import TrainingDocumentModal from '@/components/TrainingDocumentModal';
import { useCurrentUser } from '@/lib/auth';
import { can } from '@/data/permissions';
import { getEmployee, fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { STATIONS, totalSkills, completedSkillsCount } from '@/data/training';
import { stampSignature, tryGetGeolocation } from '@/lib/signature-audit';
import { appendSignature, getMostRecentRecord } from '@/data/signatures';
import { loadTrainingProgress, saveStationProgress } from '@/lib/training-db';
import { useEmployees } from '@/data/store';

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
  const [activeStationId, setActiveStationId] = useState(STATIONS[0].id);
  const [signoffStationId, setSignoffStationId] = useState<string | null>(null);
  /** documentModal: { skillId, documentId } when the PDF modal is open */
  const [documentModal, setDocumentModal] = useState<{ skillId: string; documentId: string } | null>(null);

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

  const toggleSkill = async (skillId: string) => {
    if (!canSignOff) return;
    const current = employee.trainingProgressByStation[station.id]?.skillsCompleted ?? [];
    const next = current.includes(skillId)
      ? current.filter((s) => s !== skillId)
      : [...current, skillId];
    const updated = {
      stationId: station.id,
      skillsCompleted: next,
      signedOffBy: progress?.signedOffBy,
      signedOffAt: progress?.signedOffAt,
    };
    const nextTrainingProgress = {
      ...employee.trainingProgressByStation,
      [station.id]: updated,
    };
    // Write to localStorage immediately so progress survives a page refresh.
    updateEmployee(employee.id, { trainingProgressByStation: nextTrainingProgress });
    // Also persist to Supabase when configured.
    await saveStationProgress(employee.id, updated);
  };

  const allStationSkillsDone = skillsCompleted.length === station.skills.length;
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
      skillsCompleted,
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

  return (
    <AppShell>
      {/* Training document modal — opens when a skill has a documentId */}
      {documentModal && employee && user && (
        <TrainingDocumentModal
          documentId={documentModal.documentId}
          employee={employee}
          signerEmployee={user}
          skillName={station.skills.find((s) => s.id === documentModal.skillId)?.name ?? ''}
          onSigned={() => handleDocumentSigned(documentModal.skillId)}
          onClose={() => setDocumentModal(null)}
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
                const checked = skillsCompleted.includes(sk.id);
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
                      {/* Checkbox — manual toggle for skills without a document; auto-filled for doc skills */}
                      <button
                        onClick={() => !sk.documentId && toggleSkill(sk.id)}
                        disabled={!canSignOff || stationSigned || !!sk.documentId}
                        title={sk.documentId ? 'Sign the document below to mark complete' : undefined}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                          checked
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : sk.documentId
                            ? 'border-cyan-300 bg-cyan-50'
                            : 'border-ink-300 bg-white hover:border-ink-500'
                        } ${(!canSignOff || stationSigned || !!sk.documentId) ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {checked ? (
                          <CheckCircle2 size={16} />
                        ) : sk.documentId ? (
                          <FileText size={12} className="text-cyan-400" />
                        ) : null}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <div className="font-semibold text-ink-700">{sk.name}</div>
                          <span className="text-xs text-ink-400">~{sk.estimatedMinutes} min</span>
                        </div>
                        <p className="mt-1 text-sm text-ink-600">{sk.description}</p>
                        <ul className="mt-2 space-y-1">
                          {sk.competencyCriteria.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-ink-600">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                              {c}
                            </li>
                          ))}
                        </ul>

                        {/* Document button — shown when skill has an associated document */}
                        {sk.documentId && canSignOff && !stationSigned && (
                          <div className="mt-3">
                            {checked ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 size={12} /> Document signed &amp; filed
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  setDocumentModal({ skillId: sk.id, documentId: sk.documentId! })
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                              >
                                <FileText size={12} />
                                View &amp; sign document
                              </button>
                            )}
                          </div>
                        )}
                        {sk.documentId && !canSignOff && !checked && (
                          <div className="mt-2 text-xs text-ink-400">
                            Requires a trainer or manager to open and sign the document.
                          </div>
                        )}
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
      </div>
    </AppShell>
  );
}
