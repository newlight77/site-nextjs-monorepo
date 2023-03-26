module.exports = {
  env: {
    "browser": true,
    "node": true
  },
  extends: [
    "next",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "turbo",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "@next/next/no-css-tag": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 2,
    "import/no-anonymous-default-export": 0,
    "react/prop-types": 0,
    "react-hooks/exhaustive-deps": 0,
    "turbo/no-undeclared-env-vars": 0
  },
};
