/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {render, screen} from '@testing-library/react';
import React from 'react';
import {describe, expect, it} from 'vitest';

import HelloWorld from './HelloWorld.js';

describe('ROUTE-HELLO-WORLD', () => {
	it('greets the world until the user name is known', () => {
		render(<HelloWorld />);

		expect(screen.getByRole('heading').textContent).toBe('Hello World');
	});
});
