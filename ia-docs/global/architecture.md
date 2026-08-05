# Arquitectura — InnovArx

> **Estado:** fuente única de verdad para las decisiones estructurales del proyecto — dónde vive cada cosa, qué puede depender de qué, y por qué.
> Este documento responde **dónde** y **por qué**; [`tech-stack.md`](./tech-stack.md) responde **con qué** (framework, lenguaje, convenciones de código). Si una decisión estructural no está aquí, se decide y se agrega aquí primero — no se improvisa directamente en el código.

## 1. Visión general

InnovArx es hoy un **sitio web de catálogo y captación** para la agencia: presenta servicios, precios y un punto de contacto. No hay backend propio, ni persistencia, ni autenticación — es un frontend que consume datos locales empaquetados con el propio sitio.

**Estado actual:**

```
┌─────────────────────────────┐
│           Next.js           │
│  (rutas, UI, datos locales) │
└─────────────────────────────┘
```

**Estado futuro** (cuando el proyecto lo requiera — ver §2):

```
┌──────────────┐   HTTP    ┌──────────────┐
│   Next.js    │ ────────▶ │   FastAPI    │
│  (frontend)  │ ◀──────── │  (backend)   │
└──────────────┘           └──────────────┘
```

El segundo estado no obliga a rehacer el primero: la frontera ya está trazada en `services/` (§4), así que activar el backend es un cambio contenido, no una migración.

## 2. Límites del sistema

**Next.js cubre exclusivamente el frontend**: renderizado, rutas, UI y consumo de datos. No es, ni debe convertirse informalmente, en el backend del proyecto.

- **No** se implementa lógica de backend en Route Handlers (`app/api/**`).
- **No** hay acceso directo a base de datos desde Next.js.
- **No** hay autenticación con estado (sesiones, tokens de larga vida) gestionada desde Next.js.

**Por qué:** un Route Handler que empieza como "un endpoint rápido" es la forma más común en que un frontend termina cargando lógica de negocio, secretos y validaciones que nadie planeó poner ahí — y que luego nadie puede mover sin romper algo. Trazar la línea ahora, mientras el backend todavía no existe, evita que se cruce por conveniencia cuando exista.

Si el sitio crece y se necesita backend real — formularios con persistencia, autenticación, panel de administración, integraciones con terceros que requieran llaves privadas —, ese backend se construye con **FastAPI**, como servicio independiente (repositorio y despliegue propios), y el frontend lo consume vía HTTP.

El único uso tolerado de `app/api/**` en Next.js es como **proxy delgado hacia FastAPI**, para no exponer llaves o endpoints privados en el navegador. Ese proxy no debe contener lógica de negocio: solo reenvía la petición.

## 3. Modelo de organización: por feature

El proyecto se organiza **por feature**, no por tipo de archivo. Cada feature es una unidad autocontenida con su propia UI, estado, acceso a datos y tipos.

```
src/
  app/
    (root)/                   # "/" — shim estático sin feature dueña, ver §6
      layout.tsx
      page.tsx
    [locale]/                 # solo rutas y layouts; ensambla features, no implementa lógica
      layout.tsx
      page.tsx
  i18n/                       # plomería de next-intl (routing, request config, navigation)
  messages/                   # catálogo de mensajes, un JSON por locale — ver §3 nota de i18n
  features/
    landing/
      components/             # UI propia de la feature
      hooks/                  # estado y lógica de React de la feature
      services/               # llamadas HTTP / acceso a datos
      types/                  # tipos del dominio de la feature
      utils/                  # helpers puros de la feature
      index.ts                # API pública de la feature (único punto de import)
    services-catalog/
      components/
      hooks/
      services/
      types/
      index.ts
    pricing/
      ...
    contact/
      ...
  shared/
    components/               # UI genérica reutilizable (Button, Card, Section)
    hooks/
    lib/                      # cliente HTTP, helpers transversales
    types/
  styles/
    tokens.css                # variables de styles.md §7.2
    globals.css
```

**Reglas de la arquitectura y su porqué:**

- `src/i18n/` y `src/messages/` no son features: son plomería transversal, del mismo nivel que `src/styles/`. `src/messages/<locale>.json` es un catálogo **centralizado**, no uno por feature — un catálogo por feature obligaría a `src/i18n/request.ts` a importar rutas internas de cada feature (prohibido más abajo) o a que cada feature reexportara su catálogo desde `index.ts`, ensuciando con datos estáticos la superficie pública que esa regla protege. Lo que sí se conserva es la propiedad que motiva "una feature, una carpeta": **el namespace de primer nivel de cada JSON es el nombre de la feature** — borrar una feature implica borrar su bloque de ambos catálogos en el mismo cambio.
- Una carpeta por feature. Dentro, solo se crean las subcarpetas que realmente se usan — nada de `hooks/` vacío "por si acaso". _Una carpeta vacía es una promesa de estructura que nadie pidió; añade ruido a la exploración sin añadir información._
- Cada feature expone su superficie pública en `index.ts`. **Está prohibido importar rutas internas de otra feature** (ej. `features/pricing/components/Card` desde `features/landing`). _Sin esta regla, el límite entre features se vuelve implícito y cualquier refactor interno de una feature puede romper otra sin aviso._
- **Las features no se importan entre sí.** Si dos features necesitan lo mismo, ese código sube a `shared/`. _Esto es lo que hace posible borrar una feature completa sin arqueología: si nada más la importa, su carpeta es el único lugar a tocar._
- `app/` solo compone: define rutas, layouts y metadata, e importa features. La lógica de negocio y de UI vive dentro de `features/`, nunca en `app/`. _`app/` está atado al enrutador de Next.js; si la lógica vive ahí, queda atada a él también._
- `services/` es la única capa que habla con el exterior (hoy puede ser data local o mock; mañana, FastAPI). Los componentes **nunca** hacen `fetch` directo — así, cuando exista el backend en FastAPI, el cambio se limita a la carpeta `services/` de cada feature. _Ver §4 para el flujo completo._

**Propiedad que se busca:** cada feature se puede leer, probar y eliminar de forma aislada, sin que su lógica se disperse por el proyecto.

## 4. Flujo de datos

Los datos fluyen en un solo sentido, siempre a través de la misma cadena:

```
componente  →  hook  →  service  →  fuente de datos
(UI, sin fetch)  (estado React)  (única frontera externa)  (local hoy / FastAPI mañana)
```

- **`components/`** renderiza. No sabe de dónde vienen los datos ni cómo se obtienen.
- **`hooks/`** orquesta estado y efectos de React, y llama a `services/`. No conoce la forma de la petición HTTP ni el origen del dato.
- **`services/`** es la **única** capa que sabe si el dato viene de un archivo local, un mock o una API real. Es la frontera con el exterior de toda la feature.

**Consecuencia directa:** hoy `services/` lee data local; el día que exista FastAPI, el cambio se limita a reescribir las funciones de `services/` de cada feature para que hagan `fetch` en vez de leer un archivo. Ni los componentes ni los hooks se enteran del cambio — su contrato con `services/` no varía.

**Localización de contenido — dos canales distintos, ver D5 (§7):** la copy de interfaz (botones, etiquetas, títulos de sección) llega por el catálogo de mensajes de next-intl, resuelto en el componente. El **contenido de dominio** (nombres y descripciones de los niveles de servicio, por ejemplo) llega por `services/`, que recibe el locale como parámetro explícito (`getServiceLevels(locale)`) y devuelve datos ya localizados — la cadena `componente → service → fuente` no cambia, solo gana un parámetro. El catálogo de mensajes nunca contiene datos de dominio.

## 5. Estrategia de renderizado

**Server Components por defecto.** `"use client"` se añade solo cuando un componente concretamente lo necesita:

- Mantiene estado local (`useState`, `useReducer`).
- Usa efectos (`useEffect`, `useLayoutEffect`).
- Registra manejadores de evento del navegador (`onClick`, `onChange`, …).
- Accede a APIs exclusivas del navegador (`window`, `localStorage`, media queries en runtime, etc.).

**Regla de posición:** la frontera `"use client"` se empuja lo más abajo posible en el árbol de componentes — al componente hoja que realmente necesita interactividad, no al contenedor que lo envuelve. _Marcar un componente alto en el árbol como cliente arrastra a todos sus hijos al bundle de cliente aunque no lo necesiten, y elimina el streaming/SSR que Server Components ofrece por defecto._

**Caso concreto — `LocaleSwitcher`:** es deliberadamente un Server Component (dos enlaces a `/es` y `/en`, sin estado ni efectos). La condición que lo convertiría en cliente es la aparición de rutas más allá de `/` (`/servicios`, `/contacto`), momento en que necesita `usePathname()` para preservar la ruta activa al cambiar de idioma.

**Primer `"use client"` del proyecto — hoy `ImageAnimation`:** el primer Client Component fue `BrushStroke` (spec `ia-docs/specs/001-brush-animated-large/req-001.md`), que usaba `IntersectionObserver` para animar su "pintado" al entrar en viewport, una API exclusiva del navegador — la excepción a la regla anterior, aplicada exactamente como la regla exige: la frontera quedaba en la hoja, `Hero` y `HomePage` seguían siendo Server Components. Se generalizó después en `ImageAnimation` (`src/shared/components/ImageAnimation.tsx`, ver `ia-docs/global/styles.md` §5.5) para poder animar cualquier imagen, no solo la brocha — `BrushStroke.tsx` ya no existe, `ImageAnimation` conserva su lugar como primer Client Component del proyecto. La lógica del observer se extrajo a `useViewportCycle` (`src/shared/hooks/`), compartida con los demás Client Components.

**Client Components del proyecto (tres a la fecha):** `ImageAnimation` (arriba) y `HackerText` (`src/shared/components/HackerText.tsx`, ver `ia-docs/global/styles.md` §5.5) son componentes **genéricos y reutilizables** de `shared/components/` — no pertenecen a ninguna feature. `HackerText` generaliza al antiguo `HeroEyebrow` (spec `ia-docs/specs/003-phrase-animation/req-003.md`): anima cualquier texto que se le pase por prop con un revoltijo de letras, en vez de estar atado al eyebrow del Hero. `HeroVisual` (`src/features/landing/components/HeroVisual.tsx`, spec `ia-docs/specs/002-image-animated-hero/req-002.md`) sigue siendo el único Client Component propio de una feature — orquesta tres instancias de `ImageAnimation` (brocha, laptop, dashboard) para que las tres entren encadenadas. Los tres son hojas — ninguno sube la frontera a `Hero` ni a `HomePage`. `HackerText` es el único que renderiza **texto traducido** en vez de ser puramente decorativo; la mitigación es que el texto le llega por prop, ya resuelto por el Server Component que lo monta (`Hero`, vía `useTranslations`) — `HackerText` nunca importa el catálogo de mensajes, así que `NextIntlClientProvider` sigue sin ser necesario.

## 6. Rutas

El árbol de `app/` refleja uno a uno las features existentes — no hay una feature sin ruta ni una ruta sin feature dueña. Todas las rutas del sitio están **localizadas y prefijadas** (`/es`, `/en`) salvo la raíz, que es un shim sin locale propio:

| Ruta                             | Feature            | Estado       | Nota                                                                                                                                                                                                |
| -------------------------------- | ------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                              | —                  | Implementada | Shim estático (`app/(root)/`) sin feature dueña: `<meta http-equiv="refresh">` a `/es`. No usa `redirect()` porque no produce HTML exportable bajo `output: 'export'` — ver §8                      |
| `/es`, `/en`                     | `landing`          | Implementada | Home por locale; ensambla también `services-catalog` como sección de la página                                                                                                                      |
| `/es/servicios`, `/en/servicios` | `services-catalog` | Pendiente    | Catálogo completo como ruta propia. ⚠ El segmento debe ser **idéntico** en ambos locales (`servicios`, no `services` en inglés): sin servidor no hay _rewrites_ que soporten _pathnames_ traducidos |
| `/es/contacto`, `/en/contacto`   | `contact`          | Pendiente    | Formulario de contacto. Mismo requisito de segmento idéntico                                                                                                                                        |

> **Sin `pricing` ni precios en la landing.** Es una decisión de producto, no una omisión: la home no muestra rangos de precio de ningún nivel de servicio, aunque el catálogo fuente los incluya. Si en el futuro se decide publicar precios, se hace como una feature `pricing` explícita y su propia ruta — no se reintroducen tácitamente dentro de `landing` o `services-catalog`.

`app/[locale]/<ruta>/page.tsx` importa desde el `index.ts` de su feature dueña — nunca compone UI propia más allá de layout de página. Metadata y SEO (`generateMetadata`, `<title>`, OpenGraph) se definen en el `page.tsx`/`layout.tsx` correspondiente de `app/[locale]/`, no dentro de la feature, porque es responsabilidad del enrutador, no del dominio. Con i18n, `metadata` estático se reemplaza por `generateMetadata({ params })` async, que resuelve título/descripción/`og:locale` por locale y llama a `setRequestLocale` antes de cualquier función de next-intl.

`app/(root)/` es la única ruta sin locale y, por lo mismo, sin feature dueña: sus dos strings visibles (los enlaces de fallback a `/es` y `/en`) van hardcodeados a propósito, con un comentario explicando por qué esa página no puede usar el catálogo de mensajes.

> Esta tabla es el mapa vigente mientras el sitio tenga estas cuatro features. Al añadir una feature nueva con ruta propia, se añade su fila aquí en el mismo cambio.

## 7. Decisiones estructurales

Formato: Decisión / Contexto / Consecuencias.

**D1 — Frontend y backend son proyectos separados, nunca un monolito Next.js.**

- _Contexto:_ Next.js permite implementar backend en Route Handlers, lo cual tienta a resolver ahí cualquier necesidad de servidor "rápida".
- _Consecuencias:_ cualquier lógica de negocio, acceso a datos con estado o secreto de API vive fuera de este repositorio, en el futuro servicio FastAPI. Este repositorio nunca gestiona sesiones ni tiene credenciales de base de datos.

**D2 — Organización por feature, no por tipo de archivo.**

- _Contexto:_ un proyecto organizado por tipo (`components/`, `hooks/`, `services/` a nivel raíz) escala mal: para entender una funcionalidad hay que saltar entre carpetas no relacionadas por dominio.
- _Consecuencias:_ cada feature es autocontenida y expone una única superficie pública (`index.ts`); lo compartido vive en `shared/`; ver §3.

**D3 — `services/` es la única frontera de datos.**

- _Contexto:_ si los componentes hacen `fetch` directo, el día que cambie el origen del dato (local → FastAPI) el cambio se dispersa por toda la feature.
- _Consecuencias:_ toda comunicación con el exterior pasa por `services/`; ver §4.

**D4 — CSS Modules + variables CSS puras, no un framework de utilidades.**

- _Contexto:_ la identidad visual (`styles.md`) está definida como tokens exactos (color, tipografía, espaciado) extraídos de activos de marca reales, no como una paleta genérica de utilidades.
- _Consecuencias:_ cada componente tiene su `Componente.module.css`; ningún valor de diseño se escribe literal, todo se consume vía `var(--token)` (ver [`tech-stack.md`](./tech-stack.md) §4 para el detalle de implementación).

**D5 — La copy de UI se localiza en el catálogo de mensajes; el contenido de dominio se localiza en `services/`.**

- _Contexto:_ los nombres y descripciones de los niveles de servicio son datos que el negocio posee — hoy vienen del catálogo PDF, mañana los serviría FastAPI ya localizados por `Accept-Language` o `?lang=`. Resolverlos desde `messages/*.json` por `id` crearía dos fuentes de verdad para el mismo campo el día que exista ese backend, exactamente la dispersión que D3 previene.
- _Consecuencias:_ `getServiceLevels(locale)` devuelve datos ya localizados; el catálogo de mensajes de next-intl nunca contiene datos de dominio (nombres de producto, descripciones de servicio, rangos de entrega); el límite entre "copy de UI" y "contenido de dominio" es de **propiedad** (quién puede cambiar el valor sin tocar código), no de si el valor es o no una cadena de texto.

## 8. Decisiones abiertas

**Hosting y estrategia de renderizado.** Sin definir todavía.

Implicación de cada rama:

- **Export estático** (`output: 'export'`): descarta SSR y cualquier proxy hacia FastAPI vía `app/api/**` (§2). El sitio se sirve como archivos estáticos desde cualquier CDN/hosting.
- **Despliegue en Node o Vercel**: habilita SSR y el proxy hacia FastAPI cuando exista.

**Restricción vigente mientras no se decida:** el código no debe depender de características exclusivas de servidor (Route Handlers con lógica, `cookies()`/`headers()` fuera del proxy delgado, **`proxy.ts`/`middleware.ts`**, etc.) que bloqueen la opción de export estático. Mantener ambas ramas abiertas hasta que el hosting se decida explícitamente.

> En el scaffold inicial, `next.config.ts` ya declara `images: { unoptimized: true }` para no depender de la optimización de imágenes en servidor — es lo único que se necesitaba tocar hasta ahora para no cerrar la rama de export estático.

**Internacionalización y esta restricción:** el enrutamiento de idioma (`/es`, `/en`) se implementó explícitamente **sin** `proxy.ts`/`middleware.ts` — esa es la razón por la que no hay detección automática de idioma por navegador, solo un selector manual. `Proxy` (nombre que Next 16 da al antiguo middleware) está en la lista de funciones no soportadas bajo `output: 'export'`; usarlo habría cerrado esta rama de forma unilateral. La restricción ahora es **verificable**, no solo declarativa: `npm run build:export` (ver [`tech-stack.md`](./tech-stack.md) §4) construye el sitio completo, con ambos locales, en modo export estático.
