import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-strict'],
  // React islands: hook correctness + a11y (the astro configs above only cover .astro files)
  {
    files: ['**/*.tsx'],
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules
    }
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks
    },
    // Only the classic rules; the rest of the recommended preset targets
    // codebases compiled with the React Compiler, which this site does not use.
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error'
    }
  },
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
