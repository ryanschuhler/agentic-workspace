/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable no-console */

import {
	ROOT,
	SURFACE_PREFIXES,
	enumerateSurface,
	findTestCitations,
	parsePlan,
	parseRequirements,
	validatePlan,
} from './lib.ts';

export type PlanReport = {
	problems: string[];
	summary: string[];
	tracedPercent: number;
};

export function checkPlan(root: string = ROOT): PlanReport {
	const items = parsePlan(root);
	const problems = validatePlan(items);
	const summary = [];

	const itemsById = new Map(items.map((item) => [item.id, item]));
	const plannedSources = new Set(items.map((item) => item.source));

	for (const group of enumerateSurface(root)) {
		const inCode = new Set(group.anchors);
		const inPlan = [...plannedSources].filter((source) =>
			source.startsWith(`${group.prefix}:`),
		);

		const gaps = group.anchors.filter(
			(anchor) => !plannedSources.has(anchor),
		);
		const stale = inPlan.filter((anchor) => !inCode.has(anchor));

		summary.push(
			`${!gaps.length && !stale.length ? '✓' : '✗'} ${group.title.padEnd(10)} ` +
				`${inCode.size} in code, ${inPlan.length} in plan`,
		);

		for (const anchor of gaps) {
			problems.push(
				`GAP ${anchor} is in the code but not in the plan. Run yarn plan:scaffold.`,
			);
		}

		for (const anchor of stale) {
			problems.push(
				`STALE ${anchor} is in the plan but not in the code. Edit its Source, or delete the row.`,
			);
		}
	}

	for (const item of items) {
		const prefix = item.source.split(':', 1)[0];

		if (prefix !== 'spec' && !SURFACE_PREFIXES.includes(prefix)) {
			problems.push(
				`UNKNOWN ${item.id} has the Source "${item.source}". Use one of ${[...SURFACE_PREFIXES, 'spec'].join(', ')}.`,
			);
		}
	}

	const citedIds = new Set<string>();

	for (const citation of findTestCitations(root)) {
		if (!citation.ids.length) {
			problems.push(
				`UNTRACED ${citation.file} cites no plan item. Name the plan ID that it verifies.`,
			);
		}

		for (const id of citation.ids) {
			citedIds.add(id);

			if (!itemsById.has(id)) {
				problems.push(
					`ORPHAN ${citation.file} cites ${id}, which is not in the plan.`,
				);
			}
		}
	}

	for (const item of items) {
		if (item.status === 'covered' && !citedIds.has(item.id)) {
			problems.push(
				`UNPROVEN ${item.id} is marked covered, but no test cites it.`,
			);
		}

		if (item.status === 'planned' && citedIds.has(item.id)) {
			problems.push(
				`UNMARKED ${item.id} has a test. Change its Status to covered.`,
			);
		}
	}

	const requirements = parseRequirements(root);
	const tracedIds = new Set<string>();

	for (const requirement of requirements) {
		if (!requirement.verifiedBy.length) {
			problems.push(
				`REQUIREMENT ${requirement.id} in ${requirement.file} is verified by no plan item.`,
			);
		}

		for (const id of requirement.verifiedBy) {
			tracedIds.add(id);

			if (!itemsById.has(id)) {
				problems.push(
					`DANGLING ${requirement.id} cites ${id}, which is not in the plan.`,
				);
			}
		}
	}

	const traced = items.filter((item) => tracedIds.has(item.id)).length;
	const tracedPercent = items.length ? (traced / items.length) * 100 : 100;
	const covered = items.filter((item) => item.status === 'covered').length;

	summary.push(
		'',
		`${items.length} plan items, ${covered} covered by a test, ` +
			`${traced} (${tracedPercent.toFixed(0)}%) traced to one of ` +
			`${requirements.length} requirements.`,
	);

	return {problems, summary, tracedPercent};
}

function main(): number {
	const minTracedIndex = process.argv.indexOf('--min-traced');
	const minTraced =
		minTracedIndex === -1 ? 0 : Number(process.argv[minTracedIndex + 1]);

	const report = checkPlan();

	console.log(
		'plan:check — does the plan cover the code, and do the tests and specs agree?\n',
	);

	for (const line of report.summary) {
		console.log(`  ${line}`);
	}

	if (report.tracedPercent < minTraced) {
		report.problems.push(
			`TRACE ${report.tracedPercent.toFixed(0)}% of plan items trace to a requirement, below the ${minTraced}% floor.`,
		);
	}

	if (report.problems.length) {
		console.log('');

		for (const problem of report.problems) {
			console.log(`  ✗ ${problem}`);
		}

		console.log(`\nFAIL — ${report.problems.length} problem(s).`);

		return 1;
	}

	console.log('\nOK');

	return 0;
}

if (import.meta.main) {
	process.exit(main());
}
