#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const args = process.argv.slice(2);
const cwd = process.cwd();

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".sql",
  ".yml",
  ".yaml",
  ".toml",
  ".txt",
  ".env",
  ".conf",
  ".ini",
  ".css",
]);

const ignoredDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "out",
  "build",
  "coverage",
  ".agents",
  ".claude",
  "recursos",
  "mobile-casas",
  "tmp",
]);

const ignoredFilePatterns = [/\.lock$/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/, /\.webp$/, /\.pdf$/, /\.zip$/, /\.mp4$/, /\.psd$/, /\.xlsx$/];

const ruleSet = [
  {
    id: "openai_key",
    regex: /\bsk-(?:proj|live|test|[A-Za-z0-9])[A-Za-z0-9_-]{20,}\b/g,
    message: "Possible OpenAI API key",
  },
  {
    id: "resend_key",
    regex: /\bre_[A-Za-z0-9]{20,}\b/g,
    message: "Possible Resend API key",
  },
  {
    id: "assignment_secret",
    regex:
      /\b(?:OPENAI_API_KEY|RESEND_API_KEY|SUPABASE_SERVICE_ROLE_KEY|FLOW_SECRET_KEY|FLOW_API_KEY|SERPAPI_KEY|SERPAPI_API_KEY|CRON_SECRET)\b\s*[:=]\s*["']([A-Za-z0-9_\-+=/]{8,})["']/gi,
    message: "Possible secret assignment",
  },
  {
    id: "password_assignment",
    regex: /\b(?:password|passwd|contrase(?:n|ñ)a)\b\s*[:=]\s*["']([A-Za-z0-9!@#$%^&*()_+\-=[\]{};:,.<>/?\\|]{8,})["']/gi,
    message: "Possible password in plain text",
  },
];

const valueDenylist = [
  "tu_api_key",
  "tu_clave",
  "tu_url",
  "tu_usuario",
  "tu_password",
  "placeholder",
  "missing_key_for_build",
  "re_placeholder_key_for_development",
];

function parseFileArgs() {
  const filesFlagIndex = args.indexOf("--files");
  if (filesFlagIndex === -1) return null;

  const files = args
    .slice(filesFlagIndex + 1)
    .map((value) => value.trim())
    .filter(Boolean);

  return files.length ? files : null;
}

function shouldScan(path) {
  const unixPath = path.replace(/\\/g, "/");
  if (ignoredFilePatterns.some((pattern) => pattern.test(unixPath))) return false;
  const extension = extname(unixPath).toLowerCase();
  if (!extension) return true;
  return textExtensions.has(extension);
}

function likelyPlaceholder(value) {
  const normalized = value.toLowerCase();
  return valueDenylist.some((item) => normalized.includes(item));
}

function listFilesRecursively(baseDir) {
  const files = [];
  const entries = readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") && ![".github", ".githooks"].includes(entry.name)) {
      if (entry.name !== ".env.template") continue;
    }

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      files.push(...listFilesRecursively(join(baseDir, entry.name)));
      continue;
    }

    const absolutePath = join(baseDir, entry.name);
    const relativePath = absolutePath.slice(cwd.length + 1).replace(/\\/g, "/");
    files.push(relativePath);
  }

  return files;
}

function scanFile(path) {
  let raw;
  try {
    const absolute = join(cwd, path);
    if (!statSync(absolute).isFile()) return [];
    raw = readFileSync(absolute, "utf8");
  } catch {
    return [];
  }

  if (raw.includes("\u0000")) return [];
  if (raw.includes("secret-scan:allow")) return [];

  const findings = [];
  const lines = raw.split(/\r?\n/);

  for (const rule of ruleSet) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    for (const [lineNumber, line] of lines.entries()) {
      regex.lastIndex = 0;
      const match = regex.exec(line);
      if (!match) continue;

      const captured = (match[1] || match[0] || "").trim();
      if (captured && likelyPlaceholder(captured)) continue;

      findings.push({
        path,
        line: lineNumber + 1,
        rule: rule.id,
        message: rule.message,
      });
    }
  }

  return findings;
}

const fileArgs = parseFileArgs();
const filesToScan = (fileArgs ?? listFilesRecursively(cwd))
  .map((path) => path.replace(/\\/g, "/"))
  .filter(shouldScan);

const findings = filesToScan.flatMap(scanFile);

if (findings.length > 0) {
  console.error("\nSecret scan failed. Possible secrets found:\n");
  for (const finding of findings) {
    console.error(`- ${finding.path}:${finding.line} [${finding.rule}] ${finding.message}`);
  }
  console.error(
    "\nIf this is a false positive, replace value with a placeholder or add `secret-scan:allow` in that file."
  );
  process.exit(1);
}

console.log(`Secret scan passed (${fileArgs ? "custom file list" : "repository files"}).`);
