/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {defineConfig} from '@playwright/test';

import {LIFERAY_URL} from './utils/environment.ts';

export default defineConfig({
	forbidOnly: !!process.env.CI,
	projects: [
		{
			name: 'integration',
			testDir: './integration',
		},
		{
			name: 'e2e',
			testDir: './e2e',
			use: {screenshot: 'only-on-failure', trace: 'retain-on-failure'},
		},
	],
	reporter: [
		['list'],
		['junit', {outputFile: '../test-results/playwright.xml'}],
	],
	retries: process.env.CI ? 1 : 0,
	use: {
		baseURL: LIFERAY_URL,
	},
});
