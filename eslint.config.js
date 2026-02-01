import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      perfectionist,
      'unused-imports': unusedImports
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      'astro/no-set-html-directive': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_'
        }
      ],
      ...perfectionist.configs['recommended-alphabetical'].rules
    }
  },
  prettier,
  {
    ignores: [
      'dist/**',
      '.output/**',
      'node_modules/**',
      '*.log',
      '.env*',
      '.cache/**',
      '.astro/**',
      '.DS_Store',
      'coverage/**'
    ]
  }
]
