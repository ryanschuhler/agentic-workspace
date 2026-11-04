/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import path from 'node:path';

import {deny, readInput} from './hookIO.ts';

const PROTECTED: {pattern: RegExp; reason: string}[] = [
	{
		pattern: /(^|\/)\.env(\.local)?$/,
		reason: 'The .env file holds secrets and the ports of this worktree. Ask the user to change it.',
	},
	{
		pattern: /(^|\/)(build|dist|node_modules)\//,
		reason: 'This file is generated. Edit the source and rebuild.',
	},
	{
		pattern: /(^|\/)yarn\.lock$/,
		reason: 'Change dependencies with yarn add or yarn remove, not by hand.',
	},
];

export function findProtection(filePath: string): string | undefined {
	const relativePath = path.relative(
		process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
		filePath,
	);

	return PROTECTED.find((rule) => rule.pattern.test(relativePath))?.reason;
}

if (import.meta.main) {
	const reason = findProtection(readInput().tool_input.file_path ?? '');

	if (reason) {
		deny(reason);
	}
}
