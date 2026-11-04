/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {spawnSync} from 'node:child_process';
import path from 'node:path';

import {readInput} from './hookIO.ts';

const LINTABLE = /\.(js|json|ts)$/;

if (import.meta.main) {
	const filePath = readInput().tool_input.file_path ?? '';
	const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

	if (LINTABLE.test(filePath)) {
		const result = spawnSync(
			path.join(root, 'node_modules', '.bin', 'eslint'),
			['--no-warn-ignored', filePath],
			{cwd: root, encoding: 'utf8'},
		);

		if (result.status) {
			process.stderr.write(
				`ESLint found problems in ${filePath}. Fix them now:\n${result.stdout}`,
			);
			process.exit(2);
		}
	}
}
