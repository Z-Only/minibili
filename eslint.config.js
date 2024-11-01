import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import autoImport from './.eslintrc-auto-import.js'

export default [
    { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
    {
        ignores: [
            'dist/**',
            'src/vite-env.d.ts',
            'src-tauri/**',
            'src/common/geetest/click.js',
            'docs/**',
        ],
    },
    {
        languageOptions: {
            globals: { ...globals.browser, ...autoImport?.globals },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    {
        rules: {
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    eslintConfigPrettier,
]
