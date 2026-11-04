/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

test.describe('FLOW-SAMPLE-SITE', () => {
	test('a guest opens the sample site with the global CSS applied', async ({
		page,
	}) => {
		const response = await page.goto('/web/liferay-sample');

		expect(response?.status()).toBeLessThan(400);

		await expect(
			page.locator('link[rel="stylesheet"][href*="global"]'),
		).not.toHaveCount(0);
	});
});
