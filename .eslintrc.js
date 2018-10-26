module.exports = {
  "extends": "airbnb-base",
  "plugins": ["jest"],
  "rules": {

    // overrides
    "semi": ["error", "never"],
    "quotes": ["warn", "single"],
    "func-names": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "space-before-function-paren": ["error", {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
    }],
    "object-curly-newline": ["error", { "multiline": true }],
    "operator-linebreak": ["error", "before"],
    "comma-dangle": ["error", {
        "arrays": "always",
        "objects": "always",
        "imports": "always",
        "exports": "always",
        "functions": "never"
    }],
    "no-underscore-dangle": [2, { "allowAfterThis": true }],

    // jest
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  },
  "env": {
    "jest/globals": true,
  },
}
