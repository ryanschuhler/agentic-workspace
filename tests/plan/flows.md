# Flows

Hand curated journeys that cross more than one client extension. No scanner finds them, so their Source is `spec:` and the requirement that asks for them.

| ID | Requirement | Type | Priority | Status | Source |
| --- | --- | --- | --- | --- | --- |
| FLOW-SAMPLE-SITE | A guest opens the Liferay Sample site that the site initializer creates, and the page loads with the global CSS applied | e2e | P1 | covered | `spec:REQ-SITE-001` |
| FLOW-SIDECAR-READY | The deployed Spring Boot sidecar answers its ready probe on port 58081 | integration | P0 | covered | `spec:REQ-PLATFORM-001` |
