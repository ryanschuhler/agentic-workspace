# Platform

This area covers the sidecar, the deployment, and the local environment.

## Sidecar

| ID | Requirement | Priority | Verified By |
| --- | --- | --- | --- |
| REQ-PLATFORM-001 | The sidecar answers `GET /ready` without authentication, so the probe and the deploy script know when it can take traffic. | P0 | `REST-GET-READY`, `FLOW-SIDECAR-READY` |
| REQ-PLATFORM-002 | The sidecar serves an external store for objects through the object entry manager contract. | P2 | `REST-GET-ENTRY-MANAGER-1`, `REST-GET-ENTRY-MANAGER-1-PAGE`, `REST-POST-ENTRY-MANAGER-1`, `REST-PUT-ENTRY-MANAGER-1`, `REST-DELETE-ENTRY-MANAGER-1` |
| REQ-PLATFORM-003 | The sidecar handles a notification type and a workflow action for the portal. | P2 | `REST-POST-NOTIFICATION-TYPE-1`, `REST-POST-WORKFLOW-ACTION-1` |

## Environment

The environment is declarative: `docker compose` starts it, and the client extensions fill it. Delete it and rebuild it from the tree with `scripts/env.sh reset`. These are not testable requirements, so they carry no ID.
