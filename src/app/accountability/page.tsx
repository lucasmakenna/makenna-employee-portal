'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  Plus,
  Search,
  X,
  ArrowLeft,
  AlertTriangle,
  UserMinus,
  ClipboardList,
  FileWarning,
  MapPin,
  ChevronRight,
  User,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import Avatar from '@/components/Avatar';
import { useCurrentUser } from '@/lib/auth';
import { useAccountability, useEmployees } from '@/data/store';
import { fullName } from '@/data/employees';
import { getLocation, LOCATIONS } from '@/data/locations';
import { can } from '@/data/permissions';
import {
  AccountabilityType,
  ACCOUNTABILITY_LABELS,
  ACCOUNTABILITY_COLORS,
  AccountabilityRecord,
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
const WARNING_TYPES: AccountabilityType[] = ['verbal_warning', 'write_up', 'final_warning', 'pip', 'suspension'];
const SEPARATION_TYPES: AccountabilityType[] = ['termination', 'resignation'];

export default function AccountabilityPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { records, add } = useAccountability();
  const { employees } = useEmployees();

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AccountabilityType | 'all'>('all');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const canIssue = user ? can(user.role, 'team.discipline') : false;

  // ── Location summaries for the overview grid ────────────────────────────
  const locationSummaries = useMemo(() => {
    return LOCATIONS.map((loc) => {
      const locRecords = records.filter((r) => r.locationId === loc.id);
      return {
        location: loc,
        total: locRecords.length,
        warnings: locRecords.filter((r) => WARNING_TYPES.includes(r.type)).length,
        separations: locRecords.filter((r) => SEPARATION_TYPES.includes(r.type)).length,
        hasOpenWarnings: locRecords.some((r) => WARNING_TYPES.includes(r.type) && !r.employeeAcknowledgedAt),
      };
    });
  }, [records]);

  const locationsWithRecords = locationSummaries.filter((s) => s.total > 0);
  const locationsEmpty = locationSummaries.filter((s) => s.total === 0);

  // ── Records for selected location ───────────────────────────────────────
  const locationRecords = useMemo(() => {
    if (!selectedLocationId) return [];
    return records
      .filter((r) => r.locationId === selectedLocationId)
      .filter((r) => {
        if (typeFilter !== 'all' && r.type !== typeFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          const emp = employees.find((e) => e.id === r.employeeId);
          const name = emp ? fullName(emp).toLowerCase() : '';
          if (!name.includes(q) && !r.title.toLowerCase().includes(q)) return false;
        }
        return true;
      });
  }, [records, selectedLocationId, typeFilter, search, employees]);

  // ── Group location records by employee ──────────────────────────────────
  const byEmployee = useMemo(() => {
    const map = new Map<string, AccountabilityRecord[]>();
    locationRecords.forEach((r) => {
      if (!map.has(r.employeeId)) map.set(r.employeeId, []);
      map.get(r.employeeId)!.push(r);
    });
    return Array.from(map.entries())
      .map(([empId, empRecords]) => ({
        employee: employees.find((e) => e.id === empId) ?? null,
        records: [...empRecords].sort(
          (a, b) => parseISO(b.issuedAt).getTime() - parseISO(a.issuedAt).getTime(),
        ),
      }))
      .sort((a, b) => b.records.length - a.records.length); // most records first
  }, [locationRecords, employees]);

  if (!user) return null;

  // ── Global stats (always shown) ─────────────────────────────────────────
  const statsStrip = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Written Warnings', type: 'write_up' as AccountabilityType, icon: FileWarning, color: 'text-amber-600' },
        { label: 'Final Warnings', type: 'final_warning' as AccountabilityType, icon: AlertTriangle, color: 'text-orange-600' },
        { label: 'Terminations', type: 'termination' as AccountabilityType, icon: UserMinus, color: 'text-red-600' },
        { label: 'Resignations', type: 'resignation' as AccountabilityType, icon: UserMinus, color: 'text-ink-500' },
      ].map(({ label, type, icon: Icon, color }) => (
        <div key={type} className="rounded-xl border border-ink-100 bg-white p-4">
          <Icon size={18} className={color} />
          <div className="mt-2 text-2xl font-bold text-ink-700">
            {records.filter((r) => r.type === type).length}
          </div>
          <div className="text-xs text-ink-400">{label}</div>
        </div>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCATION DETAIL VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (selectedLocationId) {
    const loc = getLocation(selectedLocationId);
    const summary = locationSummaries.find((s) => s.location.id === selectedLocationId);

    return (
      <AppShell>
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Back + header */}
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => {
                  setSelectedLocationId(null);
                  setSearch('');
                  setTypeFilter('all');
                }}
                className="mb-2 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
              >
                <ArrowLeft size={16} /> All Locations
              </button>
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-cyan-500" />
                <div>
                  <h1 className="text-3xl font-bold text-ink-700">{loc?.name}</h1>
                  <p className="text-sm text-ink-400">
                    {summary?.total ?? 0} record{summary?.total !== 1 ? 's' : ''} ·{' '}
                    {summary?.warnings ?? 0} warning{summary?.warnings !== 1 ? 's' : ''} ·{' '}
                    {summary?.separations ?? 0} separation{summary?.separations !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            {canIssue && (
              <button onClick={() => setShowNew(true)} className="btn-hibiscus">
                <Plus size={16} /> New Record
              </button>
            )}
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
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AccountabilityType | 'all')}
              className="input w-48"
            >
              <option value="all">All types</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>{ACCOUNTABILITY_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Employee groups */}
          {byEmployee.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
              <ClipboardList size={32} className="mx-auto mb-3 text-ink-300" />
              <p className="text-sm text-ink-400">
                {search || typeFilter !== 'all'
                  ? 'No records match your filters.'
                  : 'No accountability records at this location.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {byEmployee.map(({ employee, records: empRecords }) => (
                <EmployeeRecordGroup
                  key={employee?.id ?? 'unknown'}
                  employee={employee}
                  records={empRecords}
                />
              ))}
            </div>
          )}
        </div>

        {showNew && (
          <NewRecordModal
            employees={employees}
            issuedByEmployeeId={user.id}
            issuedByName={fullName(user)}
            defaultLocationId={selectedLocationId}
            onSave={(data) => { add(data); setShowNew(false); }}
            onClose={() => setShowNew(false)}
          />
        )}
      </AppShell>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LOCATION OVERVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Accountability</h1>
            <p className="mt-1 text-sm text-ink-400">
              Select a location to view and manage its records.
            </p>
          </div>
          {canIssue && (
            <button onClick={() => setShowNew(true)} className="btn-hibiscus">
              <Plus size={16} /> New Record
            </button>
          )}
        </div>

        {statsStrip}

        {/* Locations with records */}
        {locationsWithRecords.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">
              Locations with records
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {locationsWithRecords.map(({ location, total, warnings, separations, hasOpenWarnings }) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  className="group rounded-xl border border-ink-100 bg-white p-5 text-left shadow-soft transition hover:border-cyan-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-cyan-400 shrink-0" />
                      <span className="font-bold text-ink-700 group-hover:text-cyan-600 transition">
                        {location.name}
                      </span>
                    </div>
                    {hasOpenWarnings && (
                      <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1" title="Open unacknowledged warnings" />
                    )}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-ink-700">{total}</div>
                      <div className="text-xs text-ink-400">
                        total record{total !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      {warnings > 0 && (
                        <div className="text-xs font-semibold text-amber-600">
                          {warnings} warning{warnings !== 1 ? 's' : ''}
                        </div>
                      )}
                      {separations > 0 && (
                        <div className="text-xs font-semibold text-red-500">
                          {separations} separation{separations !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-1 text-xs font-semibold text-cyan-500 group-hover:text-cyan-600">
                    View employees <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Locations without records — muted */}
        {locationsEmpty.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-300">
              No records
            </h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {locationsEmpty.map(({ location }) => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocationId(location.id)}
                  className="group rounded-xl border border-dashed border-ink-100 bg-white/60 p-4 text-left transition hover:border-ink-200 hover:bg-white"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-ink-200 shrink-0" />
                    <span className="text-sm font-semibold text-ink-300 group-hover:text-ink-500 transition">
                      {location.name}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-ink-200 group-hover:text-ink-400">
                    0 records
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {records.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
            <ClipboardList size={32} className="mx-auto mb-3 text-ink-300" />
            <p className="font-semibold text-ink-400">No accountability records yet.</p>
            <p className="mt-1 text-sm text-ink-300">
              Records will appear here when issued for any location.
            </p>
          </div>
        )}
      </div>

      {showNew && (
        <NewRecordModal
          employees={employees}
          issuedByEmployeeId={user.id}
          issuedByName={fullName(user)}
          defaultLocationId={user.homeLocationId}
          onSave={(data) => { add(data); setShowNew(false); }}
          onClose={() => setShowNew(false)}
        />
      )}
    </AppShell>
  );
}

// ── Employee record group (used in location detail view) ─────────────────────

function EmployeeRecordGroup({
  employee,
  records,
}: {
  employee: ReturnType<typeof useEmployees>['employees'][number] | null;
  records: AccountabilityRecord[];
}) {
  const hasUnacknowledged = records.some((r) => !r.employeeAcknowledgedAt);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft">
      {/* Employee header */}
      <div className="flex items-center gap-4 border-b border-ink-100 bg-ink-50/50 px-5 py-3">
        {employee ? (
          <Avatar employee={employee} size="sm" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100">
            <User size={14} className="text-ink-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {employee ? (
              <Link
                href={`/team/${employee.id}`}
                className="font-bold text-ink-700 hover:text-cyan-600 transition"
              >
                {fullName(employee)}
              </Link>
            ) : (
              <span className="font-bold text-ink-400">Unknown employee</span>
            )}
            {hasUnacknowledged && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Pending acknowledgment
              </span>
            )}
          </div>
          {employee && (
            <div className="text-xs text-ink-400 capitalize">{employee.role}</div>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold text-ink-600">
          {records.length} record{records.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Records */}
      <div className="divide-y divide-ink-50">
        {records.map((record) => (
          <Link
            key={record.id}
            href={`/accountability/${record.id}`}
            className="flex items-center gap-4 px-5 py-3 hover:bg-cyan-50/30 transition group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                  {ACCOUNTABILITY_LABELS[record.type]}
                </span>
                {record.employeeAcknowledgedAt && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    ✓ Acknowledged
                  </span>
                )}
              </div>
              <div className="font-semibold text-sm text-ink-700 truncate">{record.title}</div>
              <div className="text-xs text-ink-400 mt-0.5">
                {format(parseISO(record.issuedAt), 'MMM d, yyyy')} · Issued by {record.issuedByName}
              </div>
            </div>
            <ChevronRight size={16} className="text-ink-300 shrink-0 group-hover:text-cyan-400 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── New Record Modal ──────────────────────────────────────────────────────────

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
              {employees
                .filter((e) => e.active)
                .sort((a, b) => a.firstName.localeCompare(b.firstName))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {fullName(e)} — {getLocation(e.homeLocationId)?.name}
                  </option>
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
              <input
                type="date"
                value={separationDate}
                onChange={(e) => setSeparationDate(e.target.value)}
                className="input"
              />
            </div>
          )}

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <strong>Reminder:</strong> Accountability records are formal HR documents. Ensure facts
            are accurate, language is professional, and the employee is notified.
          </div>
        </div>

        <div className="flex gap-3 border-t border-ink-100 px-6 py-4">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            disabled={!canSubmit}
            onClick={() =>
              onSave({
                employeeId,
                type,
                title,
                description,
                locationId,
                issuedByEmployeeId,
                issuedByName,
                separationDate: separationDate || undefined,
              })
            }
            className="btn-hibiscus flex-1 disabled:opacity-40"
          >
            Issue Record
          </button>
        </div>
      </div>
    </div>
  );
}
