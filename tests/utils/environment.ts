/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const LIFERAY_URL = process.env.LIFERAY_URL ?? 'http://localhost:8080';

export const SIDECAR_URL = process.env.SIDECAR_URL ?? 'http://localhost:58081';

export function basicAuthorization(): string {
	const user = process.env.LIFERAY_USER ?? 'test@liferay.com';
	const password = process.env.LIFERAY_PASSWORD ?? 'test';

	return `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
}
