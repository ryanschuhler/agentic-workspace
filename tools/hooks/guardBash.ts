/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {deny, readInput} from './hookIO.ts';

const GUARDS: {pattern: RegExp; reason: string}[] = [
	{
		pattern:
			/\bgit\s+stash(\s*$|\s*[;&|]|\s+(pop|apply|drop|clear)\b(?!\s+[0-9a-f]{7,}))/,
		reason: 'Every worktree shares one stash stack, so a bare git stash can pop the changes of another session. Make a WIP commit instead, or use git stash push -m <tag> and apply it by SHA.',
	},
	{
		pattern: /\bgit\s+add\s+(-A\b|--all\b|\.(\s|$))/,
		reason: 'Stage files by name. The working tree can hold edits that belong to another commit, and tests go in their own commit.',
	},
	{
		pattern: /--no-verify\b/,
		reason: 'The git hooks are guardrails. Fix what they report instead of skipping them.',
	},
	{
		pattern: /\bgit\s+push\b.*(--force\b|-f\b).*\b(main|master)\b/,
		reason: 'Never force push the main branch.',
	},
	{
		pattern: /\bdocker\s+compose\b.*\bdown\b.*(-v\b|--volumes\b)/,
		reason: 'Data loss. This deletes the database volume. Run scripts/env.sh reset, which asks first, or ask the user.',
	},
];

export function findViolation(command: string): string | undefined {
	return GUARDS.find((guard) => guard.pattern.test(command))?.reason;
}

if (import.meta.main) {
	const reason = findViolation(readInput().tool_input.command ?? '');

	if (reason) {
		deny(reason);
	}
}
