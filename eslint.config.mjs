import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
// @ts-check
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{ ignores: ['dist/**', '.astro/**'] },
	js.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	...eslintPluginAstro.configs.recommended,
	...eslintPluginAstro.configs['jsx-a11y-strict'],
	{ files: ['**/*.tsx'], ...jsxA11y.flatConfigs.strict },
	reactHooks.configs.flat.recommended,
	{
		plugins: { 'unused-imports': unusedImports },
		rules: {
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-unused-vars': 'off',
			'no-console': 'error',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
		},
	},
	perfectionist.configs['recommended-alphabetical'],
	eslintConfigPrettier,
);
