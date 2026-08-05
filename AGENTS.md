# Repository Guidelines

## Project Structure & Module Organization

This is a frontend-only Next.js 16 site using the App Router and TypeScript. Route and layout composition belongs in `src/app/`; localized routes live under `src/app/[locale]/`. Keep domain code self-contained in `src/features/<feature>/` and expose each feature only through its `index.ts`. Cross-feature UI, hooks, and utilities belong in `src/shared/`. Translation catalogs are in `src/messages/`, i18n plumbing in `src/i18n/`, global tokens in `src/styles/`, and static assets in `public/`. Treat `ia-docs/global/{architecture,tech-stack,styles}.md` as the source of truth for structural and visual decisions.

## Build, Test, and Development Commands

- `npm install` installs dependencies; use npm only and commit `package-lock.json` changes.
- `npm run dev` starts the local site at `http://localhost:3000`.
- `npm run lint` runs ESLint across the repository.
- `npm run format` formats files with Prettier.
- `npm run build` creates the production build; `npm run start` serves it.
- `npm run build:export` verifies that the static-export deployment option still works.

Run lint and both relevant builds before submitting changes.

## Coding Style & Naming Conventions

Use strict TypeScript with two-space indentation and no `any`; narrow `unknown` instead. Prefer the `@/*` alias over deep relative imports. Name feature directories in kebab-case, React components in PascalCase, hooks as `useX.ts`, services as `x.service.ts`, and component styles as `Component.module.css`. Default to Server Components and place `"use client"` only on the smallest interactive leaf. Use CSS Modules and existing variables from `src/styles/tokens.css`; document new design tokens before adding them. Put user-facing UI copy in both `es.json` and `en.json` rather than hardcoding it in JSX.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. Until one is adopted, validate changes with `npm run lint`, `npm run build`, and `npm run build:export`, then manually check both `/es` and `/en` plus affected responsive states. If adding tests, colocate them with the feature and use `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines

Recent commits use short, lowercase Spanish summaries such as `desplazamiento de hero`; keep commits focused and write a concise imperative description of the outcome. Pull requests should explain the change, affected routes/locales, validation commands, and linked issue or spec. Include before/after screenshots for visual work and update `ia-docs/` when architecture, stack, or design decisions change.
