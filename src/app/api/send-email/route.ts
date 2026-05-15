/**
 * POST /api/send-email
 *
 * Sends a transactional email via Resend.
 *
 * In TEST MODE (when TEST_RECIPIENT_EMAIL is set), the email is redirected
 * to that address with a [TEST MODE] banner noting the original recipient.
 * Once you verify your domain in Resend and remove TEST_RECIPIENT_EMAIL,
 * emails go to the real recipient.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { RenderedEmail } from '@/lib/email-templates';
import { renderEmailHtml } from '@/lib/email-html';

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM ?? 'Makenna Koffee <onboarding@resend.dev>';
  const testRecipient = process.env.TEST_RECIPIENT_EMAIL?.trim();

  if (!apiKey || apiKey === 're_your_api_key_here') {
    return NextResponse.json(
      {
        ok: false,
        error: 'RESEND_API_KEY not set. Add it to .env.local and restart the dev server.',
        configured: false,
      },
      { status: 500 },
    );
  }

  let body: { email: RenderedEmail };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const { email } = body;
  if (!email || !email.to || !email.subject || !email.blocks) {
    return NextResponse.json(
      { ok: false, error: 'email.to, email.subject, email.blocks required' },
      { status: 400 },
    );
  }

  const realRecipient = email.to;
  const inTestMode = !!testRecipient;
  const actualTo = inTestMode ? testRecipient! : realRecipient;
  const finalSubject = inTestMode
    ? `[TEST] ${email.subject} (intended for ${realRecipient})`
    : email.subject;

  const html = renderEmailHtml(email, {
    testBanner: inTestMode
      ? `This email was originally addressed to ${realRecipient}. You are seeing it because Resend is in test mode.`
      : undefined,
  });

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [actualTo],
      subject: finalSubject,
      html,
      text: email.text,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Resend rejected the send', details: error },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: data?.id,
      sentTo: actualTo,
      originalRecipient: realRecipient,
      testMode: inTestMode,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Unknown send error' },
      { status: 500 },
    );
  }
}
