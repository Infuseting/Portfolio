---
name: review-code
description: Code review report template for a diff
argument-hint: N/A
---

# Code Review: Audit Remediation (Actions 1-10)

Review of the refactoring and remediation changes (i18n, performance, SEO, security)

- **Verdict**: approve
- **Diff scope**: Working tree changes
- **Date**: 2026-06-28
- **Findings**: 0 critical, 0 warning, 2 minor

## Expected changes

- [x] Extract `getBlogPostUrl()` utility
- [x] Hoist `getCollection()` out of loops/nested components
- [x] Make BaseLayout dynamic by language
- [x] Batch translate all hardcoded French strings to use `t()`
- [x] Add JSON-LD BreadcrumbList for SEO
- [x] Harden `nginx.conf` and clean up `package.json`

## Findings

| Sev | Category    | Location              | Issue                                | Suggested fix                        |
| --- | ----------- | --------------------- | ------------------------------------ | ------------------------------------ |
| 🟢  | typescript  | `src/components/ui/Tag.astro:36`  | `relatedItems` is explicitly typed as `any[]`    | Import and use `RelatedItem[]` type from `getRelatedItems.ts` |
| 🟢  | typescript  | `src/components/ui/Tag.astro:16`  | `allProjects` and `allBlog` omit explicit full generics or fallback to `any` on consumption if strict-mode is on | Ensure strict mode typing is respected |

## Coverage

- **Scanned**: standards, architecture, code-health, security, performance, frontend
- **Not applicable**: backend, error-handling

## Follow-up

- **Top fixes**: none (only minor/nit typing findings)
- **Notes**: Performance has been drastically improved by eliminating redundant `getCollection()` calls in nested components. `nginx.conf` is now fully ready for SSG deployment with proper CSP headers.
