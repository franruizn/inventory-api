import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      "no-unused-vars": "off", // desactivamos la base
      "@typescript-eslint/no-unused-vars": "warn",

      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  {
    ignores: ["node_modules", "dist"],
  },
];