/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');

const CUSTOM_ELEMENT_DIR =
	'client-extensions/liferay-sample-custom-element-2/src';
const SPRING_BOOT_DIR =
	'client-extensions/liferay-sample-etc-spring-boot/src/main/java';
const BATCH_DIR = 'client-extensions/liferay-sample-batch/batch';

export const PLAN_ID_PATTERN =
	/\b(?:FLOW|MOD|OBJECT|REST|ROUTE)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b/g;

export const SURFACE_PREFIXES = ['module', 'object', 'rest', 'route'];

export type PlanItem = {
	file: string;
	id: string;
	priority: string;
	requirement: string;
	source: string;
	status: string;
	type: string;
};

export type Requirement = {
	file: string;
	id: string;
	verifiedBy: string[];
};

export type SurfaceGroup = {
	anchors: string[];
	prefix: string;
	title: string;
};

export type TestCitation = {
	file: string;
	ids: string[];
};

export function walk(directory: string, root: string = ROOT): string[] {
	const absolute = path.join(root, directory);

	if (!fs.existsSync(absolute)) {
		return [];
	}

	return fs
		.readdirSync(absolute, {recursive: true, withFileTypes: true})
		.filter(
			(entry) =>
				entry.isFile() && !entry.parentPath.includes('node_modules'),
		)
		.map((entry) =>
			path.relative(root, path.join(entry.parentPath, entry.name)),
		)
		.sort();
}

export function toId(prefix: string, value: string): string {
	return [
		prefix,
		...value
			.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
			.split(/[^A-Za-z0-9]+/)
			.filter(Boolean),
	]
		.join('-')
		.toUpperCase();
}

export function enumerateRoutes(root: string = ROOT): string[] {
	const routesDirectory = path.join(root, CUSTOM_ELEMENT_DIR, 'routes');

	if (!fs.existsSync(routesDirectory)) {
		return [];
	}

	return fs
		.readdirSync(routesDirectory, {withFileTypes: true})
		.filter((entry) => entry.isDirectory())
		.map((entry) => `route:${entry.name}`)
		.sort();
}

export function enumerateModules(root: string = ROOT): string[] {
	return walk(path.join(CUSTOM_ELEMENT_DIR, 'common'), root)
		.filter((file) => /\.js$/.test(file) && !/\.test\.js$/.test(file))
		.map((file) => `module:${path.basename(file, '.js')}`)
		.sort();
}

export function enumerateEndpoints(root: string = ROOT): string[] {
	const anchors = [];

	for (const file of walk(SPRING_BOOT_DIR, root)) {
		if (!file.endsWith('RestController.java')) {
			continue;
		}

		const source = fs.readFileSync(path.join(root, file), 'utf8');
		const basePath =
			source.match(/@RequestMapping\("([^"]*)"\)/)?.[1] ?? '';

		for (const match of source.matchAll(
			/@(Delete|Get|Patch|Post|Put)Mapping(?:\(\s*"([^"]*)"\s*\))?/g,
		)) {
			anchors.push(
				`rest:${match[1].toUpperCase()} ${basePath}${match[2] ?? ''}`,
			);
		}
	}

	return anchors.sort();
}

export function enumerateObjects(root: string = ROOT): string[] {
	const anchors = [];

	for (const file of walk(BATCH_DIR, root)) {
		const data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

		if (
			data.configuration?.className ===
			'com.liferay.object.admin.rest.dto.v1_0.ObjectDefinition'
		) {
			for (const item of data.items) {
				anchors.push(`object:${item.name}`);
			}
		}
	}

	return anchors.sort();
}

export function enumerateSurface(root: string = ROOT): SurfaceGroup[] {
	return [
		{anchors: enumerateModules(root), prefix: 'module', title: 'Modules'},
		{anchors: enumerateObjects(root), prefix: 'object', title: 'Objects'},
		{anchors: enumerateEndpoints(root), prefix: 'rest', title: 'Endpoints'},
		{anchors: enumerateRoutes(root), prefix: 'route', title: 'Routes'},
	];
}

export function anchorToId(anchor: string): string {
	const [prefix, value] = [
		anchor.slice(0, anchor.indexOf(':')),
		anchor.slice(anchor.indexOf(':') + 1),
	];

	return toId(
		{module: 'MOD', object: 'OBJECT', rest: 'REST', route: 'ROUTE'}[
			prefix
		] ?? prefix,
		value,
	);
}

function parseTableRows(file: string, root: string): string[][] {
	return fs
		.readFileSync(path.join(root, file), 'utf8')
		.split('\n')
		.filter((line) => line.startsWith('|') && !/^\|\s*-/.test(line))
		.map((line) =>
			line
				.slice(1, -1)
				.split('|')
				.map((cell) => cell.trim()),
		)
		.filter((cells) => cells[0] !== 'ID');
}

export function parsePlan(root: string = ROOT): PlanItem[] {
	return walk('tests/plan', root)
		.filter((file) => file.endsWith('.md'))
		.flatMap((file) =>
			parseTableRows(file, root).map(
				([id, requirement, type, priority, status, source]) => ({
					file,
					id,
					priority,
					requirement,
					source: source.replace(/`/g, ''),
					status,
					type,
				}),
			),
		);
}

export function validatePlan(items: PlanItem[]): string[] {
	const errors = [];
	const seen = new Set<string>();

	for (const item of items) {
		if (seen.has(item.id)) {
			errors.push(`${item.id} appears twice in the plan`);
		}

		seen.add(item.id);

		if (!['e2e', 'integration', 'junit', 'unit'].includes(item.type)) {
			errors.push(`${item.id} has the unknown type "${item.type}"`);
		}

		if (!['P0', 'P1', 'P2'].includes(item.priority)) {
			errors.push(
				`${item.id} has the unknown priority "${item.priority}"`,
			);
		}

		if (!['covered', 'planned'].includes(item.status)) {
			errors.push(`${item.id} has the unknown status "${item.status}"`);
		}

		if (!item.requirement || item.requirement === 'TODO') {
			errors.push(`${item.id} has no requirement text`);
		}
	}

	return errors;
}

export function parseRequirements(root: string = ROOT): Requirement[] {
	return walk('specs', root)
		.filter((file) => file.endsWith('.md'))
		.flatMap((file) =>
			parseTableRows(file, root)
				.filter(([id]) => /^REQ-[A-Z]+-\d{3}$/.test(id))
				.map((cells) => ({
					file,
					id: cells[0],
					verifiedBy: [
						...cells[cells.length - 1].matchAll(PLAN_ID_PATTERN),
					].map((match) => match[0]),
				})),
		);
}

export function findTestCitations(root: string = ROOT): TestCitation[] {
	return [
		...walk('client-extensions', root).filter((file) =>
			/(\.test\.js|Test\.java)$/.test(file),
		),
		...walk('tests', root).filter((file) => file.endsWith('.spec.ts')),
	].map((file) => ({
		file,
		ids: [
			...new Set(
				[
					...fs
						.readFileSync(path.join(root, file), 'utf8')
						.matchAll(PLAN_ID_PATTERN),
				].map((match) => match[0]),
			),
		],
	}));
}
