'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, FileText,
  CheckCircle, XCircle, ClipboardList, GraduationCap,
  ShieldCheck, FileCheck, BookOpen, Link2, Trash2, Clock, Download,
  ShieldAlert, ThumbsUp, ThumbsDown, ChevronRight, Send, KeyRound,
} from 'lucide-react';
import { ACCOUNTABILITY_LABELS, ACCOUNTABILITY_COLORS } from '@/types';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import EmployeeAttachments from '@/components/EmployeeAttachments';
import { useCurrentUser } from '@/lib/auth';
import { fullName } from '@/data/employees';
import { useEmployees, usePackets, useAccountability } from '@/data/store';
import { getLocation, LOCATIONS } from '@/data/locations';
import { loadSignaturesForEmployee } from '@/data/signatures';
import { loadTrainingProgress } from '@/lib/training-db';
import type { OnboardingPacket, Employee, LocationId } from '@/types';
import { STATIONS, totalSkills, completedSkillsCount } from '@/data/training';
import { ROLE_LABELS } from '@/types';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

// ─── Employee File types ───────────────────────────────────────────────────────

type FileEvent =
  | { kind: 'document'; title: string; signedAt: string; docId?: string; pdfStorageUrl?: string; signerName: string }
  | { kind: 'training_section'; sectionName: string; signedOffAt: string; signedOffBy?: string }
  | { kind: 'training_complete'; completedAt: string }
  | { kind: 'test'; score: number; passed: boolean; completedAt: string; attemptId: string }
  | { kind: 'hired'; hiredOn: string };

// ─── Employee File tab ─────────────────────────────────────────────────────────

type PacketTask = {
  id: string;
  title: string;
  required: boolean;
  signed: boolean;
  signedAt?: string;
  signedByName?: string;
  signatureRecordId?: string;
  pdfStorageUrl?: string;
  formData?: object;
};

function EmployeeFileTab({
  employeeId, hiredOn, packet: packetProp, employee, onUpdateAttachments, currentUserId,
}: {
  employeeId: string;
  hiredOn: string;
  packet?: OnboardingPacket;
  employee: Employee;
  onUpdateAttachments: (attachments: import('@/types').EmployeeAttachment[]) => void;
  currentUserId: string;
}) {
  const [events, setEvents] = useState<FileEvent[]>([]);
  const [tasks, setTasks] = useState<PacketTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const collected: FileEvent[] = [];

      // Hired event
      collected.push({ kind: 'hired', hiredOn });

      // Onboarding documents — prefer localStorage (via loadSignaturesForEmployee) over Supabase-only
      const allSigs = await loadSignaturesForEmployee(employeeId);
      const onboardingSigs = allSigs
        .filter((r) => (r.context as any)?.kind === 'onboarding')
        .sort((a, b) => (a.signedAtIso < b.signedAtIso ? -1 : 1));

      // Onboarding packet — prefer in-memory prop over Supabase query
      const taskMap: Record<string, { pdfStorageUrl?: string }> = {};
      if (packetProp?.tasks) {
        const packetTasks: PacketTask[] = packetProp.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          required: t.required ?? true,
          signed: t.signed ?? false,
          signedAt: t.signedAt,
          signedByName: t.signedByName,
          signatureRecordId: t.signatureRecordId,
          pdfStorageUrl: t.pdfStorageUrl,
          formData: t.formData as object | undefined,
        }));
        setTasks(packetTasks);
        for (const t of packetProp.tasks) {
          taskMap[t.id] = { pdfStorageUrl: t.pdfStorageUrl };
        }
      } else {
        // Fallback: fetch from Supabase if no in-memory packet yet
        const { data: packetRow } = await supabase
          .from('onboarding_packets')
          .select('tasks')
          .eq('employee_id', employeeId)
          .single();
        if (packetRow?.tasks) {
          const packetTasks: PacketTask[] = (packetRow.tasks as any[]).map((t) => ({
            id: t.id,
            title: t.title,
            required: t.required ?? true,
            signed: t.signed ?? false,
            signedAt: t.signedAt,
            signedByName: t.signedByName,
            signatureRecordId: t.signatureRecordId,
            pdfStorageUrl: t.pdfStorageUrl,
            formData: t.formData as object | undefined,
          }));
          setTasks(packetTasks);
          for (const t of packetRow.tasks as any[]) {
            taskMap[t.id] = { pdfStorageUrl: t.pdfStorageUrl };
          }
        }
      }

      const seenSigIds = new Set<string>();
      for (const sig of onboardingSigs) {
        if (seenSigIds.has(sig.id)) continue;
        seenSigIds.add(sig.id);
        const ctx = sig.context as any;
        const docId = ctx?.docId as string | undefined;
        const pdfStorageUrl = docId ? taskMap[docId]?.pdfStorageUrl : undefined;
        collected.push({
          kind: 'document',
          title: sig.documentTitle,
          signedAt: sig.signedAtIso,
          docId,
          pdfStorageUrl,
          signerName: sig.signerLegalName,
        });
      }

      // Training sections — prefer in-memory store, fall back to Supabase
      type ProgressRow = { station_id: string; signed_off_at: string; signed_off_by?: string };
      let progressRows: ProgressRow[] = [];

      // Build from in-memory trainingProgressByStation first
      const inMemoryProgress = employee.trainingProgressByStation ?? {};
      const inMemoryRows: ProgressRow[] = Object.entries(inMemoryProgress)
        .filter(([, sp]) => !!sp?.signedOffAt)
        .map(([stationId, sp]) => ({
          station_id: stationId,
          signed_off_at: sp!.signedOffAt!,
          signed_off_by: sp!.signedOffBy,
        }))
        .sort((a, b) => (a.signed_off_at < b.signed_off_at ? -1 : 1));

      if (inMemoryRows.length > 0) {
        progressRows = inMemoryRows;
      } else {
        // Fall back to Supabase if nothing in-memory yet
        const { data } = await supabase
          .from('training_progress')
          .select('station_id, signed_off_at, signed_off_by')
          .eq('employee_id', employeeId)
          .not('signed_off_at', 'is', null)
          .order('signed_off_at', { ascending: true });
        if (data) progressRows = data as ProgressRow[];
      }

      for (const row of progressRows) {
        const station = STATIONS.find((s) => s.id === row.station_id);
        collected.push({
          kind: 'training_section',
          sectionName: station?.name ?? row.station_id,
          signedOffAt: row.signed_off_at,
          signedOffBy: row.signed_off_by ?? undefined,
        });
      }
      if (progressRows.length === STATIONS.length && progressRows.length > 0) {
        const last = progressRows[progressRows.length - 1];
        collected.push({ kind: 'training_complete', completedAt: last.signed_off_at });
      }

      // Test attempts
      const { data: tests } = await supabase
        .from('recipes_test_attempts')
        .select('id, completed_at, score, passed')
        .eq('employee_id', employeeId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: true });

      if (tests) {
        for (const t of tests) {
          collected.push({
            kind: 'test',
            score: t.score ?? 0,
            passed: t.passed ?? false,
            completedAt: t.completed_at,
            attemptId: t.id,
          });
        }
      }

      // Sort everything chronologically
      collected.sort((a, b) => {
        const timeOf = (e: FileEvent) => {
          if (e.kind === 'hired') return e.hiredOn;
          if (e.kind === 'document') return e.signedAt;
          if (e.kind === 'training_section') return e.signedOffAt;
          if (e.kind === 'training_complete') return e.completedAt;
          if (e.kind === 'test') return e.completedAt;
          return '';
        };
        return timeOf(a) < timeOf(b) ? -1 : 1;
      });

      setEvents(collected);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, packetProp]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-ink-400 text-sm">
        Loading employee file…
      </div>
    );
  }

  const signedCount = tasks.filter((t) => t.signed).length;
  const requiredCount = tasks.filter((t) => t.required).length;

  return (
    <div className="space-y-8">
      <ShareFileLinkButton employeeId={employeeId} shareToken={employee.shareToken} />

      {/* Onboarding Documents */}
      {tasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Onboarding Documents</h3>
            <span className={clsx(
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              signedCount === requiredCount ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
            )}>
              {signedCount} / {tasks.length} signed
            </span>
          </div>
          <div className="rounded-xl border border-ink-100 overflow-hidden divide-y divide-ink-100">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-4 py-3 bg-white">
                {t.signed ? (
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                ) : (
                  <Clock size={18} className="text-ink-300 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-700">{t.title}</span>
                    {!t.required && (
                      <span className="text-xs text-ink-400 bg-ink-100 rounded-full px-2 py-0.5">Optional</span>
                    )}
                  </div>
                  {t.signed && t.signedAt ? (
                    <div className="text-xs text-ink-400 mt-0.5">
                      Signed by {t.signedByName} · {format(parseISO(t.signedAt), 'MMM d, yyyy · h:mm a')}
                    </div>
                  ) : (
                    <div className="text-xs text-ink-400 mt-0.5">Pending</div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {(t.id === 'w4' || t.id === 'i9') && t.signed && t.formData && (
                    <ViewDownloadPdfButton docId={t.id as 'w4' | 'i9'} formData={t.formData} />
                  )}
                  {t.pdfStorageUrl && (
                    <a
                      href={t.pdfStorageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                    >
                      <FileText size={11} /> PDF
                    </a>
                  )}
                  {t.signatureRecordId && (
                    <Link
                      href={`/onboarding/${employeeId}/certificate/${t.signatureRecordId}`}
                      className="flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition"
                    >
                      <ShieldCheck size={11} /> Certificate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos & Files */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400 mb-3">Photos &amp; Files</h3>
        <EmployeeAttachments
          attachments={employee.attachments ?? []}
          onChange={onUpdateAttachments}
          uploaderId={currentUserId}
        />
      </div>

      {/* Activity timeline */}
      {events.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400 mb-3">Activity Timeline</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-ink-100" />

      <ul className="space-y-0">
        {events.map((ev, i) => {
          const isLast = i === events.length - 1;

          if (ev.kind === 'hired') {
            return (
              <TimelineItem key="hired" icon={<Calendar size={14} />} iconBg="bg-ink-800" isLast={isLast}>
                <div className="font-semibold text-ink-700 text-sm">Hired</div>
                <div className="text-xs text-ink-400">{format(parseISO(ev.hiredOn), 'MMMM d, yyyy')}</div>
              </TimelineItem>
            );
          }

          if (ev.kind === 'document') {
            const isGovForm = ev.docId === 'w4' || ev.docId === 'i9';
            return (
              <TimelineItem key={`doc-${ev.signedAt}-${ev.title}`} icon={<FileCheck size={14} />} iconBg="bg-royal-600" isLast={isLast}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-ink-700 text-sm">{ev.title}</div>
                    <div className="text-xs text-ink-400 mt-0.5">
                      Signed by {ev.signerName} · {format(parseISO(ev.signedAt), 'MMM d, yyyy · h:mm a')}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                      <ShieldCheck size={11} />
                      <span>ESIGN Act compliant</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {isGovForm && ev.pdfStorageUrl && (
                      <a
                        href={ev.pdfStorageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                      >
                        <FileText size={11} /> View PDF
                      </a>
                    )}
                  </div>
                </div>
              </TimelineItem>
            );
          }

          if (ev.kind === 'training_section') {
            return (
              <TimelineItem key={`section-${ev.signedOffAt}-${ev.sectionName}`} icon={<BookOpen size={14} />} iconBg="bg-cyan-500" isLast={isLast}>
                <div className="font-semibold text-ink-700 text-sm">{ev.sectionName} — signed off</div>
                <div className="text-xs text-ink-400 mt-0.5">
                  {format(parseISO(ev.signedOffAt), 'MMM d, yyyy · h:mm a')}
                  {ev.signedOffBy && ` · by ${ev.signedOffBy}`}
                </div>
              </TimelineItem>
            );
          }

          if (ev.kind === 'training_complete') {
            return (
              <TimelineItem key="training_complete" icon={<GraduationCap size={14} />} iconBg="bg-emerald-500" isLast={isLast}>
                <div className="font-semibold text-emerald-700 text-sm">Training complete</div>
                <div className="text-xs text-ink-400 mt-0.5">
                  All {STATIONS.length} sections signed off · {format(parseISO(ev.completedAt), 'MMM d, yyyy')}
                </div>
              </TimelineItem>
            );
          }

          if (ev.kind === 'test') {
            return (
              <TimelineItem key={`test-${ev.attemptId}`} icon={<ClipboardList size={14} />} iconBg={ev.passed ? 'bg-emerald-500' : 'bg-hibiscus-500'} isLast={isLast}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-700 text-sm">Barista Recipe Test</span>
                      <span className={clsx(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        ev.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-hibiscus-100 text-hibiscus-700',
                      )}>
                        {ev.passed ? 'PASSED' : 'NOT PASSED'}
                      </span>
                    </div>
                    <div className="text-xs text-ink-400 mt-0.5">
                      Score: {ev.score}% · {format(parseISO(ev.completedAt), 'MMM d, yyyy · h:mm a')}
                    </div>
                  </div>
                  {ev.passed ? (
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-hibiscus-400 shrink-0 mt-0.5" />
                  )}
                </div>
              </TimelineItem>
            );
          }

          return null;
        })}
      </ul>
    </div>
        </div>
      )}
    </div>
  );
}

function ShareFileLinkButton({ employeeId, shareToken }: { employeeId: string; shareToken?: string }) {
  const [token, setToken] = useState(shareToken);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    let t = token;
    if (!t) {
      setLoading(true);
      const res = await fetch(`/api/employee-file/generate/${employeeId}`, { method: 'POST' });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) return;
      t = json.shareToken;
      setToken(t);
    }
    const url = `${window.location.origin}/file/${t}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-cyan-200 bg-cyan-50/50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-ink-700">Employee file link</p>
        <p className="text-xs text-ink-400">A read-only link this employee can open without logging in.</p>
      </div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition disabled:opacity-50"
      >
        <Link2 size={14} /> {loading ? 'Generating…' : copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}

function ViewDownloadPdfButton({ docId, formData }: { docId: 'w4' | 'i9'; formData: object }) {
  const [loadingView, setLoadingView] = useState(false);
  const [loadingDl, setLoadingDl] = useState(false);

  const fetchPdf = async (): Promise<string | null> => {
    const res = await fetch('/api/forms/pdf/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId, formData }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const handleView = async () => {
    setLoadingView(true);
    try {
      const url = await fetchPdf();
      if (url) window.open(url, '_blank');
    } finally {
      setLoadingView(false);
    }
  };

  const handleDownload = async () => {
    setLoadingDl(true);
    try {
      const url = await fetchPdf();
      if (url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docId.toUpperCase()}_filled.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoadingDl(false);
    }
  };

  return (
    <div className="flex gap-1.5">
      <button
        onClick={handleView}
        disabled={loadingView || loadingDl}
        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition disabled:opacity-50"
      >
        <FileText size={12} />
        {loadingView ? 'Loading…' : `View ${docId.toUpperCase()}`}
      </button>
      <button
        onClick={handleDownload}
        disabled={loadingView || loadingDl}
        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition disabled:opacity-50"
      >
        <Download size={12} />
        {loadingDl ? 'Saving…' : 'Save PDF'}
      </button>
    </div>
  );
}

function TimelineItem({
  icon, iconBg, isLast, children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={clsx('relative flex gap-4', isLast ? 'pb-0' : 'pb-6')}>
      <div className={clsx('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm', iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pt-1.5 pr-2">
        {children}
      </div>
    </li>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'file' | 'accountability';

export default function TeamMemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees, remove, update: updateEmployee } = useEmployees();
  const { get: getPacket } = usePackets();
  const { records: allAccountabilityRecords } = useAccountability();
  const [tab, setTab] = useState<Tab>('overview');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sent' | 'resent' | 'error'>('idle');
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [setPasswordStatus, setSetPasswordStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [setPasswordError, setSetPasswordError] = useState('');
  const canManage = user?.role === 'admin' || user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  async function handleSetPassword(emp: Employee) {
    if (!newPassword || newPassword.length < 6) return;
    setSetPasswordStatus('saving');
    setSetPasswordError('');
    try {
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emp.email, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setSetPasswordStatus('done');
      setNewPassword('');
      setTimeout(() => { setSetPasswordStatus('idle'); setShowSetPassword(false); }, 3000);
    } catch (err: unknown) {
      setSetPasswordError(err instanceof Error ? err.message : 'Something went wrong');
      setSetPasswordStatus('error');
    }
  }

  async function sendPortalInvite(emp: Employee) {
    setInviteSending(true);
    setInviteStatus('idle');
    try {
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emp.email, name: fullName(emp) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send invite');
      setInviteStatus(data.resent ? 'resent' : 'sent');
      setTimeout(() => setInviteStatus('idle'), 4000);
    } catch {
      setInviteStatus('error');
      setTimeout(() => setInviteStatus('idle'), 4000);
    } finally {
      setInviteSending(false);
    }
  }

  function copyInviteLink(empId: string) {
    const url = `${window.location.origin}/activate/${empId}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    });
  }

  const employee = employees.find((e) => e.id === params.id);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  // Overlay Supabase training progress on mount so the % shown here matches
  // the Training tab, which reads from the same training_progress table.
  useEffect(() => {
    loadTrainingProgress(params.id).then((progress) => {
      if (Object.keys(progress).length > 0) {
        updateEmployee(params.id, { trainingProgressByStation: progress });
      }
    });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!employee) {
    return (
      <AppShell>
        <p className="p-8 text-ink-400">Team member not found.</p>
      </AppShell>
    );
  }

  const total = totalSkills();
  const done = completedSkillsCount(employee.trainingProgressByStation);
  const pct = Math.round((done / total) * 100);

  return (
    <>
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <Link href="/team" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700">
          <ArrowLeft size={16} /> Team
        </Link>

        {/* Header card */}
        <div className="card mb-6 flex items-start gap-5 p-6">
          <Avatar employee={employee} size="xl" />
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-ink-400">
              {ROLE_LABELS[employee.role]}
            </div>
            <h1 className="text-3xl font-bold text-ink-700">{fullName(employee)}</h1>
            <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2 text-ink-700">
                <Mail size={14} className="text-ink-400" />
                {employee.email}
              </div>
              <div className="flex items-center gap-2 text-ink-700">
                <Phone size={14} className="text-ink-400" />
                {employee.phone}
              </div>
              <div className="flex items-start gap-2 text-ink-700">
                <MapPin size={14} className="text-ink-400 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <span className="font-medium">{getLocation(employee.homeLocationId)?.name}</span>
                  {(employee.additionalLocationIds ?? []).map((lid) => (
                    <span key={lid} className="rounded-full bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 text-xs text-cyan-700">
                      {getLocation(lid)?.name}
                    </span>
                  ))}
                  {canManage && (
                    <button
                      onClick={() => {
                        const available = LOCATIONS.filter(
                          (l) => l.id !== employee.homeLocationId && !(employee.additionalLocationIds ?? []).includes(l.id as LocationId)
                        );
                        if (available.length === 0) return;
                        const chosen = window.prompt(
                          `Add location for ${employee.firstName}?\n\nAvailable:\n${available.map((l, i) => `${i + 1}. ${l.name}`).join('\n')}\n\nType a number:`
                        );
                        const idx = parseInt(chosen ?? '') - 1;
                        if (isNaN(idx) || idx < 0 || idx >= available.length) return;
                        updateEmployee(employee.id, {
                          additionalLocationIds: [...(employee.additionalLocationIds ?? []), available[idx].id as LocationId],
                        });
                      }}
                      className="rounded-full border border-dashed border-ink-300 px-1.5 py-0.5 text-xs text-ink-400 hover:border-cyan-400 hover:text-cyan-600 transition"
                    >
                      + location
                    </button>
                  )}
                  {canManage && (employee.additionalLocationIds ?? []).length > 0 && (
                    <button
                      onClick={() => {
                        const locs = employee.additionalLocationIds ?? [];
                        const chosen = window.prompt(
                          `Remove which location?\n${locs.map((id, i) => `${i + 1}. ${getLocation(id)?.name ?? id}`).join('\n')}\n\nType a number:`
                        );
                        const idx = parseInt(chosen ?? '') - 1;
                        if (isNaN(idx) || idx < 0 || idx >= locs.length) return;
                        updateEmployee(employee.id, {
                          additionalLocationIds: locs.filter((_, i) => i !== idx),
                        });
                      }}
                      className="rounded-full border border-dashed border-hibiscus-200 px-1.5 py-0.5 text-xs text-hibiscus-400 hover:border-hibiscus-400 hover:text-hibiscus-600 transition"
                    >
                      − remove
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-700">
                <Calendar size={14} className="text-ink-400" />
                Hired {format(parseISO(employee.hiredOn), 'MMM d, yyyy')}
              </div>
            </div>
            {canManage && employee.role === 'barista' && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-xs text-ink-400">
                  Baristas don't have portal logins — use the Employee File link in the Employee File tab to share their file.
                </p>
                {isAdmin && employee.id !== user?.id && (
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="flex items-center gap-2 rounded-full border border-hibiscus-200 px-4 py-1.5 text-xs font-semibold text-hibiscus-600 hover:bg-hibiscus-50 transition"
                  >
                    <Trash2 size={13} /> Remove employee
                  </button>
                )}
              </div>
            )}
            {canManage && employee.role !== 'barista' && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => sendPortalInvite(employee)}
                      disabled={inviteSending}
                      className={clsx(
                        'flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition',
                        inviteStatus === 'sent' || inviteStatus === 'resent'
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : inviteStatus === 'error'
                          ? 'border-hibiscus-300 bg-hibiscus-50 text-hibiscus-700'
                          : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
                      )}
                    >
                      <Send size={13} />
                      {inviteSending ? 'Sending…'
                        : inviteStatus === 'sent' ? 'Invite sent!'
                        : inviteStatus === 'resent' ? 'Reset link sent!'
                        : inviteStatus === 'error' ? 'Failed — try again'
                        : 'Send portal invite'}
                    </button>
                    <button
                      onClick={() => copyInviteLink(employee.id)}
                      className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition"
                    >
                      <Link2 size={13} />
                      {linkCopied ? 'Link copied!' : 'Copy invite link'}
                    </button>
                  </div>
                  <p className="text-xs text-ink-400">
                    "Send portal invite" emails them a setup link. If they already have an account, it sends a password reset instead.
                  </p>
                  {/* Set password directly */}
                  {!showSetPassword ? (
                    <button
                      onClick={() => setShowSetPassword(true)}
                      className="flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-700 transition mt-1"
                    >
                      <KeyRound size={12} /> Set password manually
                    </button>
                  ) : (
                    <div className="mt-2 flex flex-col gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3">
                      <p className="text-xs font-semibold text-ink-600">Set a password for {employee.firstName}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (min 6 chars)"
                          className="input flex-1 text-sm py-1.5"
                        />
                        <button
                          onClick={() => handleSetPassword(employee)}
                          disabled={newPassword.length < 6 || setPasswordStatus === 'saving'}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-600 transition disabled:opacity-50"
                        >
                          {setPasswordStatus === 'saving' ? 'Saving…' : setPasswordStatus === 'done' ? '✓ Saved!' : 'Save'}
                        </button>
                        <button onClick={() => { setShowSetPassword(false); setNewPassword(''); setSetPasswordStatus('idle'); }} className="text-xs text-ink-400 hover:text-ink-700">Cancel</button>
                      </div>
                      {setPasswordError && <p className="text-xs text-hibiscus-600">{setPasswordError}</p>}
                      {setPasswordStatus === 'done' && <p className="text-xs text-emerald-600">Password updated! Share it with {employee.firstName} directly.</p>}
                    </div>
                  )}
                </div>
                {isAdmin && employee.id !== user?.id && (
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="flex items-center gap-2 rounded-full border border-hibiscus-200 px-4 py-1.5 text-xs font-semibold text-hibiscus-600 hover:bg-hibiscus-50 transition"
                  >
                    <Trash2 size={13} /> Remove employee
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(() => {
          const empRecords = allAccountabilityRecords.filter((r) => r.employeeId === employee.id);
          return (
            <div className="mb-6 flex gap-1 border-b border-ink-100">
              {(['overview', 'file', 'accountability'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={clsx(
                    'px-5 py-2.5 text-sm font-semibold border-b-2 transition -mb-px flex items-center gap-1.5',
                    tab === t
                      ? 'border-cyan-400 text-cyan-600'
                      : 'border-transparent text-ink-400 hover:text-ink-700',
                  )}
                >
                  {t === 'overview' ? 'Overview' : t === 'file' ? 'Employee File' : (
                    <>
                      Accountability
                      {empRecords.length > 0 && (
                        <span className={clsx('rounded-full px-1.5 py-0.5 text-xs font-bold', tab === t ? 'bg-cyan-100 text-cyan-700' : 'bg-ink-100 text-ink-500')}>
                          {empRecords.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          );
        })()}

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Training overview */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink-700">Training overview</h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-ink-700">{pct}%</span>
                <span className="text-sm text-ink-400">{done} of {total} skills</span>
              </div>
              <div className="mt-3 space-y-2">
                {STATIONS.map((s) => {
                  const sp = employee.trainingProgressByStation[s.id];
                  const c = sp?.skillsCompleted.length ?? 0;
                  const sPct = Math.round((c / s.skills.length) * 100);
                  return (
                    <div key={s.id}>
                      <div className="flex justify-between text-xs">
                        <span className="text-ink-700">{s.name}</span>
                        <span className="text-ink-400">{c}/{s.skills.length}</span>
                      </div>
                      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-cyan-50">
                        <div className="h-full rounded-full bg-cyan-400" style={{ width: `${sPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href={`/training/${employee.id}`} className="btn-secondary mt-5 w-full">
                Open training detail
              </Link>
            </div>

            {/* Certifications */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink-700">Certifications</h2>
              <div className="mt-3 space-y-2">
                {employee.certifications.length === 0 && (
                  <p className="text-sm text-ink-400">No certifications on file.</p>
                )}
                {employee.certifications.map((c) => {
                  const days = Math.round(
                    (new Date(c.expiresOn).getTime() - Date.now()) / 86400000,
                  );
                  return (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                      <div>
                        <div className="font-semibold text-ink-700">{c.name}</div>
                        <div className="text-xs text-ink-400">
                          Expires {format(parseISO(c.expiresOn), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <span className={`pill ${days < 0 ? 'bg-red-100 text-red-800' : days < 90 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {days < 0 ? 'Expired' : `${days}d`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Employee File tab */}
        {tab === 'file' && (
          <div className="card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink-700">Employee File</h2>
                <p className="text-xs text-ink-400 mt-0.5">
                  All signed documents, training, and test records on file for {employee.firstName} {employee.lastName}.
                </p>
              </div>
            </div>
            <EmployeeFileTab
              employeeId={employee.id}
              hiredOn={employee.hiredOn}
              packet={getPacket(employee.id)}
              employee={employee}
              onUpdateAttachments={(attachments) => updateEmployee(employee.id, { attachments })}
              currentUserId={user?.id ?? ''}
            />
          </div>
        )}

        {/* Accountability tab */}
        {tab === 'accountability' && (() => {
          const empRecords = allAccountabilityRecords
            .filter((r) => r.employeeId === employee.id)
            .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink-700 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-hibiscus-500" />
                    Accountability Records
                  </h2>
                  <p className="text-xs text-ink-400 mt-0.5">
                    All formal disciplinary and HR records for {employee.firstName}.
                  </p>
                </div>
                {canManage && (
                  <Link href="/accountability" className="btn-hibiscus text-sm">
                    <ShieldAlert size={14} /> Issue Record
                  </Link>
                )}
              </div>

              {empRecords.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
                  <ShieldAlert size={28} className="mx-auto mb-3 text-ink-200" />
                  <p className="text-sm font-semibold text-ink-400">No accountability records on file</p>
                  <p className="text-xs text-ink-300 mt-1">Records will appear here when issued.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {empRecords.map((record) => (
                    <Link
                      key={record.id}
                      href={`/accountability/${record.id}`}
                      className="group flex items-start gap-4 rounded-xl border border-ink-100 bg-white p-4 hover:border-cyan-200 hover:shadow-sm transition"
                    >
                      <div className="flex-1 min-w-0">
                        {/* Type + status badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                            {ACCOUNTABILITY_LABELS[record.type]}
                          </span>
                          {record.employeeAgreed === true && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                              <ThumbsUp size={10} /> Agreed
                            </span>
                          )}
                          {record.employeeAgreed === false && (
                            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              <ThumbsDown size={10} /> Disputed
                            </span>
                          )}
                          {record.employeeAcknowledgedAt && record.employeeAgreed === undefined && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Acknowledged</span>
                          )}
                          {!record.employeeAcknowledgedAt && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pending response</span>
                          )}
                        </div>
                        <p className="font-semibold text-sm text-ink-700 truncate">{record.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">
                          {format(parseISO(record.issuedAt), 'MMM d, yyyy')} · Issued by {record.issuedByName}
                        </p>
                        {record.employeeResponse && (
                          <p className="mt-1.5 text-xs text-ink-500 italic truncate">
                            Employee: "{record.employeeResponse}"
                          </p>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-ink-300 shrink-0 mt-1 group-hover:text-cyan-400 transition" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </AppShell>

    {showRemoveModal && user && (
      <RemoveEmployeeModal
        employeeName={fullName(employee)}
        adminEmail={user.email}
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={() => { remove(employee.id); router.replace('/team'); }}
      />
    )}
    </>
  );
}

function RemoveEmployeeModal({
  employeeName,
  adminEmail,
  onCancel,
  onConfirm,
}: {
  employeeName: string;
  adminEmail: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) { setError('Please enter a reason for termination.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          },
          body: JSON.stringify({ email: adminEmail, password }),
        },
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error_description || errData.msg || errData.error || 'Incorrect password.');
        setLoading(false);
        return;
      }
      onConfirm();
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-hibiscus-600">Remove Employee</h2>
          <p className="mt-1 text-sm text-ink-500">
            You are about to remove <strong>{employeeName}</strong> from the portal. This cannot be undone.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Reason for termination</label>
            <textarea
              className="input w-full h-24 resize-none"
              placeholder="e.g. Voluntary resignation, end of season, policy violation…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label">Your password (to confirm)</label>
            <input
              type="password"
              className="input w-full"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-hibiscus-600 bg-hibiscus-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
            <button
              type="submit"
              disabled={loading || !password || !reason.trim()}
              className="flex-1 rounded-full bg-hibiscus-500 px-4 py-2 text-sm font-semibold text-white hover:bg-hibiscus-600 disabled:opacity-40 transition"
            >
              {loading ? 'Verifying…' : 'Remove employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
