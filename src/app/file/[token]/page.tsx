'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, XCircle, Calendar, MapPin } from 'lucide-react';
import { getLocation } from '@/data/locations';
import { ROLE_LABELS } from '@/types';
import { format, parseISO } from 'date-fns';

type FileResponse = {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: keyof typeof ROLE_LABELS;
    homeLocationId: string;
    hiredOn: string;
    certifications: { id: string; name: string; issuedOn: string; expiresOn: string }[];
    active: boolean;
  };
  tasks: { id: string; title: string; signed: boolean; signedAt?: string }[];
};

export default function PublicEmployeeFilePage() {
  const params = useParams<{ token: string }>();
  const [data, setData] = useState<FileResponse | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/employee-file/view/${params.token}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(setData)
      .catch(() => setNotFound(true));
  }, [params.token]);

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-6">
        <div className="card max-w-sm p-8 text-center">
          <p className="font-semibold text-ink-700">Link not found</p>
          <p className="mt-1 text-sm text-ink-400">
            This link may have expired or been mistyped. Ask your manager for a new one.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center bg-page text-ink-400">Loading…</div>;
  }

  const { employee, tasks } = data;
  const loc = getLocation(employee.homeLocationId as Parameters<typeof getLocation>[0]);

  return (
    <div className="min-h-screen bg-page p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="tri-stripe rounded-full" />
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-ink-700">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {ROLE_LABELS[employee.role]} · {loc?.name}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-600">
              <Calendar size={14} className="text-ink-400" />
              Hired {format(parseISO(employee.hiredOn), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <MapPin size={14} className="text-ink-400" />
              {loc?.name}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-400">
            Onboarding documents
          </h2>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-2.5">
                <span className="text-sm font-medium text-ink-700">{t.title}</span>
                {t.signed ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                    <CheckCircle size={14} /> Signed
                    {t.signedAt ? ` ${format(parseISO(t.signedAt), 'MMM d, yyyy')}` : ''}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-400">
                    <XCircle size={14} /> Not signed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {employee.certifications.length > 0 && (
          <div className="card p-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-400">
              Certifications
            </h2>
            <div className="space-y-2">
              {employee.certifications.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-4 py-2.5">
                  <span className="text-sm font-medium text-ink-700">{c.name}</span>
                  <span className="text-xs text-ink-400">
                    Expires {format(parseISO(c.expiresOn), 'MMM d, yyyy')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-ink-300">
          This is a read-only view of your employee file. Contact your manager with questions.
        </p>
      </div>
    </div>
  );
}
