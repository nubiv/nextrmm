module.exports = {
  $schema: "https://json.schemastore.org/eslintrc",
  extends: ["next", "turbo", "prettier", "plugin:tailwindcss/recommended"],
  plugins: ["tailwindcss"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "error",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
}
