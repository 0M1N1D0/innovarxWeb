# 003 — Animación "scramble" del eyebrow del Hero — Implementación

## 1. Estado

Pendiente de ejecutar. Este documento es el plan (el **cómo**) para cumplir `req-003.md`;
igual que `impl-002.md`, está en imperativo/futuro porque narra pasos aún no ejecutados.

Orden de dependencias: la **Fase A (hook compartido)** bloquea a B y C — `HeroEyebrow`
(Fase C) necesita el mismo mecanismo de disparo/re-disparo que ya usa `BrushStroke`, y
extraerlo antes evita duplicar la lógica de histéresis. La **Fase B (tokens)** debe cerrar
antes de escribir el JS de la Fase C, porque `HeroEyebrow` lee esos tokens vía
`getComputedStyle`. La **Fase D (verificación)** corre al final, sobre el resultado
completo — e incluye, a diferencia de impl-001/impl-002, una regresión explícita de las
dos specs anteriores, porque esta entrega toca `BrushStroke`.

## 2. Decisión de diseño (cierra la §4 abierta de `req-003.md`)

`req-003.md` §4 deja explícitamente pendiente cómo el eyebrow (columna de texto, dentro de
`Hero.tsx`) se entera del mismo instante de arranque que hoy dispara la entrada de
laptop/dashboard en la columna visual (`HeroVisual.tsx`), sin fusionar ambas ramas del
árbol ni subir la frontera `"use client"`.

**Decisión: el eyebrow observa su propio viewport, con un `IntersectionObserver`
independiente que reutiliza la misma lógica que ya usa `BrushStroke`.** No comparte estado
en memoria con `HeroVisual`; comparte comportamiento, extraído a un hook.

Alternativas descartadas:

- **Subir el estado a `Hero`** — para que `Hero` orqueste una señal común entre la columna
  de texto y la visual, `Hero` tendría que volverse Client Component (necesita
  `useState`/efectos), lo que viola el RNF de `req-003.md` §3 ("la frontera `use client` no
  sube de nivel") y la regla de `CLAUDE.md` de no poner `"use client"` en un contenedor.
- **Context provider envolviendo ambas columnas** — técnicamente resolvería compartir el
  instante de arranque, pero exige un `"use client"` en un componente contenedor solo para
  distribuir un booleano a un efecto de texto secundario; over-engineering frente a la
  opción de abajo.

Lo que habilita la decisión elegida: **`shared/hooks/` ya está documentado en
`architecture.md` §3 como parte de la estructura prevista del proyecto** (aparece junto a
`shared/components/` y `shared/lib/`), solo que hoy no existe ningún archivo ahí todavía.
Crear el primero no es una decisión estructural nueva.

La lógica a extraer ya existe, completa y probada, en
`src/shared/components/BrushStroke.tsx:35-87`: histéresis de dos umbrales
(`{ threshold: [0, threshold] }`) para no parpadear en cruces parciales (RF-4 de
req-001), un `setTimeout` de `delay` antes de activar, short-circuit de
`prefers-reduced-motion`, y limpieza en el `return` del efecto. Se mueve tal cual a un
hook `useViewportCycle`, y tanto `BrushStroke` como el nuevo `HeroEyebrow` lo consumen —
es reuso, no lógica nueva.

## 3. Archivos de la entrega

| Archivo | Rol |
| --- | --- |
| `src/shared/hooks/useViewportCycle.ts` | Nuevo. Hook extraído del observer de `BrushStroke`. Primer archivo de `shared/hooks/`. |
| `src/shared/components/BrushStroke.tsx` | Modificado. Consume `useViewportCycle` en vez de tener el observer inline. |
| `src/shared/lib/scramble.ts` | Nuevo. Helpers puros: shuffle, plan de revelado, letra aleatoria. |
| `src/features/landing/components/HeroEyebrow.tsx` | Nuevo. Client Component hoja: revoltijo del eyebrow. |
| `src/features/landing/components/HeroEyebrow.module.css` | Nuevo. `.eyebrow`/`.eyebrow::before` migradas + `.srOnly`. |
| `src/features/landing/components/Hero.tsx` | Modificado. Monta `<HeroEyebrow>` en vez del `<span className={styles.eyebrow}>` inline. |
| `src/features/landing/components/Hero.module.css` | Modificado. Se retiran `.eyebrow`/`.eyebrow::before` (migran a `HeroEyebrow.module.css`). |
| `src/styles/tokens.css` | Modificado. Tokens `--duration-scramble`, `--interval-scramble`. |
| `ia-docs/global/styles.md` | Modificado. §5.4 dos filas nuevas; corrección de la deriva en §7.2. |
| `ia-docs/global/architecture.md` | Modificado. §5 actualiza el conteo/lista de Client Components del proyecto. |

## 4. Pasos

### Fase A — Hook compartido

1. Crear `src/shared/hooks/useViewportCycle.ts` con `"use client"` en la primera línea.
   Mover literalmente el cuerpo del `useEffect` de `BrushStroke.tsx:35-87` (el
   `IntersectionObserver`, el `paintTimer`, la histéresis de dos umbrales y el
   short-circuit de `reduced-motion`), generalizando los nombres: el hook expone
   `function useViewportCycle({ delay = 0, threshold = 0.35 }): { ref: RefObject<HTMLElement>, active: boolean }`.
   Dentro, `active` reemplaza a `isVisible`; el `useEffect` sigue dependiendo de
   `[delay, threshold]`.
   - **Hecho cuando:** el hook compila de forma aislada, sin importar nada de
     `BrushStroke.tsx`, y su comportamiento observable (cuándo pasa `active` a `true`/
     `false`) es idéntico al `isVisible` actual de `BrushStroke`.
2. Refactorizar `BrushStroke.tsx` para consumir el hook: `const { ref, active } =
   useViewportCycle({ delay, threshold });`, eliminando el `useEffect` y el `useState`
   propios. Agregar un `useEffect(() => onPaintingChange?.(active), [active,
   onPaintingChange])` para preservar el callback existente (usado por `HeroVisual`).
   `isVisible` en el JSX (`BrushStroke.tsx:97`) pasa a leer `active`. `BrushStroke.module.css`
   no se toca.
   - **Hecho cuando:** `BrushStroke` sigue exponiendo la misma interfaz pública
     (`className`, `delay`, `threshold`, `onPaintingChange`) sin cambios para sus
     consumidores (`HeroVisual.tsx` no necesita modificarse), y los criterios de
     aceptación ya cerrados de `req-001.md`/`req-002.md` (Fase D, paso 15 de este
     documento) siguen cumpliéndose.

### Fase B — Tokens y documentación

3. Agregar a `src/styles/tokens.css`, en el bloque "Movimiento" (`tokens.css:87-95`, junto
   a `--delay-stagger`):
   ```css
   --duration-scramble: 2500ms;
   --interval-scramble: 50ms;
   ```
   `--duration-scramble` cubre req-003 RF-5 (duración total ~2.5s). `--interval-scramble`
   es la cadencia a la que se sortea una nueva letra aleatoria por posición aún no fijada
   — a 50ms (20 tiradas/s) el ojo lee "revoltijo", no un parpadeo de 60fps que además
   quema CPU sin aportar legibilidad al efecto.
   - **Hecho cuando:** ambos tokens existen y `--duration-scramble` cae en el rango que
     pide req-003 RF-5 (~2.5s).
4. Documentar ambos en `ia-docs/global/styles.md` §5.4 (tabla de motion, ~línea 190), con
   la misma forma que las filas existentes: nombre, valor, uso ("Duración total del
   revoltijo del eyebrow del Hero (spec 003 RF-5)" / "Cadencia de re-tirada de letras del
   revoltijo del eyebrow (spec 003)").
   - **Hecho cuando:** las dos filas existen y el bloque de código de §7.2 queda
     sincronizado con `tokens.css` (incluye ambos tokens nuevos).
5. Aprovechar el paso anterior para corregir la deriva preexistente detectada en la
   exploración de esta entrega: `styles.md` §7.2 (~línea 371) todavía dice
   `--duration-brush: 4000ms`, mientras que `tokens.css:90` y la tabla de §5.4 dicen
   `3500ms`; a ese mismo bloque de §7.2 le faltan `--duration-reveal` y `--delay-laptop`
   (sí están en la tabla de §5.4, no en el bloque de código). Sincronizar los tres.
   - **Hecho cuando:** el bloque de código de §7.2 contiene los mismos tokens de motion,
     con los mismos valores, que `tokens.css` y la tabla de §5.4. No es un defecto
     introducido por esta entrega — ya existía antes (mismo patrón que impl-002 §11
     documentó para `--duration-brush` en su momento).

### Fase C — Componentes

6. Crear `src/shared/lib/scramble.ts` (sin `"use client"" — no toca el DOM, son funciones
   puras) con tres utilidades:
   - `randomLetter(): string` — devuelve una letra A–Z mayúscula aleatoria (req-003 RNF
     "alfabeto del revoltijo").
   - `shuffledIndices(n: number): number[]` — barajado por clave aleatoria (Schwartzian
     transform) sobre `[0..n)` — ver §11, `noUncheckedIndexedAccess` descarta Fisher–Yates
     in-place.
   - `buildRevealRanks(text: string): number[]` — para cada índice de `text` que **no** sea
     whitespace (RF-4), asigna un **turno** entero único `0..N-1` (barajado con
     `shuffledIndices`, RF-2 bis) — no un instante en ms. A los índices de whitespace se les
     asigna `-1`. Devuelve un array paralelo a `text.length` con el turno de cada posición,
     que el componente compara contra un contador de iteración que avanza por tick (ver
     paso 7 y §11 para por qué se reemplazó el plan original basado en instantes en ms).
   - **Hecho cuando:** `buildRevealRanks` es determinístico salvo por el orden aleatorio
     (mismo `text`, mismo conjunto de turnos `0..N-1`, distinto orden de asignación entre
     corridas), y cada turno es único y monótono por construcción — cumple RF-2 (orden
     aleatorio) y RF-3 (una vez fijada una posición, su turno no cambia dentro del ciclo)
     sin lógica adicional en el componente.
7. Crear `src/features/landing/components/HeroEyebrow.tsx`, `"use client"` en la primera
   línea (hoja, como `BrushStroke`). Props: `{ text: string }`. Mecánica de fijado: la
   clásica de "scramble text" — un contador `iteration` avanza una fracción fija por tick y
   una posición queda fija en cuanto su turno barajado (`buildRevealRanks`) queda por
   debajo del contador. Estructura:
   ```tsx
   export function HeroEyebrow({ text }: { text: string }) {
     const { ref, active } = useViewportCycle<HTMLSpanElement>({ threshold: 0.35 });
     const [displayedText, setDisplayedText] = useState(text);

     useEffect(() => {
       const el = ref.current;
       if (!el || !active) return;
       const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
       if (reduceMotion) return; // el estado de reposo ya es `text` resuelto — ver §5

       const styleMap = getComputedStyle(el);
       const duration = cssTimeToMs(styleMap.getPropertyValue("--duration-scramble"), 3500);
       const interval = cssTimeToMs(styleMap.getPropertyValue("--interval-scramble"), 60);
       const ranks = buildRevealRanks(text);
       const total = ranks.reduce((n, r) => (r >= 0 ? n + 1 : n), 0);
       if (total === 0) return;

       const step = total / (duration / interval); // turnos por tick
       let iteration = 0;

       const timer = setInterval(() => {
         iteration += step;
         setDisplayedText(
           text
             .split("")
             .map((char, i) => (char === " " || (ranks[i] ?? -1) < iteration ? char : randomLetter()))
             .join(""),
         );
         if (iteration >= total) {
           clearInterval(timer);
           setDisplayedText(text); // cierre exacto — nunca queda una tirada de más
         }
       }, interval);

       return () => {
         clearInterval(timer);
         setDisplayedText(text); // RF-8: nada colgado si el ciclo se corta a mitad
       };
     }, [active, text, ref]);

     return (
       <span ref={ref} className={styles.eyebrow}>
         <span className={styles.srOnly}>{text}</span>
         <span aria-hidden="true">{displayedText}</span>
       </span>
     );
   }
   ```
   Puntos que el componente debe garantizar (detallados porque no son obvios del esqueleto
   de arriba):
   - `useState(text)` nace **ya con `text` completo** — no hay estado de "vacío" ni
     "cargando": cumple RF-8 (estado inicial = frase legible) sin necesidad de lógica de
     hidratación especial.
   - El estado (`displayedText`) vive únicamente en esta hoja: sus re-renders no alcanzan
     al árbol del Hero — cumple el RNF de presupuesto de re-render de req-003 §3 sin
     necesidad de mutación imperativa de `textContent` (ver §11 para por qué se abandonó
     esa vía).
   - Los tokens de duración/cadencia se leen con `getComputedStyle` sobre el propio nodo en
     vez de duplicarse como constantes en TS. Motivo (ya sentado por `impl-002.md` §4):
     duplicar un valor de CSS en un timer de JS crea una segunda fuente de verdad que se
     desincroniza en silencio si el token cambia — ya pasó una vez con `--duration-brush`
     (paso 5 de este documento). **El valor se pasa por `cssTimeToMs`
     (`src/shared/lib/cssTime.ts`), nunca por `parseFloat` directo** — el minificador de CSS
     normaliza estos tokens a segundos al servirlos (`3500ms` → `3.5s`), y `parseFloat` a
     secas sobre ese string interpretaría `3.5` como milisegundos; fue exactamente el bug
     que dejó el revoltijo invisible antes de esta corrección (ver §12).
   - El cleanup del efecto y la rama de cierre (`iteration >= total`) ambas restauran
     `displayedText` a `text`, así que reiniciar el ciclo a mitad (RF-7 de req-003, salida
     de viewport) nunca deja una letra aleatoria colgada.
   - **Hecho cuando:** con `active=true`, el nodo muestra revoltijo A–Z en las posiciones
     no fijadas y letras correctas en las ya fijadas, en cualquier instante intermedio,
     repartidas en todo el ciclo (no concentradas al final); a los `--duration-scramble` la
     frase queda 100% resuelta; al perder `active` (viewport) el nodo vuelve a mostrar
     `text` completo de inmediato.
8. Crear `HeroEyebrow.module.css`, migrando **literalmente** las reglas `.eyebrow` y
   `.eyebrow::before` desde `Hero.module.css:23-42` (mismo precedente que impl-002 paso 16,
   que migró `.visual`/`.brush` de `Hero.module.css` a `HeroVisual.module.css` al mover esa
   responsabilidad a un componente propio). Agregar:
   ```css
   .srOnly {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     white-space: nowrap;
     border: 0;
   }
   ```
   Detalle a verificar al implementar: `.eyebrow` es `display: flex; gap: var(--space-2)`
   con un `::before` (el punto rosa). Como `.srOnly` usa `position: absolute`, queda fuera
   del flujo flex y no introduce un tercer hueco de `gap` entre el punto y el texto visible
   — si se usara `display: none` en su lugar, algunos lectores de pantalla lo ignoran, por
   eso el patrón estándar `clip`/`absolute` y no `display: none`.
   - No hace falta un bloque `@media (prefers-reduced-motion: reduce)` en este CSS — el
     guardia vive en JS (ver §5 "Puntos finos").
   - **Hecho cuando:** el punto rosa, el texto accesible y el texto animado se ven
     alineados igual que el `.eyebrow` actual (mismo espaciado, mismo color, misma
     tipografía), y el texto de `.srOnly` no es visible ni genera espacio en el layout.
9. Modificar `Hero.tsx`: reemplazar
   `<span className={styles.eyebrow}>{t("eyebrow")}</span>` (`Hero.tsx:18`) por
   `<HeroEyebrow text={t("eyebrow")} />`, importando `HeroEyebrow` desde `./HeroEyebrow`
   (mismo feature, sin cruzar features). `Hero` sigue resolviendo el texto con
   `useTranslations` y pasándolo por prop — el Client Component nunca importa el catálogo
   de mensajes, que es lo que mantiene `NextIntlClientProvider` postergado (mismo criterio
   que req-001 §5 aplicó a `BrushStroke`).
   - **Hecho cuando:** `Hero.tsx` sigue siendo Server Component (no gana `"use client"`),
     y el eyebrow sigue apareciendo como primera línea del `<h1>`, antes del título.
   Modificar `Hero.module.css` retirando `.eyebrow`/`.eyebrow::before` (ahora viven en
   `HeroEyebrow.module.css`).
   - **Hecho cuando:** `Hero.module.css` ya no define `.eyebrow` en ningún selector.
10. Actualizar `ia-docs/global/architecture.md` §5 (~línea 128), que hoy documenta a
    `BrushStroke` como "primer `use client` del proyecto" y a `HeroVisual` como el
    segundo (vía la entrega de spec 002). Agregar una entrada para `HeroEyebrow` como
    tercer Client Component y **el primero que renderiza texto traducido** en vez de ser
    puramente decorativo, documentando la mitigación: el texto llega por prop desde
    `Hero` (Server Component), así que `HeroEyebrow` nunca importa `next-intl` ni obliga a
    introducir `NextIntlClientProvider`.
    - **Hecho cuando:** `architecture.md` §5 lista los tres Client Components existentes y
      explica por qué ninguno requiere el provider todavía.

### Fase D — Verificación

11. Ejecutar `npm run lint`.
    - **Hecho cuando:** sale sin errores ni warnings nuevos.
12. Ejecutar `npm run build` e inspeccionar la tabla de rutas.
    - **Hecho cuando:** `/es` y `/en` siguen listadas como SSG (●), no dinámicas.
13. Ejecutar `npm run build:export`.
    - **Hecho cuando:** compila sin errores, confirmando que nada de lo agregado depende
      de features server-only (`architecture.md` §8).
14. Levantar `npm run dev` y, en el Hero, observar el eyebrow al cargar la página.
    - **Hecho cuando:** el revoltijo arranca en simultáneo con el pintado de la brocha, el
      orden en que las letras se fijan es visiblemente no secuencial (no se "escribe" de
      izquierda a derecha) y se percibe repartido en todo el ciclo (no todo al final), la
      frase completa queda resuelta en ~3.5s, y el ancho ocupado por el eyebrow no cambia
      en ningún fotograma.
15. **Regresión de `req-001.md`/`req-002.md`** — necesaria porque el paso 2 refactorizó
    `BrushStroke`, componente que sostiene ambas specs: verificar que la brocha se sigue
    pintando igual, que laptop y dashboard siguen entrando escalonados tras ella, y que el
    ciclo completo (brocha + laptop + dashboard) se sigue repitiendo al perder el Hero de
    vista por completo y volver.
    - **Hecho cuando:** el comportamiento observado es indistinguible del que certificaron
      `impl-001.md` e `impl-002.md` antes de este cambio.
16. Hacer scroll hasta perder el Hero de vista por completo y volver a subir; repetir con
    un scroll parcial que no saque el Hero completamente de pantalla.
    - **Hecho cuando:** en el primer caso el eyebrow repite su revoltijo desde cero, en
      sincronía con la brocha; en el segundo, nada se reinicia ni queda a medias.
17. En las dev tools, emular `prefers-reduced-motion: reduce` y volver a cargar.
    - **Hecho cuando:** el eyebrow se ve resuelto de inmediato, sin revoltijo, y no se
      anima en scrolls posteriores.
18. Inspeccionar el árbol de accesibilidad del navegador (o el DOM accesible vía devtools)
    sobre el `<h1>` del Hero, incluso a mitad del revoltijo.
    - **Hecho cuando:** el nombre accesible calculado del encabezado contiene la frase
      completa y correcta del eyebrow en todo momento, nunca un estado intermedio del
      revoltijo.

## 5. Puntos finos

- **Aquí el guardia de `reduced-motion` sí puede vivir en JS**, a diferencia de
  `impl-001.md` §6 e `impl-002.md` paso 18, que insistían en resolverlo con una garantía
  incondicional en CSS. La razón es que el modo de fallo se invierte: en aquellas specs el
  estado de reposo era "invisible" (`opacity: 0` / máscara sin revelar), así que un fallo
  de detección dejaba el elemento oculto para siempre — de ahí que la garantía tuviera que
  vivir en CSS, fuera del alcance de cualquier bug de JS. Aquí el estado de reposo del DOM
  **ya es la frase resuelta** (`el.textContent` nace como `text` en el server y el efecto
  ni siquiera arranca si `reduceMotion` es `true`), que es exactamente el resultado que
  `prefers-reduced-motion` exige. Si el `matchMedia` fallara, el peor caso es que el
  revoltijo corra de más, no que el texto desaparezca — un modo de fallo aceptable que no
  existía en las dos specs anteriores.
- **Sin librería de animación** — el revoltijo por carácter con orden de fijado aleatorio
  no es expresable en `@keyframes` puro sin generar una animación distinta por carácter (y
  el orden tendría que fijarse en build time, no ser distinto en cada ciclo); un bucle de
  ~20 líneas con `setTimeout` es más chico que cualquier dependencia. Consistente con
  req-001 §4, req-002 §3 y req-003 §3.
- **Sin layout shift** — `.eyebrow` migrado ya usa `--font-mono` (IBM Plex Mono,
  monoespaciada) con `text-transform: uppercase`; sustituir una letra A–Z por otra letra
  A–Z no cambia el ancho de ningún carácter. El documento lo deja como requisito
  verificado en el paso 14, no como una coincidencia del font elegido.
- **La frontera `"use client"` no sube** — `HeroEyebrow` es la nueva hoja cliente dentro
  del `<h1>`; `Hero` y `HomePage` siguen siendo Server Components, mismo patrón que
  req-001 §5 validó para `BrushStroke` y req-002 mantuvo para `HeroVisual`.
- **`shared/hooks/` pasa de documentado-pero-vacío a real** — `useViewportCycle.ts` es el
  primer archivo de esa carpeta; no es una carpeta nueva en el sentido de
  `architecture.md` §3 ("no se crean subcarpetas que realmente no se usan"), porque ya
  estaba prevista en el árbol documentado, solo sin contenido.

## 6. Trazabilidad RF → paso/archivo

| Requisito (`req-003.md`) | Dónde se cumple |
| --- | --- |
| RF-1 (cada posición cicla A–Z hasta fijar la correcta) | Paso 6 (`randomLetter`), paso 7 (`setInterval` del efecto) |
| RF-2 (orden de fijado aleatorio) | Paso 6, `buildRevealRanks` (barajado de turnos) |
| RF-2 bis (mecánica de contador de iteración) | Paso 7, `iteration`/`step` sobre `ranks` |
| RF-3 (una vez fijada, no cambia) | Paso 6, turno único e inmutable por posición |
| RF-4 (espacios no participan del revoltijo) | Paso 6, `buildRevealRanks` asigna `-1` a whitespace; paso 7, `char === " "` en el `map` |
| RF-5 (~3.5s de duración total, reparto uniforme) | Paso 3, tokens `--duration-scramble`/`--interval-scramble`; paso 7, `step` derivado de ambos |
| RF-6 (disparo enganchado al ciclo del Hero) | Paso 1 (`useViewportCycle`), paso 7 (mismo hook que `BrushStroke` vía `threshold: 0.35`) |
| RF-7 (re-dispara al reentrar en viewport, anti-parpadeo) | Paso 1, histéresis de dos umbrales heredada de `BrushStroke.tsx:35-87` |
| RF-8 (estado inicial/final resuelto, nada colgado) | Paso 7, `text` en el render inicial + cleanup del efecto |
| RF-9 (mismo componente para `es`/`en`, texto por prop) | Paso 9, `<HeroEyebrow text={t("eyebrow")} />` |
| §3 RNF (sin librería nueva) | §5 de este documento, "Sin librería de animación" |
| §3 RNF (sin layout shift, fuente monoespaciada) | Paso 8 (CSS migrado), §5 "Sin layout shift" |
| §3 RNF (`"use client"` no sube, texto por prop) | Pasos 7, 9; §5 "La frontera no sube" |
| §3 RNF (tokens, no valores sueltos) | Pasos 3–5 |
| §3 RNF (presupuesto de re-render) | Paso 7, estado (`useState`) contenido en la hoja `HeroEyebrow` |
| §4 (impacto arquitectónico, coordinación con `HeroVisual`) | §2 de este documento (decisión de diseño) |
| §5 accesibilidad (nombre accesible siempre correcto) | Paso 7 (`.srOnly`/`aria-hidden`), paso 8 (CSS `.srOnly`) |
| §5 accesibilidad (`reduced-motion`) | Paso 7, short-circuit en el efecto; §5 de este documento |

## 7. Riesgos y deuda conocida

- **El refactor del paso 2 toca `BrushStroke`**, componente que sostiene dos specs ya
  entregadas (`req-001.md`, `req-002.md`). De ahí el paso 15 de regresión explícita en la
  Fase D — no basta con verificar los criterios de `req-003.md`.
- **Ciclos desincronizados por debajo de 900px**: con dos observers independientes (uno en
  `HeroEyebrow`, otro en `HeroVisual`/`BrushStroke`), en el breakpoint donde
  `Hero.module.css:13-21` pasa de dos columnas a una, el eyebrow y la columna visual
  pueden entrar en el viewport del usuario en momentos ligeramente distintos durante el
  scroll, y sus ciclos de animación dejar de coincidir exactamente. Se acepta como
  comportamiento correcto — cada elemento anima cuando efectivamente se vuelve visible,
  que es el contrato de `useViewportCycle` — pero queda documentado aquí para que no se
  lea como un bug si se observa en QA.
- **(Superado por §11)** La versión original de `HeroEyebrow` mutaba `el.textContent`
  directamente, por fuera del reconciler de React, con la invariante de que el componente
  no tuviera ningún estado propio. El rediseño de §11 (2026-08-02) reemplazó esa mutación
  por `useState`, que es el patrón estándar de cualquier Client Component del proyecto —
  ya no aplica ninguna invariante especial sobre `textContent` ni restricción a futuros
  cambios del componente.
- **Sin verificación visual automatizada**: misma limitación declarada en `impl-001.md`
  §11 e `impl-002.md` §6 — esta máquina no tiene `chromium-cli`/Playwright ni permiso de
  Accesibilidad para automatizar Safari vía `osascript`. Los pasos 14–18 de la Fase D son
  manuales, pendientes de una pasada visual directa antes de dar la entrega por cerrada.
- **La deriva de `styles.md` §7.2** corregida en el paso 5 es preexistente a esta entrega
  (arrastrada desde antes de `impl-002.md`), no un defecto introducido aquí.

## 8. Desvíos de la ejecución (2026-08-02)

Detectados al implementar, antes de escribir código — no afectan la decisión de diseño de
§2 ni la trazabilidad de §6, solo el detalle de implementación de los pasos 6, 7 y 12.

- **`tsconfig.json` tiene `noUncheckedIndexedAccess: true`.** El esqueleto de `tick()` en
  el paso 7 usa `elapsed >= revealPlan[i]`, que bajo esa opción tipa
  `number | undefined` y no compila sin manejarlo. Se resolvió leyendo el umbral como
  `const revealAt = revealPlan[i] ?? 0;` dentro del `.map()`.
- **Fisher–Yates in-place también choca con `noUncheckedIndexedAccess`** (el swap
  `indices[i]`/`indices[j]` tipa `number | undefined` en cada acceso). `shuffledIndices`
  en `scramble.ts` se implementó con barajado por clave aleatoria (Schwartzian transform:
  `Array.from(...).sort(por clave random).map(...)`) en vez de Fisher–Yates — mismo
  contrato público (`(count: number) => number[]`, permutación uniforme de `[0..count)`)
  y mismas garantías sobre `buildRevealPlan` (RF-2/RF-3/RF-5), sin acceso indexado
  mutable.
- **`useViewportCycle` se tipó genérico** — `useViewportCycle<T extends HTMLElement>()`
  devolviendo `RefObject<T | null>` — para que `BrushStroke` (`<span>`) y `HeroEyebrow`
  (`<span>`) lo consuman sin castings, en vez de fijarlo a un tipo de elemento concreto
  como sugería el esqueleto del paso 1.
- **Diferencia de comportamiento menor en el paso 2**: antes del refactor, `BrushStroke`
  no llamaba a `onPaintingChange` al montar. Con
  `useEffect(() => onPaintingChange?.(active), [active, onPaintingChange])`, ahora sí lo
  llama una vez con `active=false` en el primer render. Es inocuo — `HeroVisual` ya
  arranca su propio estado `painting` en `false` — pero se deja registrado en vez de
  pasar en silencio.
- **Typo de redacción en §4 paso 6** (comilla suelta en `(sin "use client"" —`) corregido
  de paso al implementar.

Verificación ejecutada tras aplicar los pasos: `npm run lint`, `npm run build` (`/es`/`/en`
siguen SSG) y `npm run build:export` pasan sin errores. Se confirmó por inspección del
HTML servido (`curl http://localhost:3000/es`) que el nodo `.srOnly` y el nodo
`aria-hidden` del eyebrow nacen ambos con la frase completa "El arte de innovar" — cumple
RF-8 sin depender de hidratación. Los pasos 14–18 de la Fase D (revoltijo en vivo, orden
aleatorio observado, regresión visual de brocha/laptop/dashboard, scroll parcial,
`prefers-reduced-motion`, árbol de accesibilidad) requieren navegador interactivo; esta
máquina no tiene Playwright/`chromium-cli` instalados como parte del proyecto ni permiso
de Accesibilidad para automatizar Safari — misma limitación que `impl-001.md` §11 e
`impl-002.md` §6. Quedan pendientes de una pasada manual antes de cerrar la entrega.

## 9. Ajuste post-verificación (2026-08-02) — duración del revoltijo

El usuario probó el efecto en navegador (paso 14 de la Fase D) y reportó que con
`--duration-scramble: 2500ms` / `--interval-scramble: 50ms` el revoltijo pasaba casi
desapercibido: el eyebrow es texto pequeño en la esquina superior del Hero, y para cuando
el ojo lo registra, buena parte del ciclo ya transcurrió. Pedido explícito: que dure ~3s y
que el cambio de letras se perciba con claridad.

Se subieron ambos tokens en `src/styles/tokens.css`:

- `--duration-scramble`: `2500ms` → `3000ms`.
- `--interval-scramble`: `50ms` → `80ms` — cadencia más lenta de re-tirada, para que cada
  cambio de letra se lea como un paso discreto en vez de un parpadeo borroso.

Como ninguno de los dos valores estaba hardcodeado en `HeroEyebrow.tsx` (se leen de
`getComputedStyle` sobre el nodo, paso 7), el ajuste fue exclusivamente de tokens — sin
tocar componentes. Se propagó a `ia-docs/global/styles.md` §5.4 y §7.2, y a
`req-003.md` RF-5, que queda marcado "(revisado)" con el valor original citado entre
paréntesis, siguiendo el mismo patrón que `req-002.md` usó para sus RF revisados.
`buildRevealPlan`/`scramble.ts` no cambiaron: su contrato ya era independiente de la
duración concreta (recibe `duration` como parámetro), así que el nuevo valor fluye sin
tocar la lógica del plan de revelado.

## 10. Segundo ajuste post-verificación (2026-08-02) — distribución del fijado, no solo la duración

El primer ajuste (§9) subió `--duration-scramble`/`--interval-scramble` pero no tocó
`buildRevealPlan`, que seguía repartiendo los umbrales de fijado **uniformemente** en
todo `[0, duration]`. El usuario probó de nuevo y señaló el problema real: con ~16
caracteres no-espacio repartidos parejo en 3000ms, la primera letra en fijarse lo hacía a
los ~187ms — casi al arrancar el ciclo — dando la impresión de "una letra aleatoria y ya
se pone la correcta", sin tiempo perceptible de bucle. Pedido explícito: que cada posición
seguiera cambiando de letra constantemente (un bucle real) durante varios segundos, y que
las letras correctas se fueran seleccionando recién "cuando se cumple el plazo".

Cambio en `src/shared/lib/scramble.ts`, función `buildRevealPlan`: se introdujo
`SETTLE_WINDOW_RATIO = 0.4` — ninguna posición puede fijarse antes de
`duration * (1 - SETTLE_WINDOW_RATIO)` (60% del ciclo). Los umbrales de fijado, antes
`((rank + 1) / N) * duration`, pasan a `settleStart + ((rank + 1) / N) * (duration -
settleStart)`: la misma distribución de rangos aleatorios (RF-2), pero comprimida en el
40% final del ciclo en vez de ocupar el ciclo completo. Durante el 60% inicial, **todas**
las posiciones siguen recibiendo `randomLetter()` en cada tick — es el mecanismo que ya
existía en `tick()` (paso 7), no cambió; lo que cambió es que ahora ningún `revealAt` cae
dentro de esa ventana, así que ninguna posición "escapa" del bucle antes de tiempo.

De paso, se subieron los tokens una vez más: `--duration-scramble` a `3500ms` (desde
`3000ms`) y `--interval-scramble` a `60ms` (desde `80ms`, un tick más ágil para que el
bucle se lea fluido). Con estos valores: `settleStart = 3500 × 0.6 = 2100ms` — ~2.1s de
revoltijo puro sin ninguna letra fijada, seguidos de ~1.4s en los que las letras se van
fijando una por una en orden aleatorio hasta completar la frase a los 3500ms exactos.

RF-2, RF-3 y RF-5 de `req-003.md` siguen cumpliéndose sin cambios de contrato (orden
aleatorio, umbral monótono por posición, último carácter fijado exactamente a
`duration`); RF-5 se re-marcó "(revisado dos veces)" con el detalle del reparto 60/40. No
se tocó `HeroEyebrow.tsx` ni `tick()` — el cambio quedó contenido en `scramble.ts` y en
los tokens, tal como predijo la trazabilidad de §6 (RF-2/RF-3/RF-5 dependen de
`buildRevealPlan`, no del componente).

## 11. Rediseño de la mecánica de fijado (2026-08-02) — de umbrales en ms a contador de iteración

El usuario probó el resultado del ajuste de §10 (ventana de asentamiento del 60%) y no
convenció visualmente: con `settleStart = 2100ms` sobre `--duration-scramble: 3500ms`, los
primeros ~2.1s son ruido plano — todas las posiciones cicladas a la vez, sin ningún ancla
legible — y los últimos ~1.4s resuelven las 15-18 letras de golpe. Se lee como "pantalla
rota" seguida de "todo listo", no como un sistema que va adivinando la frase — el efecto
de decodificación clásico ("scramble text"/"hacker text") tiene letras correctas
apareciendo de a una **desde el principio**, mientras el resto sigue cicladas. Pedido
explícito del usuario: reimplementar desde cero con esa mecánica clásica (aportó un
ejemplo de referencia: un contador `iteration` que avanza una fracción fija por tick,
comparado contra el índice/turno de cada posición).

**Decisión de diseño (§2 de este documento) sin cambios**: `HeroEyebrow` sigue observando
su propio viewport vía `useViewportCycle`, compartido con `BrushStroke` — eso no fue lo que
falló, y el usuario lo confirmó explícitamente al aprobar el plan de este rediseño.

Cambios de mecánica, contenidos en dos archivos:

- **`src/shared/lib/scramble.ts`**: se elimina `buildRevealPlan` (y `SETTLE_WINDOW_RATIO`)
  y se agrega `buildRevealRanks(text): number[]` — en vez de un instante en ms por
  posición, asigna un **turno entero barajado `0..N-1`** (whitespace = `-1`). `randomLetter`
  y `shuffledIndices` no cambian.
- **`HeroEyebrow.tsx`**: el efecto pasa de mutar `el.textContent` con umbrales en ms
  (`performance.now()` vs. `revealAt`) a `useState(text)` + un contador `iteration` que
  avanza `step = total / (duration / interval)` turnos por tick (`setInterval`); una
  posición se fija en cuanto `ranks[i] < iteration`. El incremento (`step`) sigue
  derivándose de los tokens `--duration-scramble`/`--interval-scramble` — que **no
  cambiaron de valor** (siguen en `3500ms`/`60ms`) — y de `text.length`, así que el reparto
  uniforme es automático para cualquier longitud de frase/locale sin lógica adicional.
  Pasar de mutación imperativa a `setState` es seguro para el RNF de presupuesto de
  re-render de req-003 §3 porque el estado sigue contenido en la hoja (`HeroEyebrow` no
  propaga re-renders al árbol del Hero); de paso resuelve la deuda que §7 (Riesgos) de este
  documento señalaba sobre mutar el DOM por fuera del reconciler.

RF-2 (orden de fijado aleatorio) y RF-3 (una vez fijada no cambia) siguen cumpliéndose sin
cambio de contrato — el turno barajado reemplaza al instante en ms como mecanismo, pero
sigue siendo aleatorio y monótono por posición. RF-5 se re-marcó "(revisado tres veces)":
mismo valor de duración (~3.5s), pero ahora con reparto **uniforme** en todo el ciclo en
vez de concentrado en el 40% final — se agregó RF-2 bis a `req-003.md` §2 para dejar la
mecánica misma como requisito explícito, no solo el resultado observable. §7 (Riesgos) de
este documento actualiza su nota sobre mutación de `textContent`: ya no aplica, el
componente usa `setState` como cualquier otro Client Component del proyecto.

Verificación ejecutada tras el rediseño: `npm run lint`, `npm run build` (`/es`/`/en`
siguen SSG) y `npm run build:export` pasan sin errores. Los pasos 14–18 de la Fase D
(revoltijo en vivo con reparto uniforme observado, orden aleatorio, regresión de
brocha/laptop/dashboard, scroll parcial, `prefers-reduced-motion`, árbol de accesibilidad)
requieren navegador interactivo — misma limitación de esta máquina ya declarada en §8,
pendientes de una pasada manual.

## 12. Causa raíz del "no anima nada" (2026-08-02) — bug de unidades, no de mecánica

El usuario probó el rediseño de §11 en su navegador (Safari) y reportó que el eyebrow **no
anima en absoluto** — se ve la frase resuelta y estática, como si el efecto nunca arrancara.

**Esto invalida el diagnóstico de §9 y §10.** No fue un problema de distribución de
fijados ni de duración percibida — fue un bug de parseo que hizo que el timer real corriera
~1000× más rápido de lo previsto, resolviendo la frase en un solo tick imperceptible. Los
tres ajustes de tokens de §9/§10 (2500→3000→3500ms, 50→80→60ms) y la ventana de
asentamiento del 60% fueron todos no-ops: nunca se vio ninguno de esos valores en ejecución
real.

**Causa raíz, confirmada empíricamente** (inspección del CSS y el JS servidos por
`npm run dev` vía `curl`, sin navegador): el minificador de CSS (Lightning CSS, vía
Turbopack) normaliza las unidades de tiempo al valor más corto al compilar. `tokens.css`
declara `--duration-scramble: 3500ms`, pero el chunk CSS que llega al navegador dice
`--duration-scramble: 3.5s` (verificado también para `--duration-brush: 3.5s`,
`--delay-laptop: 1s`, `--duration-reveal: 3.6s` — afecta a todo el bloque de motion, no solo
al token nuevo). `HeroEyebrow.tsx` leía ese valor con `parseFloat(...) || 3500`:
`parseFloat("3.5s")` devuelve `3.5`, no `3500` — un número válido y truthy, así que el
fallback nunca se activaba. Con `duration = 3.5` e `interval = 60`: `step = total /
(duration/interval) ≈ 257` turnos por tick; en el primer tick (60ms) `iteration` ya supera
`total` (15–18), así que **todas las posiciones se fijan de golpe y el intervalo se limpia**
antes de que el ojo registre nada.

Alcance verificado con `grep -rn "getComputedStyle\|getPropertyValue" src/`: el único
consumidor de tokens de tiempo desde JS en todo el proyecto es `HeroEyebrow.tsx`.
`BrushStroke`/`HeroVisual` consumen sus tokens vía `animation`/`transition` en CSS, donde
`3.5s` es una unidad válida — por eso la brocha y la laptop sí animaban con normalidad y el
bug pasó inadvertido en las specs 001/002.

**Fix**: nuevo helper puro `src/shared/lib/cssTime.ts`, `cssTimeToMs(value, fallback)` —
distingue el sufijo `ms`/`s` del string devuelto por `getPropertyValue` y normaliza siempre
a milisegundos (además de blindar contra `0`/`NaN`, que producirían la misma división por
cero). `HeroEyebrow.tsx` pasa a usarlo en vez de `parseFloat` directo (ver paso 7 y su nota
de puntos finos, actualizados). Documentado también en `ia-docs/global/styles.md` §5.4 como
advertencia general — no es un detalle de esta spec, es una trampa para cualquier consumidor
futuro de un token de tiempo desde JS.

No se tocó la mecánica de `iteration`/`buildRevealRanks` de §11 — se verificó por separado
ejecutando `scramble.ts` en Node con `duration=3500`/`interval=60` reales (no los `3.5`
parseados por error) y el revoltijo progresivo resuelve correctamente en 3540ms.

Verificación ejecutada tras el fix: `npm run lint`, `npm run build` (`/es`/`/en` siguen SSG)
y `npm run build:export` pasan sin errores. `cssTimeToMs` se probó contra los valores reales
servidos por el dev server (`"3.5s"`→3500, `"60ms"`→60, `".15s"`→150, `"1s"`→1000) vía
`npx tsx -e`. Se confirmó por `curl` sobre los chunks servidos que el CSS sigue emitiendo
`--duration-scramble: 3.5s` sin cambios (el fix es del lado del consumidor, no del CSS) y
que el bundle JS servido ya contiene `cssTimeToMs` compilado. Los pasos 14–18 de la Fase D
(revoltijo en vivo, orden aleatorio, regresión de brocha/laptop/dashboard, scroll parcial,
`prefers-reduced-motion`, árbol de accesibilidad) siguen pendientes de una pasada manual en
navegador — misma limitación de esta máquina ya declarada en §8.
