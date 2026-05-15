'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, FileText,
  CheckCircle, XCircle, ClipboardList, GraduationCap,
  ShieldCheck, FileCheck, BookOpen, Link2,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { fullName } from '@/data/employees';
import { useEmployees } from '@/data/store';
import { getLocation } from '@/data/locations';
import { STATIONS, totalSkills, completedSkillsCount } from '@/data/training';
import { ROLE_LABELS, RECIPES_TEST_PASSING_SCORE } from '@/types';
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

function EmployeeFileTab({ employeeId, hiredOn }: { employeeId: string; hiredOn: string }) {
  const [events, setEvents] = useState<FileEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const collected: FileEvent[] = [];

      // Hired event
      collected.push({ kind: 'hired', hiredOn });

      // Onboarding documents — from signature_audit_records, kind=onboarding only
      const { data: sigs } = await supabase
        .from('signature_audit_records')
        .select('id, document_title, signed_at_iso, signer_legal_name, context')
        .contains('context', { kind: 'onboarding', employeeId })
        .order('signed_at_iso', { ascending: true });

      // Onboarding packet — for pdfStorageUrl on W-4/I-9
      const { data: packet } = await supabase
        .from('onboarding_packets')
        .select('tasks')
        .eq('employee_id', employeeId)
        .single();

      const taskMap: Record<string, { pdfStorageUrl?: string }> = {};
      if (packet?.tasks) {
        for (const t of packet.tasks as any[]) {
          taskMap[t.id] = { pdfStorageUrl: t.pdfStorageUrl };
        }
      }

      const seenSigIds = new Set<string>();
      if (sigs) {
        for (const sig of sigs) {
          if (seenSigIds.has(sig.id)) continue;
          seenSigIds.add(sig.id);
          const ctx = sig.context as any;
          const docId = ctx?.docId as string | undefined;
          const pdfStorageUrl = docId ? taskMap[docId]?.pdfStorageUrl : undefined;
          collected.push({
            kind: 'document',
            title: sig.document_title,
            signedAt: sig.signed_at_iso,
            docId,
            pdfStorageUrl,
            signerName: sig.signer_legal_name,
          });
        }
      }

      // Training sections — from training_progress
      const { data: progress } = await supabase
        .from('training_progress')
        .select('station_id, signed_off_at, signed_off_by')
        .eq('employee_id', employeeId)
        .not('signed_off_at', 'is', null)
        .order('signed_off_at', { ascending: true });

      if (progress) {
        for (const row of progress) {
          const station = STATIONS.find((s) => s.id === row.station_id);
          collected.push({
            kind: 'training_section',
            sectionName: station?.name ?? row.station_id,
            signedOffAt: row.signed_off_at,
            signedOffBy: row.signed_off_by ?? undefined,
          });
        }
        // Training complete = all sections signed off
        if (progress.length === STATIONS.length && progress.length > 0) {
          const last = progress[progress.length - 1];
          collected.push({ kind: 'training_complete', completedAt: last.signed_off_at });
        }
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
  }, [employeeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-ink-400 text-sm">
        Loading employee file…
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-sm text-ink-400 py-8 text-center">No records on file yet.</p>;
  }

  return (
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

type Tab = 'overview' | 'file';

export default function TeamMemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees } = useEmployees();
  const [tab, setTab] = useState<Tab>('overview');
  const [linkCopied, setLinkCopied] = useState(false);
  const canManage = user?.role === 'admin' || user?.role === 'manager';

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
              <div className="flex items-center gap-2 text-ink-700">
                <MapPin size={14} className="text-ink-400" />
                {getLocation(employee.homeLocationId)?.name}
              </div>
              <div className="flex items-center gap-2 text-ink-700">
                <Calendar size={14} className="text-ink-400" />
                Hired {format(parseISO(employee.hiredOn), 'MMM d, yyyy')}
              </div>
            </div>
            {canManage && (
              <div className="mt-4">
                <button
                  onClick={() => copyInviteLink(employee.id)}
                  className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-1.5 text-xs font-semibold text-ink-600 hover:bg-cyan-50 hover:border-cyan-300 transition"
                >
                  <Link2 size={13} />
                  {linkCopied ? 'Link copied!' : 'Copy invite link'}
                </button>
                <p className="mt-1 text-xs text-ink-400">Send this link to the employee so they can set up their account.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-ink-100">
          {(['overview', 'file'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-5 py-2.5 text-sm font-semibold border-b-2 transition -mb-px',
                tab === t
                  ? 'border-cyan-400 text-cyan-600'
                  : 'border-transparent text-ink-400 hover:text-ink-700',
              )}
            >
              {t === 'overview' ? 'Overview' : 'Employee File'}
            </button>
          ))}
        </div>

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
            <EmployeeFileTab employeeId={employee.id} hiredOn={employee.hiredOn} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
