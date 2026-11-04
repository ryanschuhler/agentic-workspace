---
description: Which tier proves which behavior, and how a test names the plan item it verifies.
paths:
    - "tests/**"
    - "**/*.test.js"
    - "**/src/test/**"
---

# Testing

Verified on 2026-11-04.

## Pick the Fastest Tier That Can Prove It

| Behavior | Tier |
| --- | --- |
| A function, a hook, a component, a route table | Vitest |
| A controller, a service, a converter in the sidecar | JUnit |
| What the portal holds after a deploy: objects, permissions, an endpoint over HTTP | Playwright integration |
| A journey a person takes in a browser across pages | Playwright e2e |

Use `/test-add` to pick the tier and copy the pattern.

## Name the Plan Item

Every test file names the plan ID that it verifies. A test with no plan ID fails `yarn lint` and `yarn plan:check`. When you add the first test for a row, change its Status from `planned` to `covered` in `tests/plan/`.

## Assert on Values, Not on Status Alone

A `200` with an empty list is the most common wrong answer from the portal: the caller lacks a permission, and the API hides it. Assert on the data.

## Commit Tests Apart

The code goes in one commit, and its tests go in the next. `yarn commits:check` reports a commit that mixes them.
