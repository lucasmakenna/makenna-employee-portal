'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  Plus,
  Search,
  X,
  ChevronDown,
  AlertTriangle,
  UserMinus,
  ClipboardList,
  FileWarning,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useAccountability, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation, LOCATIONS } from '@/data/locations';
import { can } from '@/data/permissions';
import {
  AccountabilityType,
  ACCOUNTABILITY_LABELS,
  ACCOUNTABILITY_COLORS,
} from '@/types';
import { format, parseISO } from 'date-fns';

const TYPE_GROUPS = [
  {
    label: 'Warnings & Discipline',
    icon: FileWarning,
    types: ['verbal_warning', 'write_up', 'final_warning', 'pip', 'suspension'] as AccountabilityType[],
  },
  {
    label: 'Separations',
    icon: UserMinus,
    types: ['termination', 'resignation'] as AccountabilityType[],
  },
];

const ALL_TYPES = TYPE_GROUPS.flatMap((g) => g.types);

export default function AccountabilityPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { records, add, remove } = useAccountability();
  const { employees } = useEmployees();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AccountabilityType | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const canIssue = user ? can(user.role, 'team.discipline') : false;

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (locationFilter !== 'all' && r.locationId !== locationFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const emp = employees.find((e) => e.id === r.employeeId);
        const name = emp ? fullName(emp).toLowerCase() : '';
        if (!name.includes(q) && !r.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, typeFilter, locationFilter, search, employees]);

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Accountability</h1>
            <p className="mt-1 text-sm text-ink-400">
              Warnings, write-ups, PIPs, and separation records.
            </p>
          </div>
          {canIssue && (
            <button onClick={() => setShowNew(true)} className="btn-hibiscus">
              <Plus size={16} /> New Record
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Written Warnings', type: 'write_up', icon: FileWarning, color: 'text-amber-600' },
            { label: 'Final Warnings', type: 'final_warning', icon: AlertTriangle, color: 'text-orange-600' },
            { label: 'Terminations', type: 'termination', icon: UserMinus, color: 'text-red-600' },
            { label: 'Resignations', type: 'resignation', icon: UserMinus, color: 'text-ink-500' },
          ].map(({ label, type, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type as AccountabilityType ? 'all' : type as AccountabilityType)}
              className={`rounded-xl border p-4 text-left transition hover:shadow-soft ${typeFilter === type ? 'border-cyan-400 bg-cyan-50' : 'border-ink-100 bg-white'}`}
            >
              <Icon size={18} className={color} />
              <div className="mt-2 text-2xl font-bold text-ink-700">
                {records.filter((r) => r.type === type).length}
              </div>
              <div className="text-xs text-ink-400">{label}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or title"
              className="input pl-9 w-56"
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as AccountabilityType | 'all')} className="input w-48">
            <option value="all">All types</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>{ACCOUNTABILITY_LABELS[t]}</option>
            ))}
          </select>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="input w-44">
            <option value="all">All locations</option>
            {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        {/* Records list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
              <ClipboardList size={32} className="mx-auto mb-3 text-ink-300" />
              <p className="text-sm text-ink-400">No accountability records yet.</p>
            </div>
          )}
          {filtered.map((record) => {
            const emp = employees.find((e) => e.id === record.employeeId);
            const loc = getLocation(record.locationId);
            return (
              <Link
                key={record.id}
                href={`/accountability/${record.id}`}
                className="block rounded-xl border border-ink-100 bg-white p-4 hover:border-cyan-300 hover:shadow-soft transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                        {ACCOUNTABILITY_LABELS[record.type]}
                      </span>
                      {record.employeeAcknowledgedAt && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          ✓ Acknowledged
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-ink-700 truncate">{record.title}</h3>
                    <div className="mt-1 text-xs text-ink-400">
                      {emp ? (
                        <span className="font-medium text-ink-600">{fullName(emp)} · </span>
                      ) : null}
                      {loc?.name} · Issued by {record.issuedByName} · {format(parseISO(record.issuedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {showNew && (
        <NewRecordModal
          employees={employees}
          issuedByEmployeeId={user.id}
          issuedByName={fullName(user)}
          defaultLocationId={user.homeLocationId}
          onSave={(data) => {
            add(data);
            setShowNew(false);
          }}
          onClose={() => setShowNew(false)}
        />
      )}
    </AppShell>
  );
}

// ── New Record Modal ─────────────────────────────────────────────────────────

function NewRecordModal({
  employees,
  issuedByEmployeeId,
  issuedByName,
  defaultLocationId,
  onSave,
  onClose,
}: {
  employees: ReturnType<typeof useEmployees>['employees'];
  issuedByEmployeeId: string;
  issuedByName: string;
  defaultLocationId: string;
  onSave: (data: Omit<import('@/types').AccountabilityRecord, 'id' | 'issuedAt'>) => void;
  onClose: () => void;
}) {
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<AccountabilityType>('write_up');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationId, setLocationId] = useState(defaultLocationId);
  const [separationDate, setSeparationDate] = useState('');

  const isSeparation = type === 'termination' || type === 'resignation';
  const canSubmit = employeeId && title.trim() && description.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-bold text-ink-700">New Accountability Record</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="label">Employee <span className="text-hibiscus-500">*</span></label>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
              <option value="">Select employee…</option>
              {employees.filter((e) => e.active).sort((a, b) => a.firstName.localeCompare(b.firstName)).map((e) => (
                <option key={e.id} value={e.id}>{fullName(e)} — {getLocation(e.homeLocationId)?.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Record type <span className="text-hibiscus-500">*</span></label>
            <select value={type} onChange={(e) => setType(e.target.value as AccountabilityType)} className="input">
              {TYPE_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.types.map((t) => (
                    <option key={t} value={t}>{ACCOUNTABILITY_LABELS[t]}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Location</label>
            <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="input">
              {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Subject / Title <span className="text-hibiscus-500">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late arrivals — three incidents in 30 days"
              className="input"
            />
          </div>

          <div>
            <label className="label">Description / Details <span className="text-hibiscus-500">*</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident, behavior, or reason. Be specific and factual."
              className="input min-h-[120px]"
            />
          </div>

          {isSeparation && (
            <div>
              <label className="label">Last day of employment</label>
              <input type="date" value={separationDate} onChange={(e) => setSeparationDate(e.target.value)} className="input" />
            </div>
          )}

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <strong>Reminder:</strong> Accountability records are formal HR documents. Ensure facts are accurate, language is professional, and the employee is notified.
          </div>
        </div>

        <div className="flex gap-3 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            disabled={!canSubmit}
            onClick={() => onSave({ employeeId, type, title, description, locationId, issuedByEmployeeId, issuedByName, separationDate: separationDate || undefined })}
            className="btn-hibiscus flex-1 disabled:opacity-40"
          >
            Issue Record
          </button>
        </div>
      </div>
    </div>
  );
}
