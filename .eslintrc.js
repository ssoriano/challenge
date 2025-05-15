/**
 * Using Airbnb's engineering team ESLint rules as defaults.
 *
 * These rules come from:
 * - eslint-config-airbnb
 * - eslint-config-airbnb-typescript
 *
 * And eslint-config-airbnb is composed of:
 * - eslint-plugin-react
 * - eslint-plugin-react-hooks
 * - eslint-plugin-import
 * - eslint-plugin-jsx-a11y
 *
 * More info:
 * - https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
 * - https://github.com/iamturns/eslint-config-airbnb-typescript
 */

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["airbnb", "airbnb/hooks", "airbnb-typescript", "prettier"],
  parserOptions: {
    project: __dirname + "/tsconfig.json",
  },
  rules: {
    "import/prefer-default-export": "warn",
    "import/no-default-export": "warn",
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
    "@typescript-eslint/no-unused-expressions": "error",
    "import/order": [
      "warn",
      {
        pathGroups: [
          {
            pattern: "@/*",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["type"],
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"],
          "type",
        ],
        "newlines-between": "always",
      },
    ],
    "@typescript-eslint/no-throw-literal": "error",
    "no-restricted-globals": "error",
    "consistent-return": "off",
    "@typescript-eslint/dot-notation": "error",
    "react/destructuring-assignment": "error",
    "react/jsx-no-constructed-context-values": "error",
    "@typescript-eslint/naming-convention": "error",
    eqeqeq: "error",
    "react/require-default-props": "error",
    "react/jsx-props-no-spreading": "error",
    "@typescript-eslint/no-use-before-define": "error",
    "no-nested-ternary": "error",
    "react/jsx-no-useless-fragment": "error",
    "@typescript-eslint/no-shadow": "error",
    radix: "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-unsafe-optional-chaining": "error",
    "no-underscore-dangle": "error",
    "no-restricted-syntax": "error",
    "no-param-reassign": "error",
    "no-case-declarations": "error",
    "no-plusplus": "error",
    "import/no-default-export": "error",
    "default-case": "error",
    "no-prototype-builtins": "error",
    "no-unreachable-loop": "error",
    "import/no-anonymous-default-export": "error",
    "import/no-extraneous-dependencies": "error",
    "no-return-assign": "error",
    "no-empty-pattern": "error",
    "array-callback-return": "error",
    "no-dupe-else-if": "error",
    "no-continue": "error",
    "import/no-cycle": "error",
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error",
  },
};
