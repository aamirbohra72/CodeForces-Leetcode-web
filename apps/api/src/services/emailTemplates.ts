/**
 * Branded HTML email templates for Codeforces Platform.
 * Inline styles + table layout for broad client support.
 */

const BRAND = {
  name: 'Codeforces Platform',
  tagline: 'Learn · Practice · Compete · Get Hired',
  primary: '#22c55e',
  primaryDark: '#16a34a',
  bg: '#0f0f0f',
  card: '#1a1a1a',
  border: '#2e2e2e',
  text: '#f4f4f5',
  muted: '#a1a1aa',
  white: '#ffffff',
};

function appBaseUrl(): string {
  return (
    process.env.PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.WEB_URL?.trim() ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function wrapPlatformEmail(options: {
  preheader?: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
}): string {
  const base = appBaseUrl();
  const preheader = options.preheader || options.title;
  const year = new Date().getFullYear();
  const cta = options.cta
    ? `
      <tr>
        <td align="center" style="padding: 8px 0 28px;">
          <a href="${escapeHtml(options.cta.href)}"
             style="display:inline-block;background:${BRAND.primary};color:${BRAND.bg};text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;padding:14px 28px;border-radius:10px;">
            ${escapeHtml(options.cta.label)}
          </a>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#14532d 0%,#1a1a1a 55%,#1a1a1a 100%);padding:28px 28px 20px;border-bottom:1px solid ${BRAND.border};">
              <p style="margin:0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.primary};">
                ${escapeHtml(BRAND.name)}
              </p>
              <h1 style="margin:10px 0 0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.white};">
                ${escapeHtml(options.title)}
              </h1>
              <p style="margin:8px 0 0;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:${BRAND.muted};">
                ${escapeHtml(BRAND.tagline)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${BRAND.text};">
              ${options.bodyHtml}
            </td>
          </tr>
          ${cta}
          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.border};">
                <tr>
                  <td style="padding-top:18px;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${BRAND.muted};">
                    Courses · Practice · Contests · Interview prep · TA Help<br />
                    <a href="${escapeHtml(base)}/learn" style="color:${BRAND.primary};text-decoration:none;">Learn</a>
                    &nbsp;·&nbsp;
                    <a href="${escapeHtml(base)}/practice" style="color:${BRAND.primary};text-decoration:none;">Practice</a>
                    &nbsp;·&nbsp;
                    <a href="${escapeHtml(base)}/ta-help" style="color:${BRAND.primary};text-decoration:none;">TA Help</a>
                    <br /><br />
                    © ${year} ${escapeHtml(BRAND.name)}. You’re receiving this because you use our platform.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildOtpEmailHtml(otp: string): { subject: string; html: string } {
  const code = escapeHtml(otp);
  const html = wrapPlatformEmail({
    preheader: `Your sign-in code is ${otp}. It expires in 10 minutes.`,
    title: 'Your sign-in code',
    bodyHtml: `
      <p style="margin:0 0 16px;">Use this one-time code to continue on <strong style="color:${BRAND.white};">${escapeHtml(BRAND.name)}</strong>.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
        <tr>
          <td align="center" style="background:#121212;border:1px dashed ${BRAND.primaryDark};border-radius:12px;padding:22px 16px;">
            <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};">One-time password</p>
            <p style="margin:0;font-size:36px;letter-spacing:0.28em;font-weight:800;color:${BRAND.primary};font-family:Consolas,Monaco,monospace;">${code}</p>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 10px;color:${BRAND.muted};font-size:14px;">This code expires in <strong style="color:${BRAND.text};">10 minutes</strong>.</p>
      <p style="margin:0;color:${BRAND.muted};font-size:14px;">If you didn’t request this, you can safely ignore this email.</p>
    `,
    cta: { label: 'Open platform', href: `${appBaseUrl()}/sign-in` },
  });

  return {
    subject: `${otp} is your ${BRAND.name} sign-in code`,
    html,
  };
}

export function buildWelcomeTestEmailHtml(): { subject: string; html: string } {
  const base = appBaseUrl();
  const html = wrapPlatformEmail({
    preheader: 'Email delivery is live on Codeforces Platform.',
    title: 'You’re connected',
    bodyHtml: `
      <p style="margin:0 0 14px;">Hi there — this is a confirmation that transactional email is working for <strong style="color:${BRAND.white};">${escapeHtml(BRAND.name)}</strong>.</p>
      <p style="margin:0 0 14px;">From here you can get updates about:</p>
      <ul style="margin:0 0 18px;padding-left:18px;color:${BRAND.muted};">
        <li style="margin-bottom:8px;"><span style="color:${BRAND.text};">Course enrollments</span> &amp; payment receipts</li>
        <li style="margin-bottom:8px;"><span style="color:${BRAND.text};">Learning streaks</span> &amp; continue-where-you-left-off</li>
        <li style="margin-bottom:8px;"><span style="color:${BRAND.text};">TA Help</span> replies when a teaching assistant claims your request</li>
        <li style="margin-bottom:8px;"><span style="color:${BRAND.text};">Contests</span> &amp; interview practice reminders</li>
      </ul>
      <p style="margin:0;color:${BRAND.muted};font-size:14px;">Keep building. We’ll meet you in the next lesson.</p>
    `,
    cta: { label: 'Go to dashboard', href: `${base}/learn` },
  });

  return {
    subject: `Welcome to ${BRAND.name} — email is ready`,
    html,
  };
}

export function buildSimpleNoticeEmailHtml(input: {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  subject?: string;
}): { subject: string; html: string } {
  const html = wrapPlatformEmail({
    preheader: input.message.slice(0, 120),
    title: input.title,
    bodyHtml: `<p style="margin:0;white-space:pre-wrap;">${escapeHtml(input.message)}</p>`,
    cta:
      input.ctaLabel && input.ctaHref
        ? { label: input.ctaLabel, href: input.ctaHref }
        : undefined,
  });

  return {
    subject: input.subject || `${input.title} · ${BRAND.name}`,
    html,
  };
}

export const PLATFORM_BRAND_NAME = BRAND.name;
