/**
 * One-off: npx tsx scripts/test-brevo.ts
 * Sends the branded welcome template.
 */
import path from 'path';
import dotenv from 'dotenv';

const apiDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.resolve(apiDir, '../../.env') });
dotenv.config({ path: path.join(apiDir, '.env'), override: true });

async function main() {
  const { sendTransactionalEmail, getEmailDeliveryMode } = await import(
    '../src/services/emailService'
  );
  const { buildWelcomeTestEmailHtml } = await import('../src/services/emailTemplates');

  const to = process.argv[2] || process.env.BREVO_SENDER_EMAIL?.trim();
  if (!to) throw new Error('No recipient');

  console.log('deliveryMode:', getEmailDeliveryMode());
  const { subject, html } = buildWelcomeTestEmailHtml();
  await sendTransactionalEmail({ to, subject, html });
  console.log('send: OK →', to);
  console.log('subject:', subject);
}

main().catch((e) => {
  console.error('FAILED:', e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
