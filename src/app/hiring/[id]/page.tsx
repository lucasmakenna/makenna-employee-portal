'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { STAGES } from '@/data/candidates';
import { getLocation } from '@/data/locations';
import { fullName } from '@/data/employees';
import {
  useCandidates,
  useEmployees,
  usePackets,
  buildEmployeeFromCandidate,
} from '@/data/store';
import { CandidateStage, Role, Employee } from '@/types';
import { format, parseISO } from 'date-fns';
import { welcomeEmailFor } from '@/lib/email-templates';
import EmailPreview from '@/components/EmailPreview';

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  const { getById, moveStage, addNote } = useCandidates();
  const { add: addEmployee } = useEmployees();
  const { create: createPacket } = usePackets();

  const candidate = getById(params.id);

  const [newNote, setNewNote] = useState('');
  const [hireOpen, setHireOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
  );
  const [hireRole, setHireRole] = useState<Role>(
    candidate?.appliedFor === 'Shift Lead' ? 'lead'
    : candidate?.appliedFor === 'Manager' ? 'manager'
    : 'barista'
  );
  const [hiredEmployee, setHiredEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!candidate || !user) {
    return (
      <AppShell>
        <p>Candidate not found.</p>
      </AppShell>
    );
  }

  const location = getLocation(candidate.appliedToLocationId);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(candidate.id, {
      authorId: user.id,
      authorName: fullName(user),
      body: newNote.trim(),
    });
    setNewNote('');
  };

  const handleHire = () => {
    // 1) Create the employee record
    const employee = buildEmployeeFromCandidate(candidate, startDate, undefined, hireRole);
    addEmployee(employee);
    // 2) Create the onboarding packet
    createPacket(employee.id, startDate);
    // 3) Mark the candidate hired
    moveStage(candidate.id, 'hired');
    // 4) Show the welcome email preview — this is what would be emailed in production
    setHiredEmployee(employee);
  };

  return (
    <AppShell>
      {hiredEmployee && (
        <EmailPreview
          email={welcomeEmailFor(hiredEmployee, startDate, fullName(user))}
          recipientLabel={`${hiredEmployee.firstName} ${hiredEmployee.lastName} (new hire)`}
          goToActivationUrl={`/activate/${hiredEmployee.id}`}
          onClose={() => router.push(`/onboarding/${hiredEmployee.id}`)}
          onSend={() => router.push(`/onboarding/${hiredEmployee.id}`)}
        />
      )}
      <div className="mx-auto max-w-5xl">
        <Link
          href="/hiring"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Back to pipeline
        </Link>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile + Notes */}
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-ink-700">
                    {candidate.firstName} {candidate.lastName}
                  </h1>
                  <p className="mt-1 text-sm text-ink-400">
                    {candidate.appliedFor} · Source: {candidate.source}
                  </p>
                </div>
                <span className="pill bg-cyan-50 text-ink-700 capitalize">
                  {candidate.stage.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-ink-700">
                  <Mail size={14} className="text-ink-400" />
                  <a href={`mailto:${candidate.email}`} className="underline">
                    {candidate.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <Phone size={14} className="text-ink-400" />
                  <a href={`tel:${candidate.phone}`} className="underline">
                    {candidate.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <MapPin size={14} className="text-ink-400" />
                  Applied to {location?.name}
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <Calendar size={14} className="text-ink-400" />
                  Applied {format(parseISO(candidate.appliedOn), 'MMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-bold text-ink-700">Interview notes</h2>
              <div className="mt-3 space-y-3">
                {candidate.notes.length === 0 && (
                  <p className="text-sm text-ink-400">No notes yet.</p>
                )}
                {candidate.notes.map((n) => (
                  <div key={n.id} className="rounded-lg bg-cyan-50/50 p-3">
                    <div className="flex items-center justify-between text-xs text-ink-400">
                      <span className="font-semibold">{n.authorName}</span>
                      <span>{format(parseISO(n.createdAt), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-700">{n.body}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-ink-100 pt-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note (interview impressions, schedule, follow-ups)…"
                  className="input min-h-[80px]"
                />
                <div className="mt-2 flex justify-end">
                  <button onClick={handleAddNote} className="btn-cyan">
                    Add note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
                Move to stage
              </h2>
              <div className="mt-3 space-y-2">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => moveStage(candidate.id, s.id as CandidateStage)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      candidate.stage === s.id
                        ? 'border-cyan-400 bg-cyan-400 text-white'
                        : 'border-ink-100 hover:border-cyan-300'
                    }`}
                  >
                    {s.label}
                    {candidate.stage === s.id && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">
                Decision
              </h2>
              <div className="mt-3 space-y-2">
                {candidate.stage === 'hired' ? (
                  <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                    <CheckCircle2 size={14} className="inline mr-1" />
                    Hired. Onboarding in progress.
                  </div>
                ) : !hireOpen ? (
                  <button onClick={() => setHireOpen(true)} className="btn-hibiscus w-full">
                    <Sparkles size={16} /> Hire & start onboarding
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="label">Start date</label>
                      <input
                        type="date"
                        className="input"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">Role</label>
                      <select
                        className="input"
                        value={hireRole}
                        onChange={(e) => setHireRole(e.target.value as Role)}
                      >
                        <option value="barista">Barista</option>
                        <option value="trainer">Trainer</option>
                        <option value="lead">Shift Lead</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHireOpen(false)}
                        className="btn-ghost flex-1"
                      >
                        Cancel
                      </button>
                      <button onClick={handleHire} className="btn-hibiscus flex-1">
                        <Sparkles size={14} /> Confirm hire
                      </button>
                    </div>
                  </div>
                )}
                {candidate.stage !== 'rejected' && candidate.stage !== 'hired' && (
                  <button
                    onClick={() => moveStage(candidate.id, 'rejected')}
                    className="btn-ghost w-full text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={16} /> Pass
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
