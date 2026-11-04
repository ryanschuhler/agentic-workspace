/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.sample;

import org.json.JSONObject;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import org.mockito.Mockito;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Plan: REST-POST-OBJECT-VALIDATION-RULE-1
 *
 * @author Ryan Schuhler
 */
public class ObjectValidationRule1RestControllerTest {

	@Test
	public void testPostRejectsInvalidName() {
		JSONObject jsonObject = _post("Invalid Name");

		Assertions.assertFalse(jsonObject.getBoolean("validationCriteriaMet"));
	}

	@Test
	public void testPostAcceptsOtherNames() {
		JSONObject jsonObject = _post("Ada Lovelace");

		Assertions.assertTrue(jsonObject.getBoolean("validationCriteriaMet"));
	}

	private JSONObject _post(String name) {
		ObjectValidationRule1RestController
			objectValidationRule1RestController =
				new ObjectValidationRule1RestController();

		ResponseEntity<String> responseEntity =
			objectValidationRule1RestController.post(
				Mockito.mock(Jwt.class),
				new JSONObject(
				).put(
					"name", name
				).toString());

		Assertions.assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

		return new JSONObject(responseEntity.getBody());
	}

}
