# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

InnovArx marketing/catalog website — Next.js frontend for a software dev agency. No backend today; all data is local to the repo. Content is bilingual: Spanish (default) and English, via next-intl. Both locales are route-prefixed (`/es`, `/en`); `/` is a static shim (`app/(root)/`) that bounces to `/es` via meta-refresh — not `redirect()`, which doesn't survive static export.

## Documentation is the source of truth

Before making any structural, tech-stack, or visual-design decision, read the relevant doc below — decisions are not improvised in code, they're decided in these docs first (in the same change, if new):

- **`ia-docs/global/architecture.md`** — system boundaries, feature organization, data flow, routes. Answers *where* and *why*.
- **`ia-docs/global/tech-stack.md`** — framework, TS conventions, tooling, naming conventions. Answers *with what*.
- **`ia-docs/global/styles.md`** — exact color/typography/spacing tokens extracted from real brand assets. Any color/font/size used must come from here.

## Commands

```bash
npm run dev       # dev server → http://localhost:3000
npm run build     # production build
npm run start     # serve production build (after build)
npm run lint      # ESLint (flat config; `next lint` was removed in Next 16)
npm run format    # Prettier --write .
npm run build:export  # NEXT_OUTPUT=export next build — verifies the static-export branch (architecture.md §8) still builds
```

npm only — no pnpm/yarn lockfiles. No test runner is set up yet (open decision, see tech-stack.md §7).

## Architecture

**Frontend-only, feature-based.** Next.js (App Router) covers rendering, routes, and UI exclusively — it is not, and must not informally become, the backend:
- No business logic in Route Handlers (`app/api/**`). The only tolerated use of `app/api/**` is a thin proxy to a future separate FastAPI service (no business logic, just forwarding), to avoid exposing keys/endpoints in the browser.
- No direct DB access, no stateful auth (sessions, long-lived tokens) from Next.js.
- If/when real backend is needed (persistent forms, auth, admin panel), it's built as a separate FastAPI service/repo — never inside this one.

**Organization is by feature, not by file type:**

```
src/
  app/
    (root)/                    # "/" — static shim, no owning feature (see below)
    [locale]/                  # routes/layouts only — assembles features, no business logic
  i18n/                        # next-intl plumbing (routing, request config, navigation)
  messages/                    # es.json / en.json — centralized message catalog, namespaced by feature
  features/
    landing/                   # hero, process, final CTA
    services-catalog/          # service tiers (no prices — product decision, see architecture.md §6)
    services/ hooks/ components/ types/ index.ts
  shared/
    components/                # Button, Section, SiteHeader, SiteFooter, LocaleSwitcher
  styles/
    tokens.css                 # design tokens (styles.md §7.2)
    globals.css
```

Rules that matter (full rationale in architecture.md §3):
- Each feature exposes its public surface through a single `index.ts`. **Never import a feature's internal path from another feature.**
- **Features never import each other.** Shared code goes to `shared/`.
- `app/` only composes routes/layouts/metadata and imports from feature `index.ts`; it never contains business or UI logic itself.
- **Data flow is one-directional and always through this chain:** `component → hook → service → data source`. Components never `fetch` directly — `services/` is the only layer that knows whether data comes from a local file, a mock, or (eventually) a real FastAPI call. This is what keeps a future local→FastAPI migration contained to `services/` files only.

**Rendering:** Server Components by default. Add `"use client"` only at the leaf component that actually needs state/effects/browser events/browser APIs — push the boundary as far down the tree as possible, never on a wrapping container. `LocaleSwitcher` is still a Server Component; it only becomes a client component once routes beyond `/` exist and it needs `usePathname()` to preserve the active path across a locale switch. **The first `"use client"` in the app is `BrushStroke`** (`src/shared/components/BrushStroke.tsx`, spec `ia-docs/specs/001-brush-animated-large/requirements.md`) — it needs `IntersectionObserver` to animate on viewport entry; the boundary stays at that leaf, `Hero`/`HomePage` remain Server Components.

**Routes ↔ features map 1:1** (architecture.md §6), all locale-prefixed except the root shim: `/` → static shim, no feature, bounces to `/es`; `/es` `/en` → `landing` (implemented, also assembles `services-catalog`); `/es/servicios` `/en/servicios` → `services-catalog` (pending); `/es/contacto` `/en/contacto` → `contact` (pending). ⚠ A locale-prefixed route pair must use the **identical** segment in both languages (no localized pathnames without a server). No `pricing` feature/route exists — the landing deliberately does not show prices; don't reintroduce prices into `landing` or `services-catalog` without an explicit `pricing` feature.

**Open decision:** hosting/rendering strategy (static export vs. Node/Vercel) is undecided (architecture.md §8). Until decided, don't write code that depends on server-only features (Route Handlers with logic, `cookies()`/`headers()` outside the thin proxy) that would block a static-export option — this is why `next.config.ts` sets `images.unoptimized: true`.

## Internationalization (next-intl)

- **No literal user-facing text in `.tsx`.** All copy comes from `src/messages/<locale>.json` via `useTranslations`/`getTranslations`. Documented exceptions only: the brand wordmark, `TODO` placeholders pending real data (e.g. contact info in `SiteFooter`), and `app/(root)/page.tsx` (has no locale, can't use the catalog).
- `useTranslations` in synchronous Server Components; `getTranslations` only in components that are already `async` or in `generateMetadata`. Don't make a component `async` just to translate it.
- `setRequestLocale(locale)` must be the first line of **every** `page.tsx`/`layout.tsx` under `app/[locale]/` — it's what makes the route static; skipping it silently makes the route dynamic in the build output.
- **Never create `proxy.ts`/`middleware.ts`.** This is deliberate, not an oversight: the project uses a manual ES/EN switcher instead of browser-language detection specifically so middleware — incompatible with `output: 'export'` — never has to exist (architecture.md §8/D6).
- **Domain content vs. UI copy is a hard split (architecture.md D5):** service-catalog names/descriptions/delivery times are localized in `services/` (`getServiceLevels(locale)`), never in the message catalog — that's what keeps the future FastAPI swap contained to `services/` per D3. The message catalog is UI chrome only.
- `NextIntlClientProvider` is intentionally absent — there are no Client Components to feed messages to yet. Add it only alongside the first one.
- Numbers interpolated into a message get thousands-separator formatting by default — pass `String(value)` when that's wrong (e.g. a year).

## Code conventions

- TypeScript `strict: true`, no implicit/explicit `any` — use `unknown` + narrowing.
- Import alias `@/*` → `src/*`; no deep relative imports (`../../../`).
- Naming: feature folders kebab-case (`services-catalog/`), components PascalCase (`ServiceCard.tsx`), hooks camelCase `useX.ts`, services `x.service.ts`, types PascalCase, CSS Module named after its component (`ServiceCard.module.css`).
- Styling: CSS Modules + pure CSS variables — **not** a utility framework. Every component has its own `Componente.module.css`. **No literal hex/font-size/radius/shadow values in stylesheets** — always consume via `var(--token)`. If a value doesn't exist as a token yet, add it to `styles.md` first, don't invent it in CSS.
- Fonts are loaded via `next/font/google` in `src/app/[locale]/layout.tsx` (Space Grotesk, Manrope, IBM Plex Mono), exposed as CSS variables that `tokens.css` references — do not hardcode font-family strings elsewhere.
- ESLint 9 flat config (`eslint.config.mjs`) importing `eslint-config-next`'s native flat export directly (no `FlatCompat` needed on `eslint-config-next@16`), with `eslint-config-prettier` last to defer style rules to Prettier.
