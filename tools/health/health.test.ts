/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {BASE_FIXTURE, createFixture} from '../fixture.ts';
import {findDrift} from './build.ts';
import {collect} from './collect.ts';

const OBJECT_DEFINITION = JSON.stringify({
	configuration: {
		className: 'com.liferay.object.admin.rest.dto.v1_0.ObjectDefinition',
	},
	items: [
		{
			name: 'Sample',
			objectActions: [
				{
					name: 'Ok',
					objectActionExecutorKey: 'function#sidecar-action',
				},
				{
					name: 'Broken',
					objectActionExecutorKey: 'function#missing-action',
				},
			],
			objectFields: [],
		},
	],
});

const CLIENT_EXTENSION = `sidecar-action:
    resourcePath: /ready
    type: objectAction
sidecar-orphan:
    resourcePath: /nowhere
    type: objectAction
`;

const FIXTURE = {
	...BASE_FIXTURE,
	'.agents/rules/fresh.md':
		'---\npaths:\n    - "specs/**"\n---\n\nVerified on 2026-11-04.\n',
	'.agents/rules/stale.md':
		'---\npaths:\n    - "nowhere/**"\n---\n\nNo date.\n',
	'.agents/skills/good/SKILL.md':
		'---\nname: good\ndescription: Does one thing well, and says exactly when an agent should use it.\n---\n',
	'.agents/skills/thin/SKILL.md':
		'---\nname: thin\ndescription: Short.\n---\n',
	'client-extensions/liferay-sample-batch/batch/object.batch-engine-data.json':
		OBJECT_DEFINITION,
	'client-extensions/liferay-sample-etc-spring-boot/client-extension.yaml':
		CLIENT_EXTENSION,
};

describe('health', () => {
	const ids = collect(createFixture(FIXTURE)).actions.map(
		(action) => action.id,
	);

	it('finds an object action with no handler', () => {
		assert.ok(ids.includes('object-action-no-handler:Sample/Broken'));
		assert.ok(!ids.includes('object-action-no-handler:Sample/Ok'));
	});

	it('finds a microservice entry with no controller', () => {
		assert.ok(ids.includes('endpoint-missing:sidecar-orphan'));
		assert.ok(!ids.includes('endpoint-missing:sidecar-action'));
	});

	it('finds a stale and an unverified rule', () => {
		assert.ok(ids.includes('rule-stale-paths:.agents/rules/stale.md'));
		assert.ok(ids.includes('rule-unverified:.agents/rules/stale.md'));
		assert.ok(!ids.some((id) => id.endsWith('fresh.md')));
	});

	it('finds a skill with a thin description', () => {
		assert.deepEqual(
			ids.filter((id) => id.startsWith('skill-')),
			['skill-thin-description:thin'],
		);
	});

	it('separates untracked actions from resolved known defects', () => {
		const health = collect(createFixture(FIXTURE));
		const drift = findDrift(health, {
			'endpoint-missing:sidecar-orphan': {note: '', ticket: 'EXAMPLE-2'},
			'endpoint-missing:fixed-long-ago': {note: '', ticket: 'EXAMPLE-3'},
		});

		assert.deepEqual(drift.resolved, ['endpoint-missing:fixed-long-ago']);
		assert.ok(!drift.untracked.includes('endpoint-missing:sidecar-orphan'));
	});
});
