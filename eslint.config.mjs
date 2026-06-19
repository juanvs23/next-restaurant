// eslint.config.mjs — Flat config (ESLint 10 + Next.js 16)
import nextConfig from "eslint-config-next";
import prettier from "eslint-plugin-prettier";

// nextConfig is an array of 3 flat config objects from eslint-config-next
const eslintConfig = [
  ...nextConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    // Ignore patterns
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
