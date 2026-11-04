# Tests

Four tiers, from the fastest to the slowest. Pick the fastest tier that can prove the behavior; `/test-add` picks it for you.

| Tier | Runs | Where | Command |
| --- | --- | --- | --- |
| Unit (Vitest) | In Node with jsdom, no portal | Beside the source, `*.test.js` | `yarn test:unit` |
| JUnit | In the JVM, no portal | `src/test/java` of the sidecar | `yarn test:java` |
| Integration (Playwright) | HTTP against a running stack | `tests/integration` | `yarn test:integration` |
| End to end (Playwright) | A browser against a running stack | `tests/e2e` | `yarn test:e2e` |

## The Plan

[`plan/`](./plan/) lists every behavior that a test must prove, one row per item. `yarn plan:check` compares it to three things and fails on any disagreement:

1. **The code.** A route, module, endpoint, or object with no row is a gap. A row whose code is gone is stale.
1. **The tests.** Every test file names the plan ID that it verifies, in a `describe` title or a Javadoc `Plan:` line. A row marked `covered` needs a test that cites it.
1. **The specs.** Every requirement in `specs/` names the plan items that verify it.

## Commits

Tests go in their own commit, after the code commit. `yarn commits:check` fails on a commit that mixes the two.
