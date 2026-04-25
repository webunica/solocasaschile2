import { beforeEach, describe, expect, it, vi } from "vitest";

const captureException = vi.fn();
const withScope = vi.fn((callback: (scope: {
  setLevel: (level: string) => void;
  setTag: (key: string, value: string) => void;
  setFingerprint: (value: string[]) => void;
  setContext: (key: string, value: Record<string, unknown>) => void;
}) => void) => {
  callback({
    setLevel: vi.fn(),
    setTag: vi.fn(),
    setFingerprint: vi.fn(),
    setContext: vi.fn(),
  });
});

vi.mock("@sentry/nextjs", () => ({
  captureException,
  withScope,
}));

describe("observability logger", () => {
  beforeEach(() => {
    captureException.mockClear();
    withScope.mockClear();
    vi.resetModules();
  });

  it("reports critical error events to Sentry", async () => {
    const logger = await import("./observability-logger");

    logger.logError(
      "leads_public_insert_failed",
      "/api/leads/public",
      "req-123",
      new Error("db_insert_failed"),
      { ms: 42 }
    );

    expect(withScope).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("does not report non-critical warning events to Sentry", async () => {
    const logger = await import("./observability-logger");

    logger.logWarn("leads_public_rate_limited", "/api/leads/public", "req-123", {
      retryAfterSeconds: 60,
    });

    expect(withScope).not.toHaveBeenCalled();
    expect(captureException).not.toHaveBeenCalled();
  });

  it("adds x-request-id to response headers", async () => {
    const logger = await import("./observability-logger");

    const init = logger.withRequestIdHeaders({ status: 202 }, "req-789");
    const headers = new Headers(init.headers);

    expect(init.status).toBe(202);
    expect(headers.get("x-request-id")).toBe("req-789");
  });
});
