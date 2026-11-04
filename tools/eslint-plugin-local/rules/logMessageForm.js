/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const LOG_METHODS = new Set(['debug', 'error', 'info', 'log', 'warn']);

function getMessageText(node) {
	if (node?.type === 'Literal' && typeof node.value === 'string') {
		return node.value;
	}

	if (node?.type === 'TemplateLiteral') {
		return node.quasis.map((quasi) => quasi.value.cooked).join('');
	}

	if (node?.type === 'BinaryExpression' && node.operator === '+') {
		const left = getMessageText(node.left);
		const right = getMessageText(node.right);

		if (left === undefined && right === undefined) {
			return undefined;
		}

		return (left ?? ' ') + (right ?? ' ');
	}

	return undefined;
}

function check(context, node, messageNode) {
	const text = getMessageText(messageNode);

	if (text === undefined) {
		return;
	}

	if (/^(error|failed|failure)\b/i.test(text)) {
		context.report({messageId: 'unableTo', node: messageNode});
	}
	else if (/\w: |\w=\S/.test(text)) {
		context.report({messageId: 'labelPunctuation', node: messageNode});
	}
}

export default {
	create(context) {
		return {
			CallExpression(node) {
				const callee = node.callee;

				if (
					callee.type === 'MemberExpression' &&
					callee.object.name === 'console' &&
					LOG_METHODS.has(callee.property.name)
				) {
					check(context, node, node.arguments[0]);
				}
			},
			NewExpression(node) {
				if (node.callee.name === 'Error') {
					check(context, node, node.arguments[0]);
				}
			},
		};
	},
	meta: {
		docs: {
			description:
				'Log and error messages are prose: "Unable to <verb>", with no label punctuation.',
		},
		messages: {
			labelPunctuation:
				'Write the message as prose, not as "label: value" or "key=value" (.agents/rules/code-style.md).',
			unableTo:
				'Start the message with "Unable to <verb>", not "Error" or "Failed" (.agents/rules/code-style.md).',
		},
		schema: [],
		type: 'suggestion',
	},
};
