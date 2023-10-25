/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
    root: true,
    env: {
        node: true,
        es2022: true
    },
    extends: ["standard-with-typescript", "prettier"],
    overrides: [],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        project: "./tsconfig.eslint.json",
        sourceType: "module",
        tsconfigRootDir: __dirname
    },
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
    }
}
