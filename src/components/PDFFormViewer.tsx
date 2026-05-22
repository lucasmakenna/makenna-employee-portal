'use client';

import { Download, ExternalLink, FileText, Lock } from 'lucide-react';
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

      {/* PDF open card — no iframe; opens in browser's native PDF viewer */}
      <div className="rounded-xl border border-ink-200 bg-white overflow-hidden">
        <div className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink-100">
            <FileText size={26} className="text-ink-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-800 truncate">{title}</p>
            <p className="text-xs text-ink-400 mt-0.5">Official government form · PDF</p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-ink-100 px-5 py-3 bg-ink-50">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition"
          >
            <ExternalLink size={15} />
            View Form
          </a>
          <a
            href={pdfUrl}
            download
            className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-50 transition"
          >
            <Download size={15} />
            Download
          </a>
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
