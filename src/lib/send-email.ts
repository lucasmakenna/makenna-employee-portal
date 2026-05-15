'use client';

import type { RenderedEmail } from './email-templates';

export type SendResult =
  | { ok: true; sentTo: string; originalRecipient: string; testMode: boolean }
  | { ok: false; error: string; configured?: boolean };

export async function sendEmail(email: RenderedEmail): Promise<SendResult> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Network error' };
  }
}
