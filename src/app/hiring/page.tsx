'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { STAGES } from '@/data/candidates';
import { useCandidates } from '@/data/store';
import { LOCATIONS, getLocation } from '@/data/locations';
import { Candidate, CandidateStage } from '@/types';
import { formatDistanceToNow, parseISO } from 'date-fns';

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
  const { candidates } = useCandidates();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');

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

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Hiring Pipeline</h1>
            <p className="mt-1 text-sm text-ink-400">
              {filtered.length} candidate{filtered.length === 1 ? '' : 's'} across{' '}
              {LOCATIONS.length} locations
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <Link href="/hiring/new" className="btn-cyan">
              <Plus size={16} />
              Add candidate
            </Link>
          </div>
        </div>

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
      </div>
    </AppShell>
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
