---
name: env
description: Start, stop, reset, or reprovision the local Liferay stack (Postgres, Liferay, Spring Boot sidecar) with Docker Compose. Use when the user asks to start the environment, when a test needs a running portal, or when the site or data is stale.
---

# Environment

The environment is declarative. Docker Compose starts it, and the client extensions fill it. Being wrong costs minutes: delete it and rebuild it from the tree.

Run every command from the workspace root (or the worktree root).

| Goal | Command |
| --- | --- |
| Start, or resume a stopped stack | `scripts/env.sh up` |
| Stop, and keep the data | `scripts/env.sh down` |
| Delete everything and rebuild (ask the user first) | `scripts/env.sh reset --yes` |
| Recreate the site after a page change | `scripts/env.sh reprovision` |
| Show the URLs, ports, and health | `scripts/env.sh status` |

## Procedure

1. Run `scripts/env.sh status`. When Liferay is healthy, stop here.

1. Run `scripts/env.sh up`. The first start pulls the image and takes 5 to 10 minutes. The script waits on the health check, so do not poll by hand.

1. Run `/deploy` to deploy every client extension.

## Failure Modes

- **The port is in use.** Another stack runs, maybe for another worktree. Each worktree gets its own ports from `.env`; run `scripts/env.sh status` in each.
- **The site is missing after a reset.** The site initializer deploys only after Liferay is healthy. Run `/deploy liferay-sample-site-initializer`.
- **Reprovision did nothing.** Liferay retriggers the initializer only when the zip changes. The script deletes the zip first; do not skip that step when you run it by hand.
