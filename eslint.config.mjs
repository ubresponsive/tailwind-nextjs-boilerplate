import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Lucide icons must go through src/components/ui/icon.tsx (named imports).
      // Block only default/namespace imports of lucide-react; named imports stay allowed.
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "lucide-react",
              importNames: ["default"],
              message:
                "Import named icons and render them via src/components/ui/icon.tsx",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tailwind Plus catalogue is reference material to copy from, not linted source.
    "tailwind-plus-catalog/**",
  ]),
]);

export default eslintConfig;
