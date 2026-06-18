import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

// Default sender and recipient (should be configured in .env)
const DEFAULT_FROM = process.env.SYSTEM_EMAIL_FROM || 'notifications@avaat.in';
const DEFAULT_TO = process.env.ADMIN_EMAIL_TO || 'admin@avaat.in';

export async function sendAdminNotification(subject: string, template: React.ReactElement) {
  // If no API key is provided in dev, we just log and skip to prevent crashes
  if (!process.env.RESEND_API_KEY) {
    console.log('[RESEND MOCK] Would send email:');
    console.log(`- Subject: ${subject}`);
    console.log(`- To: ${DEFAULT_TO}`);
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `AVAAT System <${DEFAULT_FROM}>`,
      to: [DEFAULT_TO],
      subject: subject,
      react: template,
    });

    if (error) {
      console.error('Failed to send email via Resend:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Exception during email send:', error);
    return { success: false, error: error?.message || 'Unknown error sending email' };
  }
}
