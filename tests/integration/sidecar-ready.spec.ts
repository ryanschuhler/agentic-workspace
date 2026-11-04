/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {SIDECAR_URL} from '../utils/environment.ts';

test.describe('FLOW-SIDECAR-READY', () => {
	test('the sidecar answers its ready probe without authentication', async ({
		request,
	}) => {
		const response = await request.get(`${SIDECAR_URL}/ready`);

		expect(response.status()).toBe(200);
		expect(await response.text()).toBe('READY');
	});
});
