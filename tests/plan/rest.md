# Endpoints

Every endpoint of the Spring Boot sidecar. A JUnit test calls the controller directly with a mocked JWT. An integration test calls the running sidecar.

> `yarn plan:scaffold` adds a row for each endpoint that has none. The IDs of the object entry manager rows are shortened by hand; the Source column keeps the full path.

| ID | Requirement | Type | Priority | Status | Source |
| --- | --- | --- | --- | --- | --- |
| REST-DELETE-ENTRY-MANAGER-1 | Deletes one entry of the external store by its external reference code | junit | P2 | planned | `rest:DELETE /object/entry/manager/1/{objectDefinitionExternalReferenceCode}/{externalReferenceCode}` |
| REST-GET-DAD-JOKE | Returns a plain text joke to a caller with a valid JWT | junit | P2 | planned | `rest:GET /dad/joke` |
| REST-GET-ENTRY-MANAGER-1 | Returns one entry of the external store by its external reference code | junit | P2 | planned | `rest:GET /object/entry/manager/1/{objectDefinitionExternalReferenceCode}/{externalReferenceCode}` |
| REST-GET-ENTRY-MANAGER-1-PAGE | Returns a page of entries of the external store | junit | P2 | planned | `rest:GET /object/entry/manager/1/{objectDefinitionExternalReferenceCode}` |
| REST-GET-READY | Returns READY without authentication, so the probe and the deploy script can wait on it | junit | P0 | covered | `rest:GET /ready` |
| REST-POST-ENTRY-MANAGER-1 | Adds an entry to the external store | junit | P2 | planned | `rest:POST /object/entry/manager/1/{objectDefinitionExternalReferenceCode}` |
| REST-POST-NOTIFICATION-TYPE-1 | Accepts a notification payload and logs it | junit | P2 | planned | `rest:POST /notification/type/1` |
| REST-POST-OBJECT-ACTION-1 | Accepts the object entry payload of an object action and returns it | junit | P1 | covered | `rest:POST /object/action/1` |
| REST-POST-OBJECT-ACTION-2 | Accepts the object entry payload of an object action and returns it | junit | P2 | planned | `rest:POST /object/action/2` |
| REST-POST-OBJECT-VALIDATION-RULE-1 | Rejects an entry named "Invalid Name" and accepts every other name | junit | P0 | covered | `rest:POST /object/validation/rule/1` |
| REST-POST-WORKFLOW-ACTION-1 | Approves the workflow task by posting to its transition URL | junit | P1 | planned | `rest:POST /workflow/action/1` |
| REST-PUT-ENTRY-MANAGER-1 | Replaces one entry of the external store | junit | P2 | planned | `rest:PUT /object/entry/manager/1/{objectDefinitionExternalReferenceCode}/{externalReferenceCode}` |
