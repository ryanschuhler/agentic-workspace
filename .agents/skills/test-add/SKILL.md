---
name: test-add
description: Add a test at the right tier (Vitest, JUnit, Playwright integration, or Playwright e2e) for a route, module, endpoint, object, or flow, cite its plan ID, and mark the plan row covered. Use when the user asks to write, add, or scaffold a test.
---

# Add a Test

## Procedure

1. Find the plan row. Run `yarn plan:check`. When the code has no row, run `yarn plan:scaffold` and replace the TODO with the behavior that the test must prove.

1. Pick the tier with the table in `.agents/rules/testing.md`. Use the fastest tier that can prove the behavior.

1. Copy the pattern of a test at that tier:

	| Tier | Pattern |
	| --- | --- |
	| Vitest | `client-extensions/liferay-sample-custom-element-2/src/common/services/liferay/api.test.js` |
	| JUnit | `client-extensions/liferay-sample-etc-spring-boot/src/test/java/com/liferay/sample/ObjectValidationRule1RestControllerTest.java` |
	| Integration | `tests/integration/sample-object.spec.ts` |
	| E2e | `tests/e2e/sample-site.spec.ts` |

1. Name the plan ID in the `describe` title, or in a `Plan:` line of the Javadoc for JUnit.

1. Run the test. Then break the code on purpose and run it again. A test that still passes proves nothing.

1. Change the Status of the plan row to `covered`.

1. Run `yarn plan:check`.

1. Commit the test apart from the code, titled for the behavior it proves: `EXAMPLE-12 Test that a Sample entry named Invalid Name is refused`.
