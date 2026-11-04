---
description: Object definitions, ERCs, and the traps of the batch and site initializer client extensions.
paths:
    - "client-extensions/liferay-sample-batch/**"
    - "client-extensions/liferay-sample-site-initializer/**"
---

# Batch and Site Initializer

Verified on 2026-11-04 against DXP 2025.Q1.

These two client extensions are the source of truth for the data model and the site. Edit the files, then deploy. Never fix the live portal by hand: the next reset loses the fix.

## External Reference Codes

- An ERC is a stable key. Renaming one creates a second record and orphans the first. Search the workspace and every loader script for an ERC before you change it.
- An object relationship needs its own stable `externalReferenceCode`, or a second import throws `DuplicateObjectRelationshipException`.

## Reserved Field Names

The portal rejects a custom field named `status`, `id`, `creator`, `keywords`, or `userId`. One rejected field aborts the import of every object in the file. Use `customStatus` or a name that says what the status is about.

## Object Actions

An object action with `objectActionExecutorKey` of `function#<key>` calls the client extension `<key>`. That key must exist in this workspace, or the action fails at run time with no error at import. `yarn health:check` reports each one.

## Site Initializer

The site initializer runs once, when the site is created. Redeploying it does not update an existing site. To apply a change to pages, run `scripts/env.sh reprovision`, which deletes the site and redeploys.
