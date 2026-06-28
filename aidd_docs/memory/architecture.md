# Architecture

The macro technical shape: the stack, how the pieces fit, and the decisions behind them. Point to the code, do not restate it.

## Stack

- Astro (`astro`): The main framework for building fast, content-focused static websites.
- TypeScript (`typescript`): Strongly typed JavaScript.
- GSAP (`gsap`): For dynamic micro-animations.

## Structure

- `src/pages/[lang]/`: Astro file-based routing entry points with dynamic i18n support.
- `src/components/`: Reusable UI components.
- `src/layouts/`: Page layout wrappers.
- `src/content/`: Markdown and MDX content collections, organized by language (`{blog,projects}/{lang}/`).
- `src/i18n/`: Translation dictionary (`ui.ts`) and utility functions.

## How it fits together

The macro flow between the main parts. One box per area, high level only.

```mermaid
flowchart LR
    A[src/content (MDX/Markdown)] --> B[src/pages (Astro Routes)]
    C[src/components (UI)] --> B
    D[src/layouts] --> B
    B --> E[Static Output (HTML/CSS/JS)]
```

## Key decisions

- Using Astro to ship zero-JS by default, opting into GSAP only for necessary animations.
- Containerized deployment using Docker and Nginx (`Dockerfile`, `nginx.conf`) with strong Content-Security-Policy headers.
- Unified bilingual system (fr/en) through `[lang]` dynamic paths and isolated translation dictionaries (`ui.ts`).

## Gotchas

- Astro components run on the server by default. Client-side scripts must be explicitly defined using `<script>` tags inside Astro components.
- Avoid redundant `getCollection()` calls in nested components; fetch once at the section/page level and pass as props to optimize static build time.
