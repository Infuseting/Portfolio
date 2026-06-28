# Codebase Map

The macro layout: the top-level areas and what each holds. A map to navigate, not the full tree.

```mermaid
flowchart TD
    Root[Project Root]
    Root --> Src[src/]
    Root --> Config[Config Files]
    Root --> Docker[Docker/Deployment]
    Src --> Pages[pages/]
    Src --> Components[components/]
    Src --> Layouts[layouts/]
    Src --> Content[content/]
```

## Areas

- `src/pages/`: File-based routes for the website.
- `src/components/`: Reusable Astro components.
- `src/layouts/`: Shared layout components.
- `src/content/`: Content collections defined in `content.config.ts`.
- `src/assets/`, `src/styles/`: Static assets and global styles.

## Entry points

- `src/pages/index.astro`: The main landing page.
- `astro.config.mjs`: The Astro configuration file.
