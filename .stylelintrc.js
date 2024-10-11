export default {
  // 继承推荐规范配置
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
    'stylelint-config-prettier'
  ],
  // 指定不同文件对应的解析器
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss'
    }
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  defaultSeverity: 'warning',
  // 自定义规则
  rules: {
    'no-empty-first-line': true, // 禁止空第一行
    'no-extra-semicolons': true, // 禁止多余的分号
    'block-closing-brace-empty-line-before': 'never', // 禁止在闭括号之前有空行
    'shorthand-property-no-redundant-values': true, // 禁止简写属性的冗余值
    'color-hex-length': 'long', // 十六进制颜色不使用缩写
    'number-no-trailing-zeros': true, // 禁止数字中的拖尾 0
    'unit-case': 'lower', // 单位必须小写
    'scss/at-import-partial-extension': 'always', // 允许@import scss
    'comment-no-empty': true, // 禁止空注释
    'selector-type-no-unknown': true,
    // 允许 global 、export 、deep伪类
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'deep']
      }
    ],
    // 允许未知属性
    'property-no-unknown': [
      true,
      {
        ignoreProperties: []
      }
    ],
    'at-rule-no-unknown': null // 不验证@未知的名字，为了兼容scss的函数
  }
};
