/**
 * Email templates for the new-hire flow.
 *
 * In production, your backend imports these and passes the rendered HTML
 * + plaintext to your email provider (Resend, Postmark, SendGrid, SES).
 * Variables come from the Employee + OnboardingPacket records.
 *
 * For the demo, the EmailPreviewModal renders these to screen so you can
 * see exactly what the recipient would get without sending anything.
 */

import type { Employee } from '@/types';
import { getLocation } from '@/data/locations';
import { ONBOARDING_DOCS } from '@/data/onboarding';
import { format, parseISO } from 'date-fns';

export type RenderedEmail = {
  to: string;
  subject: string;
  /** Plaintext fallback. */
  text: string;
  /** Marked-up version with structure for the in-app preview. */
  blocks: EmailBlock[];
};

export type EmailBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'cta'; label: string; href: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'callout'; emoji: string; title: string; body: string }
  | { kind: 'doc_preview'; items: { title: string; description: string }[] }
  | { kind: 'signoff'; text: string };

// ---------------------------------------------------------------------------
// Welcome email — sent to the new hire on hire
// ---------------------------------------------------------------------------

export function welcomeEmailFor(
  employee: Employee,
  startDate: string,
  managerName: string,
  appBaseUrl = 'https://team.makennakoffee.com',
): RenderedEmail {
  const location = getLocation(employee.homeLocationId);
  const activationUrl = `${appBaseUrl}/activate/${employee.id}`;
  const startDateLong = format(parseISO(startDate), 'EEEE, MMMM d');

  const blocks: EmailBlock[] = [
    {
      kind: 'heading',
      text: `Welcome to Makenna Koffee, ${employee.firstName}!`,
    },
    {
      kind: 'paragraph',
      text: `We're stoked to have you joining the ${location?.name} team. Your start date is ${startDateLong}.`,
    },
    {
      kind: 'paragraph',
      text: `Before your first shift, set up your account, take a quick tour of the team app, and review the documents you'll be signing. It takes about 15 minutes.`,
    },
    {
      kind: 'cta',
      label: 'Set up your account',
      href: activationUrl,
    },
    {
      kind: 'callout',
      emoji: '📱',
      title: 'Download the team app',
      body: 'Once your account is set up, install the Makenna Team app to clock in, see your schedule, and message the crew. Links live on your activation page.',
    },
    {
      kind: 'heading',
      text: 'What to bring on your first day',
    },
    {
      kind: 'list',
      items: [
        'Government-issued photo ID (driver\'s license, state ID, or passport)',
        'Either a Social Security card OR a U.S. passport (federal I-9 requirement — your manager will physically inspect)',
        'A voided check or bank routing/account info for direct deposit',
        'Your emergency contact\'s name and phone number',
      ],
    },
    {
      kind: 'callout',
      emoji: '👕',
      title: 'Dress code for Day 1',
      body: 'Wear comfortable and appropriate attire/footwear to perform any duty that a bartender might have to do during a coffee shop shift. Plan to arrive 10 minutes before your shift starts so we have time for a proper orientation.',
    },
    {
      kind: 'heading',
      text: "What you'll be signing",
    },
    {
      kind: 'paragraph',
      text: "Here’s the full list of documents in your packet — you can read them ahead of time on the activation page so you’re ready with questions:",
    },
    {
      kind: 'doc_preview',
      items: ONBOARDING_DOCS.map((d) => ({ title: d.title, description: d.description })),
    },
    {
      kind: 'paragraph',
      text: `Questions? Email haley@makennakoffee.com or ask your trainer/manager on your first day. We’re excited to have you on the team.`,
    },
    {
      kind: 'signoff',
      text: 'The Makenna Mafia',
    },
  ];

  // Plaintext fallback
  const text = [
    `Welcome to Makenna Koffee, ${employee.firstName}!`,
    ``,
    `Your start date is ${startDateLong} at ${location?.name}.`,
    ``,
    `Set up your account: ${activationUrl}`,
    ``,
    `Bring on Day 1:`,
    `  - Photo ID`,
    `  - SSN card or U.S. passport (for I-9)`,
    `  - Voided check or bank info`,
    `  - Emergency contact name & phone`,
    ``,
    `Dress code: comfortable attire and footwear suitable for any barista duty. Arrive 10 minutes early.`,
    ``,
    `Documents you’ll be signing:`,
    ...ONBOARDING_DOCS.map((d) => `  - ${d.title}`),
    ``,
    `Questions? Email haley@makennakoffee.com or ask your trainer/manager on your first day. We're excited to have you on the team.`,
    ``,
    `The Makenna Mafia`,
  ].join('\n');

  return {
    to: employee.email,
    subject: `Welcome to Makenna Koffee, ${employee.firstName}! Your Day One paperwork is ready`,
    text,
    blocks,
  };
}

// ---------------------------------------------------------------------------
// Manager notification — sent when a new hire is added at their store
// ---------------------------------------------------------------------------

export function managerNotificationFor(
  employee: Employee,
  startDate: string,
  managerEmail: string,
): RenderedEmail {
  const location = getLocation(employee.homeLocationId);
  const startDateLong = format(parseISO(startDate), 'MMM d, yyyy');

  return {
    to: managerEmail,
    subject: `New hire heads-up: ${employee.firstName} ${employee.lastName} starts ${startDateLong}`,
    text: [
      `${employee.firstName} ${employee.lastName} is hired and starting ${startDateLong} at ${location?.name}.`,
      ``,
      `Their welcome email is on the way. Onboarding progress will show in the portal under Onboarding.`,
      ``,
      `Reminder: I-9 Section 2 is on you. Physically inspect their identity documents within 3 business days of their start date.`,
    ].join('\n'),
    blocks: [
      { kind: 'heading', text: 'New hire heads-up' },
      {
        kind: 'paragraph',
        text: `${employee.firstName} ${employee.lastName} is hired and starting ${startDateLong} at ${location?.name}.`,
      },
      {
        kind: 'paragraph',
        text: 'Their welcome email is on the way. Onboarding progress will show in the portal under Onboarding.',
      },
      {
        kind: 'callout',
        emoji: '⚠️',
        title: 'I-9 Section 2 reminder',
        body: 'Federal law requires you to physically inspect their ID documents within 3 business days of their start date. Section 2 sign-off happens in the portal.',
      },
      { kind: 'signoff', text: 'Makenna Koffee Team Portal' },
    ],
  };
}
