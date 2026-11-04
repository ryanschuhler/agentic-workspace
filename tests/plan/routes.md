# Routes

Each directory under `src/routes` of the custom element is one route, selected by the `route` attribute of the host element. A unit test renders the page of the route.

> `yarn plan:scaffold` adds a row for each route that has none.

| ID | Requirement | Type | Priority | Status | Source |
| --- | --- | --- | --- | --- | --- |
| ROUTE-HELLO-BAR | The `hello-bar` route renders the Hello Bar heading | unit | P2 | covered | `route:hello-bar` |
| ROUTE-HELLO-FOO | The `hello-foo` route renders the Hello Foo heading | unit | P2 | planned | `route:hello-foo` |
| ROUTE-HELLO-WORLD | The default route greets the world, and replaces "World" with the given name of a signed in user | unit | P1 | covered | `route:hello-world` |
