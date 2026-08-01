# 002 — Laptop y dashboard animados delante de la brocha del Hero — Implementación

## 1. Estado

Pendiente de ejecutar. Este documento es el plan (el **cómo**) para cumplir
`req-002.md`; a diferencia de `impl-001.md` (escrito después de implementar, en pasado), este
está en imperativo/futuro porque narra pasos aún no ejecutados.

Orden de dependencias: la **Fase A (assets)** bloquea todo lo demás — sin `laptop-hero.png` y
`app-dashboard-hero.png` con alfa real no hay nada que montar en componentes (req-002 §4, "sin
este archivo, el componente no puede implementarse", igual que en req-001). La **Fase B
(tokens)** debe cerrar antes de escribir el CSS de la Fase C, porque ese CSS consume el token
nuevo. La **Fase D (verificación)** corre al final, sobre el resultado completo.

## 2. Archivos de la entrega

| Archivo | Rol |
| --- | --- |
| `public/images/app-dashboard-hero.png` | Nuevo. Dashboard desmateado (alfa real), recortado, comprimido. |
| `public/images/laptop-hero.png` | Nuevo. Laptop con halo eliminado, recortada a bbox, comprimida. |
| `src/shared/components/BrushStroke.tsx` | Modificado. Prop opcional `onPaintedChange`. |
| `src/features/landing/components/HeroVisual.tsx` | Nuevo. Client component: orquesta brocha + laptop + dashboard. |
| `src/features/landing/components/HeroVisual.module.css` | Nuevo. `.visual`, `.brush`, `.laptop`, `.dashboard`, `@keyframes reveal`. |
| `src/features/landing/components/Hero.tsx` | Modificado. Monta `HeroVisual` en vez de `BrushStroke` directo. |
| `src/features/landing/components/Hero.module.css` | Modificado. Se retiran `.visual`/`.brush` (migran a `HeroVisual.module.css`). |
| `src/styles/tokens.css` | Modificado. Token `--delay-stagger`. |
| `ia-docs/global/styles.md` | Modificado. §5.4 fila nueva; corrección de la inconsistencia en §7.2 (ver §6 de este documento). |

## 3. Pasos

### Fase A — Assets

1-3. **Superados (2026-08-01).** Estos tres pasos describían el desmatado por dos fondos
   conocidos para reconstruir un alfa real a partir del damero horneado en la versión original de
   `imagen_app_dashboard.png` (928×1695, RGB sin alfa). El usuario re-exportó esa fuente
   directamente con canal alfa real (369×675, RGBA, color type 6, borde limpio sin franja gris),
   dejando obsoleto el desmatado. Es exactamente el "plan B" que este documento ya anticipaba en
   el paso 3 — recortar con el alfa real disponible y resolver la sombra en CSS — solo que
   aplicado desde el origen en vez de como fallback. Ver desvío en §6.
4. Sobre `public/images/imagen_app_dashboard.png` (fuente RGBA re-exportada), recortar al
   bounding box real del contenido (umbral α>8, para descartar píxeles sueltos casi transparentes
   pegados al borde del lienzo) con un margen de respiro de ~10px por lado, igual que se hizo con
   `brush-stroke-large.png` en req-001 §3.
   - **Hecho cuando:** el nuevo bbox no tiene franjas transparentes de más de ~10px en ningún
     borde. Medido: bbox de contenido x 48→320, y 51→625; recorte final con respiro 293×595.
5. Decodificar `public/images/imagen_laptop.png` (RGBA) y binarizar su canal alfa: todo px con
   α actual > ~192 pasa a 255, el resto a 0; suavizar el borde resultante con un feather de 1–2px
   (blur del canal alfa acotado a esa franja) para no dejarlo dentado.
   - **Hecho cuando:** un histograma de alfa posterior al proceso muestra prácticamente solo dos
     picos (0 y 255), sin la meseta intermedia de ~6.333 muestras en el rango 1–249 medida en el
     original.
6. Recortar el resultado del paso 5 a su bounding box real: x 269→1359, y 83→945 (medido sobre
   el archivo original de 1536×1024), con el mismo margen de respiro de ~10px.
7. Reescalar ambos assets a ~2× su mayor tamaño de despliegue previsto (laptop ≈1120px de ancho,
   dashboard ≈300px de ancho — ver §7 de la investigación técnica, contenedor de 1120px en
   `Section.module.css:19`) y comprimir con el mismo camino que `brush-stroke-large.png`
   (`impl-001.md` §3): encoder PNG propio con filtro adaptativo por línea + `zlib` nivel 9, ya
   que esta máquina no tiene `pngquant`/`oxipng` ni soporte de `sips` para WebP.
   - **Hecho cuando:** ambos archivos pesan en el orden de magnitud de `brush-stroke-large.png`
     (~600 KB), no en los MB de los originales — ver criterio de aceptación de req-002 §7.
8. Guardar los resultados en `public/images/laptop-hero.png` y
   `public/images/app-dashboard-hero.png`, dejando `imagen_laptop.png` /
   `imagen_app_dashboard.png` intactos como fuente (mismo criterio que `imagen-brocha-1.png` en
   req-001).
   - **Hecho cuando:** ambos archivos nuevos existen en `public/images/`, con canal alfa real
     verificado por `IHDR` color type 6/4, y los originales no fueron tocados.

### Fase B — Tokens y documentación

9. Agregar `--delay-stagger: 250ms;` a `src/styles/tokens.css`, en el bloque "Movimiento"
   (`tokens.css:86-92`), junto a `--duration-brush`.
   - **Hecho cuando:** el token existe y su valor cae dentro del rango 200–300ms pedido por
     req-002 RF-3.
10. Documentar el token nuevo en `ia-docs/global/styles.md` §5.4 (tabla de motion), con la misma
    forma que las filas existentes: nombre, valor, uso ("Retardo entre laptop y dashboard al
    entrar en el Hero").
    - **Hecho cuando:** la fila existe y el bloque de código de tokens en §7.2 de `styles.md`
      queda sincronizado con `tokens.css` (incluye `--delay-stagger`).
11. Aprovechar el paso anterior para corregir la inconsistencia preexistente detectada en esta
    sesión: `styles.md` §7.2 (~línea 368) todavía cita `--duration-brush: 1800ms`, mientras que
    la tabla de §5.4 y `tokens.css:90` ya dicen `4000ms`. Alinear el bloque de código de §7.2 al
    valor real.
    - **Hecho cuando:** `--duration-brush` aparece como `4000ms` en los tres lugares
      (`tokens.css`, tabla §5.4, bloque §7.2).

### Fase C — Componentes

12. En `BrushStroke.tsx`, agregar la prop opcional `onPaintedChange?: (painted: boolean) => void`
    a `BrushStrokeProps` (`BrushStroke.tsx:7-13`), sin valor por defecto y sin volverla
    obligatoria — los consumidores actuales (`Hero.tsx`) no cambian.
    - **Hecho cuando:** el tipo compila y ningún llamado existente de `BrushStroke` necesita
      tocarse.
13. Invocar `onPaintedChange?.(true)` en el manejador `onAnimationEnd` del `<Image>` enmascarado
    (`BrushStroke.tsx:71-81`), agregando ese manejador al JSX.
    - **Hecho cuando:** el callback se dispara exactamente cuando termina la animación CSS de
      pintado (`@keyframes paint`), no antes.
14. Invocar `onPaintedChange?.(false)` en la misma rama del observer que ya pone
    `setIsVisible(false)` (`BrushStroke.tsx:52-58`, rama `!entry.isIntersecting`), para que el
    consumidor sepa que el ciclo se reinició.
    - **Hecho cuando:** al salir del viewport por completo, `onPaintedChange(false)` se dispara
      una sola vez por salida — cumple req-002 RF-5/RF-6 (reposo = imágenes no visibles).
15. Crear `src/features/landing/components/HeroVisual.tsx` como Client Component
    (`"use client"` en la hoja, siguiendo la regla de `CLAUDE.md` de empujar la frontera lo más
    abajo posible): recibe las mismas responsabilidades que hoy tiene el bloque `.visual` dentro
    de `Hero.tsx`, mantiene `const [painted, setPainted] = useState(false)`, monta
    `<BrushStroke className={styles.brush} onPaintedChange={setPainted} />` y, delante de ella,
    la laptop y el dashboard como `next/image` con `className` condicionado a `painted` (p. ej.
    `${styles.laptop} ${painted ? styles.isRevealed : ""}`).
    - **Hecho cuando:** el componente compila, no importa nada de otra feature (regla de
      `architecture.md` §3), y expone las tres capas en el orden laptop → dashboard → (brocha ya
      detrás por orden de montaje, ver paso 16).
16. Crear `HeroVisual.module.css` migrando literalmente las reglas `.visual` y `.brush` (y su
    bloque `@media (max-width: 900px)`) desde `Hero.module.css:13-32`, y agregar `.laptop`/
    `.dashboard` con `position: absolute` dentro de `.visual` (que ya tiene
    `isolation: isolate`), reproduciendo la composición de `captura_hero.png`: laptop ocupando
    el grueso de la columna, dashboard menor solapando su esquina inferior derecha con
    `z-index` mayor.
    - **Hecho cuando:** el espacio de ambas imágenes está reservado en el layout desde el primer
      render (dimensiones explícitas vía `width`/`height` de `next/image` + CSS, no insertadas
      de golpe) — cumple el requisito de CLS ≈ 0 de req-002 §3.
17. Agregar en `HeroVisual.module.css` las clases `.isRevealed` para laptop y dashboard con
    `animation: reveal var(--duration-base) var(--ease-out) forwards`, y un
    `@keyframes reveal` que anime `opacity: 0 → 1` y `transform: translateY(var(--space-3)) →
    translateY(0)`. En la regla de `.dashboard.isRevealed`, agregar
    `animation-delay: var(--delay-stagger)` para el escalonado de RF-3. Reposo (sin
    `.isRevealed`): `opacity: 0`.
    - **Hecho cuando:** con `painted=false` ambas imágenes están en `opacity: 0`; con
      `painted=true`, la laptop entra de inmediato y el dashboard ~250ms después — cumple RF-2,
      RF-3, RF-4, RF-6.
18. Agregar en `HeroVisual.module.css` el bloque `@media (prefers-reduced-motion: reduce)` que
    fuerza `opacity: 1; transform: none; animation: none;` en `.laptop`/`.dashboard`
    incondicionalmente (sin depender de `.isRevealed`), siguiendo el mismo patrón de garantía-en-
    CSS de `BrushStroke.module.css:55-64`. Esto es necesario porque con `reduced-motion` la
    brocha nunca dispara `onAnimationEnd` (su propia animación está en `animation: none`), así
    que `painted` se queda en `false` para siempre y el único mecanismo que puede mostrar las
    imágenes es este bloque CSS, no el estado de React.
    - **Hecho cuando:** con `prefers-reduced-motion: reduce` activo, las tres capas (brocha,
      laptop, dashboard) se ven completas de inmediato sin depender de ningún estado de JS —
      cumple req-002 §5.
19. Modificar `Hero.tsx` para importar y montar `<HeroVisual />` en vez del bloque actual
    `<div className={styles.visual}><BrushStroke className={styles.brush} /></div>`
    (`Hero.tsx` líneas finales), y limpiar el comentario que anticipaba esta entrega. Modificar
    `Hero.module.css` retirando `.visual`/`.brush` (ahora viven en `HeroVisual.module.css`).
    - **Hecho cuando:** `Hero.tsx` sigue siendo Server Component (no gana `"use client"`), solo
      importa `HeroVisual` desde el mismo feature (`./HeroVisual`, sin cruzar features) y el
      grid de dos columnas de `Hero.module.css` sigue intacto salvo por las reglas migradas.

### Fase D — Verificación

20. Ejecutar `npm run lint`.
    - **Hecho cuando:** sale sin errores ni warnings nuevos.
21. Ejecutar `npm run build` e inspeccionar la tabla de rutas.
    - **Hecho cuando:** `/es` y `/en` siguen listadas como SSG (●), no dinámicas — igual que
      exige el criterio de aceptación de req-002 §7 y el precedente de `impl-001.md` §10.
22. Ejecutar `npm run build:export`.
    - **Hecho cuando:** compila sin errores, confirmando que nada de lo agregado depende de
      features server-only (`architecture.md` §8).
23. Levantar `npm run dev` y, en el Hero, verificar la secuencia completa al cargar: brocha
    pintándose, y solo al terminar, laptop y luego dashboard apareciendo con fade + subida.
    - **Hecho cuando:** el orden temporal observado es brocha → laptop → dashboard (con el salto
      perceptible de ~250ms entre las dos imágenes), nunca imágenes antes de que la brocha
      termine.
24. Hacer scroll hasta perder el Hero de vista por completo y volver a subir; repetir con un
    scroll parcial que no saque el Hero completamente de pantalla.
    - **Hecho cuando:** en el primer caso el ciclo completo se repite desde cero (brocha +
      ambas imágenes); en el segundo, nada se reinicia ni queda a medias — cumple RF-5/RF-6 y el
      criterio anti-parpadeo heredado de req-001 RF-4.
25. En las dev tools, emular `prefers-reduced-motion: reduce` y volver a cargar; luego achicar el
    viewport por debajo de 900px.
    - **Hecho cuando:** con reduced-motion, las tres capas aparecen completas sin animación ni
      repetición por scroll; por debajo de 900px, el dashboard no se sale de `.visual` ni tapa
      la laptop por completo — cumple RF-7 y req-002 §5.

## 4. Puntos finos

- **`animationend` en vez de un segundo `setTimeout`:** duplicar `--duration-brush` en un timer
  aparte crearía una segunda fuente de verdad sobre cuánto dura el pintado; si ese token cambia
  (ya cambió una vez, de 1800ms a 4000ms, ver §6), un `setTimeout` fijo se desincroniza en
  silencio. Escuchar el evento real del DOM no tiene ese riesgo.
- **CSS como garantía de `reduced-motion`, no JS:** igual que en `impl-001.md` §6, si el corte
  viviera solo en el `useState` de `HeroVisual`, un bug en la detección de `matchMedia` (o el
  hecho, ya señalado en el paso 18, de que `onAnimationEnd` no se dispara con `reduced-motion`)
  dejaría las imágenes invisibles para siempre en vez de mostrarlas de más. El bloque CSS
  incondicional del paso 18 es lo que efectivamente cumple el criterio de accesibilidad.
- **La frontera `"use client"` no sube:** `HeroVisual` es la nueva hoja cliente (reemplaza al
  bloque que antes montaba `BrushStroke` directo dentro de `Hero`), pero `Hero` y `HomePage`
  siguen siendo Server Components — mismo patrón que req-001 §5 ya validó para `BrushStroke`.
- **Sin librería de animación:** el escalonado y el fade se resuelven con `@keyframes` +
  `animation-delay`, sin GSAP/Framer Motion, consistente con `req-002.md` §3 y con la decisión
  ya tomada en `impl-001.md` §9.

## 5. Trazabilidad RF → paso/archivo

| Requisito (`req-002.md`) | Dónde se cumple |
| --- | --- |
| RF-1 (composición delante de la brocha) | Pasos 15–16, `HeroVisual.tsx`/`.module.css` |
| RF-2 (arranca solo cuando termina la brocha) | Pasos 12–14 (`onPaintedChange`), paso 17 (`.isRevealed` depende de `painted`) |
| RF-3 (escalonado laptop → dashboard) | Paso 17, `animation-delay: var(--delay-stagger)` (token del paso 9) |
| RF-4 (fade + subida leve) | Paso 17, `@keyframes reveal` |
| RF-5 (re-dispara el ciclo completo) | Paso 14 (`onPaintedChange(false)` en la rama de rearme del observer) |
| RF-6 (reposo/final sin estados colgados) | Pasos 14, 17 — una sola clase de estado por imagen, sin transición intermedia expuesta |
| RF-7 (responsive <900px) | Paso 16, reglas migradas + nuevas dentro del mismo `@media (max-width: 900px)` |
| §4 assets (alfa real, sin damero, sin halo) | Fase A completa (pasos 1–8) |
| §5 accesibilidad / reduced-motion | Paso 18 |
| §3 RNF (sin layout shift, sin librería nueva, `"use client"` no sube) | Pasos 15, 16 (dimensiones reservadas), §4 de este documento |

## 6. Riesgos y deuda conocida

- **Desvío (2026-08-01) — desmatado descartado:** los pasos 1–3 de la Fase A quedaron sin usar;
  el usuario resolvió el problema de origen re-exportando `imagen_app_dashboard.png` con alfa
  real en vez de dejar que este documento reconstruyera el alfa desde un damero horneado. El
  derivado `app-dashboard-hero.png` pasó a generarse con un recorte simple al bbox (paso 4), sin
  ningún cálculo de amplitud ni fórmula de dos fondos.
- **Desvío (2026-08-01) — sombra vía CSS, no horneada en el PNG:** la fuente re-exportada no
  incluye la sombra suave del mockup (el cuerpo queda casi blanco, ~#fdfdff, apenas distinguible
  del `--color-bg` del sitio sin ella). Se adoptó el plan B que el paso 3 original ya anticipaba:
  `filter: drop-shadow(var(--shadow-lg))` en `.dashboard` (`HeroVisual.module.css`), igual
  mecanismo que ya usa `.laptop`.
- **Desvío (2026-08-01) — resolución por debajo de 2×:** el contenido real de la fuente
  re-exportada mide 273px de ancho; el despliegue máximo previsto del dashboard en el Hero es
  ~154px CSS (`width: 30%` de una columna visual de ~512px dentro del contenedor de 1120px), lo
  que da ~1.9× en vez del ≥2× pedido en req-002 §4. No se reescaló hacia arriba porque no
  agregaría detalle real, solo interpolación; verificado a simple vista sin pixelado perceptible
  a zoom 200%.
- **Sin verificación visual automatizada:** misma limitación que `impl-001.md` §11 — esta
  máquina no tiene `chromium-cli`/Playwright ni permiso de Accesibilidad para automatizar Safari
  vía `osascript`. Los pasos 23–25 son manuales; quedan como criterio de aceptación pendiente de
  confirmar por inspección visual directa, no por script.
- **Inconsistencia preexistente en `styles.md` §7.2** (`--duration-brush` desincronizado del
  valor real): se corrige de paso en el paso 11 por tocar esa sección de todos modos, pero no es
  un defecto introducido por esta entrega — ya existía antes.
- **Los originales `imagen_laptop.png` / `imagen_app_dashboard.png`** quedan en el repo sin usar
  tras esta entrega, igual que `imagen-brocha-1.png` quedó tras req-001 — no se referencian desde
  ningún componente, se conservan como fuente.
