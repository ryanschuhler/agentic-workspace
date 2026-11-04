/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import path from 'node:path';

function getDeclaredName(declaration) {
	if (
		declaration.type === 'FunctionDeclaration' ||
		declaration.type === 'ClassDeclaration'
	) {
		return declaration.id?.name;
	}

	if (declaration.type === 'Identifier') {
		return declaration.name;
	}

	return undefined;
}

export default {
	create(context) {
		const basename = path
			.basename(context.filename)
			.replace(/\.(test\.)?[jt]sx?$/, '');

		if (!/^[A-Z]/.test(basename) || context.filename.includes('.test.')) {
			return {};
		}

		return {
			ExportDefaultDeclaration(node) {
				const name = getDeclaredName(node.declaration);

				if (name && name !== basename) {
					context.report({
						data: {basename, name},
						messageId: 'mismatch',
						node,
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				'A PascalCase file default exports a value with the same name.',
		},
		messages: {
			mismatch:
				'The file {{basename}} default exports {{name}}. Rename one of them so they match.',
		},
		schema: [],
		type: 'problem',
	},
};
