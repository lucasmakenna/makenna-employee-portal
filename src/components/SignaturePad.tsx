'use client';

import { useRef, useState } from 'react';
import { Eraser, Check } from 'lucide-react';

/**
 * Signature pad. Captures hand-drawn signature + typed legal name.
 * Parent components handle audit trail stamping (see signature-audit.ts).
 */
export type SignaturePadResult = {
  signaturePngDataUrl: string;
  signerLegalName: string;
};

export default function SignaturePad({
  onSubmit,
  signerName,
  buttonLabel = 'Sign & save',
}: {
  onSubmit: (result: SignaturePadResult) => void;
  signerName: string;
  buttonLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [name, setName] = useState(signerName);

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1A0F09';
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    if (!hasInk) setHasInk(true);
  };

  const end = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const submit = () => {
    if (!hasInk || !name.trim()) return;
    const data = canvasRef.current?.toDataURL('image/png');
    if (!data) return;
    onSubmit({ signaturePngDataUrl: data, signerLegalName: name.trim() });
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-ink-300 bg-cyan-50/30 p-4">
      <p className="mb-3 text-xs text-ink-600">
        By signing below I acknowledge I have read and agree to the contents of this document.
        My signature is captured along with a server-stamped timestamp, my IP address, my device
        information, and a hash of the document text — these together form the audit trail for
        this signature.
      </p>
      <div className="rounded-lg border border-ink-200 bg-white">
        <canvas
          ref={canvasRef}
          width={780}
          height={220}
          className="h-[220px] w-full touch-none rounded-lg"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="label">Type full legal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="input"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={clear} className="btn-ghost">
            <Eraser size={16} /> Clear
          </button>
          <button
            onClick={submit}
            disabled={!hasInk || !name.trim()}
            className="btn-primary disabled:opacity-40"
          >
            <Check size={16} /> {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
