/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {BASE_FIXTURE, createFixture} from '../fixture.ts';
import {checkPlan} from './check.ts';
import {anchorToId, enumerateSurface} from './lib.ts';

describe('plan', () => {
	it('derives IDs from anchors', () => {
		assert.equal(anchorToId('module:DadJoke'), 'MOD-DAD-JOKE');
		assert.equal(
			anchorToId('rest:POST /object/action/1'),
			'REST-POST-OBJECT-ACTION-1',
		);
		assert.equal(anchorToId('route:hello-world'), 'ROUTE-HELLO-WORLD');
	});

	it('enumerates routes, modules, and endpoints', () => {
		const surface = enumerateSurface(createFixture(BASE_FIXTURE));

		assert.deepEqual(
			surface.flatMap((group) => group.anchors),
			['module:api', 'rest:GET /ready', 'route:hello-world'],
		);
	});

	it('passes when the plan, the tests, and the specs agree', () => {
		assert.deepEqual(checkPlan(createFixture(BASE_FIXTURE)).problems, []);
	});

	it('reports a gap, a stale row, an orphan tag, and an unproven row', () => {
		const root = createFixture({
			...BASE_FIXTURE,
			'client-extensions/liferay-sample-custom-element-2/src/routes/hello-bar/pages/HelloBar.js':
				'',
			'client-extensions/liferay-sample-custom-element-2/src/routes/hello-bar/pages/HelloBar.test.js':
				"describe('ROUTE-HELLO-BAZ', () => {});",
			'tests/plan/plan.md':
				BASE_FIXTURE['tests/plan/plan.md'] +
				'| ROUTE-GONE | Gone | unit | P2 | covered | `route:gone` |\n',
		});

		const kinds = checkPlan(root).problems.map(
			(problem) => problem.split(' ')[0],
		);

		assert.deepEqual(kinds.sort(), ['GAP', 'ORPHAN', 'STALE', 'UNPROVEN']);
	});

	it('reports a requirement that cites a missing plan item', () => {
		const root = createFixture({
			...BASE_FIXTURE,
			'specs/business/samples.md':
				'| ID | Requirement | Priority | Verified By |\n| --- | --- | --- | --- |\n| REQ-SAMPLE-001 | Greets. | P1 | `ROUTE-NOPE` |\n',
		});

		assert.ok(
			checkPlan(root).problems.some((problem) =>
				problem.startsWith('DANGLING'),
			),
		);
	});
});
