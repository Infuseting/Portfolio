# Navigation

How the user moves through the app: routing and the page structure.

## Routing

- Astro's file-based routing (`src/pages/`).
- Sitemap generation via `@astrojs/sitemap`.

## Structure

The macro page map, main sections only.

```mermaid
flowchart LR
    Index[Home (/)]
    Index --> Content[Portfolio Projects/Articles]
```
