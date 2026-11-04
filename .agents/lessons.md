# Lessons

Each row is a review comment that became a guardrail. `/review-learn` appends a row. Read the newest rows first: they are the mistakes that agents made most recently.

| Date | Comment | Became |
| --- | --- | --- |
| 2026-11-04 | "Error updating sample" reads like generated code. Write "Unable to update sample". | Lint rule `local/log-message-form` |
| 2026-11-04 | This test does not say which requirement it proves. | Lint rule `local/test-cites-plan-id`, and the UNTRACED check in `plan:check` |
| 2026-11-04 | The object action calls a Node function that this workspace does not deploy. | Health action `object-action-no-handler` |
| 2026-11-04 | Another session popped my stash in a shared worktree. | `PreToolUse` hook `tools/hooks/guardBash.ts` blocks a bare `git stash` |
| 2026-11-04 | The ESLint plugin ignored my rule edit until the copied dependency was rebuilt. | The plugin is plain JavaScript, imported by path from `eslint.config.js`. There is no build step to forget. |
