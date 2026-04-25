import * as Sentry from "@sentry/nextjs";

type PrimitiveLogValue = string | number | boolean | null;
type LogValue = PrimitiveLogValue | Record<string, PrimitiveLogValue>;

type LogPayload = {
  level: "info" | "warn" | "error";
  event: string;
  route: string;
  requestId: string;
  ms?: number;
} & Record<string, LogValue | undefined>;

const SENTRY_ALERT_EVENTS = new Set([
  "checkout_start_failed",
  "checkout_start_flow_config_missing",
  "checkout_start_profile_upsert_failed",
  "cron_generate_blog_config_missing",
  "cron_generate_blog_failed",
  "cron_generate_blog_webhook_failed",
  "flow_checkout_config_missing",
  "flow_checkout_failed",
  "flow_webhook_failed",
  "flow_webhook_missing_constructora",
  "flow_webhook_plan_activation_failed",
  "leads_public_config_missing",
  "leads_public_insert_failed",
  "leads_public_unexpected_error",
]);

export function getRequestId(req: Request): string {
  return (
    req.headers.get("x-vercel-id") ||
    req.headers.get("x-request-id") ||
    req.headers.get("cf-ray") ||
    "local"
  );
}

export function getErrorDetails(error: unknown): Record<string, PrimitiveLogValue> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    return {
      name: typeof record.name === "string" ? record.name : "UnknownError",
      message: typeof record.message === "string" ? record.message : "unknown_error",
      code: typeof record.code === "string" ? record.code : null,
      status: typeof record.status === "number" ? record.status : null,
    };
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

function cleanPayload(payload: LogPayload): LogPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as LogPayload;
}

function shouldSendToSentry(payload: LogPayload) {
  return payload.level === "error" && SENTRY_ALERT_EVENTS.has(payload.event);
}

function toError(errorValue: LogValue | undefined, event: string) {
  if (errorValue && typeof errorValue === "object" && !Array.isArray(errorValue)) {
    const name =
      typeof errorValue.name === "string" && errorValue.name.length > 0
        ? errorValue.name
        : "ObservedRouteError";
    const message =
      typeof errorValue.message === "string" && errorValue.message.length > 0
        ? errorValue.message
        : event;
    const error = new Error(message);
    error.name = name;
    return error;
  }

  return new Error(event);
}

function sendToSentry(payload: LogPayload) {
  if (!shouldSendToSentry(payload)) {
    return;
  }

  const { error, level, event, route, requestId, ...extra } = payload;
  const sentryLevel = level === "warn" ? "warning" : level;

  Sentry.withScope((scope) => {
    scope.setLevel(sentryLevel);
    scope.setTag("event", event);
    scope.setTag("route", route);
    scope.setTag("request_id", requestId);
    scope.setFingerprint([event, route]);
    scope.setContext("observability", {
      route,
      requestId,
      ...extra,
    });

    Sentry.captureException(toError(error, event));
  });
}

function writeLog(payload: LogPayload) {
  const clean = cleanPayload(payload);
  sendToSentry(clean);

  if (clean.level === "error") {
    console.error(JSON.stringify(clean));
    return;
  }

  if (clean.level === "warn") {
    console.warn(JSON.stringify(clean));
    return;
  }

  console.info(JSON.stringify(clean));
}

export function logInfo(
  event: string,
  route: string,
  requestId: string,
  fields: Record<string, LogValue | undefined> = {}
) {
  writeLog({ level: "info", event, route, requestId, ...fields });
}

export function logWarn(
  event: string,
  route: string,
  requestId: string,
  fields: Record<string, LogValue | undefined> = {}
) {
  writeLog({ level: "warn", event, route, requestId, ...fields });
}

export function logError(
  event: string,
  route: string,
  requestId: string,
  error: unknown,
  fields: Record<string, LogValue | undefined> = {}
) {
  writeLog({
    level: "error",
    event,
    route,
    requestId,
    ...fields,
    error: getErrorDetails(error),
  });
}

export function withRequestIdHeaders(init: ResponseInit = {}, requestId: string): ResponseInit {
  const headers = new Headers(init.headers);
  headers.set("x-request-id", requestId);

  return {
    ...init,
    headers,
  };
}
