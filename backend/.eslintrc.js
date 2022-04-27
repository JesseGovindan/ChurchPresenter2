module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    'require-jsdoc': 'off',
    'max-len': [2, { 'code': 120, 'tabWidth': 2 }],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'arrow-parens': [2, 'as-needed'],
    'indent': ['error', 2],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }],
    'object-curly-spacing': ['error', 'always'],
    'semi': [2, 'never'],
    'comma-dangle': ['error', 'only-multiline'],
    'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }]
  },
}
