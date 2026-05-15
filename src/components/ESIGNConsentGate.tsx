'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { captureConsent } from '@/lib/signature-audit';

/**
 * One-time ESIGN consent gate.
 *
 * Per the federal ESIGN Act and California UETA, before we can use
 * electronic signatures with an employee, they must affirmatively consent
 * to do business electronically. We capture this once per employee, store
 * it with their fingerprint and timestamp, and never ask again.
 */
export default function ESIGNConsentGate({
  employeeId,
  employeeName,
  onConsent,
  onCancel,
}: {
  employeeId: string;
  employeeName: string;
  onConsent: () => void;
  onCancel: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAgree = () => {
    if (!agreed) return;
    setSubmitting(true);
    captureConsent(employeeId);
    onConsent();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card max-w-lg p-6">
        <div className="flex items-center gap-2 text-ink-700">
          <Lock size={20} />
          <h2 className="text-lg font-bold">Consent to electronic signatures</h2>
        </div>
        <div className="mt-4 max-h-[50vh] overflow-y-auto rounded-lg bg-cyan-50/40 p-4 text-sm text-ink-700 leading-relaxed space-y-3">
          <p>
            Before you sign any documents through the Makenna Koffee Team Portal,
            we need your consent to use electronic records and electronic
            signatures.
          </p>
          <p>
            <strong>What this means:</strong> By consenting, you agree that your
            electronic signatures on company documents (W-4, I-9, NDA, handbook
            acknowledgement, training sign-offs, and similar) will have the
            same legal effect as a handwritten signature on a paper document.
          </p>
          <p>
            <strong>What we capture:</strong> Each time you sign, we record a
            timestamp, your IP address, your device information, the exact
            text of the document you signed, and a cryptographic hash of that
            text. These records are stored in an append-only log so neither you
            nor we can alter them after the fact.
          </p>
          <p>
            <strong>Your rights:</strong> You may request a paper copy of any
            document at any time. You may also withdraw your consent in writing
            to <a className="underline" href="mailto:hr@makennakoffee.com">hr@makennakoffee.com</a> —
            after withdrawal, future documents will be signed on paper.
          </p>
          <p>
            <strong>Hardware/software requirements:</strong> A modern browser
            (Chrome, Safari, Firefox, or Edge from the last 2 years) with
            JavaScript enabled. To save copies of signed documents, you'll
            need a PDF viewer.
          </p>
          <p className="text-xs text-ink-400">
            This consent is governed by the federal ESIGN Act (15 U.S.C. §7001
            et seq.) and the California Uniform Electronic Transactions Act
            (Cal. Civ. Code §1633.1 et seq.).
          </p>
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-ink-700">
            I, <strong>{employeeName}</strong>, consent to use electronic records
            and electronic signatures for my employment with Makenna Koffee
            Company.
          </span>
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Not now
          </button>
          <button
            onClick={handleAgree}
            disabled={!agreed || submitting}
            className="btn-primary disabled:opacity-40"
          >
            Consent &amp; continue
          </button>
        </div>
      </div>
    </div>
  );
}
