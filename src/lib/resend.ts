import { Resend, type CreateEmailOptions, type CreateEmailRequestOptions } from 'resend';

let resendClient: Resend | null = null;
let resendClientKey: string | null = null;

function getResendClient() {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  if (!resendClient || resendClientKey !== resendApiKey) {
    resendClient = new Resend(resendApiKey);
    resendClientKey = resendApiKey;
  }

  return resendClient;
}

export const resend = {
  emails: {
    send(payload: CreateEmailOptions, options?: CreateEmailRequestOptions) {
      return getResendClient().emails.send(payload, options);
    },
  },
};
