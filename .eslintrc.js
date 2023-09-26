module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    plugins: ["@typescript-eslint"],
    extends: [
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ],
    ignorePatterns: ["node_modules/*", "out/*", "hardhat-scripts/*"]
  };