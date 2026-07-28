# Stack tecnológico — InnovArx

> **Estado:** fuente única de verdad para las decisiones de tecnología y convención de código del proyecto.
> Cualquier tecnología, patrón o convención de código que se use en el desarrollo debe salir de este documento. Si algo no está aquí, se decide y se agrega aquí primero — no se improvisa directamente en el código.
> Para decisiones estructurales — límites del sistema, organización por feature, flujo de datos, rutas — ver [`architecture.md`](./architecture.md), que es la fuente de verdad de **dónde** y **por qué**. Este documento responde **con qué**.

## 1. Stack

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | Next.js 16 (App Router) | Solo frontend — ver [`architecture.md`](./architecture.md) §2 para los límites |
| Librería UI | React 19 | Server Components por defecto; `"use client"` solo cuando haga falta interactividad — ver [`architecture.md`](./architecture.md) §5 |
| Lenguaje | TypeScript ~5.9 | `strict: true`, sin `any` implícito |
| Estilos | CSS Modules + variables CSS puras | Tokens definidos en [`styles.md`](./styles.md) §7.2 |
| Gestor de paquetes | npm | Único gestor instalado en el entorno del proyecto; no se mezcla con pnpm/yarn |
| Linter | ESLint 9 (flat config) + `eslint-config-next` | Ver §5 |
| Formatter | Prettier | Ver §5 |
| Backend (futuro, no existe hoy) | FastAPI | Servicio separado; se activa solo si el proyecto lo requiere — ver [`architecture.md`](./architecture.md) §2 |

## 2. TypeScript

- `strict: true` en `tsconfig.json`; queda prohibido `any` (usar `unknown` + narrowing cuando el tipo no se conoce de antemano).
- Los tipos de dominio de una feature viven en su propia carpeta `types/`; los tipos compartidos entre features viven en `src/shared/types/`.
- Alias de import `@/*` apuntando a `src/*`. Prohibidas las rutas relativas profundas (`../../../`).

## 3. Estilos

La fuente de verdad visual es [`styles.md`](./styles.md); este documento solo define **cómo** se implementa en código.

- Se usan las **variables CSS puras** de `styles.md` §7.2 (no la variante Tailwind), declaradas una única vez en `:root` dentro de `src/styles/tokens.css`.
- Cada componente lleva su propio `Componente.module.css` junto al `.tsx`, sin hojas de estilo globales salvo `src/styles/globals.css` (reset y aplicación de tokens base).
- Regla dura: **ningún valor hexadecimal, tamaño de fuente, radio o sombra escrito literal en un archivo de estilos** — todo se consume vía `var(--token)`. Si un valor no existe todavía como token, se agrega primero a `styles.md`, no se inventa en el CSS.
- Tipografías: usar el import de Google Fonts documentado en `styles.md` §4.1, o `next/font` si se prefiere autoalojarlas — en ambos casos deben ser exactamente Space Grotesk, Manrope e IBM Plex Mono.

> La organización de carpetas (`src/features/`, `src/shared/`, etc.) es una decisión estructural — ver [`architecture.md`](./architecture.md) §3.

## 4. Tooling

- **Gestor de paquetes: npm.** Es el único instalado en el entorno del proyecto (no hay pnpm ni yarn) — no se generan lockfiles de otro gestor.
- **Linter: ESLint 9 en flat config** (`eslint.config.mjs`), usando `eslint-config-next` directamente. Desde `eslint-config-next@16` el paquete exporta un flat config nativo (un array de configuraciones) — no hace falta `FlatCompat` ni nombrar presets como `"next/core-web-vitals"` en un `extends` de estilo legacy; se importa el config y se hace *spread*.
- **Formatter: Prettier**, con `eslint-config-prettier` al final del array de ESLint para desactivar cualquier regla de estilo que choque con el formatter.
- **Scripts de `package.json`:**

  | Script | Comando | Nota |
  |---|---|---|
  | `dev` | `next dev` | |
  | `build` | `next build` | |
  | `start` | `next start` | |
  | `lint` | `eslint .` | `next lint` fue eliminado en Next 16; se invoca ESLint directamente |
  | `format` | `prettier --write .` | |

## 5. Convenciones de nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Carpeta de feature | kebab-case | `services-catalog/` |
| Componente (archivo y export) | PascalCase | `ServiceCard.tsx` |
| Hook | camelCase con prefijo `use` | `useServiceFilter.ts` |
| Servicio | camelCase con sufijo `.service` | `services.service.ts` |
| Tipos | PascalCase | `Service`, `PricingTier` |
| CSS Module | mismo nombre que el componente | `ServiceCard.module.css` |

## 6. Puntos abiertos

Estas decisiones aún no están tomadas. Se documentan como pendientes en vez de asumirse:

- **Estrategia de testing.** Por definir.
- **Existencia y contrato de la API de FastAPI.** Por definir — hoy no hay backend en este proyecto.

> Hosting y estrategia de renderizado es también una decisión abierta, pero de naturaleza estructural — ver [`architecture.md`](./architecture.md) §8.
