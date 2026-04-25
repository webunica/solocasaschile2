import { spawn } from "node:child_process";
import path from "node:path";

const port = process.argv[2] || "3002";
const nextBin = path.resolve("node_modules", "next", "dist", "bin", "next");

const child = spawn(
  process.execPath,
  [
    nextBin,
    "dev",
    "-H",
    "127.0.0.1",
    "-p",
    port,
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "",
      NEXT_PUBLIC_DISABLE_SUPABASE_WARNINGS: "true",
    },
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

["SIGINT", "SIGTERM"].forEach((eventName) => {
  process.on(eventName, () => {
    child.kill(eventName);
  });
});
