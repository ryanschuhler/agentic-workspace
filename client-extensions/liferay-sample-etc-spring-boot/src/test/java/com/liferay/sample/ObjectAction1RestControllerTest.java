/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.sample;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Plan: REST-POST-OBJECT-ACTION-1
 *
 * @author Ryan Schuhler
 */
public class ObjectAction1RestControllerTest {

	@Test
	public void testPostEchoesThePayload() {
		ObjectAction1RestController objectAction1RestController =
			new ObjectAction1RestController();

		String json = "{\"objectEntry\":{\"id\":1}}";

		ResponseEntity<String> responseEntity =
			objectAction1RestController.post(Mockito.mock(Jwt.class), json);

		Assertions.assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
		Assertions.assertEquals(json, responseEntity.getBody());
	}

}
