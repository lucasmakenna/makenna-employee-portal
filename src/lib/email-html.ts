/**
 * Renders our structured EmailBlock[] format to HTML for actual email sending.
 *
 * Email clients are picky — table-based layout, inline styles only, no
 * external CSS, no flex/grid (Outlook will mangle them).
 */

import type { EmailBlock, RenderedEmail } from './email-templates';

const COLORS = {
  cyan: '#4FB8C9',
  cyanDark: '#2A95A8',
  hibiscus: '#C5293A',
  royal: '#1F5FB6',
  ink: '#0F1729',
  inkLight: '#5A6577',
  cyanWash: '#E5F6F8',
  hibiscusWash: '#FBE9EB',
  border: '#E2E8F0',
};

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderBlock(b: EmailBlock): string {
  switch (b.kind) {
    case 'heading':
      return `<h2 style="font-size:22px;font-weight:700;color:${COLORS.ink};margin:24px 0 12px;font-family:sans-serif;">${escape(b.text)}</h2>`;
    case 'paragraph':
      return `<p style="font-size:15px;line-height:1.6;color:${COLORS.ink};margin:0 0 12px;font-family:sans-serif;">${escape(b.text)}</p>`;
    case 'cta':
      return `
        <div style="text-align:center;margin:24px 0;font-family:sans-serif;">
          <a href="${escape(b.href)}" style="display:inline-block;background:${COLORS.cyan};color:#fff;padding:14px 28px;border-radius:999px;font-weight:700;text-decoration:none;font-size:15px;">${escape(b.label)}</a>
          <div style="margin-top:8px;font-size:11px;color:${COLORS.inkLight};word-break:break-all;">${escape(b.href)}</div>
        </div>`;
    case 'list':
      return `<ul style="font-size:15px;line-height:1.7;color:${COLORS.ink};padding-left:20px;margin:8px 0 16px;font-family:sans-serif;">${b.items
        .map((it) => `<li style="margin-bottom:6px;">${escape(it)}</li>`)
        .join('')}</ul>`;
    case 'callout':
      return `
        <div style="background:${COLORS.cyanWash};border:1px solid #CDEDF1;border-radius:12px;padding:16px;margin:16px 0;font-family:sans-serif;">
          <div style="font-size:18px;display:inline;margin-right:6px;">${b.emoji}</div>
          <strong style="font-size:15px;color:${COLORS.ink};">${escape(b.title)}</strong>
          <p style="font-size:14px;line-height:1.6;color:${COLORS.inkLight};margin:6px 0 0;">${escape(b.body)}</p>
        </div>`;
    case 'doc_preview':
      return `
        <table style="width:100%;border-collapse:collapse;margin:8px 0 16px;font-family:sans-serif;border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden;">
          ${b.items
            .map(
              (it, i) => `
            <tr>
              <td style="padding:12px 16px;${i > 0 ? `border-top:1px solid ${COLORS.border};` : ''}">
                <div style="font-size:14px;font-weight:700;color:${COLORS.ink};">${escape(it.title)}</div>
                <div style="font-size:13px;line-height:1.5;color:${COLORS.inkLight};margin-top:2px;">${escape(it.description)}</div>
              </td>
            </tr>`,
            )
            .join('')}
        </table>`;
    case 'signoff':
      return `<p style="font-family:'Pacifico','Brush Script MT',cursive;font-size:24px;color:${COLORS.cyan};margin:24px 0 0;">${escape(b.text)}</p>`;
  }
}

export function renderEmailHtml(
  email: RenderedEmail,
  options: { testBanner?: string } = {},
): string {
  const banner = options.testBanner
    ? `
      <div style="background:${COLORS.hibiscusWash};border-bottom:2px solid ${COLORS.hibiscus};padding:12px 24px;font-family:sans-serif;font-size:13px;color:${COLORS.hibiscus};text-align:center;">
        <strong>[TEST MODE]</strong> ${escape(options.testBanner)}
      </div>`
    : '';

  const tristrip = `
    <div style="height:6px;background:linear-gradient(to right,${COLORS.hibiscus} 0%,${COLORS.hibiscus} 33%,${COLORS.royal} 33%,${COLORS.royal} 66%,#7DD0D9 66%,#7DD0D9 100%);"></div>`;

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(email.subject)}</title></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:sans-serif;">
  ${banner}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#F8FAFC;">
    <tr><td style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,41,0.06);">
        <tr><td style="padding:32px 32px 0 32px;">
          <div style="text-align:center;margin-bottom:8px;">
            <div style="font-family:'Pacifico','Brush Script MT',cursive;font-size:36px;color:${COLORS.cyan};line-height:1;">Makenna</div>
            <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${COLORS.royal};text-transform:uppercase;margin-top:4px;">Koffee Company</div>
          </div>
        </td></tr>
        <tr><td>${tristrip}</td></tr>
        <tr><td style="padding:24px 32px 32px 32px;">
          ${email.blocks.map(renderBlock).join('\n')}
        </td></tr>
        <tr><td style="padding:16px 32px 24px 32px;border-top:1px solid ${COLORS.border};font-family:sans-serif;font-size:11px;color:${COLORS.inkLight};text-align:center;">
          Makenna Koffee Company · 9 locations across California ·
          <a href="https://makennakoffee.com" style="color:${COLORS.cyan};text-decoration:none;">makennakoffee.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
