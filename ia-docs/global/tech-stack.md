# Stack tecnológico — InnovArx

> **Estado:** fuente única de verdad para las decisiones de tecnología y convención de código del proyecto.
> Cualquier tecnología, patrón o convención de código que se use en el desarrollo debe salir de este documento. Si algo no está aquí, se decide y se agrega aquí primero — no se improvisa directamente en el código.
> Para decisiones estructurales — límites del sistema, organización por feature, flujo de datos, rutas — ver [`architecture.md`](./architecture.md), que es la fuente de verdad de **dónde** y **por qué**. Este documento responde **con qué**.

## 1. Stack

| Capa                            | Tecnología                                    | Nota                                                                                                                                                                |
| ------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                       | Next.js 16 (App Router)                       | Solo frontend — ver [`architecture.md`](./architecture.md) §2 para los límites                                                                                      |
| Librería UI                     | React 19                                      | Server Components por defecto; `"use client"` solo cuando haga falta interactividad — ver [`architecture.md`](./architecture.md) §5                                 |
| Lenguaje                        | TypeScript ~5.9                               | `strict: true`, sin `any` implícito                                                                                                                                 |
| Estilos                         | CSS Modules + variables CSS puras             | Tokens definidos en [`styles.md`](./styles.md) §7.2                                                                                                                 |
| Gestor de paquetes              | npm                                           | Único gestor instalado en el entorno del proyecto; no se mezcla con pnpm/yarn                                                                                       |
| Linter                          | ESLint 9 (flat config) + `eslint-config-next` | Ver §5                                                                                                                                                              |
| Formatter                       | Prettier                                      | Ver §5                                                                                                                                                              |
| Internacionalización            | next-intl 4                                   | ES (default) + EN, ambos con prefijo de ruta (`/es`, `/en`); sin proxy/middleware para no cerrar el export estático — ver [`architecture.md`](./architecture.md) §8 |
| Backend (futuro, no existe hoy) | FastAPI                                       | Servicio separado; se activa solo si el proyecto lo requiere — ver [`architecture.md`](./architecture.md) §2                                                        |

## 2. TypeScript

- `strict: true` en `tsconfig.json`; queda prohibido `any` (usar `unknown` + narrowing cuando el tipo no se conoce de antemano).
- Los tipos de dominio de una feature viven en su propia carpeta `types/`; los tipos compartidos entre features viven en `src/shared/types/`.
- Alias de import `@/*` apuntando a `src/*`. Prohibidas las rutas relativas profundas (`../../../`).
- `src/global.ts` aumenta el módulo `next-intl` (`AppConfig.Locale` y `AppConfig.Messages`) a partir de `src/i18n/routing.ts` y `src/messages/es.json`. `es.json` es el catálogo canónico: sus claves son las que tipan `useTranslations`/`getTranslations` en todo el proyecto. `en.json` no está tipado por separado — una clave que falte ahí no la detecta `tsc`, solo el aviso en consola de next-intl en desarrollo.

## 3. Estilos

La fuente de verdad visual es [`styles.md`](./styles.md); este documento solo define **cómo** se implementa en código.

- Se usan las **variables CSS puras** de `styles.md` §7.2 (no la variante Tailwind), declaradas una única vez en `:root` dentro de `src/styles/tokens.css`.
- Cada componente lleva su propio `Componente.module.css` junto al `.tsx`, sin hojas de estilo globales salvo `src/styles/globals.css` (reset y aplicación de tokens base).
- Regla dura: **ningún valor hexadecimal, tamaño de fuente, radio o sombra escrito literal en un archivo de estilos** — todo se consume vía `var(--token)`. Si un valor no existe todavía como token, se agrega primero a `styles.md`, no se inventa en el CSS.
- Tipografías: usar el import de Google Fonts documentado en `styles.md` §4.1, o `next/font` si se prefiere autoalojarlas — en ambos casos deben ser exactamente Space Grotesk, Manrope e IBM Plex Mono.

> La organización de carpetas (`src/features/`, `src/shared/`, etc.) es una decisión estructural — ver [`architecture.md`](./architecture.md) §3.

## 4. Tooling

### Baseline de navegadores

Se soportan las últimas 2 versiones de Chrome, Edge y Firefox, además de Safari e iOS Safari
desde la versión 16. Esta baseline permite usar `clamp()`, `dvh`, propiedades lógicas y
`env(safe-area-inset-*)` sin introducir polyfills.

- **Gestor de paquetes: npm.** Es el único instalado en el entorno del proyecto (no hay pnpm ni yarn) — no se generan lockfiles de otro gestor.
- **Linter: ESLint 9 en flat config** (`eslint.config.mjs`), usando `eslint-config-next` directamente. Desde `eslint-config-next@16` el paquete exporta un flat config nativo (un array de configuraciones) — no hace falta `FlatCompat` ni nombrar presets como `"next/core-web-vitals"` en un `extends` de estilo legacy; se importa el config y se hace _spread_.
- **Formatter: Prettier**, con `eslint-config-prettier` al final del array de ESLint para desactivar cualquier regla de estilo que choque con el formatter.
- **Scripts de `package.json`:**

  | Script         | Comando                         | Nota                                                                                                                         |
  | -------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
  | `dev`          | `next dev`                      |                                                                                                                              |
  | `build`        | `next build`                    |                                                                                                                              |
  | `start`        | `next start`                    |                                                                                                                              |
  | `lint`         | `eslint .`                      | `next lint` fue eliminado en Next 16; se invoca ESLint directamente                                                          |
  | `format`       | `prettier --write .`            |                                                                                                                              |
  | `build:export` | `NEXT_OUTPUT=export next build` | Verifica que la rama de export estático sigue viable (`architecture.md` §8) — no decide el hosting, solo lo hace comprobable |

## 5. Internacionalización

Implementada con **next-intl 4**. Reglas operativas — el detalle estructural (rutas, límites del sistema) está en [`architecture.md`](./architecture.md) §3, §6 y §8:

- **Prohibido texto de usuario literal en `.tsx`.** Toda copy sale de `src/messages/<locale>.json` vía `useTranslations`/`getTranslations`. Excepciones documentadas explícitamente en el código: nombre de marca (`InnovArx`, wordmark), placeholders `TODO` pendientes de dato real (ej. contacto en `SiteFooter`), y el shim estático de `/` (no tiene locale, no puede traducirse).
- `useTranslations` en Server Components síncronos; `getTranslations` (async) solo en componentes ya `async` o en `generateMetadata`. No convertir un componente en `async` únicamente para traducirlo.
- `t.rich(...)` para mensajes con markup embebido (ej. un `<span>` de énfasis dentro de un titular) — el nombre de la etiqueta en el mensaje describe su rol semántico (`accent`), no la etiqueta HTML final.
- `setRequestLocale(locale)` es la primera línea de **cada** `page.tsx` y `layout.tsx` bajo `app/[locale]/` — habilita el render estático; omitirlo degrada la ruta a dinámica en el build (ver `architecture.md` §8).
- **Nunca crear `proxy.ts` ni `middleware.ts`.** Es una decisión deliberada, no una omisión: el proyecto no hace detección automática de idioma por navegador (selector manual en el header) precisamente para que el middleware —incompatible con `output: 'export'`— no cierre la rama de export estático (`architecture.md` §8).
- `NextIntlClientProvider` está ausente a propósito: el proyecto no tiene ningún `"use client"` component, así que no hay a quién proveerle mensajes en el navegador. El día que exista el primero, se añade junto con él.
- El extractor de mensajes basado en SWC que trae `next-intl` no se usa; el flujo es el catálogo JSON clásico.
- Números interpolados en un mensaje (`{year}`, `{total}`) se formatean con separador de miles por defecto — pasar `String(valor)` cuando el número no debe llevarlo (ej. un año: `{year: 2026}` renderiza `2.026` en `es`).

## 6. Convenciones de nombres

| Elemento                      | Convención                      | Ejemplo                        |
| ----------------------------- | ------------------------------- | ------------------------------ |
| Carpeta de feature            | kebab-case                      | `services-catalog/`            |
| Componente (archivo y export) | PascalCase                      | `ServiceCard.tsx`              |
| Hook                          | camelCase con prefijo `use`     | `useServiceFilter.ts`          |
| Servicio                      | camelCase con sufijo `.service` | `services.service.ts`          |
| Tipos                         | PascalCase                      | `Service`, `PricingTier`       |
| CSS Module                    | mismo nombre que el componente  | `ServiceCard.module.css`       |
| Archivo de mensajes           | código ISO 639-1                | `es.json`, `en.json`           |
| Namespace de mensajes         | nombre de feature en camelCase  | `servicesCatalog`              |
| Clave de mensaje              | camelCase                       | `ctaServices`, `deliveryWeeks` |

## 7. Puntos abiertos

Estas decisiones aún no están tomadas. Se documentan como pendientes en vez de asumirse:

- **Estrategia de testing.** Por definir.
- **Existencia y contrato de la API de FastAPI.** Por definir — hoy no hay backend en este proyecto.
- **Pathnames localizados** (ej. `/en/services` en vez de `/en/servicios`). Requieren rewrites de servidor vía la opción `pathnames` de next-intl, incompatibles con `output: 'export'` sin proxy. Descartado mientras no exista servidor — ver `architecture.md` §8.

> Hosting y estrategia de renderizado es también una decisión abierta, pero de naturaleza estructural — ver [`architecture.md`](./architecture.md) §8.
