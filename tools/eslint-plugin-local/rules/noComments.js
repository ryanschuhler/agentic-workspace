/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

function isAllowed(comment) {
	const value = comment.value.trim();

	return (
		(comment.type === 'Block' && value.includes('SPDX-FileCopyrightText')) ||
		value.startsWith('eslint-') ||
		value.startsWith('global ')
	);
}

export default {
	create(context) {
		const sourceCode = context.sourceCode;

		return {
			Program() {
				for (const comment of sourceCode.getAllComments()) {
					if (isAllowed(comment)) {
						continue;
					}

					context.report({
						loc: comment.loc,
						messageId: 'unexpectedComment',
					});
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				'Disallow comments other than the SPDX header and ESLint directives. Name the code instead.',
		},
		messages: {
			unexpectedComment:
				'Unexpected comment. Rename the variable or extract a function so the code says it (.agents/rules/code-style.md).',
		},
		schema: [],
		type: 'suggestion',
	},
};
