# 004 — Diseño responsivo — Implementación

## 1. Estado

Pendiente de ejecutar. Este documento es el plan (el **cómo**) para cumplir `req-004.md`; a
diferencia de `impl-001.md` (escrito después de implementar, en pasado), este está en
imperativo/futuro porque narra pasos aún no ejecutados.

Orden de dependencias: la **Fase A (tokens y documentación)** bloquea todo lo demás — el CSS de
las fases B, C y D consume los tokens de breakpoint, contenedor, gutter, ritmo vertical y
tipografía fluida que ahí se crean, y `styles.md` debe quedar sincronizado antes de que ningún
`.module.css` use un valor que ese documento no reconozca (regla de `tech-stack.md` §3). La
**Fase C (navegación móvil)** depende de que la Fase B ya haya introducido los tokens de
contenedor/gutter que el panel del menú reutiliza. La **Fase D (verificación)** corre al final,
sobre el resultado completo.

## 2. Archivos de la entrega

| Archivo                                                                                                       | Rol                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ia-docs/global/styles.md`                                                                                    | Nueva sección de breakpoints/contenedor; tokens sincronizados en §7.1 y §7.2; corrección de la referencia obsoleta a `requirements.md` |
| `ia-docs/global/tech-stack.md`                                                                                | Nueva baseline de navegadores soportados                                                                                               |
| `ia-docs/global/architecture.md`                                                                              | Corrección de la misma referencia obsoleta a `requirements.md` (§5)                                                                    |
| `CLAUDE.md`                                                                                                   | Corrección de la misma referencia obsoleta a `requirements.md`                                                                         |
| `src/styles/tokens.css`                                                                                       | Modificado. Tokens de breakpoint (comentario de referencia), contenedor, gutter, ritmo vertical, tipografía fluida, z-index            |
| `src/styles/globals.css`                                                                                      | Modificado. `scroll-padding-top`, `-webkit-text-size-adjust`, `img { height: auto }`                                                   |
| `src/shared/components/Section.tsx` / `.module.css`                                                           | Modificado. Contenedor y padding vía los tokens nuevos, sin literales                                                                  |
| `src/shared/components/SiteHeader.tsx` / `.module.css`                                                        | Modificado. Monta `MobileNav`; `.nav` vuelve a mostrarse desde `md`; logo sin tamaño fijo en JSX                                       |
| `src/shared/components/MobileNav.tsx` (nuevo)                                                                 | Nuevo. Client Component: botón + panel del menú móvil (RF-7)                                                                           |
| `src/shared/components/MobileNav.module.css` (nuevo)                                                          | Nuevo. Estilos del botón y el panel, `@media (prefers-reduced-motion: reduce)`                                                         |
| `src/shared/components/Button.module.css`                                                                     | Modificado. `min-height: 44px`                                                                                                         |
| `src/shared/components/LocaleSwitcher.module.css`                                                             | Modificado. `min-height`/padding para llegar a 44px de área de toque                                                                   |
| `src/shared/components/SiteFooter.module.css`                                                                 | Modificado. Retira `max-width: 320px` de `.brand`; usa el token de contenedor                                                          |
| `src/features/landing/components/Hero.module.css`                                                             | Modificado. Grid 1→2 columnas migrado a `min-width: 1024px`                                                                            |
| `src/features/landing/components/HeroVisual.module.css`                                                       | Modificado. Mismo breakpoint que `Hero`; ajustes de proporción por debajo de `lg` (RF-9)                                               |
| `src/features/landing/components/Process.module.css`                                                          | Modificado. Grid 1→2→3 columnas en `md`/`lg`                                                                                           |
| `src/features/landing/components/FinalCta.module.css`                                                         | Modificado. Padding vertical vía token de ritmo (si aplica)                                                                            |
| `src/features/services-catalog/components/ServiceLevels.module.css`                                           | Modificado. Grid explícito 1→2→3 en `sm`/`lg`, sustituye `auto-fit minmax(220px,1fr)`                                                  |
| `src/features/services-catalog/components/ServiceLevelCard.module.css`                                        | Modificado. Verificación de que el badge absoluto no solapa en las columnas nuevas                                                     |
| `src/messages/es.json`, `src/messages/en.json`                                                                | Modificado. Namespace `shared.mobileNav` (o equivalente) con copy del botón de menú                                                    |
| `public/images/laptop-hero.png`, `app-dashboard-hero.png`, `logo-innovarx.jpg` y demás assets del header/hero | Modificado. Re-dimensionados/recomprimidos al presupuesto de RF-12                                                                     |
| `package.json`                                                                                                | Modificado (opcional). Campo `browserslist` reflejando la baseline de §4 de este documento                                             |

## 3. Pasos

### Fase A — Tokens y documentación

1. Agregar a `ia-docs/global/styles.md` una nueva subsección de breakpoints (p. ej. `### 5.6
Breakpoints y contenedor`, a continuación de la de movimiento) con la tabla de §2 de
   `req-004.md` (base/`sm`/`md`/`lg`/`xl`/`2xl` con sus `min-width`), y una nota explícita de
   que la condición de `@media` no acepta `var()` — por eso estos seis valores se citan
   literales en cada `.module.css`, y esta tabla es la fuente de verdad que todo literal debe
   igualar.
   - **Hecho cuando:** la tabla existe con los seis valores exactos de `req-004.md` §2 y la nota
     sobre `var()` en `@media` queda escrita.
2. En la misma subsección, documentar el token de contenedor (1120px) y el de gutter
   responsivo (16px base / 24px `md` / 32px `lg`), y sincronizar el bloque de código de §7.2
   (variables CSS puras) con los nombres exactos que se agregarán a `tokens.css` en el paso 4.
   - **Hecho cuando:** §7.2 de `styles.md` lista los mismos nombres y valores que
     `tokens.css` tendrá al final de este paso.
3. Documentar en `styles.md` §4.2 (o una nota adyacente) que la escala tipográfica pasa a tener
   un mínimo y un máximo por nivel (el máximo es el valor ya existente en la tabla; el mínimo
   se define aquí para `--text-display` y los headings), y en §5.1 que el ritmo vertical de
   sección (`--space-9`) pasa a tener un valor mínimo en base y el actual como máximo desde
   `lg`.
   - **Hecho cuando:** cada token que va a volverse fluido en el paso 4 tiene su mínimo y máximo
     documentados en prosa antes de existir en CSS.
4. Agregar a `src/styles/tokens.css`, en bloques nuevos dentro de `:root` y en bloques
   `@media (min-width: …)` según corresponda:
   - `--container-max: 1120px;`
   - `--space-gutter` con su valor base y sus reasignaciones en `md`/`lg` (o vía `clamp()` si el
     valor lo permite sin quedar fuera de los breakpoints exactos de §2).
   - `--space-section-y` con el mismo patrón que `--space-gutter`.
   - `--text-display` (y el resto de la escala que RF-5 pide fluida) redefinido con `clamp()`
     entre el mínimo de móvil documentado en el paso 3 y el máximo ya existente.
   - `--z-header: 10;` y cualquier otro z-index literal hoy suelto en componentes (`HeroVisual`
     usa `1`/`2`), para eliminar los literales de z-index sueltos aprovechados por este cambio.
   - **Hecho cuando:** cada token nuevo tiene su fila espejo ya escrita en `styles.md` §7.2
     (pasos 1–3), y ningún valor de estos tokens repite un breakpoint fuera de los seis de §2.
5. Agregar a `ia-docs/global/tech-stack.md` §4 (o una nueva subsección) la baseline de
   navegadores: últimas 2 versiones de Chrome/Edge/Firefox, Safari e iOS Safari desde 16 — y,
   si se decide, el campo `browserslist` correspondiente en `package.json`.
   - **Hecho cuando:** `tech-stack.md` deja de tener el vacío señalado en `req-004.md` §4 sobre
     baseline de navegadores.
6. Corregir de paso la referencia obsoleta a `requirements.md` (renombrado a `req-001.md` en el
   commit `e960f68`) que sigue apareciendo en `styles.md` §5.4, `architecture.md` §5 y
   `CLAUDE.md` — mismo criterio de "corregir de paso por tocar esa sección de todos modos" que
   usó `impl-002.md` paso 11 con la inconsistencia de `--duration-brush`.
   - **Hecho cuando:** ninguna de las tres referencias cita `requirements.md`; las tres apuntan a
     `req-001.md`.

### Fase B — Base global y shared

7. En `src/styles/globals.css`, agregar `scroll-padding-top` en `html` con un valor igual a la
   altura real del header sticky (medida en `SiteHeader.module.css`, hoy determinada por su
   padding + contenido), `-webkit-text-size-adjust: 100%`, y añadir `height: auto` a la regla
   existente `img { max-width: 100%; }` para que un `<img>` crudo constreñido por `max-width` no
   se deforme.
   - **Hecho cuando:** un enlace `#anchor` del nav deja el destino visible debajo del header
     sticky, no oculto tras él.
8. En `Section.module.css`, reemplazar el literal `max-width: 1120px` por `var(--container-max)`
   y `padding: var(--space-9) var(--space-5)` por `var(--space-section-y) var(--space-gutter)`.
   Repetir el reemplazo de `max-width: 1120px` por `var(--container-max)` en
   `SiteHeader.module.css` y en las dos apariciones de `SiteFooter.module.css`.
   - **Hecho cuando:** el literal `1120px` no aparece más de cero veces en `src/`, salvo dentro
     de la propia definición del token en `tokens.css`.
9. En `Button.module.css`, agregar `min-height: 44px` (ajustando `padding` si hace falta para
   mantener las proporciones visuales actuales). En `LocaleSwitcher.module.css`, aumentar
   `padding`/`min-height` de `.link` hasta alcanzar 44px de alto de área de toque.
   - **Hecho cuando:** ambos elementos miden ≥44px de alto en el inspector, en cualquier
     viewport.
10. En `SiteFooter.module.css`, retirar `max-width: 320px` de `.brand` y verificar que el
    `flex-wrap` existente apila limpiamente en 320px de ancho sin ese límite artificial.
    - **Hecho cuando:** en 320px de ancho ningún bloque del footer se recorta ni desborda
      horizontalmente.

### Fase C — Navegación móvil

11. Crear `src/shared/components/MobileNav.tsx` como Client Component (`"use client"` en la
    hoja, empujando la frontera lo más abajo posible, siguiendo `CLAUDE.md`): recibe por props
    los enlaces de navegación ya traducidos (label + href), el nodo o props del `LocaleSwitcher`
    y del CTA, y el texto del botón de apertura/cierre — nunca importa `useTranslations` ni el
    catálogo de mensajes directamente, mismo criterio que `req-003` §4 aplicó a `HackerText`.
    Mantiene `const [open, setOpen] = useState(false)`.
    - **Hecho cuando:** el componente compila, no importa nada de otra feature ni usa
      `useTranslations`/`getTranslations` directamente.
12. Implementar en `MobileNav.tsx` el manejo de foco atrapado (guardar el elemento con foco
    antes de abrir, mover el foco al primer enlace del panel al abrir, ciclar `Tab`/`Shift+Tab`
    dentro del panel, devolver el foco al botón al cerrar), el cierre con `Escape`, el cierre al
    hacer click fuera del panel (listener en `document`), el cierre al seleccionar un enlace, y
    el cierre automático si `window.matchMedia` reporta que el viewport ya cruzó `min-width:
768px` mientras el panel está abierto.
    - **Hecho cuando:** las cinco vías de cierre de RF-7 funcionan manualmente en dev tools, y el
      foco de teclado nunca escapa del panel mientras está abierto.
13. Mientras `open === true`, aplicar bloqueo de scroll del `body` (p. ej. alternando una clase
    que fija `overflow: hidden` en `body`, aplicada vía `document.body.classList`, revertida en
    cleanup del efecto).
    - **Hecho cuando:** con el panel abierto, hacer scroll con la rueda/gesto no mueve el
      contenido detrás del panel; al cerrar, el scroll se restaura sin saltar de posición.
14. Crear `MobileNav.module.css`: botón con ícono hamburguesa/cierre (mín. 44×44px, RF/accesib.
    de `req-004.md` §6), panel `position: fixed` cubriendo el viewport bajo el header, con
    transición de entrada/salida controlada por una clase de estado; bloque
    `@media (prefers-reduced-motion: reduce)` que fuerza la transición a instantánea, mismo
    patrón de garantía-en-CSS que `BrushStroke.module.css` y `HeroVisual.module.css` ya usan.
    El panel y el botón usan `env(safe-area-inset-*)` para no quedar bajo el notch/home-indicator
    de iOS.
    - **Hecho cuando:** con `prefers-reduced-motion: reduce` activo en dev tools, el panel
      aparece/desaparece sin animación perceptible.
15. Modificar `SiteHeader.tsx` (Server Component, sin ganar `"use client"`) para resolver los
    textos de nav/CTA/botón de menú vía `useTranslations` como ya hace, montar `<nav>` visible
    solo desde `md` (`.nav` recupera su regla, ahora con `@media (min-width: 768px) { display:
flex }` en vez de la actual `display: none` en `max-width: 720px`), y montar `<MobileNav
links={...} />` visible solo por debajo de `md`, pasando los textos ya traducidos por props.
    Quitar el `width={160} height={80}` fijo del `<Image>` del logo y sustituirlo por un tamaño
    que responda al espacio disponible vía CSS (`SiteHeader.module.css`), manteniendo el
    `aspect-ratio` real del archivo.
    - **Hecho cuando:** `SiteHeader.tsx` sigue siendo Server Component; en <768px se ve el botón
      de `MobileNav` y no el `<nav>` inline; desde 768px ocurre lo inverso; el logo no desborda
      ni se solapa con el botón de menú en 320px.
16. Agregar el namespace de mensajes necesario (p. ej. `shared.mobileNav.open` /
    `shared.mobileNav.close`) a `src/messages/es.json` y `src/messages/en.json`.
    - **Hecho cuando:** ambos catálogos tienen las mismas claves, sin texto literal en
      `MobileNav.tsx`/`SiteHeader.tsx` para ese copy.

### Fase D — Features y verificación

17. En `Hero.module.css` y `HeroVisual.module.css`, reemplazar `@media (max-width: 900px)` por
    `@media (min-width: 1024px)`, invirtiendo cada regla (lo que hoy es el estado "por debajo de
    900px" pasa a ser el estado base sin media query; lo que hoy es el estado por encima de
    900px pasa a vivir dentro del nuevo bloque `min-width: 1024px`).
    - **Hecho cuando:** el grid de `Hero` es 1 columna en base y 2 columnas desde 1024px; la
      composición de `HeroVisual` (aspect-ratio, anchos de `.brush`/`.laptop`/`.dashboard`) sigue
      el mismo patrón invertido, cumpliendo RF-9 en cualquier ancho intermedio, no solo en el
      punto exacto de 1024px.
18. En `Process.module.css`, reemplazar `@media (max-width: 800px)` por dos bloques:
    `@media (min-width: 768px)` con `grid-template-columns: repeat(2, 1fr)` y
    `@media (min-width: 1024px)` con `repeat(3, 1fr)`; el estado base (sin media query) queda en
    `1fr`.
    - **Hecho cuando:** `Process` muestra 1/2/3 columnas exactamente en los tres rangos de RF-6.
19. En `ServiceLevels.module.css`, reemplazar `grid-template-columns: repeat(auto-fit,
minmax(220px, 1fr))` por columnas explícitas: `1fr` en base, `repeat(2, 1fr)` desde
    `min-width: 640px`, `repeat(3, 1fr)` desde `min-width: 1024px`. Verificar en
    `ServiceLevelCard.module.css` que `.badge` (`position: absolute; top: 16px; right: 16px`) no
    solapa `.name` en el ancho de columna resultante de 2 columnas en `sm`.
    - **Hecho cuando:** no hay overflow horizontal de la grilla en 320px y el badge no se solapa
      visualmente con el nombre del nivel en ninguna de las tres configuraciones de columnas.
20. Revisar `FinalCta.module.css` y cualquier otro `.module.css` con padding vertical fijo que
    no haya sido cubierto en la Fase B, migrándolo a `var(--space-section-y)` si corresponde.
    - **Hecho cuando:** no queda padding de sección con literal en px fuera de los tokens del
      paso 4.
21. Re-dimensionar/recomprimir los assets del Hero/header (`laptop-hero.png`,
    `app-dashboard-hero.png`, `logo-innovarx.jpg` y el brush si aplica) al presupuesto de peso
    fijado para imágenes `priority`, y revisar cuál de las cuatro imágenes actuales con
    `priority` es realmente el elemento LCP — quitando la prop de las que no lo sean.
    - **Hecho cuando:** el peso combinado de las imágenes que conservan `priority` cae dentro
      del presupuesto documentado, medido con las herramientas de red del navegador en un
      viewport de 375px.
22. Ejecutar `npm run lint`.
    - **Hecho cuando:** sale sin errores ni warnings nuevos.
23. Ejecutar `npm run build` e inspeccionar la tabla de rutas.
    - **Hecho cuando:** `/es` y `/en` siguen listadas como SSG (●), no dinámicas.
24. Ejecutar `npm run build:export`.
    - **Hecho cuando:** compila sin errores, confirmando que nada de lo agregado depende de
      features server-only (`architecture.md` §8).
25. Levantar `npm run dev` y recorrer manualmente los criterios de aceptación de `req-004.md`
    §8 en los nueve anchos listados ahí (320/375/414/640/768/1024/1280/1536/2560px), en ambos
    locales, incluyendo la emulación de `prefers-reduced-motion: reduce` y la desactivación
    temporal de `overflow-x: clip` en dev tools para el chequeo de RF-13.
    - **Hecho cuando:** cada checkbox de `req-004.md` §8 queda verificado y, si alguno falla, se
      documenta como desvío en §6 de este documento antes de marcarlo.

## 4. Puntos finos

- **`min-width` en vez de `max-width`:** con `max-width` cada regla describe "hasta dónde
  aguanta el layout de escritorio", lo que obliga a pensar el diseño desde arriba y a repetir
  ajustes cada vez que se agrega un breakpoint intermedio (el salto directo 3→1 de `Process` es
  síntoma de esto). Con `min-width` el estado base ya es el de celular, y cada breakpoint solo
  añade lo que el espacio extra permite — coherente con el pedido explícito de mobile-first.
- **Breakpoints literales pese a la regla general de tokens:** `@media` no evalúa `var()` en su
  condición (limitación real de CSS, no de este proyecto), así que los seis valores de §2 no
  pueden vivir como variable consumida directamente en la condición. La solución no es
  inventar una excepción silenciosa a la regla de `tech-stack.md` §3, sino declarar
  explícitamente que la fuente de verdad es la tabla de `styles.md` (Fase A, paso 1) y que todo
  literal debe igualarla — el equivalente a un token, solo que verificado por inspección/lint
  en vez de por indirección de CSS.
- **Sistema CSS-only, no `useMediaQuery`:** un hook de React que escuche `window.matchMedia`
  para decidir qué renderizar forzaría `"use client"` en cualquier componente que lo use
  (`architecture.md` §5), empujando la frontera cliente hacia arriba del árbol. Todo el sistema
  de breakpoints se resuelve en CSS; el único uso de `matchMedia` en JS es el de
  `MobileNav.tsx` (paso 12), acotado a decidir si debe autocerrarse — no a decidir qué pintar.
- **`overflow-x: clip` se mantiene, no se elimina:** existe porque `.brush` se diseñó para
  desbordar su columna al 130% (`impl-001.md` §7) y `overflow: hidden` rompería
  `position: sticky` del header. RF-13 no pide quitarlo — pide poder verificar, con la
  propiedad temporalmente desactivada en dev tools, que ningún _otro_ elemento depende de ese
  recorte para no generar scroll horizontal. Si el paso 25 encuentra un elemento que sí depende
  de él, se corrige ese elemento, no se retira la propiedad de `globals.css`.
- **Migrar la escala tipográfica a `clamp()` sin romper la escala documentada:** el máximo de
  cada `clamp()` es literalmente el valor ya existente en `styles.md` §4.2 — este documento no
  cambia ningún tamaño máximo, solo agrega un mínimo y una curva de interpolación entre ambos.

## 5. Trazabilidad RF → paso/archivo

| Requisito (`req-004.md`)                                                              | Dónde se cumple                                             |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| RF-1 (mobile-first, sin `max-width`)                                                  | Pasos 17–20, migración de las tres media queries existentes |
| RF-2 (escala única documentada)                                                       | Pasos 1, 4 — tabla en `styles.md`, tokens sincronizados     |
| RF-3 (contenedor y gutters)                                                           | Pasos 2, 4, 8                                               |
| RF-4 (ritmo vertical)                                                                 | Pasos 3, 4, 8, 20                                           |
| RF-5 (tipografía fluida)                                                              | Pasos 3, 4                                                  |
| RF-6 (grids adaptativos)                                                              | Pasos 17–19                                                 |
| RF-7 (navegación móvil)                                                               | Pasos 11–16                                                 |
| RF-8 (header sin desborde en 320px)                                                   | Paso 15                                                     |
| RF-9 (composición del Hero en móvil)                                                  | Paso 17                                                     |
| RF-10 (footer apilado)                                                                | Paso 10                                                     |
| RF-11 (imágenes fluidas sin scroll horizontal)                                        | Paso 7 (`img { height: auto }`), verificación en paso 25    |
| RF-12 (presupuesto de imagen)                                                         | Paso 21                                                     |
| RF-13 (sin scroll horizontal 320–2560px)                                              | Verificación en paso 25                                     |
| §4 RNF (breakpoints en `styles.md` primero)                                           | Pasos 1–6                                                   |
| §4 RNF (tokens fluidos concentran breakpoints)                                        | Paso 4                                                      |
| §4 RNF (baseline de navegadores)                                                      | Paso 5                                                      |
| §4 RNF (`"use client"` no sube salvo `MobileNav`)                                     | Pasos 11, 15                                                |
| §5 accesibilidad (tap targets, foco, `scroll-padding-top`, safe-area, reduced-motion) | Pasos 7, 9, 12, 14                                          |

## 6. Riesgos y deuda conocida

- **Sin verificación visual automatizada:** misma limitación que `impl-001.md` §11 e
  `impl-002.md` §6 — esta máquina no tiene Playwright/`chromium-cli` ni permiso de
  Accesibilidad para automatizar Safari vía `osascript`. El paso 25 es enteramente manual;
  cada checkbox de `req-004.md` §8 queda pendiente de confirmación por inspección directa, no
  por script.
- **`req-002` RF-7 queda superado, no eliminado:** el criterio original ("por debajo de 900px el
  dashboard no se sale de `.visual`") se reemplaza en la práctica por `req-004` RF-9, que cubre
  el rango completo por debajo de `lg`, no solo el punto de 900px. `req-002.md` no se edita
  retroactivamente — esta nota es la referencia de que el comportamiento sigue garantizado bajo
  un requisito más amplio.
- **Riesgo de crecimiento de `MobileNav` hacia necesitar `NextIntlClientProvider`:** mientras
  reciba todo el texto por props (paso 11), la mitigación de §5 de `req-004.md` se sostiene. Si
  una futura entrega le agrega lógica que necesite el catálogo de mensajes directamente (p. ej.
  formateo de fecha/número localizado dentro del panel), ese sería el primer punto real donde
  `NextIntlClientProvider` deja de poder postergarse — se deja anotado, no se resuelve aquí.
- **Posible desincronización de animaciones al cruzar breakpoints en vivo:** ya documentado en
  `impl-003.md` §7 para el caso de dos observers independientes en `Hero`/`HeroVisual`; migrar
  esas secciones a `min-width` (paso 17) no introduce el riesgo, pero tampoco lo resuelve — sigue
  aceptado como comportamiento correcto según ese documento.
- **El presupuesto de imagen de RF-12 depende de recomprimir assets a mano** (mismo proceso
  artesanal que `impl-001.md` §3 e `impl-002.md` Fase A, sin `pngquant`/`oxipng`/`sips` con
  soporte WebP en esta máquina) — si el resultado no alcanza el presupuesto fijado, queda como
  desvío documentado en este mismo apartado al ejecutar el paso 21, no como bloqueo de toda la
  entrega.
- **Presupuesto de imágenes `priority`:** máximo combinado de 150 KB transferidos en el viewport
  móvil de 375px. Solo `laptop-hero.png`, candidato visual a LCP del Hero, conserva `priority`;
  su versión pre-redimensionada y recomprimida pesa 121.627 bytes.
