module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  rules: {
    // 允许单词组件名
    'vue/multi-word-component-names': 'off',
    // 允许未使用变量
    'no-unused-vars': 'warn',
    // 禁止直接修改props
    'vue/no-mutating-props': 'error'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'no-undef': 'off',
        'vue/script-setup-uses-vars': 'error'
      }
    }
  ]
};
