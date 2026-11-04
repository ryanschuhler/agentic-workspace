/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, test} from '@playwright/test';

import {basicAuthorization} from '../utils/environment.ts';

test.describe('OBJECT-SAMPLE', () => {
	test('the batch import publishes the Sample object with field1', async ({
		request,
	}) => {
		const response = await request.get(
			'/o/object-admin/v1.0/object-definitions',
			{
				headers: {Authorization: basicAuthorization()},
				params: {filter: "name eq 'Sample'"},
			},
		);

		expect(response.ok()).toBe(true);

		const {items} = await response.json();

		expect(items).toHaveLength(1);
		expect(items[0].status.label).toBe('approved');
		expect(
			items[0].objectFields.map(
				(objectField: {name: string}) => objectField.name,
			),
		).toContain('field1');
	});
});
