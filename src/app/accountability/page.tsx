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
  ChevronLeft,
  CheckCircle2,
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
import { ACCOUNTABILITY_TEMPLATES, SCENARIOS, type TemplateField, type ScenarioKey } from '@/data/accountability-templates';
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
      .sort((a, b) => b.records.length - a.records.length);
  }, [locationRecords, employees]);

  if (!user) return null;

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

  // ── LOCATION DETAIL VIEW ─────────────────────────────────────────────────
  if (selectedLocationId) {
    const loc = getLocation(selectedLocationId);
    const summary = locationSummaries.find((s) => s.location.id === selectedLocationId);

    return (
      <AppShell>
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => { setSelectedLocationId(null); setSearch(''); setTypeFilter('all'); }}
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

          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or title" className="input pl-9 w-56" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as AccountabilityType | 'all')} className="input w-48">
              <option value="all">All types</option>
              {ALL_TYPES.map((t) => <option key={t} value={t}>{ACCOUNTABILITY_LABELS[t]}</option>)}
            </select>
          </div>

          {byEmployee.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
              <ClipboardList size={32} className="mx-auto mb-3 text-ink-300" />
              <p className="text-sm text-ink-400">
                {search || typeFilter !== 'all' ? 'No records match your filters.' : 'No accountability records at this location.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {byEmployee.map(({ employee, records: empRecords }) => (
                <EmployeeRecordGroup key={employee?.id ?? 'unknown'} employee={employee} records={empRecords} />
              ))}
            </div>
          )}
        </div>

        {showNew && (
          <NewRecordWizard
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

  // ── LOCATION OVERVIEW ────────────────────────────────────────────────────
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Accountability</h1>
            <p className="mt-1 text-sm text-ink-400">Select a location to view and manage its records.</p>
          </div>
          {canIssue && (
            <button onClick={() => setShowNew(true)} className="btn-hibiscus">
              <Plus size={16} /> New Record
            </button>
          )}
        </div>

        {statsStrip}

        {locationsWithRecords.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">Locations with records</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {locationsWithRecords.map(({ location, total, warnings, separations, hasOpenWarnings }) => (
                <button key={location.id} onClick={() => setSelectedLocationId(location.id)}
                  className="group rounded-xl border border-ink-100 bg-white p-5 text-left shadow-soft transition hover:border-cyan-300 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-cyan-400 shrink-0" />
                      <span className="font-bold text-ink-700 group-hover:text-cyan-600 transition">{location.name}</span>
                    </div>
                    {hasOpenWarnings && <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1" title="Open unacknowledged warnings" />}
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-ink-700">{total}</div>
                      <div className="text-xs text-ink-400">total record{total !== 1 ? 's' : ''}</div>
                    </div>
                    <div className="text-right space-y-0.5">
                      {warnings > 0 && <div className="text-xs font-semibold text-amber-600">{warnings} warning{warnings !== 1 ? 's' : ''}</div>}
                      {separations > 0 && <div className="text-xs font-semibold text-red-500">{separations} separation{separations !== 1 ? 's' : ''}</div>}
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

        {locationsEmpty.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-300">No records</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {locationsEmpty.map(({ location }) => (
                <button key={location.id} onClick={() => setSelectedLocationId(location.id)}
                  className="group rounded-xl border border-dashed border-ink-100 bg-white/60 p-4 text-left transition hover:border-ink-200 hover:bg-white">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-ink-200 shrink-0" />
                    <span className="text-sm font-semibold text-ink-300 group-hover:text-ink-500 transition">{location.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-ink-200 group-hover:text-ink-400">0 records</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {records.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center">
            <ClipboardList size={32} className="mx-auto mb-3 text-ink-300" />
            <p className="font-semibold text-ink-400">No accountability records yet.</p>
            <p className="mt-1 text-sm text-ink-300">Records will appear here when issued for any location.</p>
          </div>
        )}
      </div>

      {showNew && (
        <NewRecordWizard
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

// ── EmployeeRecordGroup ───────────────────────────────────────────────────────

function EmployeeRecordGroup({
  employee,
  records,
}: {
  employee: ReturnType<typeof useEmployees>['employees'][number] | null;
  records: AccountabilityRecord[];
}) {
  const hasUnacknowledged = records.some((r) => !r.employeeAcknowledgedAt);
  const hasPendingResponse = records.some((r) => r.employeeAcknowledgedAt && r.employeeAgreed === undefined);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft">
      <div className="flex items-center gap-4 border-b border-ink-100 bg-ink-50/50 px-5 py-3">
        {employee ? <Avatar employee={employee} size="sm" /> : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100">
            <User size={14} className="text-ink-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {employee ? (
              <Link href={`/team/${employee.id}`} className="font-bold text-ink-700 hover:text-cyan-600 transition">
                {fullName(employee)}
              </Link>
            ) : (
              <span className="font-bold text-ink-400">Unknown employee</span>
            )}
            {hasUnacknowledged && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pending acknowledgment</span>
            )}
            {hasPendingResponse && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Pending response</span>
            )}
          </div>
          {employee && <div className="text-xs text-ink-400 capitalize">{employee.role}</div>}
        </div>
        <span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold text-ink-600">
          {records.length} record{records.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="divide-y divide-ink-50">
        {records.map((record) => (
          <Link key={record.id} href={`/accountability/${record.id}`}
            className="flex items-center gap-4 px-5 py-3 hover:bg-cyan-50/30 transition group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ACCOUNTABILITY_COLORS[record.type]}`}>
                  {ACCOUNTABILITY_LABELS[record.type]}
                </span>
                {record.employeeAgreed === true && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">✓ Agreed</span>
                )}
                {record.employeeAgreed === false && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">✗ Disputed</span>
                )}
                {record.employeeAcknowledgedAt && record.employeeAgreed === undefined && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Acknowledged</span>
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

// ── NewRecordWizard — Step 1: Who + Type, Step 2: Template fields ─────────────

function NewRecordWizard({
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
  onSave: (data: Omit<AccountabilityRecord, 'id' | 'issuedAt'>) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [employeeId, setEmployeeId] = useState('');
  const [scenario, setScenario] = useState<ScenarioKey | null>(null);
  const [type, setType] = useState<AccountabilityType>('write_up');
  const [locationId, setLocationId] = useState(defaultLocationId);
  const [fieldValues, setFieldValues] = useState<Record<string, string | string[]>>({});

  const template = ACCOUNTABILITY_TEMPLATES[type];
  const activeScenario = SCENARIOS.find((s) => s.key === scenario) ?? null;

  // Build field defaults merging: scenario description + template field defaults
  function buildDefaults(t: AccountabilityType, sc: ScenarioKey | null): Record<string, string | string[]> {
    const defaults: Record<string, string | string[]> = {};
    const tmpl = ACCOUNTABILITY_TEMPLATES[t];
    // Start with template-level defaults
    for (const field of tmpl.fields) {
      if (field.defaultValue) defaults[field.key] = field.defaultValue;
    }
    // Overlay scenario-specific values
    if (sc) {
      const scen = SCENARIOS.find((s) => s.key === sc);
      if (scen) {
        defaults['incidentCategory'] = scen.defaultIncidentCategory;
        defaults['correctiveAction'] = scen.defaultCorrectiveActions;
        const scenDesc = scen.descriptionByType[t];
        if (scenDesc) defaults['incidentDescription'] = scenDesc;
        // PIP uses different key
        if (t === 'pip' && scen.descriptionByType['pip']) {
          defaults['issueDescription'] = scen.descriptionByType['pip']!;
        }
      }
    }
    return defaults;
  }

  function setField(key: string, value: string | string[]) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(key: string, option: string) {
    setFieldValues((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      return {
        ...prev,
        [key]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option],
      };
    });
  }

  // Build the human-readable description from template fields
  function buildDescription(): string {
    const lines: string[] = [];
    for (const field of template.fields) {
      const val = fieldValues[field.key];
      if (!val || (Array.isArray(val) && val.length === 0)) continue;
      const display = Array.isArray(val) ? val.join(', ') : val;
      lines.push(`${field.label}: ${display}`);
    }
    lines.push('');
    lines.push(template.closingStatement);
    return lines.join('\n');
  }

  // Build title from type + key fields
  function buildTitle(): string {
    const cat = fieldValues['incidentCategory'] as string | undefined;
    const base = ACCOUNTABILITY_LABELS[type];
    if (cat) return `${base} — ${cat}`;
    const issue = fieldValues['performanceIssue'] as string | undefined;
    if (issue) return `${base} — ${issue}`;
    const reason = fieldValues['terminationReason'] as string | undefined;
    if (reason) return `${base} — ${reason}`;
    return template.defaultTitle;
  }

  // Validate required fields in step 2
  const requiredFields = template.fields.filter((f) => f.required);
  const step2Valid = employeeId && requiredFields.every((f) => {
    const val = fieldValues[f.key];
    return val && (Array.isArray(val) ? val.length > 0 : val.trim().length > 0);
  });

  function handleSubmit() {
    const description = buildDescription();
    const title = buildTitle();
    const separationDate = (fieldValues['lastDay'] as string | undefined) || undefined;
    onSave({
      employeeId,
      type,
      title,
      description,
      locationId,
      issuedByEmployeeId,
      issuedByName,
      templateData: fieldValues,
      separationDate,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-ink-400 hover:text-ink-700">
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-ink-700">New Accountability Record</h2>
              <p className="text-xs text-ink-400">
                Step {step} of 2 — {step === 1 ? 'Select employee, category & type' : ACCOUNTABILITY_LABELS[type]}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1 px-6 pt-3 shrink-0">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-hibiscus-500' : 'bg-ink-100'}`} />
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 1 ? (
            <>
              <div>
                <label className="label">Employee <span className="text-hibiscus-500">*</span></label>
                <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
                  <option value="">Select employee…</option>
                  {employees.filter((e) => e.active)
                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {fullName(e)} — {getLocation(e.homeLocationId)?.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Scenario / Category picker */}
              <div>
                <label className="label">What is this about? <span className="text-hibiscus-500">*</span></label>
                <div className="grid gap-2">
                  {SCENARIOS.map((sc) => {
                    const selected = scenario === sc.key;
                    return (
                      <button
                        key={sc.key}
                        type="button"
                        onClick={() => {
                          setScenario(sc.key);
                          setFieldValues(buildDefaults(type, sc.key));
                        }}
                        className={`w-full flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                          selected
                            ? 'border-hibiscus-400 bg-hibiscus-50'
                            : 'border-ink-100 bg-white hover:border-ink-300'
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{sc.emoji}</span>
                        <div>
                          <p className={`font-bold text-sm ${selected ? 'text-hibiscus-700' : 'text-ink-700'}`}>{sc.label}</p>
                          <p className="text-xs text-ink-400 mt-0.5">{sc.subtitle}</p>
                        </div>
                        {selected && <CheckCircle2 size={16} className="text-hibiscus-500 ml-auto mt-0.5 shrink-0" />}
                      </button>
                    );
                  })}
                  {/* Other / No template */}
                  <button
                    type="button"
                    onClick={() => {
                      setScenario(null);
                      setFieldValues(buildDefaults(type, null));
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                      scenario === null
                        ? 'border-ink-400 bg-ink-50'
                        : 'border-ink-100 bg-white hover:border-ink-300'
                    }`}
                  >
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-bold text-sm text-ink-700">Other / Custom</p>
                      <p className="text-xs text-ink-400">Write a custom description without a preset template</p>
                    </div>
                    {scenario === null && <CheckCircle2 size={16} className="text-ink-500 ml-auto shrink-0" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Record Type <span className="text-hibiscus-500">*</span></label>
                <div className="grid grid-cols-1 gap-2">
                  {TYPE_GROUPS.map((g) => (
                    <div key={g.label}>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">{g.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {g.types.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => { setType(t); setFieldValues(buildDefaults(t, scenario)); }}
                            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                              type === t
                                ? `${ACCOUNTABILITY_COLORS[t]} border-transparent`
                                : 'bg-white text-ink-500 border-ink-200 hover:border-ink-400'
                            }`}
                          >
                            {ACCOUNTABILITY_LABELS[t]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Location</label>
                <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="input">
                  {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              {template.formNote && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                  {template.formNote}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Scenario badge */}
              {activeScenario && (
                <div className="flex items-center gap-2 rounded-xl bg-hibiscus-50 border border-hibiscus-200 px-4 py-2.5">
                  <span className="text-xl">{activeScenario.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-hibiscus-700">{activeScenario.label}</p>
                    <p className="text-xs text-hibiscus-500">Template pre-filled — replace [BRACKETED TEXT] with specifics</p>
                  </div>
                </div>
              )}
              {template.formNote && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
                  {template.formNote}
                </div>
              )}
              {template.fields.map((field) => (
                <TemplateFieldInput
                  key={field.key}
                  field={field}
                  value={fieldValues[field.key]}
                  onChange={(v) => setField(field.key, v)}
                  onToggleMulti={(opt) => toggleMulti(field.key, opt)}
                />
              ))}
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-700">
                <strong>Reminder:</strong> Accountability records are formal HR documents. Ensure facts are accurate and language is professional. The employee will be asked to acknowledge and respond.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-ink-100 px-6 py-4 shrink-0">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          {step === 1 ? (
            <button
              disabled={!employeeId}
              onClick={() => {
                if (!fieldValues['incidentDescription'] && !fieldValues['issueDescription']) {
                  setFieldValues(buildDefaults(type, scenario));
                }
                setStep(2);
              }}
              className="btn-hibiscus flex-1 disabled:opacity-40"
            >
              Next: Fill in Details →
            </button>
          ) : (
            <button
              disabled={!step2Valid}
              onClick={handleSubmit}
              className="btn-hibiscus flex-1 disabled:opacity-40"
            >
              <CheckCircle2 size={16} /> Issue Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Template field renderer ───────────────────────────────────────────────────

function TemplateFieldInput({
  field,
  value,
  onChange,
  onToggleMulti,
}: {
  field: TemplateField;
  value: string | string[] | undefined;
  onChange: (v: string) => void;
  onToggleMulti: (opt: string) => void;
}) {
  const strVal = (value as string | undefined) ?? '';
  const arrVal = (value as string[] | undefined) ?? [];

  return (
    <div>
      <label className="label">
        {field.label}
        {field.required && <span className="text-hibiscus-500 ml-1">*</span>}
      </label>
      {field.helperText && <p className="text-xs text-ink-400 mb-1">{field.helperText}</p>}

      {field.type === 'dropdown' && (
        <select value={strVal} onChange={(e) => onChange(e.target.value)} className="input">
          <option value="">Select…</option>
          {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}

      {field.type === 'multi_select' && (
        <div className="flex flex-wrap gap-2 mt-1">
          {field.options?.map((opt) => {
            const selected = arrVal.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onToggleMulti(opt)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selected
                    ? 'bg-cyan-500 text-white border-cyan-500'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-cyan-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {field.type === 'text' && (
        <input type="text" value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} className="input" />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={strVal || field.defaultValue || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="input min-h-[140px] text-sm font-mono"
        />
      )}

      {field.type === 'date' && (
        <input type="date" value={strVal} onChange={(e) => onChange(e.target.value)} className="input" />
      )}

      {field.type === 'number' && (
        <input type="number" min={1} value={strVal} onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder} className="input" />
      )}
    </div>
  );
}
