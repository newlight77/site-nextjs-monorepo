module.exports = {
  env: {
    "browser": true,
    "node": true
  },
  extends: [
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
  plugins: ["react", "react-hooks"],
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 2,
    "import/no-anonymous-default-export": 0,
    "react/prop-types": 0,
    "react-hooks/exhaustive-deps": 0,
    "turbo/no-undeclared-env-vars": 0
  },
};
