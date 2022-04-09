module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
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
    'react/react-in-jsx-scope': 'off',
    'require-jsdoc': 'off',
    'max-len': [2, {'code': 100, 'tabWidth': 2}],
    'no-multiple-empty-lines': ['error', {'max': 1}],
    'arrow-parens': [2, 'as-needed'],
    'indent': ['error', 2],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0 }]
  },
};
