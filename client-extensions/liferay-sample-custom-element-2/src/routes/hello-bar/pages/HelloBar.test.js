/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {render, screen} from '@testing-library/react';
import React from 'react';
import {describe, expect, it} from 'vitest';

import HelloBar from './HelloBar.js';

describe('ROUTE-HELLO-BAR', () => {
	it('renders the bar greeting', () => {
		render(<HelloBar />);

		expect(screen.getByRole('heading').textContent).toBe('Hello Bar');
	});
});
