module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: [
    'vue',
  ],
  rules: {
    "no-const-assign": 2,
    "comma-style"  : [
      2,
      "last"
    ],
  },
};
