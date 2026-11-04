---
name: deploy
description: Build one or all client extensions, copy them into the running Liferay container, and verify that each one started. Use when the user asks to deploy, after a change to any client extension, or before an integration or e2e test.
---

# Deploy

Deploy and verify in one step. A green build does not prove that Liferay started the client extension.

## Procedure

1. Run `scripts/deploy.sh` to deploy every client extension, or `scripts/deploy.sh <project>` for one, for example `scripts/deploy.sh liferay-sample-etc-spring-boot`.

1. Read the output. The script waits for `STARTED <project>` in the Liferay log for each zip and fails after 120 seconds.

1. For the sidecar, the script also rebuilds the sidecar image and waits for `GET /ready` to return `READY`.

## Order

The batch client extension deploys before the site initializer, because pages can reference objects. The script keeps this order. When you deploy by hand, keep it too.

## Failure Modes

- **`STARTED` never appears.** Read the last 100 lines of the log with `docker compose logs liferay --tail 100`. A batch import error names the file and the item.
- **The sidecar returns 401 on every call.** The OAuth2 application changed on deploy and the sidecar kept the old routes. Run `docker compose restart sidecar`.
