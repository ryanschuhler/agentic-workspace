/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import js from '@eslint/js';
import jsonc from 'eslint-plugin-jsonc';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import local from './tools/eslint-plugin-local/index.js';

export default [
	{
		ignores: [
			'**/build/**',
			'**/node_modules/**',
			'playwright-report/**',
			'test-results/**',
		],
	},
	{
		files: ['**/*.js'],
		...js.configs.recommended,
	},
	{
		linterOptions: {reportUnusedDisableDirectives: 'off'},
	},
	{
		files: ['client-extensions/**/*.js'],
		languageOptions: {
			globals: {...globals.browser, Liferay: 'readonly'},
			parserOptions: {ecmaFeatures: {jsx: true}},
		},
		plugins: {local, react, 'react-hooks': reactHooks},
		rules: {
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'local/filename-matches-default-export': 'error',
			'local/log-message-form': 'error',
			'local/no-comments': 'error',
			'local/test-cites-plan-id': 'error',
			'no-unused-vars': [
				'error',
				{argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
			],
			'react/prop-types': 'off',
		},
		settings: {react: {version: '18'}},
	},
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ['tests/**/*.ts', 'tools/**/*.ts'],
	})),
	{
		files: ['tests/**/*.ts', 'tools/**/*.{js,ts}', '*.js'],
		languageOptions: {globals: globals.node},
		plugins: {local},
		rules: {
			'local/log-message-form': 'error',
			'local/test-cites-plan-id': 'error',
		},
	},
	...jsonc.configs['flat/base'].map((config) => ({
		...config,
		files: ['client-extensions/**/*.json'],
	})),
	{
		files: ['client-extensions/**/*.json'],
		rules: {
			'jsonc/no-dupe-keys': 'error',
			'jsonc/sort-keys': 'error',
		},
	},
];
