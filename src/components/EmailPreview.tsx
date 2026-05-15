'use client';

import { useState } from 'react';
import { Mail, X, ExternalLink, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { RenderedEmail, EmailBlock } from '@/lib/email-templates';
import { sendEmail, SendResult } from '@/lib/send-email';

/**
 * In-app preview of a transactional email. In sandbox mode this is what
 * actually shows the user; in production the same RenderedEmail is rendered
 * to HTML server-side and posted to your email provider.
 */
export default function EmailPreview({
  email,
  onClose,
  onSend,
  recipientLabel,
  goToActivationUrl,
}: {
  email: RenderedEmail;
  onClose: () => void;
  onSend?: () => void;
  recipientLabel: string;
  /** Local URL the "Set up your account" CTA should point to in the demo. */
  goToActivationUrl?: string;
}) {
  const router = useRouter();
  const [sendStatus, setSendStatus] = useState<
    'idle' | 'sending' | SendResult
  >('idle');

  const handleSend = async () => {
    setSendStatus('sending');
    const result = await sendEmail(email);
    setSendStatus(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-100 bg-white px-5 py-3">
          <div className="flex items-center gap-2 text-ink-700">
            <Mail size={18} />
            <h2 className="font-bold">Email preview — {recipientLabel}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-cyan-50">
            <X size={18} className="text-ink-400" />
          </button>
        </div>

        {/* Email envelope */}
        <div className="border-b border-ink-100 bg-cyan-50/40 px-5 py-3 text-sm">
          <div className="flex gap-2">
            <span className="w-12 text-xs font-bold uppercase tracking-wider text-ink-400">To</span>
            <span className="text-ink-700">{email.to}</span>
          </div>
          <div className="flex gap-2 mt-1">
            <span className="w-12 text-xs font-bold uppercase tracking-wider text-ink-400">Subj</span>
            <span className="font-semibold text-ink-700">{email.subject}</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Letterhead */}
          <div className="mb-5 flex items-center gap-3">
            <img src="/logo.png" alt="Makenna Koffee" className="h-10 w-auto" />
          </div>
          <div className="tri-stripe rounded-full mb-5" />

          <div className="space-y-4 text-ink-700">
            {email.blocks.map((b, i) => (
              <BlockView
                key={i}
                block={b}
                onCtaClick={(href) => {
                  if (goToActivationUrl) {
                    onClose();
                    router.push(goToActivationUrl);
                  }
                }}
              />
            ))}
          </div>

          <p className="mt-8 border-t border-ink-100 pt-3 text-xs text-ink-400">
            Makenna Koffee Company · 9 locations across California ·{' '}
            <a href="https://makennakoffee.com" className="underline">
              makennakoffee.com
            </a>
          </p>
        </div>

        {/* Status banner */}
        {sendStatus !== 'idle' && sendStatus !== 'sending' && (
          <div
            className={`px-5 py-3 text-sm border-t ${
              sendStatus.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-hibiscus-200 bg-hibiscus-50/50 text-hibiscus-700'
            }`}
          >
            {sendStatus.ok ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Email sent ✓</div>
                  <div className="mt-0.5 text-xs">
                    Delivered to <strong>{sendStatus.sentTo}</strong>
                    {sendStatus.testMode && (
                      <> (test mode — original recipient was {sendStatus.originalRecipient})</>
                    )}
                    . Check your inbox in a few seconds.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Couldn't send email</div>
                  <div className="mt-0.5 text-xs">{sendStatus.error}</div>
                  {sendStatus.configured === false && (
                    <div className="mt-1 text-xs">
                      Setup steps are in <code>web/.env.local.example</code>.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-ink-100 bg-white px-5 py-3">
          <span className="text-xs text-ink-400">
            Press <strong>Send for real</strong> to deliver via Resend.
          </span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-ghost">
              Close
            </button>
            <button
              onClick={handleSend}
              disabled={sendStatus === 'sending' || (typeof sendStatus === 'object' && sendStatus.ok)}
              className="btn-cyan disabled:opacity-50"
            >
              <Send size={14} />
              {sendStatus === 'sending'
                ? 'Sending…'
                : typeof sendStatus === 'object' && sendStatus.ok
                ? 'Sent'
                : 'Send for real'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({
  block,
  onCtaClick,
}: {
  block: EmailBlock;
  onCtaClick: (href: string) => void;
}) {
  if (block.kind === 'heading') {
    return <h3 className="text-xl font-bold text-ink-700">{block.text}</h3>;
  }
  if (block.kind === 'paragraph') {
    return <p className="text-sm leading-relaxed text-ink-700">{block.text}</p>;
  }
  if (block.kind === 'cta') {
    return (
      <div className="text-center">
        <button
          onClick={() => onCtaClick(block.href)}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-500"
        >
          {block.label}
          <ExternalLink size={14} />
        </button>
        <div className="mt-2 text-[10px] text-ink-400 break-all">{block.href}</div>
      </div>
    );
  }
  if (block.kind === 'list') {
    return (
      <ul className="space-y-1.5">
        {block.items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hibiscus-400" />
            {it}
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'callout') {
    return (
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{block.emoji}</span>
          <div>
            <div className="font-bold text-ink-700">{block.title}</div>
            <p className="mt-1 text-sm text-ink-600 leading-relaxed">{block.body}</p>
          </div>
        </div>
      </div>
    );
  }
  if (block.kind === 'doc_preview') {
    return (
      <div className="rounded-xl border border-ink-100 bg-white">
        {block.items.map((it, i) => (
          <div
            key={i}
            className={`p-3 text-sm ${i > 0 ? 'border-t border-ink-100' : ''}`}
          >
            <div className="font-semibold text-ink-700">{it.title}</div>
            <div className="mt-0.5 text-xs text-ink-500 leading-relaxed">{it.description}</div>
          </div>
        ))}
      </div>
    );
  }
  if (block.kind === 'signoff') {
    return <p className="font-script text-2xl text-cyan-500">{block.text}</p>;
  }
  return null;
}
