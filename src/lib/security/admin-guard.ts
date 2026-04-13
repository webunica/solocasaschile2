import type { SupabaseClient, User } from "@supabase/supabase-js";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type AdminRoleResult = {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: string | null;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(options.key);

  if (!current || now >= current.resetAt) {
    buckets.set(options.key, { count: 1, resetAt: now + options.windowMs });
    return {
      ok: true,
      remaining: options.limit - 1,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  if (current.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(options.key, current);

  return {
    ok: true,
    remaining: options.limit - current.count,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export async function resolveAdminRole(
  supabase: SupabaseClient,
  user: User
): Promise<AdminRoleResult> {
  const { data: profile } = await supabase
    .from("constructoras")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as string | undefined) ?? null;
  const metadataRole =
    (user.app_metadata?.role as string | undefined) ??
    (user.user_metadata?.role as string | undefined) ??
    null;
  const isSuperAdmin =
    user.app_metadata?.is_superadmin === true ||
    role === "superadmin" ||
    metadataRole === "superadmin";
  const isAdmin = isSuperAdmin || role === "admin" || metadataRole === "admin";

  return {
    isAdmin,
    isSuperAdmin,
    role,
  };
}
