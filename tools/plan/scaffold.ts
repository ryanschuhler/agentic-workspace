/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

import {ROOT, anchorToId, enumerateSurface, parsePlan} from './lib.ts';

const PLAN_FILES: Record<string, string> = {
	module: 'tests/plan/modules.md',
	object: 'tests/plan/objects.md',
	rest: 'tests/plan/rest.md',
	route: 'tests/plan/routes.md',
};

const DEFAULT_TYPES: Record<string, string> = {
	module: 'unit',
	object: 'integration',
	rest: 'junit',
	route: 'unit',
};

function main(): number {
	const plannedSources = new Set(parsePlan().map((item) => item.source));
	let added = 0;

	for (const group of enumerateSurface()) {
		const gaps = group.anchors.filter(
			(anchor) => !plannedSources.has(anchor),
		);

		if (!gaps.length) {
			continue;
		}

		const file = path.join(ROOT, PLAN_FILES[group.prefix]);

		if (!fs.existsSync(file)) {
			fs.writeFileSync(
				file,
				`# ${group.title}\n\n` +
					'| ID | Requirement | Type | Priority | Status | Source |\n' +
					'| --- | --- | --- | --- | --- | --- |\n',
			);
		}

		const rows = gaps.map(
			(anchor) =>
				`| ${anchorToId(anchor)} | TODO | ${DEFAULT_TYPES[group.prefix]} | P1 | planned | \`${anchor}\` |`,
		);

		fs.appendFileSync(file, rows.join('\n') + '\n');

		added += rows.length;

		console.log(
			`Added ${rows.length} row(s) to ${PLAN_FILES[group.prefix]}`,
		);
	}

	console.log(
		added
			? '\nReplace each TODO with the behavior that a test must prove.'
			: 'The plan already covers the code surface.',
	);

	return 0;
}

process.exit(main());
