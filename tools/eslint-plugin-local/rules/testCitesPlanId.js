/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const PLAN_ID_PATTERN =
	/\b(?:FLOW|MOD|OBJECT|REST|ROUTE)-[A-Z0-9]+(?:-[A-Z0-9]+)*\b/;

export default {
	create(context) {
		if (!/\.(test|spec)\.[jt]sx?$/.test(context.filename)) {
			return {};
		}

		return {
			Program(node) {
				if (!PLAN_ID_PATTERN.test(context.sourceCode.getText())) {
					context.report({messageId: 'missingPlanId', node});
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				'Every test file names the plan item it verifies, so plan:check can trace it to a requirement.',
		},
		messages: {
			missingPlanId:
				"Name the plan item this test verifies in a describe title, for example describe('ROUTE-HELLO-WORLD'). Find or add the row in tests/plan/.",
		},
		schema: [],
		type: 'problem',
	},
};
