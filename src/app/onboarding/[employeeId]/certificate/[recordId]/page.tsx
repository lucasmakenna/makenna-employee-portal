'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Clock,
  Smartphone,
  MapPin,
  Hash,
  FileLock2,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useCurrentUser } from '@/lib/auth';
import { getSignatureById, verifyChain } from '@/data/signatures';
import { getEmployee, fullName } from '@/data/employees';
import { getDocTemplate } from '@/data/onboarding';
import type { SignatureAuditRecord } from '@/types';
import { format, parseISO } from 'date-fns';

export default function CertificatePage() {
  const params = useParams<{ employeeId: string; recordId: string }>();
  const router = useRouter();
  const { user, loaded } = useCurrentUser();
  const [record, setRecord] = useState<SignatureAuditRecord | undefined>();
  const [chainValid, setChainValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (loaded && !user) router.replace('/login');
  }, [loaded, user, router]);

  useEffect(() => {
    setRecord(getSignatureById(params.recordId));
    verifyChain().then((r) => setChainValid(r.valid));
  }, [params.recordId]);

  if (!record || !user) {
    return (
      <AppShell>
        <p>Audit record not found.</p>
      </AppShell>
    );
  }

  const employee = getEmployee(record.signerEmployeeId);
  const docId = (record.context as any).docId as string | undefined;
  const tpl = docId ? getDocTemplate(docId as import('@/types').OnboardingDocId) : null;

  const PDF_URLS: Record<string, string> = {
    w4: '/forms/w4.pdf',
    i9: '/forms/i9.pdf',
  };
  const pdfUrl = docId ? PDF_URLS[docId] : null;

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3 print:hidden">
          <Link
            href={`/onboarding/${params.employeeId}`}
            className="inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-700"
          >
            <ArrowLeft size={16} /> Back to packet
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>

        <div className="card mt-4 p-8 print:shadow-none print:border-0">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b border-ink-100 pb-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-500 font-bold">
                Certificate of Completion
              </div>
              <h1 className="mt-1 text-2xl font-bold text-ink-700">
                Electronic Signature Audit Record
              </h1>
              <p className="mt-1 text-sm text-ink-400">
                Makenna Koffee Company — Team Portal
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink-700 text-white">
              <ShieldCheck size={28} />
            </div>
          </div>

          {/* Headline summary */}
          <p className="mt-5 text-base leading-relaxed text-ink-700">
            <strong>{record.signerLegalName}</strong>{' '}
            {record.signerEmployeeId === record.context.employeeId
              ? 'electronically signed'
              : 'electronically signed on behalf of'}{' '}
            <strong>{record.documentTitle}</strong> on{' '}
            <strong>{format(parseISO(record.signedAtIso), "MMMM d, yyyy 'at' h:mm:ss a zzz")}</strong>.
          </p>

          {/* Two-column metadata */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                Signer
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Legal name</dt>
                  <dd className="font-semibold text-ink-700 text-right">
                    {record.signerLegalName}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Employee ID</dt>
                  <dd className="font-mono text-ink-700 text-right">
                    {record.signerEmployeeId}
                  </dd>
                </div>
                {employee && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-400">Email</dt>
                    <dd className="text-ink-700 text-right">{employee.email}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">ESIGN consent</dt>
                  <dd className="text-emerald-700 font-semibold text-right">
                    {record.consentAcknowledged ? 'Acknowledged' : 'Not acknowledged'}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
                <Clock size={12} /> Timing
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Signed at</dt>
                  <dd className="font-semibold text-ink-700 text-right">
                    {format(parseISO(record.signedAtIso), 'PPPp')}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">ISO timestamp</dt>
                  <dd className="font-mono text-ink-700 text-right text-xs">
                    {record.signedAtIso}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Source clock</dt>
                  <dd className="text-ink-700 text-right">
                    {record.serverStamped ? 'Server (NTP-synced)' : 'Client (sandbox)'}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
                <Smartphone size={12} /> Device
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">User agent</dt>
                  <dd className="text-ink-700 text-right text-xs break-all">
                    {record.fingerprint.userAgent}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Language</dt>
                  <dd className="text-ink-700 text-right">{record.fingerprint.language}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Timezone</dt>
                  <dd className="text-ink-700 text-right">{record.fingerprint.timezone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Screen / viewport</dt>
                  <dd className="text-ink-700 text-right">
                    {record.fingerprint.screenSize} / {record.fingerprint.viewport}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
                <MapPin size={12} /> Network &amp; location
              </h3>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">IP address</dt>
                  <dd className="text-ink-700 text-right font-mono">
                    {record.ipAddress ?? <span className="text-ink-400">— captured server-side in production —</span>}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400">Geolocation</dt>
                  <dd className="text-ink-700 text-right">
                    {record.geo
                      ? `${record.geo.latitude.toFixed(5)}, ${record.geo.longitude.toFixed(5)} (±${Math.round(record.geo.accuracyMeters)}m)`
                      : 'Not provided'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Document hash */}
          <div className="mt-6 rounded-lg border border-ink-100 bg-cyan-50/40 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
              <Hash size={12} /> Document integrity
            </h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Document title</dt>
                <dd className="font-semibold text-ink-700 text-right">
                  {record.documentTitle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Document size</dt>
                <dd className="text-ink-700 text-right">{record.documentBytes} bytes</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">SHA-256 hash</dt>
                <dd className="font-mono text-ink-700 text-right text-xs break-all">
                  {record.documentHash}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-400 leading-relaxed">
              The hash above was computed at the moment of signing. Any change to the document's
              text — even a single character — will produce a different hash, proving that
              what's on file is what was actually signed.
            </p>
          </div>

          {/* Hash chain */}
          <div className="mt-4 rounded-lg border border-ink-100 bg-cyan-50/40 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2 flex items-center gap-1">
              <FileLock2 size={12} /> Tamper-evident chain
            </h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">This record ID</dt>
                <dd className="font-mono text-ink-700 text-right text-xs">{record.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Prior record ID</dt>
                <dd className="font-mono text-ink-700 text-right text-xs">
                  {record.priorRecordId ?? <span className="text-ink-400">— first record —</span>}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Prior record hash</dt>
                <dd className="font-mono text-ink-700 text-right text-xs break-all">
                  {record.priorRecordHash ?? <span className="text-ink-400">— first record —</span>}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400">Chain integrity</dt>
                <dd
                  className={`text-right font-semibold ${
                    chainValid === null
                      ? 'text-ink-400'
                      : chainValid
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                >
                  {chainValid === null
                    ? 'Verifying…'
                    : chainValid
                    ? 'Verified ✓'
                    : 'Broken — investigate'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Government form link (W-4 / I-9) */}
          {pdfUrl && (
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                Government form reviewed
              </h3>
              <div className="rounded-xl border border-ink-200 bg-white overflow-hidden print:hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-100">
                    <FileText size={22} className="text-ink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-800 truncate">{tpl?.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">Official government form · PDF</p>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-ink-100 px-4 py-3 bg-ink-50">
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition"
                  >
                    <ExternalLink size={14} /> View Form
                  </a>
                  <a
                    href={pdfUrl}
                    download
                    className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-600 hover:bg-ink-50 transition"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
              {/* Print fallback */}
              <p className="hidden print:block text-sm text-ink-400 mt-1">
                Form: {pdfUrl}
              </p>
            </div>
          )}

          {/* What was signed */}
          {tpl && (
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                Attestation text agreed to
              </h3>
              <div className="rounded-lg border border-ink-100 bg-white p-4 text-sm text-ink-700 leading-relaxed whitespace-pre-line">
                {tpl.templateBody}
              </div>
            </div>
          )}

          {/* Signature image */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
              Signature
            </h3>
            <div className="rounded-lg border border-ink-200 bg-white p-4">
              <img
                src={record.signatureImagePngDataUrl}
                alt={`Signature of ${record.signerLegalName}`}
                className="h-auto w-full max-w-md"
              />
              <p className="mt-2 border-t border-ink-100 pt-2 text-xs text-ink-400">
                {record.signerLegalName} · {format(parseISO(record.signedAtIso), 'PPPp')}
              </p>
            </div>
          </div>

          {/* Legal footer */}
          <div className="mt-8 border-t border-ink-100 pt-4 text-xs text-ink-400 leading-relaxed">
            <p>
              This Certificate of Completion is an electronic record under the federal Electronic
              Signatures in Global and National Commerce Act (15 U.S.C. §7001 et seq.) and the
              California Uniform Electronic Transactions Act (Cal. Civ. Code §1633.1 et seq.).
              The signature represented above has the same legal effect as a handwritten
              signature on a paper document.
            </p>
            <p className="mt-2">
              Audit record retained by Makenna Koffee Company in an append-only log. Each record
              is cryptographically chained to the prior record; any modification of any record
              breaks the chain and is detectable.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
