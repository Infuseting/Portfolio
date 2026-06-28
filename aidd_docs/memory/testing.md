# Testing

How the project is tested: the layers, the tools, and the conventions. Where tests live and how to run them.

## Strategy

- Currently, the project relies on static type checking (`astro check`) and build verifications (`astro build`). No formal automated testing layers (unit, e2e) are configured yet.

## Tools

- Astro Check: Built-in diagnostic tool.

## Conventions

- Visual verification via the development server (`npm run dev`).

## Run

- `npm run build` to verify production builds.
