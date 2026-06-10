'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useEmployees } from '@/data/store';
import { LOCATIONS } from '@/data/locations';
import { ROLES, ROLE_LABELS } from '@/types';
import type { Employee, LocationId, Role } from '@/types';

const PALETTE = ['#2B1810', '#D4A574', '#5C3A28', '#956A36', '#3D241A', '#B8894E', '#8C6347'];

type ParsedRow = {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  homeLocationId: LocationId;
  raw: string;
  error?: string;
};

type RowResult = ParsedRow & {
  status: 'pending' | 'working' | 'invited' | 'resent' | 'failed';
  message?: string;
};

const LOCATION_IDS = new Set(LOCATIONS.map((l) => l.id));
const ROLE_SET = new Set<string>(ROLES);

function parseLines(text: string): ParsedRow[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      const [name, email, role, location] = parts;

      let error: string | undefined;
      let firstName = '';
      let lastName = '';
      if (!name || !name.includes(' ')) {
        error = 'Name must be "First Last"';
      } else {
        const idx = name.indexOf(' ');
        firstName = name.slice(0, idx).trim();
        lastName = name.slice(idx + 1).trim();
      }

      if (!email || !email.includes('@')) {
        error = error ?? 'Invalid email';
      }

      const roleLower = (role ?? '').toLowerCase().trim();
      if (!ROLE_SET.has(roleLower)) {
        error = error ?? `Role must be one of: ${ROLES.join(', ')}`;
      }

      const locLower = (location ?? '').toLowerCase().trim().replace(/\s+/g, '-');
      if (!LOCATION_IDS.has(locLower as LocationId)) {
        error = error ?? `Location must be one of: ${[...LOCATION_IDS].join(', ')}`;
      }

      return {
        firstName,
        lastName,
        email: (email ?? '').toLowerCase(),
        role: roleLower as Role,
        homeLocationId: locLower as LocationId,
        raw: line,
        error,
      };
    });
}

export default function BulkInvitePage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { employees, add } = useEmployees();
  const [text, setText] = useState('');
  const [rows, setRows] = useState<RowResult[] | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;
  if (user.role !== 'admin' && user.role !== 'manager') {
    return (
      <AppShell>
        <p className="text-ink-500">You don&apos;t have permission to view this page.</p>
      </AppShell>
    );
  }

  const parsed = parseLines(text);
  const validCount = parsed.filter((r) => !r.error).length;
  const errorCount = parsed.length - validCount;

  async function runImport() {
    const valid = parsed.filter((r) => !r.error);
    const initial: RowResult[] = valid.map((r) => ({ ...r, status: 'pending' }));
    setRows(initial);
    setRunning(true);

    for (let i = 0; i < initial.length; i++) {
      const row = initial[i];

      setRows((prev) => prev!.map((r, j) => (j === i ? { ...r, status: 'working' } : r)));

      try {
        // Skip if an employee with this email already exists
        const existing = employees.find(
          (e) => e.email.toLowerCase() === row.email.toLowerCase(),
        );

        if (!existing) {
          const newEmployee: Employee = {
            id: `emp-${Date.now()}-${i}`,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            phone: '',
            role: row.role,
            homeLocationId: row.homeLocationId,
            hiredOn: new Date().toISOString().slice(0, 10),
            certifications: [],
            trainingProgressByStation: {},
            avatarColor: PALETTE[i % PALETTE.length],
            active: true,
          };
          add(newEmployee);
        }

        const res = await fetch('/api/invite-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: row.email, name: `${row.firstName} ${row.lastName}` }),
        });
        const data = await res.json();

        if (!res.ok) {
          setRows((prev) =>
            prev!.map((r, j) => (j === i ? { ...r, status: 'failed', message: data.error ?? 'Failed' } : r)),
          );
        } else if (data.resent) {
          setRows((prev) =>
            prev!.map((r, j) => (j === i ? { ...r, status: 'resent', message: 'Already had an account — sent reset link' } : r)),
          );
        } else {
          setRows((prev) =>
            prev!.map((r, j) => (j === i ? { ...r, status: 'invited', message: 'Invite sent' } : r)),
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setRows((prev) => prev!.map((r, j) => (j === i ? { ...r, status: 'failed', message: msg } : r)));
      }

      // Small delay between sends to be gentle on the email provider
      await new Promise((res) => setTimeout(res, 1200));
    }

    setRunning(false);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/team"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Team
        </Link>

        <div className="card p-6 mb-6">
          <h1 className="text-2xl font-bold text-ink-700 mb-1">Bulk invite</h1>
          <p className="text-sm text-ink-400 mb-4">
            Paste one person per line: <code className="bg-cyan-50 px-1 py-0.5 rounded text-xs">Full Name, email, role, location</code>
          </p>
          <p className="text-xs text-ink-400 mb-4">
            Roles: {ROLES.join(', ')} &middot; Locations: {LOCATIONS.map((l) => l.id).join(', ')}
          </p>

          <textarea
            className="input w-full font-mono text-xs"
            rows={10}
            placeholder={`Jane Doe, jane@makennakoffee.com, barista, simi-valley\nJohn Smith, john@makennakoffee.com, trainer, ventura`}
            value={text}
            onChange={(e) => { setText(e.target.value); setRows(null); }}
            disabled={running}
          />

          {parsed.length > 0 && (
            <div className="mt-3 text-sm">
              <span className="text-emerald-600 font-semibold">{validCount} ready</span>
              {errorCount > 0 && (
                <span className="text-hibiscus-500 font-semibold ml-3">{errorCount} with errors</span>
              )}
            </div>
          )}

          {parsed.filter((r) => r.error).length > 0 && (
            <div className="mt-2 space-y-1">
              {parsed.filter((r) => r.error).map((r, i) => (
                <p key={i} className="text-xs text-hibiscus-500">
                  &quot;{r.raw}&quot; — {r.error}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={runImport}
            disabled={validCount === 0 || running}
            className="btn-cyan mt-4 flex items-center gap-2"
          >
            {running ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {running ? 'Sending invites…' : `Add ${validCount} ${validCount === 1 ? 'person' : 'people'} & send invites`}
          </button>
          <p className="mt-2 text-xs text-ink-400">
            Each person gets an "Employees" record (so they show up in Team/Training right away)
            and an email invite to set their password. Sends one at a time with a short pause —
            this can take a while for large lists. Don&apos;t close this tab while it runs.
          </p>
        </div>

        {rows && (
          <div className="card overflow-hidden">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 text-sm ${i > 0 ? 'border-t border-ink-100' : ''}`}
              >
                {r.status === 'pending' && <span className="h-4 w-4 rounded-full bg-ink-100 shrink-0" />}
                {r.status === 'working' && <Loader2 size={16} className="animate-spin text-cyan-500 shrink-0" />}
                {(r.status === 'invited' || r.status === 'resent') && (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                )}
                {r.status === 'failed' && <XCircle size={16} className="text-hibiscus-500 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-700">
                    {r.firstName} {r.lastName} <span className="text-ink-400 font-normal">· {r.email}</span>
                  </div>
                  <div className="text-xs text-ink-400">
                    {ROLE_LABELS[r.role]} · {r.homeLocationId}
                    {r.message ? ` — ${r.message}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
