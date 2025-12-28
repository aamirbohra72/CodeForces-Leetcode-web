import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  // In development, just log the OTP
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
    console.log(`\n📧 OTP for ${email}: ${otp}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
  } catch (error) {
    console.error('Failed to send email:', error);
    // In development, fallback to console log
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📧 OTP for ${email}: ${otp}\n`);
    } else {
      throw new Error('Failed to send OTP email');
    }
  }
}

