module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "standard",
    "plugin:@typescript-eslint/recommended",
  ],
  "plugins": [
    "@typescript-eslint",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": '@typescript-eslint/parser',
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module",
    "project": "./tsconfig.json",
  },
  "rules": {
    "semi": ["error", "always"],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }],
    "@typescript-eslint/no-explicit-any": "off"
  }
};