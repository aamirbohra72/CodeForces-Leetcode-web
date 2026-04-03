import nodemailer, { type Transporter } from 'nodemailer';

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? '587');
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  return {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port,
    secure,
    user,
    pass,
    from: process.env.SMTP_FROM ?? user,
  };
}

let transporter: Transporter | null = null;

function getTransporter(config: SmtpConfig): Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    ...(config.port === 587 && !config.secure ? { requireTLS: true } : {}),
  });

  return transporter;
}

export function getEmailDeliveryMode(): 'smtp' | 'console' {
  return getSmtpConfig() ? 'smtp' : 'console';
}

/** Optional: verifies SMTP credentials on startup (logs only, does not throw). */
export async function verifySmtpIfConfigured(): Promise<void> {
  const config = getSmtpConfig();
  if (!config) return;
  const mailer = getTransporter(config);
  await mailer.verify();
}

/**
 * Production guardrail: fail fast when SMTP is not configured correctly.
 */
export function assertEmailConfigForRuntime(): void {
  if (process.env.NODE_ENV !== 'production') return;

  const config = getSmtpConfig();
  if (!config) {
    throw new Error(
      'SMTP is required in production. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.',
    );
  }
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const config = getSmtpConfig();

  // Local/dev fallback to unblock testing without SMTP setup.
  if (!config) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'SMTP is not configured. OTP email cannot be delivered in production.',
      );
    }
    console.log(`\n📧 [DEV OTP] ${email}: ${otp}\n`);
    return;
  }

  try {
    const mailer = getTransporter(config);
    const result = await mailer.sendMail({
      from: config.from,
      to: email,
      subject: 'Your Login OTP - Codeforces Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Login OTP</h2>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #0070f3;">${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`[MAIL] OTP sent to ${email}; messageId=${result.messageId}`);
  } catch (error) {
    console.error('[MAIL] Failed to send OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}

