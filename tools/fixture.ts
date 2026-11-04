/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function createFixture(files: Record<string, string>): string {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'workspace-'));

	for (const [file, content] of Object.entries(files)) {
		fs.mkdirSync(path.join(root, path.dirname(file)), {recursive: true});
		fs.writeFileSync(path.join(root, file), content);
	}

	return root;
}

const CUSTOM_ELEMENT = 'client-extensions/liferay-sample-custom-element-2/src';
const SPRING_BOOT =
	'client-extensions/liferay-sample-etc-spring-boot/src/main/java/com/liferay/sample';

export const BASE_FIXTURE: Record<string, string> = {
	[`${CUSTOM_ELEMENT}/common/services/api.js`]: 'export default 1;',
	[`${CUSTOM_ELEMENT}/routes/hello-world/pages/HelloWorld.js`]: '',
	[`${CUSTOM_ELEMENT}/routes/hello-world/pages/HelloWorld.test.js`]:
		"describe('ROUTE-HELLO-WORLD', () => {});",
	[`${SPRING_BOOT}/ReadyRestController.java`]:
		'@RequestMapping("/ready")\n@RestController\nclass A {\n\t@GetMapping\n\tString get() {}\n}',
	'specs/business/samples.md':
		'| ID | Requirement | Priority | Verified By |\n| --- | --- | --- | --- |\n| REQ-SAMPLE-001 | Greets. | P1 | `ROUTE-HELLO-WORLD` |\n',
	'tests/plan/plan.md':
		'| ID | Requirement | Type | Priority | Status | Source |\n| --- | --- | --- | --- | --- | --- |\n' +
		'| MOD-API | Calls the portal | unit | P1 | planned | `module:api` |\n' +
		'| REST-GET-READY | Answers READY | junit | P0 | planned | `rest:GET /ready` |\n' +
		'| ROUTE-HELLO-WORLD | Greets | unit | P1 | covered | `route:hello-world` |\n',
};
