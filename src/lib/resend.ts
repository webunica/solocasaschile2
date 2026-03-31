import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn('RESEND_API_KEY is not defined in production environment');
}

export const resend = new Resend(resendApiKey || 're_placeholder_key_for_development');
