/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';

import {checkPlan} from '../plan/check.ts';
import {
	ROOT,
	enumerateEndpoints,
	findTestCitations,
	parsePlan,
	parseRequirements,
	walk,
} from '../plan/lib.ts';

export type Action = {
	fix: string;
	id: string;
	part: 'context' | 'guardrails' | 'sandbox' | 'tools';
	severity: 'high' | 'low' | 'medium';
	title: string;
};

export type ClientExtensionEntry = {
	key: string;
	project: string;
	resourcePath?: string;
	type: string;
};

export type Rule = {
	description: string;
	file: string;
	matchedFiles: number;
	paths: string[];
	verifiedOn?: string;
};

export type Skill = {
	description: string;
	name: string;
};

export type Health = {
	actions: Action[];
	clientExtensions: ClientExtensionEntry[];
	counts: Record<string, number>;
	rules: Rule[];
	skills: Skill[];
};

const MICROSERVICE_TYPES = new Set([
	'notificationType',
	'objectAction',
	'objectEntryManager',
	'objectValidationRule',
	'workflowAction',
]);

function readFrontmatter(file: string): Record<string, unknown> {
	const match = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);

	return match ? (parse(match[1]) ?? {}) : {};
}

export function collectClientExtensions(root: string): ClientExtensionEntry[] {
	return walk('client-extensions', root)
		.filter((file) => file.endsWith('/client-extension.yaml'))
		.flatMap((file) => {
			const data = parse(fs.readFileSync(path.join(root, file), 'utf8'));

			return Object.entries(data)
				.filter(([key]) => key !== 'assemble')
				.map(([key, value]) => ({
					key,
					project: path.basename(path.dirname(file)),
					resourcePath: (value as {resourcePath?: string})
						.resourcePath,
					type: (value as {type: string}).type,
				}));
		});
}

export function collectRules(root: string): Rule[] {
	return walk('.agents/rules', root)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const frontmatter = readFrontmatter(path.join(root, file));
			const paths = (frontmatter.paths as string[] | undefined) ?? [];

			return {
				description: String(frontmatter.description ?? ''),
				file,
				matchedFiles: paths.length
					? paths.flatMap((pattern) =>
							fs.globSync(pattern, {
								cwd: root,
								exclude: (name) => name === 'node_modules',
							}),
						).length
					: -1,
				paths,
				verifiedOn: fs
					.readFileSync(path.join(root, file), 'utf8')
					.match(/Verified on (.+?)\.(?:\s|$)/)?.[1],
			};
		});
}

export function collectSkills(root: string): Skill[] {
	return walk('.agents/skills', root)
		.filter((file) => file.endsWith('/SKILL.md'))
		.map((file) => {
			const frontmatter = readFrontmatter(path.join(root, file));

			return {
				description: String(frontmatter.description ?? ''),
				directory: path.basename(path.dirname(file)),
				name: String(frontmatter.name ?? ''),
			};
		})
		.map(({description, directory, name}) => ({
			description,
			name: name === directory ? name : `${directory} (named ${name})`,
		}));
}

function collectObjectActions(
	root: string,
): {action: string; executor: string; object: string}[] {
	return walk('client-extensions', root)
		.filter((file) => file.endsWith('.batch-engine-data.json'))
		.flatMap((file) => {
			const data = JSON.parse(
				fs.readFileSync(path.join(root, file), 'utf8'),
			);

			return (data.items ?? []).flatMap(
				(item: {
					name: string;
					objectActions?: {
						name: string;
						objectActionExecutorKey: string;
					}[];
				}) =>
					(item.objectActions ?? []).map((objectAction) => ({
						action: objectAction.name,
						executor: objectAction.objectActionExecutorKey,
						object: item.name,
					})),
			);
		});
}

function collectOAuth2References(root: string): string[] {
	return [
		...new Set(
			walk('client-extensions', root)
				.filter((file) => /\.(js|ts|tsx)$/.test(file))
				.flatMap((file) => [
					...fs
						.readFileSync(path.join(root, file), 'utf8')
						.matchAll(/FromUserAgentApplication\(\s*'([^']+)'/g),
				])
				.map((match) => match[1]),
		),
	].sort();
}

export function collect(root: string = ROOT): Health {
	const actions: Action[] = [];
	const clientExtensions = collectClientExtensions(root);
	const keys = new Set(clientExtensions.map((entry) => entry.key));

	for (const objectAction of collectObjectActions(root)) {
		const [executorType, key] = objectAction.executor.split('#');

		if (executorType === 'function' && !keys.has(key)) {
			actions.push({
				fix: `Add the ${key} client extension, or point the action at a handler that exists.`,
				id: `object-action-no-handler:${objectAction.object}/${objectAction.action}`,
				part: 'sandbox',
				severity: 'high',
				title: `The ${objectAction.object} object action ${objectAction.action} calls ${key}, which no client extension in this workspace defines.`,
			});
		}
	}

	for (const reference of collectOAuth2References(root)) {
		if (!keys.has(reference)) {
			actions.push({
				fix: `Define the ${reference} OAuth2 application, or remove the call.`,
				id: `oauth2-application-missing:${reference}`,
				part: 'sandbox',
				severity: 'medium',
				title: `Frontend code asks for the OAuth2 application ${reference}, which no client extension defines.`,
			});
		}
	}

	const endpoints = enumerateEndpoints(root).map((anchor) =>
		anchor.slice(anchor.indexOf(' ') + 1),
	);

	for (const entry of clientExtensions) {
		if (
			MICROSERVICE_TYPES.has(entry.type) &&
			entry.resourcePath &&
			!endpoints.some((endpoint) =>
				endpoint.startsWith(entry.resourcePath!),
			)
		) {
			actions.push({
				fix: `Add a controller for ${entry.resourcePath}, or fix the resourcePath.`,
				id: `endpoint-missing:${entry.key}`,
				part: 'sandbox',
				severity: 'high',
				title: `The ${entry.type} ${entry.key} points at ${entry.resourcePath}, which no controller serves.`,
			});
		}
	}

	const rules = collectRules(root);

	for (const rule of rules) {
		if (rule.matchedFiles === 0) {
			actions.push({
				fix: 'Update the paths in its frontmatter, or delete the rule.',
				id: `rule-stale-paths:${rule.file}`,
				part: 'context',
				severity: 'medium',
				title: `${rule.file} is scoped to paths that match no file, so it never loads.`,
			});
		}

		if (!rule.verifiedOn) {
			actions.push({
				fix: 'Check the rule against the code and add a "Verified on <date or release>." line.',
				id: `rule-unverified:${rule.file}`,
				part: 'context',
				severity: 'low',
				title: `${rule.file} does not say when it was last verified.`,
			});
		}
	}

	const skills = collectSkills(root);

	for (const skill of skills) {
		if (skill.name.includes('(named')) {
			actions.push({
				fix: 'Make the name in the frontmatter match the directory.',
				id: `skill-name-mismatch:${skill.name}`,
				part: 'tools',
				severity: 'medium',
				title: `The skill ${skill.name} has a name that differs from its directory.`,
			});
		}

		if (skill.description.length < 60) {
			actions.push({
				fix: 'Say what the skill does and when to use it. The agent picks a skill by its description.',
				id: `skill-thin-description:${skill.name}`,
				part: 'tools',
				severity: 'medium',
				title: `The skill ${skill.name} has a description too short for an agent to pick it.`,
			});
		}
	}

	for (const problem of checkPlan(root).problems) {
		actions.push({
			fix: 'Run yarn plan:check for the details.',
			id: `plan:${problem}`,
			part: 'guardrails',
			severity: 'medium',
			title: problem,
		});
	}

	const citations = findTestCitations(root);
	const planItems = parsePlan(root);

	return {
		actions: actions.sort((a, b) => a.id.localeCompare(b.id)),
		clientExtensions,
		counts: {
			'Client extension entries': clientExtensions.length,
			'JUnit files': citations.filter((citation) =>
				citation.file.endsWith('.java'),
			).length,
			'Plan items': planItems.length,
			'Plan items covered': planItems.filter(
				(item) => item.status === 'covered',
			).length,
			'Playwright files': citations.filter((citation) =>
				citation.file.endsWith('.spec.ts'),
			).length,
			Requirements: parseRequirements(root).length,
			Rules: rules.length,
			Skills: skills.length,
			'Vitest files': citations.filter((citation) =>
				citation.file.endsWith('.test.js'),
			).length,
		},
		rules,
		skills,
	};
}
