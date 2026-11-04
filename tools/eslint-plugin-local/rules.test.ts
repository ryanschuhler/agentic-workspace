/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {RuleTester} from 'eslint';
import {describe, it} from 'node:test';

import plugin from './index.js';

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
	languageOptions: {parserOptions: {ecmaFeatures: {jsx: true}}},
});

describe('MOD-ESLINT-PLUGIN-LOCAL', () => {
	ruleTester.run('no-comments', plugin.rules['no-comments'], {
		invalid: [
			{
				code: 'const a = 1; // the answer',
				errors: [{messageId: 'unexpectedComment'}],
			},
		],
		valid: [
			'/**\n * SPDX-FileCopyrightText: (c) 2026 Liferay\n */\nconst a = 1;',
			'// eslint-disable-next-line no-console\nconsole.log(1);',
		],
	});

	ruleTester.run(
		'filename-matches-default-export',
		plugin.rules['filename-matches-default-export'],
		{
			invalid: [
				{
					code: 'function HelloBar() {}\nexport default HelloBar;',
					errors: [{messageId: 'mismatch'}],
					filename: '/src/HelloWorld.js',
				},
			],
			valid: [
				{
					code: 'function HelloWorld() {}\nexport default HelloWorld;',
					filename: '/src/HelloWorld.js',
				},
				{
					code: 'export default function api() {}',
					filename: '/src/api.js',
				},
			],
		}
	);

	ruleTester.run('log-message-form', plugin.rules['log-message-form'], {
		invalid: [
			{
				code: "throw new Error('Error updating sample');",
				errors: [{messageId: 'unableTo'}],
			},
			{
				code: "console.error('Update failed: id=' + id);",
				errors: [{messageId: 'labelPunctuation'}],
			},
		],
		valid: [
			"throw new Error('Unable to update sample ' + id);",
			'console.error(error);',
		],
	});

	ruleTester.run('test-cites-plan-id', plugin.rules['test-cites-plan-id'], {
		invalid: [
			{
				code: "describe('HelloWorld', () => {});",
				errors: [{messageId: 'missingPlanId'}],
				filename: '/src/HelloWorld.test.js',
			},
		],
		valid: [
			{
				code: "describe('ROUTE-HELLO-WORLD', () => {});",
				filename: '/src/HelloWorld.test.js',
			},
			{code: "describe('anything', () => {});", filename: '/src/api.js'},
		],
	});
});
