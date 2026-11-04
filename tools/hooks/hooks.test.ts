/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import assert from 'node:assert/strict';
import {describe, it} from 'node:test';

import {findViolation} from './guardBash.ts';
import {findProtection} from './guardEdit.ts';

describe('guardBash', () => {
	for (const command of [
		'git stash',
		'git stash pop',
		'git stash && git pull',
		'git add -A',
		'git add .',
		'git commit --no-verify -m x',
		'git push --force origin main',
		'docker compose down -v',
	]) {
		it(`blocks ${command}`, () => {
			assert.ok(findViolation(command));
		});
	}

	for (const command of [
		'git stash push -u -m wip-12',
		'git stash apply 3f2a9c81d',
		'git add tools/hooks/guardBash.ts',
		'git push --force-with-lease origin EXAMPLE-12',
		'docker compose down',
	]) {
		it(`allows ${command}`, () => {
			assert.equal(findViolation(command), undefined);
		});
	}
});

describe('guardEdit', () => {
	it('protects .env, generated files, and the lockfile', () => {
		assert.ok(findProtection(`${process.cwd()}/.env`));
		assert.ok(
			findProtection(`${process.cwd()}/client-extensions/a/build/x.js`),
		);
		assert.ok(findProtection(`${process.cwd()}/yarn.lock`));
	});

	it('allows source files', () => {
		assert.equal(
			findProtection(`${process.cwd()}/tools/plan/lib.ts`),
			undefined,
		);
		assert.equal(
			findProtection(`${process.cwd()}/.env.example`),
			undefined,
		);
	});
});
