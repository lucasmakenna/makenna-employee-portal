'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Full-screen scrollable sheet for long forms (W-4, I-9).
 * Prevents the form being clipped by parent overflow-hidden containers,
 * and gives the iPad keyboard room to breathe.
 */
export default function FormSheet({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Lock body scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Sticky header */}
      <div className="flex shrink-0 items-center justify-between border-b border-ink-100 bg-white px-5 py-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-ink-800">{title}</h2>
          {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink-100 transition"
        >
          <X size={20} className="text-ink-500" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
}
