# Design

The visual language: the design system, tokens, and UI conventions. What it looks like, not how it is coded.

## System

- Scoped CSS inside Astro components (`<style>`).
- Global CSS for base styles in `src/styles/`.

## Tokens

- Typography: Inter and Syne fonts (via `@fontsource-variable`). JetBrains Mono for monospace.
- Icons: Built-in `astro-icon` utilizing `@iconify-json/mdi` and `simple-icons`.

## Components

- Custom Astro components in `src/components/`.

## Accessibility

- Semantic HTML via Astro.
