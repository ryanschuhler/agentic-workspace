/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import type {Action, Health} from './collect.ts';

export type KnownDefects = Record<string, {note: string; ticket: string}>;

const PARTS: {description: string; key: Action['part']; title: string}[] = [
	{
		description:
			'Skills and their descriptions. The agent picks a skill by its description.',
		key: 'tools',
		title: 'Tools',
	},
	{
		description:
			'Rules, specs, and the plan. What the agent knows, and whether it is still true.',
		key: 'context',
		title: 'Context',
	},
	{
		description:
			'The client extensions that build the environment, and the references between them.',
		key: 'sandbox',
		title: 'Sandbox',
	},
	{
		description:
			'Tests at every tier and the plan that ties them to requirements.',
		key: 'guardrails',
		title: 'Guardrails',
	},
];

function escape(value: unknown): string {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function table(headers: string[], rows: unknown[][]): string {
	if (!rows.length) {
		return '<p class="empty">Nothing here.</p>';
	}

	return `<table><thead><tr>${headers.map((header) => `<th>${escape(header)}</th>`).join('')}</tr></thead><tbody>${rows
		.map(
			(row) =>
				`<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`,
		)
		.join('')}</tbody></table>`;
}

function actionRows(actions: Action[], knownDefects: KnownDefects): string[][] {
	return actions.map((action) => [
		`<span class="severity ${action.severity}">${action.severity}</span>`,
		`${escape(action.title)}<div class="fix">${escape(action.fix)}</div>`,
		knownDefects[action.id]
			? `<code>${escape(knownDefects[action.id].ticket)}</code>`
			: '<span class="untracked">untracked</span>',
	]);
}

function partPanel(
	health: Health,
	knownDefects: KnownDefects,
	part: (typeof PARTS)[number],
): string {
	const actions = health.actions.filter((action) => action.part === part.key);
	let detail = '';

	if (part.key === 'tools') {
		detail = table(
			['Skill', 'Description'],
			health.skills.map((skill) => [
				`<code>/${escape(skill.name)}</code>`,
				escape(skill.description),
			]),
		);
	} else if (part.key === 'context') {
		detail = table(
			['Rule', 'Loads For', 'Verified On'],
			health.rules.map((rule) => [
				`<code>${escape(rule.file)}</code><div class="fix">${escape(rule.description)}</div>`,
				rule.paths.length
					? `${rule.paths.map((pattern) => `<code>${escape(pattern)}</code>`).join('<br>')}<div class="fix">${rule.matchedFiles} files</div>`
					: 'Every session',
				escape(rule.verifiedOn ?? '—'),
			]),
		);
	} else if (part.key === 'sandbox') {
		detail = table(
			['Project', 'Entry', 'Type'],
			health.clientExtensions.map((entry) => [
				`<code>${escape(entry.project)}</code>`,
				`<code>${escape(entry.key)}</code>`,
				escape(entry.type),
			]),
		);
	} else {
		detail = table(
			['Measure', 'Value'],
			Object.entries(health.counts).map(([key, value]) => [
				escape(key),
				escape(value),
			]),
		);
	}

	return `<section id="${part.key}" class="panel" hidden>
<p class="lead">${escape(part.description)}</p>
<h2>Actions</h2>
${table(['Severity', 'Action', 'Ticket'], actionRows(actions, knownDefects))}
<h2>Inventory</h2>
${detail}
</section>`;
}

export function render(
	health: Health,
	knownDefects: KnownDefects,
	generatedAt: string,
): string {
	const untracked = health.actions.filter(
		(action) => !knownDefects[action.id],
	);

	const tiles = Object.entries(health.counts)
		.map(
			([key, value]) =>
				`<div class="tile"><div class="value">${escape(value)}</div><div class="label">${escape(key)}</div></div>`,
		)
		.join('');

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Workspace Health</title>
<style>
:root {
	--background: #fbfbfa;
	--border: #e3e2de;
	--high: #c4302b;
	--low: #6b6a66;
	--medium: #b26b00;
	--muted: #6b6a66;
	--surface: #ffffff;
	--text: #1d1d1b;
	--accent: #0b5fff;
}
@media (prefers-color-scheme: dark) {
	:root:not([data-theme="light"]) {
		--background: #161615;
		--border: #33332f;
		--high: #ff6b63;
		--low: #a3a29d;
		--medium: #f0a83a;
		--muted: #a3a29d;
		--surface: #1f1f1d;
		--text: #ecebe7;
		--accent: #6b9bff;
	}
}
body { background: var(--background); color: var(--text); font: 15px/1.5 system-ui, sans-serif; margin: 0; padding: 24px 16px; }
main { margin: 0 auto; max-width: 1100px; }
h1 { font-size: 24px; margin: 0; }
h2 { font-size: 16px; margin: 24px 0 8px; }
code { font-size: 13px; }
nav { border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 4px; margin: 20px 0; }
nav button { background: none; border: 0; border-bottom: 2px solid transparent; color: var(--muted); cursor: pointer; font: inherit; padding: 8px 12px; }
nav button[aria-selected="true"] { border-color: var(--accent); color: var(--text); }
table { border-collapse: collapse; width: 100%; }
th, td { border-bottom: 1px solid var(--border); padding: 8px; text-align: left; vertical-align: top; }
th { color: var(--muted); font-size: 13px; font-weight: 600; }
.empty, .fix, .meta, .lead { color: var(--muted); }
.fix { font-size: 13px; }
.severity { font-size: 12px; font-weight: 600; text-transform: uppercase; }
.severity.high { color: var(--high); }
.severity.medium { color: var(--medium); }
.severity.low { color: var(--low); }
.tiles { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.tile { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
.tile .value { font-size: 24px; font-weight: 600; }
.tile .label { color: var(--muted); font-size: 13px; }
.untracked { color: var(--high); font-weight: 600; }
@media (max-width: 640px) { table { display: block; overflow-x: auto; } }
</style>
</head>
<body>
<main>
<h1>Workspace Health</h1>
<p class="meta">Built from the source by <code>yarn health</code> at ${escape(generatedAt)}. <code>yarn health:check</code> fails when an action is untracked, or a known defect is resolved but still listed.</p>
<nav role="tablist">
<button role="tab" data-panel="overview">Overview</button>
${PARTS.map((part) => `<button role="tab" data-panel="${part.key}">${part.title} (${health.actions.filter((action) => action.part === part.key).length})</button>`).join('\n')}
</nav>
<section id="overview" class="panel">
<div class="tiles">${tiles}</div>
<h2>Triage Queue</h2>
<p class="lead">Actions that no ticket tracks. Fix each one, or record its ticket in <code>tools/health/known-defects.json</code>.</p>
${table(['Severity', 'Action', 'Ticket'], actionRows(untracked, knownDefects))}
</section>
${PARTS.map((part) => partPanel(health, knownDefects, part)).join('\n')}
</main>
<script>
const buttons = document.querySelectorAll('nav button');
function show(id) {
	for (const button of buttons) {
		button.setAttribute('aria-selected', String(button.dataset.panel === id));
	}
	for (const panel of document.querySelectorAll('.panel')) {
		panel.hidden = panel.id !== id;
	}
	history.replaceState(null, '', '#' + id);
}
for (const button of buttons) {
	button.addEventListener('click', () => show(button.dataset.panel));
}
show(location.hash.slice(1) || 'overview');
</script>
</body>
</html>
`;
}
