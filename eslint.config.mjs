import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Transitional baseline: keep lint blocking for correctness while we burn down
  // legacy typing/react-purity debt in dedicated backlog items.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Non-productive directories and generated/media assets
    ".agents/**",
    ".claude/**",
    "tmp/**",
    "recursos/**",
    "mobile-casas/**",
    "public/images/**",
    // Root loose utility scripts outside product surface
    "check_*.ts",
    "clean_json.js",
    "fix_*.js",
    "generate_final_sql.js",
    "list_roles.ts",
    "seed_*.js",
    "seed_*.ts",
    "test-blog-setup.ts",
    "tmp_flow.ts",
    "verify_*.ts",
  ]),
]);

export default eslintConfig;
