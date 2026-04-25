import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV;
const SENTRY_RELEASE = process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA;

Sentry.init({
  dsn: SENTRY_DSN || "",
  enabled: Boolean(SENTRY_DSN),
  environment: SENTRY_ENVIRONMENT,
  release: SENTRY_RELEASE,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for trace-based performance monitoring.
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
