'use client';

import { useRef, useState } from 'react';
import { Upload, CheckCircle2, ImageIcon, X, Calendar, School, AlertTriangle } from 'lucide-react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';

const MAX_WIDTH = 1200;

/** Compress an image File to a JPEG data URL, capped at MAX_WIDTH. */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export type WorkPermitResult = {
  completionProofDataUrl: string;
  permitExpirationDate: string;
  permitSchool: string;
  signature: SignaturePadResult;
};

/**
 * WorkPermitUpload
 *
 * 4-step flow for recording a minor's California work permit:
 *   1. Info about work permit requirements
 *   2. Permit details (school, expiration date)
 *   3. Photo of the physical permit
 *   4. Manager sign & attest (locked until photo is uploaded)
 *
 * The manager (logged-in user) signs — not the employee — because the
 * attestation confirms the manager physically inspected the permit.
 */
export default function WorkPermitUpload({
  signerName,
  employeeName,
  templateBody,
  onSubmit,
  onCancel,
}: {
  signerName: string;
  employeeName: string;
  templateBody: string;
  onSubmit: (result: WorkPermitResult) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [permitSchool, setPermitSchool] = useState('');
  const [permitExpirationDate, setPermitExpirationDate] = useState('');
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const detailsComplete = permitSchool.trim().length > 0 && permitExpirationDate.length > 0;
  const readyToSign = detailsComplete && proofDataUrl !== null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, etc.).');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const dataUrl = await compressImage(file);
      setProofDataUrl(dataUrl);
    } catch {
      setUploadError('Could not read that image — try a different file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSign = (sig: SignaturePadResult) => {
    if (!proofDataUrl || !detailsComplete) return;
    onSubmit({
      completionProofDataUrl: proofDataUrl,
      permitExpirationDate,
      permitSchool: permitSchool.trim(),
      signature: sig,
    });
  };

  return (
    <div className="space-y-6 p-1">
      {/* Info banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-bold">Work permit required — California law</p>
            <p className="mt-1 leading-relaxed">
              California Education Code §49160 requires every minor under 18 to have a valid{' '}
              <strong>Statement Authorizing Employment (CDE Form B1-4)</strong> issued by their
              school district before starting work. Makenna Koffee cannot employ a minor without
              a current permit on file.
            </p>
            <ul className="mt-2 list-disc space-y-0.5 pl-4">
              <li>Permits are issued by the student's school or district office.</li>
              <li>They expire at the end of the school year or the date shown on the permit.</li>
              <li>A new permit is required each school year — set a renewal reminder.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 1 — Permit details */}
      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              detailsComplete ? 'bg-emerald-400 text-white' : 'bg-cyan-400 text-white'
            }`}
          >
            {detailsComplete ? <CheckCircle2 size={16} /> : '1'}
          </div>
          <div className="flex-1 space-y-3">
            <div className="font-bold text-ink-700">Enter permit details</div>
            <p className="text-sm text-ink-500">
              Fill in the details from <strong>{employeeName}</strong>'s physical work permit.
            </p>

            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">
                <span className="inline-flex items-center gap-1">
                  <School size={12} /> School / District issuing the permit
                </span>{' '}
                <span className="text-hibiscus-500">*</span>
              </label>
              <input
                type="text"
                value={permitSchool}
                onChange={(e) => setPermitSchool(e.target.value)}
                placeholder="e.g. Simi Valley Unified School District"
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 placeholder-ink-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} /> Permit expiration date
                </span>{' '}
                <span className="text-hibiscus-500">*</span>
              </label>
              <input
                type="date"
                value={permitExpirationDate}
                onChange={(e) => setPermitExpirationDate(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
              {permitExpirationDate && (
                <p className="mt-1 text-xs text-ink-400">
                  Remind {employeeName} to get a renewed permit before this date.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 — Upload permit photo */}
      <div
        className={`rounded-xl border bg-white p-5 transition ${
          !detailsComplete ? 'border-ink-50 opacity-50 pointer-events-none select-none' : 'border-ink-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              proofDataUrl ? 'bg-emerald-400 text-white' : detailsComplete ? 'bg-cyan-400 text-white' : 'bg-ink-100 text-ink-400'
            }`}
          >
            {proofDataUrl ? <CheckCircle2 size={16} /> : '2'}
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-700">Photograph the work permit</div>
            {!detailsComplete && (
              <p className="mt-1 text-sm text-ink-400">Complete Step 1 to unlock.</p>
            )}
            {detailsComplete && (
              <>
                <p className="mt-1 text-sm text-ink-500">
                  Take a clear photo of both sides of the permit and upload it here. This image
                  is stored securely as the official record.
                </p>

                {proofDataUrl ? (
                  <div className="mt-3">
                    <div className="relative inline-block">
                      <img
                        src={proofDataUrl}
                        alt="Work permit photo"
                        className="max-h-56 rounded-lg border border-ink-100 object-contain shadow-sm"
                      />
                      <button
                        onClick={() => setProofDataUrl(null)}
                        className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow border border-ink-100 hover:bg-red-50"
                        title="Remove and re-upload"
                      >
                        <X size={14} className="text-ink-400" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-emerald-700 font-semibold">
                      ✓ Permit photo attached — proceed to Step 3 below.
                    </p>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/40 px-6 py-8 text-center hover:border-cyan-400 hover:bg-cyan-50 transition"
                  >
                    {uploading ? (
                      <p className="text-sm text-ink-400">Processing…</p>
                    ) : (
                      <>
                        <ImageIcon size={28} className="text-cyan-300" />
                        <div className="text-sm font-semibold text-ink-700">
                          Drag permit photo here, or click to browse
                        </div>
                        <div className="text-xs text-ink-400">PNG, JPG, or WEBP</div>
                        <button className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-cyan-300 bg-white px-4 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-50">
                          <Upload size={12} /> Choose file
                        </button>
                      </>
                    )}
                  </div>
                )}
                {uploadError && (
                  <p className="mt-2 text-xs text-hibiscus-600">{uploadError}</p>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = '';
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 3 — Manager sign & attest (locked until permit photo uploaded) */}
      <div
        className={`rounded-xl border bg-white p-5 transition ${
          readyToSign ? 'border-ink-100' : 'border-ink-50 opacity-50 pointer-events-none select-none'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              readyToSign ? 'bg-cyan-400 text-white' : 'bg-ink-100 text-ink-400'
            }`}
          >
            3
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-700">Manager — sign &amp; attest</div>
            {!readyToSign && (
              <p className="mt-1 text-sm text-ink-400">
                Complete Steps 1 and 2 to unlock the manager attestation.
              </p>
            )}
            {readyToSign && (
              <div className="mt-3 space-y-4">
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="font-semibold">Manager signs below — not the employee</p>
                  <p className="mt-0.5">
                    You ({signerName}) are attesting that you personally inspected the work permit
                    and that everything logged here is accurate.
                  </p>
                </div>
                <div className="rounded-lg bg-cyan-50/50 p-4 text-sm text-ink-700">
                  <p className="font-semibold text-ink-700 mb-2">What you are signing</p>
                  <p className="leading-relaxed whitespace-pre-line">{templateBody}</p>
                </div>
                <SignaturePad
                  onSubmit={handleSign}
                  signerName={signerName}
                  buttonLabel="Sign & save permit record"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel */}
      <div className="flex justify-end">
        <button onClick={onCancel} className="btn-ghost text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
