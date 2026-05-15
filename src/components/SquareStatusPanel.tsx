'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Loader2, RefreshCcw, Square } from 'lucide-react';

type Status =
  | { kind: 'loading' }
  | {
      kind: 'connected';
      environment: string;
      merchantName?: string;
      locationCount: number;
      locations: { id: string; name: string; city?: string; state?: string }[];
    }
  | { kind: 'not_configured'; error: string }
  | { kind: 'error'; error: string; details?: any };

export default function SquareStatusPanel() {
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  const check = async () => {
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch('/api/square/test', { cache: 'no-store' });
      const data = await res.json();
      if (data.ok) {
        setStatus({
          kind: 'connected',
          environment: data.environment,
          merchantName: data.merchantName,
          locationCount: data.locationCount,
          locations: data.locations,
        });
      } else if (data.configured === false) {
        setStatus({ kind: 'not_configured', error: data.error });
      } else {
        setStatus({ kind: 'error', error: data.error, details: data.details });
      }
    } catch (err: any) {
      setStatus({ kind: 'error', error: err?.message ?? 'Network error' });
    }
  };

  useEffect(() => {
    check();
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-700 text-white">
            <Square size={16} />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-700">Square connection</h2>
            <p className="text-xs text-ink-400">
              POS, locations, team members, and labor data live in Square.
            </p>
          </div>
        </div>
        <button
          onClick={check}
          className="rounded-full p-2 text-ink-400 hover:bg-cyan-50 hover:text-ink-700"
          title="Re-check"
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      <div className="mt-4">
        {status.kind === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Loader2 size={16} className="animate-spin" /> Checking…
          </div>
        )}

        {status.kind === 'connected' && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-emerald-800">
                  Connected ({status.environment})
                </div>
                <div className="mt-0.5 text-xs text-emerald-700">
                  {status.merchantName && <>Merchant: {status.merchantName} · </>}
                  {status.locationCount} location{status.locationCount === 1 ? '' : 's'} returned
                  by Square
                </div>
                {status.locations.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-emerald-700 hover:underline">
                      View raw location IDs
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {status.locations.map((l) => (
                        <li key={l.id} className="text-xs text-emerald-800">
                          <span className="font-mono">{l.id}</span> — {l.name}
                          {l.city && `, ${l.city}`}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <p className="mt-2 text-xs text-emerald-700">
                  Tip: copy each Square location ID into{' '}
                  <code className="rounded bg-emerald-100 px-1">src/data/locations.ts</code> so
                  orders, timecards, and team data route to the right store.
                </p>
              </div>
            </div>
          </div>
        )}

        {status.kind === 'not_configured' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-amber-800">Not configured yet</div>
                <p className="mt-1 text-xs text-amber-700 leading-relaxed">{status.error}</p>
                <p className="mt-2 text-xs text-amber-700">
                  Setup steps are in <code>web/.env.local.example</code>. Sign up at{' '}
                  <a
                    href="https://developer.squareup.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    developer.squareup.com
                  </a>{' '}
                  and paste your Sandbox token into <code>.env.local</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {status.kind === 'error' && (
          <div className="rounded-lg border border-hibiscus-200 bg-hibiscus-50/50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-hibiscus-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-hibiscus-700">Square rejected the request</div>
                <p className="mt-1 text-xs text-hibiscus-600 leading-relaxed">
                  {status.error}
                </p>
                {status.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-semibold text-hibiscus-700">
                      Raw error details
                    </summary>
                    <pre className="mt-1 overflow-auto rounded bg-white p-2 text-xs text-hibiscus-700">
                      {JSON.stringify(status.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
