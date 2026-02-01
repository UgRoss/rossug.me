# AGENTS.md

This document provides context and guidelines for AI agents working on this project.

## Project Context

- **Core**: Personal website/digital garden built with [Astro](https://astro.build/).
- **Configuration**: Always use `src/config.ts` for site metadata (title, author, description, etc.). **Do not hardcode these values.**

## Tech Stack & Preferences

- **Dependencies**: Use `pnpm` for package management.
- **Logic**: Prefer Functional Programming (FP) patterns.
- **Astro Components**: Use `astro-toolkit` but **avoid** the `For` component.
- **Dates**: Use `date-fns` for all date manipulations.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/).
- **Content**: Use Tailwind CSS Typography (`prose`) for rendering markdown/content.

## Code Style

- **TypeScript**: Strict types, explicit returns.
- **Naming**: `PascalCase` for types/classes, `camelCase` for functions/variables.
- **Files**: `kebab-case.extension`.
- **Indentation**: 2 spaces.
- **Imports**: Group imports alphabetically and group by type (types, then globals, then locals). Always import types separately from values.
