# Modules

The shared components and services under `src/common` of the custom element. A unit test proves a module in isolation, with `fetch` and the OAuth2 client stubbed.

> `yarn plan:scaffold` adds a row for each module that has none. Edit the Requirement, Type, Priority, and Status columns freely. Do not change an ID: when the code moves, edit the Source so the row keeps its ID.

| ID | Requirement | Type | Priority | Status | Source |
| --- | --- | --- | --- | --- | --- |
| MOD-API | Resolves a relative path against the portal origin, sends the CSRF token, and lets the caller override the request options | unit | P0 | covered | `module:api` |
| MOD-COMIC | Shows a loading state, then the comic title and image from the Node sidecar | unit | P2 | planned | `module:Comic` |
| MOD-DAD-JOKE | Shows a loading state, then the joke that the Spring Boot sidecar returns through the OAuth2 user agent application | unit | P1 | covered | `module:DadJoke` |
| MOD-LIFERAY | Falls back to a signed out stub when the page has no global `Liferay` object, so the element renders outside the portal | unit | P2 | planned | `module:liferay` |
