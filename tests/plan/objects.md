# Objects

Every object definition in the batch client extension. An integration test reads the definition from the running portal over `object-admin`, so it proves what the batch import produced, not what the JSON says.

> `yarn plan:scaffold` adds a row for each object that has none.

| ID | Requirement | Type | Priority | Status | Source |
| --- | --- | --- | --- | --- | --- |
| OBJECT-SAMPLE | The batch import publishes the Sample object with its `field1` text field | integration | P1 | covered | `object:Sample` |
