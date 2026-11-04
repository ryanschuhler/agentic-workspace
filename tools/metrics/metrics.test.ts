/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {computeMetrics} from './prMetrics.ts';

function pullRequest(
	login: string,
	createdAt: string,
	mergedAt: string,
	comments = 0,
) {
	return {
		author: {login},
		comments: Array.from({length: comments}),
		createdAt,
		mergedAt,
		reviews: [],
	};
}

describe('computeMetrics', () => {
	const metrics = computeMetrics([
		pullRequest('ada', '2026-10-05T00:00:00Z', '2026-10-05T02:00:00Z', 2),
		pullRequest('ada', '2026-10-06T00:00:00Z', '2026-10-06T04:00:00Z'),
		pullRequest('grace', '2026-10-13T00:00:00Z', '2026-10-13T10:00:00Z', 1),
	]);

	it('counts shipped PRs per ISO week', () => {
		assert.deepEqual(metrics.shippedPerWeek, {
			'2026-W41': 2,
			'2026-W42': 1,
		});
	});

	it('computes PRs per author per month', () => {
		assert.deepEqual(metrics.authorsPerMonth, {'2026-10': 2});
		assert.equal(metrics.prsPerAuthorPerMonth['2026-10'], 1.5);
	});

	it('computes the lead time percentiles and the review comments', () => {
		assert.deepEqual(metrics.leadTimeHours, {median: 4, p75: 10});
		assert.equal(metrics.reviewCommentsPerPr, 1);
	});
});
