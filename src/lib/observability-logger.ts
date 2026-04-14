type PrimitiveLogValue = string | number | boolean | null;
type LogValue = PrimitiveLogValue | Record<string, PrimitiveLogValue>;

type LogPayload = {
  level: "info" | "warn" | "error";
  event: string;
  route: string;
  requestId: string;
  ms?: number;
} & Record<string, LogValue | undefined>;

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

function writeLog(payload: LogPayload) {
  const clean = cleanPayload(payload);

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
