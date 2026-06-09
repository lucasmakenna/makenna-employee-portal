'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Trash2, CheckCircle2, CalendarDays, User, MapPin,
  ThumbsUp, ThumbsDown, MessageSquare, ShieldCheck, AlertCircle,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useAccountability, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { can } from '@/data/permissions';
import { ACCOUNTABILITY_LABELS, ACCOUNTABILITY_COLORS } from '@/types';
import { ACCOUNTABILITY_TEMPLATES } from '@/data/accountability-templates';
import { format, parseISO } from 'date-fns';

export default function AccountabilityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { getById, update, remove } = useAccountability();
  const { employees } = useEmployees();

  const [responseText, setResponseText] = useState('');
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [pendingAgreed, setPendingAgreed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const record = getById(params.id);

  if (!record || !user) return null;

  const emp = employees.find((e) => e.id === record.employeeId);
  const loc = getLocation(record.locationId);
  const canEdit = can(user.role, 'team.discipline');
  const isSubject = user.id === record.employeeId;
  const isSeparation = record.type === 'termination' || record.type === 'resignation';
  const hasResponded = record.employeeAgreed !== undefined;
  const template = ACCOUNTABILITY_TEMPLATES[record.type];
  const templateData = record.templateData as Record<string, string | string[]> | undefined;

  const handleDelete = () => {
    if (!confirm('Delete this accountability record permanently?')) return;
    remove(record.id);
    router.push('/accountability');
  };

  const handleAgreeDisagree = (agreed: boolean) => {
    if (agreed) {
      update(record.id, {
        employeeAcknowledgedAt: record.employeeAcknowledgedAt ?? new Date().toISOString(),
        employeeAgreed: true,
        employeeRespondedAt: new Date().toISOString(),
      });
    } else {
      setPendingAgreed(false);
      setShowResponseBox(true);
    }
  };

  const handleSubmitResponse = () => {
    update(record.id, {
      employeeAcknowledgedAt: record.employeeAcknowledgedAt ?? new Date().toISOString(),
      employeeAgreed: false,
      employeeResponse: responseText.trim() || undefined,
      employeeRespondedAt: new Date().toISOString(),
    });
    setShowResponseBox(false);
    setPendingAgreed(null);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/accountability" className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700">
          <ArrowLeft size={16} /> Accountability
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          {/* Type badge + title + delete */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                {ACCOUNTABILITY_LABELS[record.type]}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-ink-700">{record.title}</h1>
            </div>
            {canEdit && (
              <button onClick={handleDelete} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition mt-1">
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-ink-600">
              <User size={14} className="text-ink-400 shrink-0" />
              {emp ? (
                <Link href={`/team/${emp.id}`} className="font-semibold hover:text-cyan-600">{fullName(emp)}</Link>
              ) : <span className="text-ink-400">Unknown employee</span>}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <MapPin size={14} className="text-ink-400 shrink-0" />
              {loc?.name ?? record.locationId}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <CalendarDays size={14} className="text-ink-400 shrink-0" />
              Issued {format(parseISO(record.issuedAt), 'MMMM d, yyyy')} by {record.issuedByName}
            </div>
            {isSeparation && record.separationDate && (
              <div className="flex items-center gap-2 text-ink-600">
                <CalendarDays size={14} className="text-ink-400 shrink-0" />
                Last day: {format(parseISO(record.separationDate), 'MMMM d, yyyy')}
              </div>
            )}
          </div>

          {/* ── Structured Template Data ───────────────────────────────── */}
          {templateData && Object.keys(templateData).length > 0 && template && (
            <div className="mt-6 border-t border-ink-100 pt-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-400">Record Details</h2>
              {template.fields.map((field) => {
                const val = templateData[field.key];
                if (!val || (Array.isArray(val) && val.length === 0)) return null;
                return (
                  <div key={field.key}>
                    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{field.label}</p>
                    {Array.isArray(val) ? (
                      <div className="flex flex-wrap gap-1.5">
                        {val.map((v) => (
                          <span key={v} className="rounded-full bg-cyan-50 border border-cyan-200 px-3 py-0.5 text-sm text-ink-700">{v}</span>
                        ))}
                      </div>
                    ) : field.type === 'textarea' ? (
                      <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap bg-ink-50 rounded-xl p-3">{val}</p>
                    ) : (
                      <p className="text-sm font-semibold text-ink-700">{val}</p>
                    )}
                  </div>
                );
              })}
              {/* Closing statement */}
              <div className="rounded-xl bg-ink-50 border border-ink-100 p-4 mt-2">
                <p className="text-xs text-ink-500 leading-relaxed italic">{template.closingStatement}</p>
              </div>
            </div>
          )}

          {/* Fallback plain description (old records without templateData) */}
          {(!templateData || Object.keys(templateData).length === 0) && (
            <div className="mt-6 border-t border-ink-100 pt-5">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-400">Details</h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{record.description}</p>
            </div>
          )}

          {/* Follow-up notes */}
          {record.followUpNotes && (
            <div className="mt-5 rounded-xl bg-ink-50 p-4">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-ink-400">Follow-up Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-ink-700">{record.followUpNotes}</p>
            </div>
          )}

          {canEdit && (
            <div className="mt-5">
              <label className="label">Add / update follow-up notes</label>
              <textarea
                defaultValue={record.followUpNotes ?? ''}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val !== (record.followUpNotes ?? '')) {
                    update(record.id, { followUpNotes: val || undefined });
                  }
                }}
                placeholder="Outcome, next steps, resolution…"
                className="input min-h-[80px]"
              />
            </div>
          )}
        </div>

        {/* ── Employee Agree / Disagree ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h2 className="text-sm font-bold text-ink-700 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-500" /> Employee Acknowledgment
          </h2>

          {hasResponded ? (
            <div className="space-y-3">
              {/* Agreed */}
              {record.employeeAgreed === true && (
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <ThumbsUp size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">
                      {emp ? fullName(emp) : 'Employee'} agreed with this record
                    </p>
                    {record.employeeRespondedAt && (
                      <p className="text-xs text-emerald-600 mt-0.5">
                        {format(parseISO(record.employeeRespondedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Disagreed */}
              {record.employeeAgreed === false && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <ThumbsDown size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800 text-sm">
                        {emp ? fullName(emp) : 'Employee'} disputed this record
                      </p>
                      {record.employeeRespondedAt && (
                        <p className="text-xs text-red-500 mt-0.5">
                          {format(parseISO(record.employeeRespondedAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </div>
                  </div>
                  {record.employeeResponse && (
                    <div className="mt-2 ml-7">
                      <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1">Employee's Statement</p>
                      <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap bg-white rounded-lg border border-red-100 p-3">
                        {record.employeeResponse}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <AlertCircle size={15} className="text-amber-500 shrink-0" />
                {isSubject
                  ? 'Please review this record and indicate whether you agree or disagree with its contents.'
                  : `${emp ? fullName(emp) : 'The employee'} has not yet responded to this record.`}
              </div>

              {/* Show buttons only to the subject employee */}
              {isSubject && !showResponseBox && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAgreeDisagree(true)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <ThumbsUp size={16} /> I Agree
                  </button>
                  <button
                    onClick={() => handleAgreeDisagree(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    <ThumbsDown size={16} /> I Disagree
                  </button>
                </div>
              )}

              {/* Response box for disagreement */}
              {showResponseBox && isSubject && (
                <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                    <MessageSquare size={15} /> Your Statement (optional but recommended)
                  </div>
                  <p className="text-xs text-red-600">
                    Explain your perspective. This will be permanently attached to this record and visible to management.
                  </p>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response here…"
                    className="input min-h-[100px] border-red-200 focus:ring-red-300"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { setShowResponseBox(false); setPendingAgreed(null); }} className="btn-ghost flex-1 text-sm">
                      Cancel
                    </button>
                    <button onClick={handleSubmitResponse} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 text-white py-2 text-sm font-bold hover:bg-red-600 transition">
                      Submit Disagreement
                    </button>
                  </div>
                </div>
              )}

              {/* Admin can mark acknowledged on behalf */}
              {canEdit && !isSubject && (
                <button
                  onClick={() => update(record.id, { employeeAcknowledgedAt: new Date().toISOString() })}
                  className="btn-ghost text-sm"
                >
                  <CheckCircle2 size={14} /> Mark as acknowledged (on behalf)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
