/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.sample;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

/**
 * Plan: REST-GET-READY
 *
 * @author Ryan Schuhler
 */
public class ReadyRestControllerTest {

	@Test
	public void testGetReturnsReady() {
		ReadyRestController readyRestController = new ReadyRestController();

		Assertions.assertEquals("READY", readyRestController.get());
	}

}
