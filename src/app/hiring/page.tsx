'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Upload, X, AlertCircle, CheckCircle2, RotateCcw, UserX } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { STAGES } from '@/data/candidates';
import { useCandidates } from '@/data/store';
import { LOCATIONS, getLocation } from '@/data/locations';
import { Candidate, CandidateStage, LocationId } from '@/types';
import { formatDistanceToNow, parseISO, format } from 'date-fns';

const STAGE_ORDER: CandidateStage[] = [
  'applied',
  'phone_screen',
  'in_person',
  'offer',
  'hired',
];

export default function HiringPage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { candidates, add, moveStage } = useCandidates();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showIndeedImport, setShowIndeedImport] = useState(false);
  const [view, setView] = useState<'pipeline' | 'rejected'>('pipeline');

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const filtered = useMemo(() => {
    return candidates.filter((c) => c.stage !== 'rejected').filter((c) => {
      if (locationFilter !== 'all' && c.appliedToLocationId !== locationFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.appliedFor.toLowerCase().includes(q)
      );
    });
  }, [candidates, search, locationFilter]);

  const rejected = useMemo(() => {
    return candidates.filter((c) => c.stage === 'rejected').filter((c) => {
      if (locationFilter !== 'all' && c.appliedToLocationId !== locationFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.appliedFor.toLowerCase().includes(q)
      );
    });
  }, [candidates, search, locationFilter]);

  // Detect if a rejected candidate has reapplied (same email exists in non-rejected pool)
  const reappliedEmails = useMemo(() => {
    const activeEmails = new Set(
      candidates.filter((c) => c.stage !== 'rejected').map((c) => c.email.toLowerCase())
    );
    return activeEmails;
  }, [candidates]);

  if (!user) return null;

  return (
    <>
    <AppShell>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Hiring</h1>
            <p className="mt-1 text-sm text-ink-400">
              {view === 'pipeline'
                ? `${filtered.length} active candidate${filtered.length === 1 ? '' : 's'} across ${LOCATIONS.length} locations`
                : `${rejected.length} candidate${rejected.length === 1 ? '' : 's'} in reject pool`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates"
                className="input pl-9 w-56"
              />
            </div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input w-44"
            >
              <option value="all">All locations</option>
              {LOCATIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            {view === 'pipeline' && (
              <>
                <button
                  onClick={() => setShowIndeedImport(true)}
                  className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-cyan-50 hover:border-cyan-300 transition"
                >
                  <Upload size={15} /> Import from Indeed
                </button>
                <Link href="/hiring/new" className="btn-cyan">
                  <Plus size={16} />
                  Add candidate
                </Link>
              </>
            )}
          </div>
        </div>

        {/* View tabs */}
        <div className="mb-5 flex gap-1 rounded-xl border border-ink-100 bg-ink-50 p-1 w-fit">
          <button
            onClick={() => setView('pipeline')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${view === 'pipeline' ? 'bg-white shadow-sm text-ink-700' : 'text-ink-400 hover:text-ink-600'}`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setView('rejected')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${view === 'rejected' ? 'bg-white shadow-sm text-ink-700' : 'text-ink-400 hover:text-ink-600'}`}
          >
            <UserX size={14} />
            Reject Pool
            {rejected.length > 0 && (
              <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">{rejected.length}</span>
            )}
          </button>
        </div>

        {view === 'pipeline' ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {STAGE_ORDER.map((stage) => {
              const cards = filtered.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="rounded-xl bg-cyan-50/40 p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-ink-700">
                      {STAGES.find((s) => s.id === stage)?.label}
                    </h3>
                    <span className="pill bg-white text-ink-400">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map((c) => (
                      <CandidateCard key={c.id} candidate={c} />
                    ))}
                    {cards.length === 0 && (
                      <div className="rounded-lg border border-dashed border-ink-200 p-4 text-center text-xs text-ink-400">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {rejected.length === 0 && (
              <div className="rounded-xl border border-dashed border-ink-200 p-12 text-center text-sm text-ink-400">
                No rejected candidates yet.
              </div>
            )}
            {rejected.map((c) => {
              const loc = getLocation(c.appliedToLocationId);
              const hasReapplied = reappliedEmails.has(c.email.toLowerCase());
              return (
                <div key={c.id} className="rounded-xl border border-ink-100 bg-white p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/hiring/${c.id}`} className="font-semibold text-ink-700 hover:text-cyan-600">
                        {c.firstName} {c.lastName}
                      </Link>
                      {hasReapplied && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                          <RotateCcw size={11} /> Reapplied
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-ink-400">
                      {c.appliedFor} · {loc?.name} · Applied {format(parseISO(c.appliedOn), 'MMM d, yyyy')}
                    </div>
                    {c.notes.length > 0 && (
                      <p className="mt-1.5 text-xs text-ink-500 italic line-clamp-1">
                        "{c.notes[c.notes.length - 1].body}"
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => moveStage(c.id, 'applied')}
                      className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
                    >
                      <RotateCcw size={12} /> Re-enter pipeline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>

    {showIndeedImport && user && (
      <IndeedImportModal
        onClose={() => setShowIndeedImport(false)}
        onImport={(rows) => {
          rows.forEach((r) =>
            add({
              firstName: r.firstName,
              lastName: r.lastName,
              email: r.email,
              phone: r.phone,
              appliedFor: r.appliedFor,
              appliedToLocationId: r.locationId,
              source: 'Indeed',
              authorId: user.id,
              authorName: `${user.firstName} ${user.lastName}`,
            }),
          );
          setShowIndeedImport(false);
        }}
      />
    )}
    </>
  );
}

// ── Indeed CSV columns (Indeed's export format) ──────────────────────────────
// "Name","Email address","Phone number","Applied date","Job"
type IndeedRow = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedFor: Candidate['appliedFor'];
  locationId: LocationId;
};

function parseIndeedCsv(text: string): IndeedRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  // Normalize header to lowercase for flexible column matching
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());

  const nameIdx = headers.findIndex((h) => h.includes('name'));
  const emailIdx = headers.findIndex((h) => h.includes('email'));
  const phoneIdx = headers.findIndex((h) => h.includes('phone'));
  const jobIdx = headers.findIndex((h) => h.includes('job') || h.includes('position') || h.includes('title'));

  return lines.slice(1).flatMap((line) => {
    // Handle quoted fields with commas inside
    const cols: string[] = [];
    let cur = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur.trim());

    const fullNameVal = nameIdx >= 0 ? cols[nameIdx] ?? '' : '';
    const parts = fullNameVal.split(' ');
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ') || '';
    if (!firstName) return [];

    const jobRaw = (jobIdx >= 0 ? cols[jobIdx] ?? '' : '').toLowerCase();
    const appliedFor: Candidate['appliedFor'] = jobRaw.includes('lead') || jobRaw.includes('shift')
      ? 'Shift Lead'
      : jobRaw.includes('manager')
      ? 'Manager'
      : 'Barista';

    return [{
      firstName,
      lastName,
      email: emailIdx >= 0 ? cols[emailIdx] ?? '' : '',
      phone: phoneIdx >= 0 ? cols[phoneIdx] ?? '' : '',
      appliedFor,
      locationId: LOCATIONS[0].id as LocationId,
    }];
  });
}

function IndeedImportModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (rows: IndeedRow[]) => void;
}) {
  const [rows, setRows] = useState<IndeedRow[]>([]);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseIndeedCsv(text);
      if (parsed.length === 0) {
        setError('No candidates found. Make sure this is an Indeed applicant CSV export.');
        setRows([]);
      } else {
        setError('');
        setRows(parsed);
      }
    };
    reader.readAsText(file);
  }

  function handleLocationChange(idx: number, locationId: LocationId) {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, locationId } : r));
  }

  function handleRoleChange(idx: number, appliedFor: Candidate['appliedFor']) {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, appliedFor } : r));
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-8 text-center space-y-3">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
          <h2 className="text-xl font-bold text-ink-700">Import complete</h2>
          <p className="text-sm text-ink-500">{rows.length} candidate{rows.length !== 1 ? 's' : ''} added to the pipeline.</p>
          <button onClick={onClose} className="btn-cyan w-full">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ink-700">Import from Indeed</h2>
            <p className="text-xs text-ink-400 mt-0.5">
              In Indeed Employer → go to your job → Candidates → Download CSV
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-ink-100">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* File upload */}
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 p-6 cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/40 transition">
            <Upload size={24} className="text-ink-300" />
            <span className="text-sm font-semibold text-ink-600">Click to upload Indeed CSV</span>
            <span className="text-xs text-ink-400">Download from Indeed Employer Dashboard → Candidates → Export</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-hibiscus-50 px-3 py-2 text-sm text-hibiscus-600">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {rows.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-ink-700">{rows.length} candidate{rows.length !== 1 ? 's' : ''} ready to import — confirm location and role:</p>
              <div className="divide-y divide-ink-100 rounded-xl border border-ink-100 overflow-hidden">
                {rows.map((r, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-3 p-3 bg-white">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-ink-700">{r.firstName} {r.lastName}</div>
                      <div className="text-xs text-ink-400 truncate">{r.email}{r.phone ? ` · ${r.phone}` : ''}</div>
                    </div>
                    <select
                      value={r.appliedFor}
                      onChange={(e) => handleRoleChange(i, e.target.value as Candidate['appliedFor'])}
                      className="input text-xs py-1 w-32"
                    >
                      <option>Barista</option>
                      <option>Shift Lead</option>
                      <option>Manager</option>
                    </select>
                    <select
                      value={r.locationId}
                      onChange={(e) => handleLocationChange(i, e.target.value as LocationId)}
                      className="input text-xs py-1 w-40"
                    >
                      {LOCATIONS.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-ink-100 px-6 py-4 shrink-0">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={() => { onImport(rows); setDone(true); }}
            disabled={rows.length === 0}
            className="btn-cyan flex-1 disabled:opacity-40"
          >
            Import {rows.length > 0 ? `${rows.length} candidate${rows.length !== 1 ? 's' : ''}` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const location = getLocation(candidate.appliedToLocationId);
  return (
    <Link
      href={`/hiring/${candidate.id}`}
      className="block rounded-lg border border-ink-100 bg-white p-3 transition hover:border-cyan-300 hover:shadow-soft"
    >
      <div className="font-semibold text-ink-700">
        {candidate.firstName} {candidate.lastName}
      </div>
      <div className="mt-1 text-xs text-ink-400">
        {candidate.appliedFor} · {location?.name}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="pill bg-cyan-50 text-ink-700">{candidate.source}</span>
        <span className="text-[10px] text-ink-400">
          {formatDistanceToNow(parseISO(candidate.appliedOn), { addSuffix: true })}
        </span>
      </div>
      {candidate.notes.length > 0 && (
        <div className="mt-2 line-clamp-2 text-xs text-ink-600 italic">
          "{candidate.notes[candidate.notes.length - 1].body}"
        </div>
      )}
    </Link>
  );
}
