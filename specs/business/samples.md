# Samples

This area covers the sample widget, the Sample object, and the logic that runs when a Sample entry changes.

The actors are a guest, a signed in user, and Liferay itself, which calls the sidecar when an object action or a validation rule runs.

## Widget

| ID | Requirement | Priority | Verified By |
| --- | --- | --- | --- |
| REQ-SAMPLE-001 | The widget greets a guest with "Hello World". It greets a signed in user by the given name of the user. | P1 | `ROUTE-HELLO-WORLD` |
| REQ-SAMPLE-002 | A page author can show a different greeting on a page through the `route` attribute of the widget. | P2 | `ROUTE-HELLO-BAR`, `ROUTE-HELLO-FOO` |
| REQ-SAMPLE-003 | Every call that the widget makes to the portal carries the CSRF token of the session. | P0 | `MOD-API` |
| REQ-SAMPLE-004 | A signed in user sees a joke that the sidecar supplies. The widget calls the sidecar through its OAuth2 user agent application, never with a stored secret. | P2 | `MOD-DAD-JOKE`, `REST-GET-DAD-JOKE` |

## Sample Object

| ID | Requirement | Priority | Verified By |
| --- | --- | --- | --- |
| REQ-SAMPLE-010 | Every environment has the Sample object with a `field1` text field. The batch client extension is the only writer of the definition. | P1 | `OBJECT-SAMPLE` |
| REQ-SAMPLE-011 | The system refuses a Sample entry named "Invalid Name". | P0 | `REST-POST-OBJECT-VALIDATION-RULE-1` |
| REQ-SAMPLE-012 | When a Sample entry changes, the sidecar receives the entry. | P1 | `REST-POST-OBJECT-ACTION-1`, `REST-POST-OBJECT-ACTION-2` |
