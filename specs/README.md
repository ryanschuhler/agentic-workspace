# Specs

The specs record what the workspace must do (`business/`) and how it must behave as a system (`technical/`). They are the intent that an agent reads before it builds anything. Without intent, an agent builds the wrong thing very well.

## Requirement IDs

Every requirement is one row in a table, with an ID of the form `REQ-<AREA>-<NNN>`:

| ID | Requirement | Priority | Verified By |
| --- | --- | --- | --- |
| REQ-SAMPLE-001 | One sentence that a test can prove. | P0 | `MOD-API`, `ROUTE-HELLO-WORLD` |

The **Verified By** column names plan items in `tests/plan/`. `yarn plan:check` fails when a requirement names a plan item that does not exist, or names none at all.

## Precedence

The code is the source of truth for names: the object definitions in `client-extensions/liferay-sample-batch/batch/` for objects and fields, and the Spring Boot controllers for endpoints. A spec that disagrees with them is stale. Fix the spec.

## Files

- [`glossary.md`](./glossary.md) — the shared terms. Use one word for one thing.
- [`business/samples.md`](./business/samples.md) — the sample widget, object, and object logic.
- [`business/site.md`](./business/site.md) — the sample site and its look.
- [`technical/platform.md`](./technical/platform.md) — the sidecar, deployment, and the environment.
