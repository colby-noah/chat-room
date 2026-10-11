import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
    { ignores: ['dist/', 'node_modules/', 'coverage/'] },
    js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    prettier,
    {
        languageOptions: { globals: globals.browser },
        rules: {
            camelcase: ['warn', { properties: 'never', ignoreDestructuring: true }],
        },
    },
]
