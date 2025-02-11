module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "plugin:react/recommended",
    "eslint:recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  parser: "@typescript-eslint/parser",
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "react"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "block-like", next: "*" },
    ],
    "react/jsx-uses-react": "error",
    "react/prop-types": "off",
    "no-console": "warn",
    eqeqeq: "warn",
    "no-debugger": "warn",
    "consistent-return": "error",
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
}

{
}
