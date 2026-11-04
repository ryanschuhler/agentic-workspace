/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {ROOT} from '../plan/lib.ts';
import {collect} from './collect.ts';

function git(...args: string[]): string {
	return execFileSync('git', args, {cwd: ROOT, encoding: 'utf8'}).trim();
}

function main(): number {
	const base = process.argv[2] ?? 'main';
	const mergeBase = git('merge-base', base, 'HEAD');
	const baseDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'health-'));

	try {
		execFileSync(
			'sh',
			[
				'-c',
				`git archive ${mergeBase} | tar --extract --directory "${baseDirectory}"`,
			],
			{cwd: ROOT},
		);

		const before = new Map(
			collect(baseDirectory).actions.map((action) => [action.id, action]),
		);
		const after = new Map(
			collect(ROOT).actions.map((action) => [action.id, action]),
		);

		const added = [...after.keys()].filter((id) => !before.has(id));
		const resolved = [...before.keys()].filter((id) => !after.has(id));

		console.log(
			`health:diff — actions this branch adds and resolves against ${base} (${mergeBase.slice(0, 10)})\n`,
		);

		for (const id of added) {
			console.log(`  + ${after.get(id)?.title}`);
		}

		for (const id of resolved) {
			console.log(`  - ${before.get(id)?.title}`);
		}

		if (!added.length && !resolved.length) {
			console.log('  No change.');
		}

		return 0;
	} finally {
		fs.rmSync(baseDirectory, {force: true, recursive: true});
	}
}

process.exit(main());
