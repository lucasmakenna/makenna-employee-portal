'use client';

import { useRef, useState } from 'react';
import { Upload, ImageIcon, Trash2, X } from 'lucide-react';
import { compressImage } from '@/lib/image';
import { format, parseISO } from 'date-fns';
import type { EmployeeAttachment, OnboardingDocId } from '@/types';
import { ONBOARDING_DOCS } from '@/data/onboarding';

const CATEGORY_OPTIONS: { id: OnboardingDocId | 'other'; label: string }[] = [
  { id: 'other', label: 'Other / general file' },
  ...ONBOARDING_DOCS.map((d) => ({ id: d.id, label: d.title })),
  { id: 'work_permit', label: 'California Work Permit' },
];

function categoryLabel(category?: OnboardingDocId | 'other') {
  return CATEGORY_OPTIONS.find((c) => c.id === category)?.label ?? 'Other / general file';
}

export default function EmployeeAttachments({
  attachments,
  onChange,
  uploaderId,
}: {
  attachments: EmployeeAttachment[];
  onChange: (next: EmployeeAttachment[]) => void;
  uploaderId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<EmployeeAttachment | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const additions: EmployeeAttachment[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only images (PNG, JPG, etc.) can be uploaded here.');
          continue;
        }
        const dataUrl = await compressImage(file);
        additions.push({
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          dataUrl,
          uploadedAt: new Date().toISOString(),
          uploadedBy: uploaderId,
          category: 'other',
        });
      }
      if (additions.length > 0) onChange([...attachments, ...additions]);
    } catch {
      setError('Could not read one of those files — try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  const handleCategoryChange = (id: string, category: OnboardingDocId | 'other') => {
    onChange(attachments.map((a) => (a.id === id ? { ...a, category } : a)));
  };

  return (
    <div>
      <div
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50/40 px-6 py-6 text-center hover:border-cyan-400 hover:bg-cyan-50 transition"
      >
        {uploading ? (
          <p className="text-sm text-ink-400">Processing…</p>
        ) : (
          <>
            <ImageIcon size={24} className="text-cyan-300" />
            <div className="text-sm font-semibold text-ink-700">
              Drag photos/screenshots here, or click to browse
            </div>
            <div className="text-xs text-ink-400">PNG, JPG, or WEBP — multiple files OK</div>
            <button className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-cyan-300 bg-white px-4 py-1.5 text-xs font-semibold text-cyan-600 hover:bg-cyan-50">
              <Upload size={12} /> Choose files
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-hibiscus-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
      />

      {attachments.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {attachments
            .slice()
            .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
            .map((a) => (
              <div key={a.id} className="group relative overflow-hidden rounded-lg border border-ink-100 bg-white">
                <img
                  src={a.dataUrl}
                  alt={a.name}
                  onClick={() => setPreview(a)}
                  className="h-28 w-full cursor-pointer object-cover"
                />
                <button
                  onClick={() => handleRemove(a.id)}
                  title="Remove"
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 shadow transition group-hover:opacity-100 hover:bg-red-50"
                >
                  <Trash2 size={12} className="text-hibiscus-500" />
                </button>
                <div className="px-2 py-1.5">
                  <div className="truncate text-xs font-medium text-ink-700">{a.name}</div>
                  <div className="text-[10px] text-ink-400">
                    {format(parseISO(a.uploadedAt), 'MMM d, yyyy')}
                  </div>
                  <select
                    value={a.category ?? 'other'}
                    onChange={(e) => handleCategoryChange(a.id, e.target.value as OnboardingDocId | 'other')}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 w-full rounded border border-ink-100 bg-ink-50 px-1 py-0.5 text-[10px] text-ink-600"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>
      )}

      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 hover:bg-white"
          >
            <X size={18} />
          </button>
          <div className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={preview.dataUrl}
              alt={preview.name}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <div className="mt-2 text-sm text-white">{preview.name} — {categoryLabel(preview.category)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
