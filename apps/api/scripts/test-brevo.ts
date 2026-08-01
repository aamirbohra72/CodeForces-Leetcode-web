/**
 * One-off: npx tsx scripts/test-brevo.ts
 */
import path from 'path';
import dotenv from 'dotenv';

const apiDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(apiDir, '../../.env') });
dotenv.config({ path: path.join(apiDir, '.env'), override: true });

async function main() {
  const key = process.env.BREVO_API_KEY?.trim() || '';
  const sender = process.env.BREVO_SENDER_EMAIL?.trim() || '';
  const name = process.env.BREVO_SENDER_NAME?.trim() || 'Codeforces Platform';
  const to = process.argv[2] || sender;

  console.log('keyType:', key.startsWith('xsmtpsib-') ? 'smtp' : key.startsWith('xkeysib-') ? 'api' : 'unknown');
  console.log('keyMeta:', {
    len: key.length,
    prefix: key.slice(0, 10),
    suffix: key.slice(-4),
    hasWhitespace: /\s/.test(key),
  });
  console.log('sender:', sender, 'to:', to);

  if (!key || !sender || !to) {
    throw new Error('Missing BREVO_API_KEY / BREVO_SENDER_EMAIL');
  }

  if (key.startsWith('xsmtpsib-')) {
    const { getEmailDeliveryMode, sendTransactionalEmail, verifySmtpIfConfigured } =
      await import('../src/services/emailService');
    console.log('deliveryMode:', getEmailDeliveryMode());
    await verifySmtpIfConfigured();
    await sendTransactionalEmail({
      to,
      subject: 'Brevo test — Codeforces Platform',
      html: '<p>This is a test email from your local API Brevo integration.</p>',
    });
    console.log('send: OK →', to);
    return;
  }

  const acct = await fetch('https://api.brevo.com/v3/account', {
    headers: { accept: 'application/json', 'api-key': key },
  });
  const acctBody = await acct.text();
  console.log('account:', acct.status, acctBody.slice(0, 500));

  const send = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': key,
    },
    body: JSON.stringify({
      sender: { name, email: sender },
      to: [{ email: to }],
      subject: 'Brevo test — Codeforces Platform',
      htmlContent:
        '<p>This is a test email from your local API Brevo integration.</p><p>If you received this, email is working.</p>',
    }),
  });
  const sendBody = await send.text();
  console.log('send:', send.status, sendBody.slice(0, 500));

  if (!acct.ok || !send.ok) process.exitCode = 1;
  else console.log('send: OK →', to);
}

main().catch((e) => {
  console.error('FAILED:', e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
