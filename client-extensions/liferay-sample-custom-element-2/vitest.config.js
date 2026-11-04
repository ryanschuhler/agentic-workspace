/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	esbuild: {
		exclude: [],
		include: /\.js$/,
		jsx: 'automatic',
		loader: 'jsx',
	},
	resolve: {
		alias: {
			'@liferay/oauth2-provider-web/client': fileURLToPath(
				new URL('./test/oauth2Client.js', import.meta.url),
			),
		},
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.js'],
		reporters: ['default', 'junit'],
		outputFile: {junit: 'build/test-results/TEST-frontend-js.xml'},
	},
});
