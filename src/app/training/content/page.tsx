'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { can } from '@/data/permissions';
import { STATIONS } from '@/data/training';

/**
 * Content versioning admin.
 *
 * In production this is hooked to a CMS or DB so admins can edit station
 * content, criteria, and skills without redeploying. Each save bumps
 * contentVersion. Trainees auto-get the new version next time they open it.
 */
export default function TrainingContentAdmin() {
  const router = useRouter();
  const { user, loaded } = useCurrentUser();

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  if (!user) return null;

  if (!can(user.role, 'training.edit_curriculum')) {
    return (
      <AppShell>
        <p>You don't have access to edit training content.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <Link
          href="/training"
          className="mb-4 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
        >
          <ArrowLeft size={16} /> Training
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink-700">Training Content</h1>
            <p className="mt-1 text-sm text-ink-400">
              Edit station content from your existing 62-page guide. Every save bumps the version
              and trainees get the update next time they open the app.
            </p>
          </div>
          <button className="btn-primary">
            <Plus size={16} /> New station
          </button>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 mb-6">
          <strong>Heads up:</strong> The current curriculum is a starter scaffold. Upload your
          62-page training guide and we'll port the real content into this structure — same
          stations, your real skills and criteria.
        </div>

        <div className="space-y-3">
          {STATIONS.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">
                    Section {s.order} · v{s.contentVersion}
                  </div>
                  <h2 className="text-lg font-bold text-ink-700">{s.name}</h2>
                  <p className="mt-1 text-sm text-ink-400">{s.description}</p>
                  <p className="mt-1 text-xs text-ink-400">
                    {s.skills.length} skills · last updated{' '}
                    {new Date(s.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/training/stations/${s.id}`} className="btn-ghost">
                  <Pencil size={14} /> Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
