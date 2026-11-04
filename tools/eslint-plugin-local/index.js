/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import filenameMatchesDefaultExport from './rules/filenameMatchesDefaultExport.js';
import logMessageForm from './rules/logMessageForm.js';
import noComments from './rules/noComments.js';
import testCitesPlanId from './rules/testCitesPlanId.js';

const plugin = {
	meta: {
		name: 'eslint-plugin-local',
	},
	rules: {
		'filename-matches-default-export': filenameMatchesDefaultExport,
		'log-message-form': logMessageForm,
		'no-comments': noComments,
		'test-cites-plan-id': testCitesPlanId,
	},
};

export default plugin;
