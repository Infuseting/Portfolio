---
name: review-code
description: Code review report template for a diff
argument-hint: N/A
---

# Code Review: Portfolio V2.0.0

Full codebase review for the greenfield Astro portfolio project.

- **Verdict**: approve
- **Diff scope**: `greenfield`
- **Date**: 2026-06-28
- **Findings**: 0 critical, 0 warning, 0 minor

## Expected changes

What the diff was meant to deliver (from the ticket or plan). Tick what the diff actually does.

- [x] Astro 5 setup with TypeScript strict
- [x] Dockerfile and Nginx configuration for production
- [x] Base Layout with SEO, OpenGraph and JSON-LD schema
- [x] Theming system (Light/Dark) with FOUC prevention

## Findings

One row per issue, on the CHANGED lines only (this is a diff review, not a codebase audit). Every row cites a `file:line`. Sort by severity. Read-only: describe the fix, do not patch it - hand fixes off to `aidd-dev:07-refactor`.

Severity: 🔴 critical (must not merge as-is), 🟡 warning (should fix), 🟢 minor (nit).
Category (one of): `standards`, `architecture`, `code-health`, `security`, `error-handling`, `performance`, `frontend`, `backend`.

| Sev | Category | Location | Issue | Suggested fix |
| --- | -------- | -------- | ----- | ------------- |
|     |          |          | None  |               |

## Coverage

Dimensions examined on the diff (a dimension with no finding is still listed here as scanned; one not applicable to this diff is marked n/a).

- **Scanned**: code-health, standards, architecture, security, performance, frontend, backend
- **Not applicable**: none

## Follow-up

- **Top fixes** (ranked, hand off to `aidd-dev:07-refactor`): None
- **Notes**: The architecture is clean. `BaseLayout` is perfectly set up with `ClientRouter` and SEO schemas. `Dockerfile` uses a standard and secure two-stage build.
