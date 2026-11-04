/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'node:fs';

export type HookInput = {
	tool_input: {command?: string; file_path?: string};
	tool_name: string;
};

export function readInput(): HookInput {
	return JSON.parse(fs.readFileSync(0, 'utf8'));
}

export function deny(reason: string): void {
	process.stdout.write(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PreToolUse',
				permissionDecision: 'deny',
				permissionDecisionReason: reason,
			},
		}),
	);
}
