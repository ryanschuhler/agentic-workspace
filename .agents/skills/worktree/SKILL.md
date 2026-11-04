---
name: worktree
description: Create or remove an isolated sandbox for one ticket, a git worktree with its own branch, ports, and Liferay stack, so parallel agents do not overwrite each other. Use when starting work on a ticket, or when the user asks for a worktree or a sandbox.
---

# Worktree

Two agents in one checkout overwrite each other. A worktree isolates the files and shares the git history. Each worktree gets its own Compose project and port offset, so its stack runs next to the others.

## Create

```bash
scripts/worktree.sh create EXAMPLE-12
```

The script:

1. Creates `../agentic-workspace-EXAMPLE-12` on a new branch `EXAMPLE-12` from `main`.
1. Writes `.env` there with `COMPOSE_PROJECT_NAME=aw-example-12` and a free port offset.
1. Runs `yarn install`.
1. Opens the worktree as a herdr workspace when it runs inside herdr.

Then run `/env` and `/deploy` inside the worktree.

## Remove

```bash
scripts/worktree.sh remove EXAMPLE-12
```

The script stops the stack, deletes its volumes, and removes the worktree. It refuses when the worktree has uncommitted changes.

## Rules for Shared State

- **Commit early.** Another session can reset a tracked file in a shared checkout. An untracked file or a commit survives.
- **Never run a bare `git stash`.** Every worktree shares one stash stack, so `git stash pop` can apply the changes of another session. The `PreToolUse` hook blocks it. Make a WIP commit instead.
