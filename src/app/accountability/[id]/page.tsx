'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2, CheckCircle2, CalendarDays, User, MapPin } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useAccountability, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation } from '@/data/locations';
import { can } from '@/data/permissions';
import { ACCOUNTABILITY_LABELS, ACCOUNTABILITY_COLORS } from '@/types';
import { format, parseISO } from 'date-fns';

export default function AccountabilityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { getById, update, remove } = useAccountability();
  const { employees } = useEmployees();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const record = getById(params.id);
  if (!record || !user) return null;

  const emp = employees.find((e) => e.id === record.employeeId);
  const loc = getLocation(record.locationId);
  const canEdit = can(user.role, 'team.discipline');
  const isSeparation = record.type === 'termination' || record.type === 'resignation';

  const handleAcknowledge = () => {
    update(record.id, { employeeAcknowledgedAt: new Date().toISOString() });
  };

  const handleDelete = () => {
    if (!confirm('Delete this accountability record permanently?')) return;
    remove(record.id);
    router.push('/accountability');
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/accountability" className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700">
            <ArrowLeft size={16} /> Accountability
          </Link>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          {/* Type badge + title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                {ACCOUNTABILITY_LABELS[record.type]}
              </span>
              <h1 className="mt-3 text-2xl font-bold text-ink-700">{record.title}</h1>
            </div>
            {canEdit && (
              <button onClick={handleDelete} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition">
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2 text-ink-600">
              <User size={14} className="text-ink-400 shrink-0" />
              {emp ? (
                <Link href={`/team/${emp.id}`} className="font-semibold hover:text-cyan-600">
                  {fullName(emp)}
                </Link>
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

          {/* Description */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-400">Details</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{record.description}</p>
          </div>

          {/* Follow-up notes */}
          {record.followUpNotes && (
            <div className="mt-5 rounded-xl bg-ink-50 p-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-400">Follow-up Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-ink-700">{record.followUpNotes}</p>
            </div>
          )}

          {canEdit && (
            <div className="mt-5">
              <label className="label">Add follow-up notes</label>
              <textarea
                defaultValue={record.followUpNotes ?? ''}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val !== (record.followUpNotes ?? '')) {
                    update(record.id, { followUpNotes: val || undefined });
                  }
                }}
                placeholder="Update with outcome, next steps, or resolution…"
                className="input min-h-[80px]"
              />
            </div>
          )}

          {/* Acknowledgment */}
          <div className="mt-6 border-t border-ink-100 pt-5">
            {record.employeeAcknowledgedAt ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={16} className="shrink-0" />
                Acknowledged by {emp ? fullName(emp) : 'employee'} on{' '}
                {format(parseISO(record.employeeAcknowledgedAt), 'MMM d, yyyy h:mm a')}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-ink-500">
                  Employee has not yet acknowledged this record.
                </p>
                {(user.id === record.employeeId || canEdit) && (
                  <button
                    onClick={handleAcknowledge}
                    className="btn-cyan shrink-0"
                  >
                    <CheckCircle2 size={15} /> Mark Acknowledged
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
