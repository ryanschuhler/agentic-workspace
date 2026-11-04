/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {render, screen} from '@testing-library/react';
import React from 'react';
import {describe, expect, it} from 'vitest';

import DadJoke from './DadJoke.js';

describe('MOD-DAD-JOKE', () => {
	it('shows a loading state, then the joke from the sidecar', async () => {
		render(<DadJoke />);

		expect(screen.getByText('Loading...')).toBeDefined();
		expect(await screen.findByText('A joke')).toBeDefined();
	});
});
