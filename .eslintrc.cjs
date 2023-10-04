module.exports = {
  root: true,
  extends: [
    require.resolve('@gera2ld/plaid/eslint'),
    require.resolve('@gera2ld/plaid-common-vue/eslint'),
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
};
