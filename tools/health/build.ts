/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

import {ROOT} from '../plan/lib.ts';
import {type Health, collect} from './collect.ts';
import {type KnownDefects, render} from './render.ts';

const KNOWN_DEFECTS_FILE = path.join(import.meta.dirname, 'known-defects.json');

export function readKnownDefects(): KnownDefects {
	return JSON.parse(fs.readFileSync(KNOWN_DEFECTS_FILE, 'utf8'));
}

export function findDrift(
	health: Health,
	knownDefects: KnownDefects,
): {resolved: string[]; untracked: string[]} {
	const actionIds = new Set(health.actions.map((action) => action.id));

	return {
		resolved: Object.keys(knownDefects).filter((id) => !actionIds.has(id)),
		untracked: [...actionIds].filter((id) => !knownDefects[id]),
	};
}

function main(): number {
	const rootIndex = process.argv.indexOf('--root');
	const root = rootIndex === -1 ? ROOT : process.argv[rootIndex + 1];

	const health = collect(root);

	if (process.argv.includes('--json')) {
		console.log(JSON.stringify(health, null, '\t'));

		return 0;
	}

	const knownDefects = readKnownDefects();

	if (process.argv.includes('--check')) {
		const {resolved, untracked} = findDrift(health, knownDefects);

		for (const id of untracked) {
			const action = health.actions.find((action) => action.id === id);

			console.log(`  ✗ UNTRACKED ${action?.title}\n      ${action?.fix}`);
		}

		for (const id of resolved) {
			console.log(
				`  ✗ RESOLVED ${id} is fixed. Remove it from tools/health/known-defects.json.`,
			);
		}

		if (untracked.length || resolved.length) {
			console.log(
				`\nFAIL — ${untracked.length} untracked action(s), ${resolved.length} resolved known defect(s).`,
			);

			return 1;
		}

		console.log(
			`OK — ${health.actions.length} action(s), all tracked by a ticket.`,
		);

		return 0;
	}

	const outputDirectory = path.join(import.meta.dirname, 'build');

	fs.mkdirSync(outputDirectory, {recursive: true});

	const outputFile = path.join(outputDirectory, 'index.html');

	fs.writeFileSync(
		outputFile,
		render(health, knownDefects, new Date().toISOString()),
	);

	console.log(`Wrote ${path.relative(ROOT, outputFile)}`);

	return 0;
}

if (import.meta.main) {
	process.exit(main());
}
