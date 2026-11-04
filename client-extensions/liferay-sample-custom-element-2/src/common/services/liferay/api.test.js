/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {afterEach, describe, expect, it, vi} from 'vitest';

import api from './api.js';

describe('MOD-API', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('resolves the path against the portal origin and sends the CSRF token', async () => {
		const fetchMock = vi.fn(() => Promise.resolve(new Response('{}')));

		vi.stubGlobal('fetch', fetchMock);

		await api('o/headless-admin-user/v1.0/my-user-account');

		const [url, options] = fetchMock.mock.calls[0];

		expect(url).toBe(
			`${window.location.origin}/o/headless-admin-user/v1.0/my-user-account`
		);
		expect(options.headers['x-csrf-token']).toBeDefined();
	});

	it('lets the caller override the request options', async () => {
		const fetchMock = vi.fn(() => Promise.resolve(new Response('{}')));

		vi.stubGlobal('fetch', fetchMock);

		await api('o/c/samples', {method: 'POST'});

		expect(fetchMock.mock.calls[0][1].method).toBe('POST');
	});
});
