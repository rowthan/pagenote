module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  requireConfigFile: false,
  env: {
    browser: true,
    node: true
  },
  extends: [
    "standard",
    "plugin:vue/recommended",
    "plugin:vue/base"
  ],
  // 校验 .vue 文件
  plugins: [
    "babel",
    "promise",
    "import",
    "vue"
  ],
  // 自定义规则
  rules: {
    "standard/no-callback-literal": 0,
    "vue/attributes-order": 2,
    "vue/no-multi-spaces": 2,
    "vue/html-self-closing": 0,
    "vue/html-quotes": ["error", "double"],
    "quotes": ["error", "single"],
    "no-new": 0,
    "no-underscore-dangle": 0,
    "prefer-promise-reject-errors": 0,
    "key-spacing"          : 0,
    "camelcase"            :0,
    "no-multi-spaces"      :0,
    "generator-star-spacing" :0,
    "indent"                :0,
    "max-len"              : [2, 300, 2],
    "object-curly-spacing" : [2, "always"],
    "no-useless-constructor" : 0,
    "no-extra-boolean-cast": 0,
    "no-multiple-empty-lines": 0,
    "padded-blocks": 0,
    "no-mixed-operators": 0,
    "no-control-regex": 0,
    "object-shorthand": ["error", "methods"],
    "comma-dangle": ["error", "always-multiline"],
    "handle-callback-err": 0,
    "no-unused-expressions": 0,
    "vue/no-v-html": 0,
    "no-tabs": 0,
  },
  globals: {
    "__DEV__"      : false,
    "__PROD__"     : false
  }
}
