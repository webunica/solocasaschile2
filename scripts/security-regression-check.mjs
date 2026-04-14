#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const checks = [
  {
    file: "src/app/api/admin/sync-suppliers/route.ts",
    patterns: [
      /resolveAdminRole/,
      /checkRateLimit/,
      /status:\s*403/,
      /status:\s*429/,
    ],
  },
  {
    file: "src/app/api/admin/sync-region/route.ts",
    patterns: [
      /resolveAdminRole/,
      /checkRateLimit/,
      /status:\s*403/,
      /status:\s*429/,
    ],
  },
  {
    file: "src/app/api/admin/check-serpapi/route.ts",
    patterns: [
      /resolveAdminRole/,
      /checkRateLimit/,
      /status:\s*403/,
      /status:\s*429/,
    ],
    notPatterns: [/keyPreview/],
  },
  {
    file: "src/app/api/cron/generate-blog/route.ts",
    patterns: [
      /authHeader\s*=\s*req\.headers\.get\('authorization'\)/,
      /authHeader\s*===\s*`Bearer \$\{cronSecret\}`/,
      /status:\s*401/,
    ],
    notPatterns: [/searchParams/, /secretParam/],
  },
  {
    file: "src/app/api/leads/public/route.ts",
    patterns: [
      /PublicLeadSchema/,
      /website:\s*z\.string\(\)\.optional\(\)/,
      /parsed\.data\.website\s*&&\s*parsed\.data\.website\.trim\(\)\s*!==\s*""/,
      /checkRateLimit/,
      /status:\s*429/,
      /SUPABASE_SERVICE_ROLE_KEY/,
    ],
  },
  {
    file: "src/components/home/hero-lead-form.tsx",
    patterns: [/fetch\("\/api\/leads\/public"/],
    notPatterns: [/from\("leads"\)\.insert/],
  },
  {
    file: "src/components/home/price-drop-banner.tsx",
    patterns: [/fetch\("\/api\/leads\/public"/],
    notPatterns: [/createLead\(/],
  },
  {
    file: "src/components/modelo/price-notify.tsx",
    patterns: [/fetch\("\/api\/leads\/public"/],
    notPatterns: [/createLead\(/],
  },
  {
    file: "src/app/api/obras/[id]/stages/route.ts",
    patterns: [/supabase\.auth\.getUser\(\)/, /status:\s*401/, /Project not found/],
  },
  {
    file: "src/app/api/obras/[id]/files/route.ts",
    patterns: [
      /supabase\.auth\.getUser\(\)/,
      /status:\s*401/,
      /Stage not found for this project/,
    ],
  },
  {
    file: "src/app/api/obras/[id]/stages/[stageId]/route.ts",
    patterns: [
      /supabase\.auth\.getUser\(\)/,
      /status:\s*401/,
      /Stage not found for this project/,
    ],
  },
];

const failures = [];

for (const check of checks) {
  const content = readFileSync(check.file, "utf8");

  for (const pattern of check.patterns) {
    try {
      assert.match(content, pattern);
    } catch {
      failures.push(`${check.file}: missing ${pattern}`);
    }
  }

  for (const pattern of check.notPatterns ?? []) {
    if (pattern.test(content)) {
      failures.push(`${check.file}: forbidden match ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("\nSecurity regression check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Security regression check passed.");
