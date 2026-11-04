/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import fs from 'node:fs';

export function checkCommitTitle(message: string): string[] {
	const title = message.split('\n')[0];
	const problems = [];

	if (/^(Merge|Revert|fixup!|squash!) /.test(title)) {
		return [];
	}

	if (!/^[A-Z][A-Z0-9]+-\d+ /.test(title)) {
		problems.push(
			'Start the title with the ticket ID, for example "EXAMPLE-12 Refuse a Sample entry with no name".',
		);
	}

	if (title.length > 72) {
		problems.push(
			`Shorten the title to 72 characters or less (now ${title.length}).`,
		);
	}

	if (title.endsWith('.')) {
		problems.push('Remove the period at the end of the title.');
	}

	return problems;
}

if (import.meta.main) {
	const problems = checkCommitTitle(fs.readFileSync(process.argv[2], 'utf8'));

	for (const problem of problems) {
		console.error(`✗ ${problem}`);
	}

	process.exit(problems.length ? 1 : 0);
}
