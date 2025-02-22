import { nextJsConfig } from '@repo/eslint-config/next-js'

/** @type {import("eslint").Linter.Config} */
export default {
  nextJsConfig,
  rules: {
    ...nextJsConfig.rules,
    'react-hooks/exhaustive-deps': 'off'
  }
}
