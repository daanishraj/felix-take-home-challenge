module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'airbnb-typescript/base',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: ['./tsconfig.json'],
  },
  rules: {
    'max-len': [
      'error',
      {code: 140, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true, ignoreComments: true, ignoreTrailingComments: true},
    ],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    // prettier role
    '@typescript-eslint/object-curly-spacing': 'off',
    // prettier role
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/no-explicit-any': [0, false],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'off',
    'no-use-before-define': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'no-unused-vars': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'class-methods-use-this': 'off',
    'prefer-template': "error",
    "object-shorthand": ["error", "always"],
    'no-underscore-dangle': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '[type|returns|of]', args: 'after-used'}],
    //"func-style": ["error", "declaration"], removing it for now as it is quite annoying to have warnings or errors everywhere
    'newline-before-return': 'error',
    curly: ['error', 'multi-line'],
    'import/order': ['error', {alphabetize: {order: 'asc', caseInsensitive: true}}],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    quotes: 'off',
    '@typescript-eslint/quotes': ['error', 'single', {allowTemplateLiterals: true, avoidEscape: true}],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {selector: 'property', format: null},
      {selector: 'parameter', format: null},
      {selector: 'parameterProperty', format: null},
    ],
  },
  settings: {
    'import/ignore': ['later', 'lodash'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: './tsconfig.json',
      node: true,
    },
  },
};
