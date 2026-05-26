'use client';

import { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenLine, Type } from 'lucide-react';

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
  const [mode, setMode] = useState<'type' | 'draw'>('type');
  const [name, setName] = useState(signerName);

  // Sync if the parent resolves the employee name asynchronously after mount
  // (useState only captures the initial value — this keeps the field correct)
  useEffect(() => {
    setName(signerName);
  }, [signerName]);

  // Draw mode state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);

  // Type mode preview canvas
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  const canSubmit = mode === 'type' ? name.trim().length > 0 : (hasInk && name.trim().length > 0);

  // Re-render type preview whenever name or mode changes
  useEffect(() => {
    if (mode !== 'type') return;
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!name.trim()) return;
    const fontSize = Math.min(72, Math.floor(canvas.width / (name.length * 0.55 + 2)));
    ctx.font = `italic ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = '#1A0F09';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(name.trim(), canvas.width / 2, canvas.height / 2);
    // Underline
    const metrics = ctx.measureText(name.trim());
    const lineY = canvas.height / 2 + fontSize * 0.55;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - metrics.width / 2, lineY);
    ctx.lineTo(canvas.width / 2 + metrics.width / 2, lineY);
    ctx.strokeStyle = '#1A0F09';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [name, mode]);

  // Draw mode helpers
  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1A0F09';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasInk) setHasInk(true);
  };

  const end = () => setDrawing(false);

  const clearDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const switchMode = (next: 'type' | 'draw') => {
    setMode(next);
    setHasInk(false);
    clearDraw();
  };

  const submit = () => {
    if (!canSubmit) return;

    if (mode === 'type') {
      const canvas = previewRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSubmit({ signaturePngDataUrl: dataUrl, signerLegalName: name.trim() });
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      onSubmit({ signaturePngDataUrl: dataUrl, signerLegalName: name.trim() });
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-ink-300 bg-cyan-50/30 p-4 space-y-3">
      <p className="text-xs text-ink-500">
        By signing below I acknowledge I have read and agree to the contents of this document.
        My signature, name, timestamp, IP address, and a document hash form the legal audit trail.
      </p>

      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => switchMode('type')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            mode === 'type' ? 'bg-cyan-400 text-white' : 'border border-ink-200 text-ink-500 hover:bg-ink-50'
          }`}
        >
          <Type size={13} /> Type to sign
        </button>
        <button
          onClick={() => switchMode('draw')}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            mode === 'draw' ? 'bg-cyan-400 text-white' : 'border border-ink-200 text-ink-500 hover:bg-ink-50'
          }`}
        >
          <PenLine size={13} /> Draw to sign
        </button>
      </div>

      {/* Name input */}
      <div>
        <label className="block text-xs font-semibold text-ink-600 mb-1">
          Full legal name <span className="text-hibiscus-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your full legal name"
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-800 placeholder-ink-300 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* Type mode — signature preview */}
      {mode === 'type' && (
        <div>
          <p className="text-xs text-ink-400 mb-1">Signature preview</p>
          <div className="rounded-lg border border-ink-200 bg-white overflow-hidden">
            <canvas
              ref={previewRef}
              width={780}
              height={140}
              className="h-[140px] w-full"
            />
          </div>
          {!name.trim() && (
            <p className="text-xs text-ink-400 mt-1">Type your name above to see your signature</p>
          )}
        </div>
      )}

      {/* Draw mode — drawing canvas */}
      {mode === 'draw' && (
        <div>
          <p className="text-xs text-ink-400 mb-1">Draw your signature in the box below</p>
          <div className="rounded-lg border border-ink-200 bg-white">
            <canvas
              ref={canvasRef}
              width={780}
              height={180}
              className="h-[180px] w-full touch-none rounded-lg cursor-crosshair"
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            {!hasInk && <p className="text-xs text-ink-400">Click or touch and drag to sign</p>}
            {hasInk && (
              <button onClick={clearDraw} className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-700">
                <Eraser size={12} /> Clear and redo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-1">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={16} /> {buttonLabel}
        </button>
      </div>
    </div>
  );
}
