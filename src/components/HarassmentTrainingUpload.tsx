'use client';

import { useRef, useState } from 'react';
import { ExternalLink, Upload, CheckCircle2, ImageIcon, X } from 'lucide-react';
import SignaturePad, { SignaturePadResult } from '@/components/SignaturePad';

const TRAINING_URL = 'https://calcivilrights.ca.gov/shpt/';
const MAX_WIDTH = 1200; // px — keeps localStorage size reasonable

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

export type HarassmentTrainingResult = {
  completionProofDataUrl: string;
  signature: SignaturePadResult;
};

export default function HarassmentTrainingUpload({
  signerName,
  templateBody,
  onSubmit,
  onCancel,
}: {
  signerName: string;
  templateBody: string;
  onSubmit: (result: HarassmentTrainingResult) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [proofDataUrl, setProofDataUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    if (!proofDataUrl) return;
    onSubmit({ completionProofDataUrl: proofDataUrl, signature: sig });
  };

  return (
    <div className="space-y-6 p-1">
      {/* Step 1 — Open the training */}
      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-white text-sm font-bold">
            1
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-700">Complete the state training</div>
            <p className="mt-1 text-sm text-ink-500 leading-relaxed">
              California provides a free online course through the Civil Rights Department. It takes
              about 1 hour for crew and 2 hours for supervisors. When you finish you'll see a
              completion screen — that's what you'll upload in Step 2.
            </p>
            <a
              href={TRAINING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-500 transition"
            >
              Open CA Harassment Prevention Training
              <ExternalLink size={14} />
            </a>
            <p className="mt-2 text-xs text-ink-400 break-all">{TRAINING_URL}</p>
          </div>
        </div>
      </div>

      {/* Step 2 — Upload completion screenshot */}
      <div className="rounded-xl border border-ink-100 bg-white p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              proofDataUrl ? 'bg-emerald-400 text-white' : 'bg-cyan-400 text-white'
            }`}
          >
            {proofDataUrl ? <CheckCircle2 size={16} /> : '2'}
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-700">Upload your completion screenshot</div>
            <p className="mt-1 text-sm text-ink-500">
              When the training is done, take a screenshot of the completion page and upload it here.
            </p>

            {proofDataUrl ? (
              <div className="mt-3">
                <div className="relative inline-block">
                  <img
                    src={proofDataUrl}
                    alt="Completion proof"
                    className="max-h-48 rounded-lg border border-ink-100 object-contain shadow-sm"
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
                  ✓ Screenshot attached — proceed to Step 3 below.
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
                      Drag your screenshot here, or click to browse
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
          </div>
        </div>
      </div>

      {/* Step 3 — Sign attestation (locked until screenshot uploaded) */}
      <div
        className={`rounded-xl border bg-white p-5 transition ${
          proofDataUrl ? 'border-ink-100' : 'border-ink-50 opacity-50 pointer-events-none select-none'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              proofDataUrl ? 'bg-cyan-400 text-white' : 'bg-ink-100 text-ink-400'
            }`}
          >
            3
          </div>
          <div className="flex-1">
            <div className="font-bold text-ink-700">Sign your attestation</div>
            {!proofDataUrl && (
              <p className="mt-1 text-sm text-ink-400">
                Upload your completion screenshot in Step 2 to unlock this section.
              </p>
            )}
            {proofDataUrl && (
              <div className="mt-3 space-y-4">
                <div className="rounded-lg bg-cyan-50/50 p-4 text-sm text-ink-700">
                  <p className="font-semibold text-ink-700 mb-2 flex items-center gap-2">
                    What you are signing
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">{templateBody}</p>
                </div>
                <SignaturePad
                  onSubmit={handleSign}
                  signerName={signerName}
                  buttonLabel="Sign & complete"
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
