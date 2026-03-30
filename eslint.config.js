import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, vitest },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...vitest.environments.env.globals, ...globals.node },
    },
  },
  eslintConfigPrettier,
]);
