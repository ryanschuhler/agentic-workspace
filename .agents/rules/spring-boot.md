---
description: Controller, security, and test rules for the Spring Boot sidecar.
paths:
    - "client-extensions/liferay-sample-etc-spring-boot/**"
---

# Spring Boot Sidecar

Verified on 2026-11-04 against Spring Boot 3.3 and `com.liferay.client.extension.util.spring.boot3`.

## Controllers

- One controller per resource path. The class extends `BaseRestController` and carries `@RequestMapping("<resourcePath>")`.
- The `resourcePath` of each `objectAction`, `objectValidationRule`, `objectEntryManager`, `notificationType`, and `workflowAction` entry in `client-extension.yaml` must match a controller. `yarn health:check` fails when one does not.
- Every endpoint takes `@AuthenticationPrincipal Jwt jwt`. Only the paths in `liferay.oauth.urls.excludes` are open. Today that is `/ready` and nothing else.

## Shared State

A controller is a singleton. Do not keep request data in a field. Two requests at the same time see each other's values.

## Tests

- Each controller has a JUnit test in `src/test/java`, named `<Controller>Test`. Call the controller directly with `Mockito.mock(Jwt.class)`. Do not start a Spring context for a unit test.
- The Javadoc of the test class names the plan ID: `Plan: REST-GET-READY`.
- Run them with `yarn test:java`. The build needs JDK 21; `mise install` provides it.
