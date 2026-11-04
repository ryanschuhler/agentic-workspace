/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {checkCommitTitle} from './commitMessage.ts';
import {isMixed, isTestFile} from './commitSplit.ts';

describe('checkCommitTitle', () => {
	it('accepts a ticket title', () => {
		assert.deepEqual(
			checkCommitTitle('EXAMPLE-12 Refuse a Sample entry with no name\n'),
			[],
		);
	});

	it('rejects a title with no ticket, a period, or too many characters', () => {
		assert.equal(checkCommitTitle('Fix stuff.').length, 2);
		assert.equal(checkCommitTitle(`EXAMPLE-1 ${'x'.repeat(70)}`).length, 1);
	});
});

describe('commitSplit', () => {
	it('knows a test file at every tier', () => {
		assert.ok(isTestFile('client-extensions/a/src/api.test.js'));
		assert.ok(isTestFile('client-extensions/b/src/test/java/ATest.java'));
		assert.ok(isTestFile('tests/plan/rest.md'));
		assert.ok(!isTestFile('client-extensions/a/src/api.js'));
	});

	it('flags a commit that mixes code and tests', () => {
		assert.ok(isMixed(['src/api.js', 'src/api.test.js']));
		assert.ok(!isMixed(['src/api.test.js', 'tests/plan/modules.md']));
		assert.ok(!isMixed(['src/api.js']));
	});
});
