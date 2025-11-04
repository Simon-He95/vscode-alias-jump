// @ts-check
import simon_he from '@antfu/eslint-config'

export default simon_he({
  ignores: [
    'funnycode.cache.json',
  ],
}, {
  rules: {
    'import/no-mutable-exports': 'off',
    'regexp/no-misleading-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-cond-assign': 'off',
    'ts/no-unused-expressions': 'off',
  },
})
