'use client';

import { useState } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

/**
 * Wipes every demo store key from localStorage and reloads the page so the
 * fresh seed data takes effect.
 *
 * In production this whole component goes away — it only exists because
 * we're persisting demo state in localStorage instead of a real backend.
 */
const DEMO_KEYS = [
  'mk-candidates-v1',
  'mk-employees-v1',
  'mk-packets-v1',
  'mk-conversations-v1',
  'mk-messages-v1',
  'mk-availability-v1',
  'makenna-portal-current-user',
  'makenna-signature-log',
];

export default function ResetDemoButton() {
  const [confirming, setConfirming] = useState(false);

  const wipe = () => {
    DEMO_KEYS.forEach((k) => window.localStorage.removeItem(k));
    // Also remove any per-employee ESIGN consent flags
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith('makenna-esign-consent:'))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.href = '/login';
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-ink-200 px-3 py-2 text-xs font-semibold text-ink-400 hover:border-hibiscus-300 hover:text-hibiscus-500"
      >
        <RefreshCcw size={14} />
        Reset demo data
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-hibiscus-200 bg-hibiscus-50/40 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="text-hibiscus-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-bold text-ink-700">Reset everything?</div>
          <p className="mt-1 text-xs text-ink-500 leading-relaxed">
            Clears every candidate, employee, onboarding packet, message, signature, and
            availability you've added. Reloads the original demo seed.
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setConfirming(false)} className="btn-ghost text-xs">
              Cancel
            </button>
            <button
              onClick={wipe}
              className="rounded-full bg-hibiscus-400 px-3 py-1.5 text-xs font-bold text-white hover:bg-hibiscus-500"
            >
              Yes, reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
