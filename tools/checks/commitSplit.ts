/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import {execFileSync} from 'node:child_process';

const TEST_FILE = /(\.test\.[jt]sx?|\.spec\.ts)$|\/src\/test\/|^tests\//;

export function isTestFile(file: string): boolean {
	return TEST_FILE.test(file);
}

export function isMixed(files: string[]): boolean {
	const tests = files.filter(isTestFile).length;

	return tests > 0 && tests < files.length;
}

function git(...args: string[]): string {
	return execFileSync('git', args, {encoding: 'utf8'}).trim();
}

function main(): number {
	const base = process.argv[2] ?? 'main';
	let range: string;

	try {
		range = `${git('merge-base', base, 'HEAD')}..HEAD`;
	} catch {
		console.log(`commits:check — skipped, ${base} is not a known ref.`);

		return 0;
	}

	const mixed = git('rev-list', range)
		.split('\n')
		.filter(Boolean)
		.filter((sha) =>
			isMixed(
				git('show', '--format=', '--name-only', sha)
					.split('\n')
					.filter(Boolean),
			),
		);

	for (const sha of mixed) {
		console.log(`  ✗ ${git('log', '--format=%h %s', '-1', sha)}`);
	}

	if (mixed.length) {
		console.log(
			`\nFAIL — ${mixed.length} commit(s) mix code and tests. Put the tests in their own commit, after the code.`,
		);

		return 1;
	}

	console.log(
		`commits:check — OK, no commit in ${range.slice(0, 10)}..HEAD mixes code and tests.`,
	);

	return 0;
}

if (import.meta.main) {
	process.exit(main());
}
