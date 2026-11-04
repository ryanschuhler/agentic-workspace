---
description: Commit messages, PR scope, and the checks to run before a PR.
---

# PR Hygiene

Verified on 2026-11-04.

## Commit Messages

- Start the title with the ticket ID: `EXAMPLE-12 Refuse a Sample entry with no name`.
- Describe the change in behavior, not the code. Use sentence case, no trailing period, and stay under 72 characters.
- Add a body only when the title does not say why. The `commit-msg` hook checks the title.

## One Ticket, One PR

A PR addresses one ticket. A fix for a different problem gets its own ticket and its own PR.

## Before You Send

Run `yarn verify`. It runs lint, the file name lint, the tool tests, the unit tests, `plan:check`, `health:check`, and `commits:check`. CI runs the same commands, so a green `yarn verify` is a green build.

Run `yarn health:diff` and paste the actions that the branch adds and resolves into the PR description.
