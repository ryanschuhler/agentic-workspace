---
description: Structure, data access, and safety rules for the React custom element.
paths:
    - "client-extensions/liferay-sample-custom-element-2/**"
---

# Custom Element

Verified on 2026-11-04 against `liferay-sample-custom-element-2`.

## Structure

- A route is a directory under `src/routes/<route-name>/` with `pages/` and `components/`. The `route` attribute of the host element selects it. `yarn plan:check` finds a new route directory and asks for a plan row.
- Shared code lives under `src/common/`: `components/` for React components, `services/` for calls to the portal.
- A PascalCase file default exports a value of the same name (`local/filename-matches-default-export`).

## Calling the Portal

- Call the portal through `src/common/services/liferay/api.js`. It adds the CSRF token. A bare `fetch` to `/o/...` from the browser has no token, and the portal refuses a write.
- Call the sidecar through `Liferay.OAuth2Client.FromUserAgentApplication('<erc>')`. The ERC must name an `oAuthApplicationUserAgent` entry in a `client-extension.yaml`, or `yarn health:check` reports it.
- Never put a secret in the bundle. Everything in the custom element is public.

## Tests

A component or page has a Vitest file beside it, `<Name>.test.js`. Its `describe` title is the plan ID, for example `describe('ROUTE-HELLO-WORLD', ...)`.
