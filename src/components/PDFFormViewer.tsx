'use client';

import { Download, ExternalLink, Lock } from 'lucide-react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';

interface PDFFormViewerProps {
  /** Path to the PDF, relative to /public — e.g. "/forms/w4.pdf" */
  pdfUrl: string;
  /** Short display title shown above the embed */
  title: string;
  /** Instruction text shown above the PDF */
  instructions: React.ReactNode;
  /** The canonical attestation text the signer is agreeing to */
  attestationText: string;
  signerName: string;
  onSubmit: (result: SignaturePadResult) => void;
  onCancel: () => void;
}

export default function PDFFormViewer({
  pdfUrl,
  title,
  instructions,
  attestationText,
  signerName,
  onSubmit,
  onCancel,
}: PDFFormViewerProps) {
  return (
    <div className="space-y-5">
      {/* Instructions */}
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
        {instructions}
      </div>

      {/* PDF embed */}
      <div className="rounded-xl border border-ink-200 overflow-hidden bg-ink-50">
        <div className="flex items-center justify-between border-b border-ink-200 bg-white px-4 py-2.5">
          <span className="text-sm font-semibold text-ink-700">{title}</span>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition"
            >
              <ExternalLink size={13} />
              Open PDF
            </a>
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition"
            >
              <Download size={13} />
              Download
            </a>
          </div>
        </div>
        {/* iframe — renders on desktop/Chrome; iPad Safari may show blank (use Open PDF button above) */}
        <iframe
          src={`${pdfUrl}#toolbar=0&view=FitH`}
          title={title}
          className="w-full"
          style={{ height: '520px' }}
        />
        <div className="border-t border-ink-100 bg-amber-50 px-4 py-2.5 text-center md:hidden">
          <p className="text-xs text-amber-700 font-medium">
            PDF not loading?{' '}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Tap here to open it
            </a>
          </p>
        </div>
      </div>

      {/* Attestation */}
      <div className="rounded-xl border border-ink-100 bg-white p-4 space-y-4">
        <div className="rounded-lg bg-cyan-50/60 p-4 text-sm text-ink-700">
          <p className="font-semibold text-ink-700 mb-2 flex items-center gap-2">
            <Lock size={14} /> What you are signing
          </p>
          <p className="leading-relaxed whitespace-pre-line">{attestationText}</p>
        </div>
        <SignaturePad onSubmit={onSubmit} signerName={signerName} />
      </div>

      <button onClick={onCancel} className="text-sm text-ink-400 hover:text-ink-600 transition">
        Cancel
      </button>
    </div>
  );
}
