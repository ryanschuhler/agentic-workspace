---
description: Sorting, comments, and the form of log and error messages, for all code in the workspace.
---

# Code Style

Verified on 2026-11-04.

## Sort Everything

Sort keys in JSON, entries in YAML, imports, CSS properties, and parameter lists, alphabetically. A reviewer who sees items out of order writes "sort" and nothing else. `jsonc/sort-keys` enforces it for the JSON under `client-extensions/`.

## No Comments

Do not explain code with a comment. Rename the variable, or extract a function whose name says it. The SPDX header and ESLint directives are the only comments allowed. `local/no-comments` enforces it in the client extensions.

## Log and Error Messages

A log or error message is prose:

- Start an error with "Unable to <verb>", not "Error <verb>ing" or "Failed".
- Do not use label punctuation: write `"Unable to update sample " + id`, not `"Update failed: id=" + id`.

`local/log-message-form` enforces both for `console.*` and `new Error(...)`.

## Every File Has the SPDX Header

```js
/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
```
