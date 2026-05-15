'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { useCandidates } from '@/data/store';
import { LOCATIONS } from '@/data/locations';
import { fullName } from '@/data/employees';
import type { Candidate, LocationId } from '@/types';

const ROLES: Candidate['appliedFor'][] = ['Barista', 'Shift Lead', 'Manager'];
const SOURCES: Candidate['source'][] = ['Indeed', 'Walk-in', 'Referral', 'Instagram', 'Other'];

export default function AddCandidatePage() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const { add } = useCandidates();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appliedFor, setAppliedFor] = useState<Candidate['appliedFor']>('Barista');
  const [appliedToLocationId, setAppliedToLocationId] = useState<LocationId>(
    user?.homeLocationId ?? LOCATIONS[0].id,
  );
  const [source, setSource] = useState<Candidate['source']>('Indeed');
  const [initialNote, setInitialNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const valid =
    firstName.trim() && lastName.trim() && email.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const cand = add({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      appliedFor,
      appliedToLocationId,
      source,
      initialNote: initialNote.trim() || undefined,
      authorId: user.id,
      authorName: fullName(user),
    });
    router.push(`/hiring/${cand.id}`);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <Link
          href="/hiring"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Back to pipeline
        </Link>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-hibiscus-400 ring-2 ring-cyan-100">
              <UserPlus size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-700">Add a candidate</h1>
              <p className="text-sm text-ink-400">
                They'll land in the Applied column. You can move them through the pipeline from
                their candidate page.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First name</label>
                <input
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jasmine"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Carter"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jasmine@example.com"
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(805) 555-0199"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Applying for</label>
                <select
                  className="input"
                  value={appliedFor}
                  onChange={(e) => setAppliedFor(e.target.value as Candidate['appliedFor'])}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <select
                  className="input"
                  value={appliedToLocationId}
                  onChange={(e) => setAppliedToLocationId(e.target.value as LocationId)}
                >
                  {LOCATIONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">How did they find us?</label>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      source === s
                        ? 'bg-cyan-400 text-white'
                        : 'bg-cyan-50 text-ink-700 hover:bg-cyan-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">First note (optional)</label>
              <textarea
                className="input min-h-[90px]"
                value={initialNote}
                onChange={(e) => setInitialNote(e.target.value)}
                placeholder="First impression, schedule, things to follow up on…"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
              <Link href="/hiring" className="btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={!valid || submitting}
                className="btn-cyan disabled:opacity-40"
              >
                <UserPlus size={16} />
                Add candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
