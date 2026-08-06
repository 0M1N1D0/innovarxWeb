# Guía de estilo visual — InnovArx

> **Estado:** fuente única de verdad para el diseño visual del frontend.
> Cualquier color, tipografía o medida que se use en el desarrollo debe salir de este documento. Si algo no está aquí, se decide y se agrega aquí primero — no se improvisa directamente en el código.

## 1. Origen de esta guía

Este documento se construyó auditando los tres únicos activos de marca existentes en el repositorio, extrayendo valores exactos (no aproximaciones visuales) de sus archivos fuente:

| Activo                                          | Qué aportó                                                                                                                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `logo-innovarx.jpg`                             | El gradiente de marca exacto (muestreado píxel a píxel) y el concepto de identidad (estructura + energía).                                                                     |
| `Catalogo_Servicios_Web_InnovArx.pdf`           | Las tres familias tipográficas reales embebidas en el PDF, la escala de tamaños usada, y la paleta neutra/semántica declarada en los operadores de color del propio documento. |
| `Landing page moderna para agencia digital.png` | Cómo se aplica la identidad en un layout web real: superficies, tintes de fondo, banda oscura, jerarquía de botones.                                                           |

No existe código de frontend todavía — este documento antecede la implementación y debe guiarla.

## 2. Identidad de marca

El logo `InnovArx` construye su identidad sobre un contraste deliberado entre dos mitades:

- **`Innov`** — una sans geométrica sólida, en negro casi puro (`#131313`), sin gradiente. Transmite estructura, solidez, ingeniería.
- **`Arx`** — una itálica tipo pincel/brush, con el gradiente de marca completo aplicado como relleno. Transmite energía, creatividad, movimiento.

Esta dualidad **estructura + energía** es el concepto rector de la marca: lo sólido y confiable (texto, layout, componentes) se mantiene neutro y disciplinado; el color y el gradiente se reservan como acento para lo que debe destacar (CTAs, énfasis, elementos de marca). No se debe diluir el gradiente aplicándolo de forma genérica a todo el texto o fondos — pierde su función de acento.

Las "pinceladas" (brushstrokes) que acompañan al logo y aparecen tanto en el catálogo como en el mockup de landing son parte de este mismo lenguaje visual: trazos de pincel con el gradiente de marca, usados como elemento gráfico de fondo. Se documentan en la sección 6.

## 3. Paleta de color

### 3.1 Gradiente de marca (elemento central de identidad)

Medido por muestreo píxel a píxel sobre la palabra "Arx" del logo, de izquierda a derecha:

| Parada  | Hex       | Posición | Uso                                             |
| ------- | --------- | -------- | ----------------------------------------------- |
| Azul    | `#1F5EF3` | 0%       | Inicio del gradiente, enlaces, iconos de acento |
| Índigo  | `#5A51E8` | ~30%     | Botones primarios (tono dominante en CTAs)      |
| Púrpura | `#9644DC` | ~55%     | Centro del gradiente                            |
| Magenta | `#C934C0` | ~75%     | Transición hacia el acento                      |
| Rosa    | `#FC24A5` | 100%     | Final del gradiente, acentos puntuales, badges  |

**Definición canónica:**

```
linear-gradient(90deg, #1F5EF3 0%, #5A51E8 25%, #9644DC 50%, #C934C0 75%, #FC24A5 100%)
```

**Variantes de ángulo:**

- `90deg` (horizontal) — texto con gradiente (wordmark "Arx"), subrayados, bordes de acento.
- `135deg` (diagonal) — fondos de superficie, botones, tarjetas destacadas, banners.

No recolorear ni reordenar las paradas. No usar el gradiente completo sobre áreas de texto largo (afecta legibilidad); para texto usar `background-clip: text` solo en titulares cortos o wordmarks.

### 3.2 Neutrales

Declarados como operadores de color en el propio PDF del catálogo (no estimados):

| Token              | Hex       | Uso                                                            |
| ------------------ | --------- | -------------------------------------------------------------- |
| Tinta (ink)        | `#131313` | Texto principal, titulares, la mitad "Innov" del logo          |
| Texto secundario   | `#4A4A52` | Párrafos, descripciones, texto de apoyo                        |
| Texto sutil        | `#B8B8C2` | Placeholders, iconos deshabilitados, marcas ✕ de "no incluido" |
| Borde              | `#E6E6EC` | Bordes de tarjetas, separadores                                |
| Superficie elevada | `#EFEFF3` | Fondos de tarjetas sobre `bg`, chips, inputs                   |
| Fondo              | `#F6F6F9` | Fondo de página en secciones neutras                           |
| Blanco             | `#FFFFFF` | Fondo de página principal, texto sobre superficies oscuras     |

### 3.3 Superficies adicionales (del mockup de landing)

| Token             | Hex       | Uso                                                           |
| ----------------- | --------- | ------------------------------------------------------------- |
| Fondo lavanda     | `#F8F7FD` | Fondo de secciones alternas (tinte sutil, no plano `#F6F6F9`) |
| Superficie oscura | `#15122B` | Banda de CTA final, fondos de mockups de producto, footer     |

### 3.4 Semántico

| Token            | Hex       | Uso                                                   |
| ---------------- | --------- | ----------------------------------------------------- |
| Éxito / incluido | `#12805C` | Marcas ✓ en listas de características, confirmaciones |

> El catálogo no declara colores de error/advertencia — al necesitarse, elegir tonos que mantengan el mismo nivel de saturación y luminosidad que el verde de éxito (evitar rojos/amarillos puros que choquen con el gradiente frío-a-cálido de marca).

### 3.5 Contraste (WCAG) — verificado

| Combinación                         | Ratio  | Veredicto                                                           |
| ----------------------------------- | ------ | ------------------------------------------------------------------- |
| `#131313` sobre `#FFFFFF`           | 18.6:1 | AAA — texto de cualquier tamaño                                     |
| `#4A4A52` sobre `#F6F6F9`           | 8.1:1  | AAA — texto de cualquier tamaño                                     |
| `#FFFFFF` sobre `#15122B`           | 18.2:1 | AAA — texto de cualquier tamaño                                     |
| `#12805C` sobre `#FFFFFF`           | 4.9:1  | AA — texto de cualquier tamaño                                      |
| `#FFFFFF` sobre `#1F5EF3` (azul)    | 5.3:1  | AA — texto de cualquier tamaño                                      |
| `#FFFFFF` sobre `#5A51E8` (índigo)  | 5.6:1  | AA — texto de cualquier tamaño                                      |
| `#FFFFFF` sobre `#9644DC` (púrpura) | 5.1:1  | AA — texto de cualquier tamaño                                      |
| `#FFFFFF` sobre `#C934C0` (magenta) | 4.4:1  | **Solo texto grande (≥18.66px bold o ≥24px)**                       |
| `#FFFFFF` sobre `#FC24A5` (rosa)    | 3.5:1  | **Solo texto grande** — no usar para párrafos ni etiquetas pequeñas |
| `#B8B8C2` sobre `#F6F6F9`           | 1.8:1  | **Decorativo únicamente** — nunca portar texto legible              |

Regla práctica: texto blanco sobre el **gradiente completo** en `135deg` es seguro en su mitad azul/índigo/púrpura; si un botón o banda usa el extremo magenta/rosa como fondo sólido, el texto debe ser de tamaño grande (≥18.66px bold / ≥24px) o llevar un ink oscuro en vez de blanco.

## 4. Tipografía

### 4.1 Familias

| Familia           | Pesos                     | Rol                                                      |
| ----------------- | ------------------------- | -------------------------------------------------------- |
| **Space Grotesk** | SemiBold, Bold            | Titulares y display (H1–H3)                              |
| **Manrope**       | Regular, Medium, SemiBold | Cuerpo de texto, UI, botones, párrafos                   |
| **IBM Plex Mono** | Regular, SemiBold         | Eyebrows/etiquetas en mayúsculas, precios, datos, badges |

> ⚠️ **`DejaVu Sans` y `DejaVu Sans Mono` aparecen embebidas en el PDF pero NO son fuentes de marca.** Son el fallback automático que usa el generador del documento para glifos (como acentos: á, é, í, ó, ú, ñ) que las fuentes reales no cubrían en ese momento. No usar DejaVu en ninguna implementación — sustituir siempre por Space Grotesk / Manrope / IBM Plex Mono, que sí soportan tildes y eñe correctamente en sus versiones de Google Fonts.

Import de Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

### 4.2 Escala

Tamaños medidos en el PDF (puntos, contexto impreso) traducidos a una escala web en `rem` que conserva las mismas proporciones relativas:

| Nivel   | Fuente PDF (pt) | Web (rem / px)            | Familia                 | Peso             | Uso                                                         |
| ------- | --------------- | ------------------------- | ----------------------- | ---------------- | ----------------------------------------------------------- |
| Display | 44              | 2rem–2.75rem / 32–44px    | Space Grotesk           | SemiBold         | H1 de hero                                                  |
| H2      | 24              | 1.375rem–1.5rem / 22–24px | Space Grotesk           | SemiBold         | Títulos de sección                                          |
| H3      | 17.33           | 1rem–1.125rem / 16–18px   | Space Grotesk           | SemiBold/Bold    | Subtítulos, títulos de tarjeta                              |
| Body-lg | 16              | 1rem / 16px               | Manrope                 | Regular/Medium   | Párrafo destacado, subcopy de hero                          |
| Body    | 14              | 1rem / 16px               | Manrope                 | Regular          | Párrafo estándar; mínimo móvil para evitar auto-zoom en iOS |
| Body-sm | 12.8            | 0.8rem / 12.8px           | Manrope                 | Medium           | Texto de UI (botones, nav)                                  |
| Caption | 11.2            | 0.7rem / 11.2px           | Manrope / IBM Plex Mono | Regular/SemiBold | Metadatos, precios secundarios                              |
| Micro   | 9–10.8          | 0.6–0.68rem               | IBM Plex Mono           | Regular/SemiBold | Eyebrows, badges, timestamps                                |

`--text-display`, `--text-h2` y `--text-h3` usan `clamp()` entre los mínimos y máximos de
la tabla: alcanzan su mínimo a 320px y su máximo a 1024px. Los máximos conservan la escala
original. `--text-body-lg` y `--text-body` permanecen en 1rem (16px) para no bajar del mínimo
legible en móviles.

### 4.3 Line-height y letter-spacing

| Nivel                              | Line-height | Letter-spacing                                                       |
| ---------------------------------- | ----------- | -------------------------------------------------------------------- |
| Display / H2 / H3 (Space Grotesk)  | 1.1–1.2     | -0.01em (ajuste óptico leve)                                         |
| Body / Body-lg / Body-sm (Manrope) | 1.5–1.6     | 0                                                                    |
| Caption / Micro en IBM Plex Mono   | 1.4         | **0.08–0.12em**, siempre en mayúsculas (`text-transform: uppercase`) |

El tracking amplio + mayúsculas en IBM Plex Mono es una firma consistente del catálogo para etiquetas tipo eyebrow ("SERVICIOS · WEB", "NIVELES DE SERVICIO") — mantenerlo siempre que se use esta familia para etiquetas cortas.

## 5. Espaciado, radios y sombras

### 5.1 Espaciado

Escala base de 4px:

```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

El ritmo vertical de sección usa `--space-section-y`: parte de 48px a 320px y crece de forma
continua hasta el máximo existente de 96px desde `lg` (1024px).

### 5.2 Radios

Observados en el mockup de landing:

| Token         | Valor | Uso                                       |
| ------------- | ----- | ----------------------------------------- |
| `radius-sm`   | 8px   | Inputs, chips pequeños                    |
| `radius-md`   | 12px  | Tarjetas de servicio, iconos contenedores |
| `radius-lg`   | 16px  | Tarjetas grandes, secciones destacadas    |
| `radius-pill` | 999px | Botones, badges ("POPULAR"), navegación   |

### 5.3 Sombras

El mockup usa sombras suaves y muy difusas, sin bordes duros, coherentes con un fondo predominantemente blanco:

```
shadow-sm:  0 1px 2px rgba(19, 19, 19, 0.04)
shadow-md:  0 4px 12px rgba(19, 19, 19, 0.06)
shadow-lg:  0 12px 32px rgba(19, 19, 19, 0.10)
shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25)   /* halo de color para CTAs con gradiente */
```

### 5.4 Movimiento

Introducido para `BrushStroke` (`ia-docs/specs/001-brush-animated-large/req-001.md`), primer
componente animado del sitio. Duraciones cortas para micro-interacciones (hover, transiciones de
UI); `--duration-brush` es un caso aparte, calibrado para que el "pintado" del trazo se lea como
un gesto deliberado, no un parpadeo.

| Token                      | Valor                            | Uso                                                                                                                                                                                          |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `duration-fast`            | 150ms                            | Hover, focus, transiciones de UI puntuales                                                                                                                                                   |
| `duration-base`            | 300ms                            | Transiciones de UI por defecto                                                                                                                                                               |
| `duration-slow`            | 600ms                            | Transiciones de layout más notorias                                                                                                                                                          |
| `duration-brush`           | 3500ms                           | Calibración específica del Hero: duración del "pintado" de la brocha (`ImageAnimation` con `direction="diagonal"`) — más lenta que el default genérico, pasada explícita vía prop `duration` |
| `duration-image-animation` | 3600ms                           | Default de `duration` en `image-animation` (§5.5) — usado tal cual por laptop y dashboard del Hero                                                                                           |
| `delay-laptop`             | 1000ms                           | Calibración del Hero: retardo entre el arranque del pintado de la brocha y el arranque de la laptop (spec 002 RF-2 rev.), pasado vía prop `delay` de `image-animation`                       |
| `delay-stagger`            | 250ms                            | Calibración del Hero: retardo entre laptop y dashboard al entrar en el Hero, sumado a `delay-laptop` vía `calc()` en la prop `delay` del dashboard                                           |
| `duration-hacker-text`     | 3500ms                           | Default de `duration` en `hacker-text-animation` (§5.5) — duración total del revoltijo (spec 003 RF-5, revisado tres veces — ver impl-003.md §8/§10/§11)                                     |
| `interval-hacker-text`     | 60ms                             | Default de `interval` en `hacker-text-animation` — cadencia de re-tirada de letras (spec 003, revisado tres veces)                                                                           |
| `ease-out`                 | `cubic-bezier(0.16, 1, 0.3, 1)`  | Entradas — arranque rápido, llegada suave                                                                                                                                                    |
| `ease-in-out`              | `cubic-bezier(0.65, 0, 0.35, 1)` | Transiciones simétricas (aparece y desaparece)                                                                                                                                               |

`duration-brush`/`delay-laptop`/`delay-stagger` no son valores por defecto de una animación
genérica — son calibraciones de las tres instancias concretas del Hero, pasadas explícitas por
prop en `HeroVisual.tsx`. `duration-image-animation`/`duration-hacker-text`/
`interval-hacker-text` sí son defaults: se usan automáticamente si el consumidor no pasa la prop
correspondiente. Ver §5.5 para el catálogo completo de props de cada animación.

**⚠ Consumo de estos tokens desde JS (no solo CSS):** el minificador de CSS (Lightning CSS, vía
Turbopack) normaliza las unidades de tiempo al valor más corto al servir el build — `3500ms` llega
al navegador como `3.5s`. `getComputedStyle(...).getPropertyValue(...)` devuelve ese string ya
normalizado, así que un `parseFloat` directo sobre un token de tiempo interpreta `"3.5s"` como
`3.5`, no `3500` — un bug silencioso que hace que cualquier timer derivado corra ~1000× más rápido
de lo esperado. Todo consumo de un token de tiempo desde JS (no desde `animation`/`transition` en
CSS, donde la unidad no importa) debe pasar por `cssTimeToMs` (`src/shared/lib/cssTime.ts`), nunca
por `parseFloat` directo. Historial: este bug afectó al revoltijo del eyebrow del Hero — ver
`ia-docs/specs/003-phrase-animation/impl-003.md` §12.

### 5.5 Animaciones reutilizables

Las tres animaciones del Hero (specs 001/002/003) se generalizaron en dos componentes de
`src/shared/components/`, para poder aplicarse a cualquier texto o imagen futura sin duplicar
lógica. Ninguna introduce una librería de animación (GSAP, Framer Motion) — mismo argumento que
ya sentaron req-001 §4, req-002 §3 y req-003 §3: JS simple (`setInterval`/`IntersectionObserver`)
o CSS (`@keyframes`/`mask`) alcanza.

#### `hacker-text-animation` — `HackerText`

Revoltijo de letras que se van fijando en orden aleatorio hasta revelar un texto — efecto
"scramble text"/"hacker text": un contador de iteración avanza por tick y cada posición se fija
en cuanto le toca su turno (barajado). Generaliza el revoltijo del eyebrow del Hero
(`ia-docs/specs/003-phrase-animation/`).

```tsx
<HackerText text={t("eyebrow")} className={styles.eyebrow} />
```

| Prop        | Tipo          | Requerido | Default                        | Nota                                                                        |
| ----------- | ------------- | --------- | ------------------------------ | --------------------------------------------------------------------------- |
| `text`      | `string`      | sí        | —                              | El texto a revelar                                                          |
| `className` | `string`      | no        | —                              | Estilo visual (tipografía, color, layout) — el componente no impone ninguno |
| `duration`  | `number` (ms) | no        | `--duration-hacker-text`       | Duración total del ciclo                                                    |
| `interval`  | `number` (ms) | no        | `--interval-hacker-text`       | Cadencia de re-tirada de letras                                             |
| `alphabet`  | `string`      | no        | `"ABCDEFGHIJKLMNOPQRSTUVWXYZ"` | Alfabeto del revoltijo                                                      |
| `delay`     | `number` (ms) | no        | `0`                            | Espera tras entrar en viewport antes de arrancar                            |
| `threshold` | `number`      | no        | `0.35`                         | Umbral de visibilidad del `IntersectionObserver`                            |

`duration`/`interval` son numéricos porque el revoltijo es un timer de JS (`setInterval`), no una
animación CSS — el default se lee del token vía `cssTimeToMs` (§5.4 ⚠), nunca por `parseFloat`
directo. El nombre accesible expuesto a lectores de pantalla es siempre el texto completo y
correcto, nunca un estado intermedio del revoltijo (texto visualmente oculto en paralelo al nodo
animado, que lleva `aria-hidden`). Con `prefers-reduced-motion: reduce`, el texto se muestra
resuelto de inmediato, sin ciclo.

#### `image-animation` — `ImageAnimation`

Barrido de máscara sobre una imagen, con revelado opcional (`fade`) que además la hace entrar con
un desplazamiento vertical corto. Generaliza el "pintado" de la brocha del Hero
(`ia-docs/specs/001-brush-animated-large/`) y el revelado de laptop/dashboard
(`ia-docs/specs/002-image-animated-hero/`) — misma técnica, antes separada en dos lugares
distintos del código.

```tsx
<ImageAnimation
  src="/images/laptop-hero.png"
  alt=""
  width={1400}
  height={1098}
  priority
  direction="left-to-right"
  fade
  duration="var(--duration-image-animation)"
  delay="var(--delay-laptop)"
  className={styles.laptop}
  active={painting}
/>
```

| Prop                            | Tipo                                               | Requerido | Default                           | Nota                                                                                                                         |
| ------------------------------- | -------------------------------------------------- | --------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `src`, `alt`, `width`, `height` | passthrough de `next/image`                        | sí        | —                                 |                                                                                                                              |
| `priority`                      | `boolean`                                          | no        | —                                 | Passthrough de `next/image`                                                                                                  |
| `className`                     | `string`                                           | no        | —                                 | Tamaño/posición del consumidor                                                                                               |
| `direction`                     | `"diagonal" \| "left-to-right" \| "top-to-bottom"` | **sí**    | —                                 | Ángulo y eje del barrido de máscara — sin default sensato                                                                    |
| `fade`                          | `boolean`                                          | no        | `false`                           | Si además del barrido, la imagen entra con `translateY` desde `--space-3`                                                    |
| `duration`                      | `string` (valor/expresión CSS)                     | no        | `var(--duration-image-animation)` | p. ej. `"var(--duration-brush)"`                                                                                             |
| `delay`                         | `string` (valor/expresión CSS)                     | no        | `"0ms"`                           | p. ej. `"var(--delay-laptop)"` o `"calc(var(--delay-laptop) + var(--delay-stagger))"`                                        |
| `active`                        | `boolean`                                          | no        | —                                 | **Modo controlado**: si se pasa (incluso `false`), el componente no observa su propio viewport — reacciona solo a este valor |
| `onRevealChange`                | `(active: boolean) => void`                        | no        | —                                 | Notifica cuándo arranca/rearma el ciclo, controlado o no                                                                     |
| `threshold`                     | `number`                                           | no        | `0.35`                            | Umbral del observer — solo aplica en modo no controlado                                                                      |

`duration`/`delay` son strings CSS (no números) porque `image-animation` es una animación CSS pura
(`@keyframes` + `mask-position`/`opacity`/`transform`): el valor nunca se parsea en JS, va directo
a `animation-duration`/`animation-delay`, dejando que la cascada de tokens (`var(...)`,
`calc(...)`) siga siendo la única fuente de verdad. Contraste con `hacker-text-animation`, donde
`duration`/`interval` sí son numéricos porque controlan un timer de JS.

**Modo controlado vs. no controlado:** sin `active`, el componente se auto-observa (como hacía
`BrushStroke`) y arranca solo al entrar en viewport. Con `active` explícito, no instala ningún
`IntersectionObserver` propio (`useViewportCycle` gana un parámetro `enabled` para esto,
`src/shared/hooks/useViewportCycle.ts`) — un padre le pasa el estado. Así se encadenan las tres
capas del Hero: la brocha se auto-observa y avisa por `onRevealChange` cuándo arranca; laptop y
dashboard están en modo controlado (`active={painting}`) para entrar en simultáneo con ella.

Con `prefers-reduced-motion: reduce`, la imagen se muestra completa de inmediato y no se anima en
ningún scroll — garantía incondicional en CSS (no en JS), para que no dependa de cómo llegó
`active` en modo controlado.

### 5.6 Breakpoints y contenedor

El sistema responsivo es mobile-first: el estado base no usa media query y cada ampliación usa
`min-width` con esta escala única.

| Nombre | `min-width` | Rango de referencia |
| ------ | ----------: | ------------------- |
| base   |           — | 0–639px             |
| `sm`   |       640px | Desde 640px         |
| `md`   |       768px | Desde 768px         |
| `lg`   |      1024px | Desde 1024px        |
| `xl`   |      1280px | Desde 1280px        |
| `2xl`  |      1536px | Desde 1536px        |

Las condiciones de `@media` no aceptan `var()`: por eso estos valores se escriben literalmente
en cada `.module.css`. Esta tabla es la fuente de verdad y todo literal debe coincidir con ella.
El contenido usa `--container-max: 1120px`. El gutter `--space-gutter` vale 16px en base, 24px
desde `md` y 32px desde `lg`.

## 6. Uso del logo

- **Área de respeto:** dejar un margen mínimo alrededor del logo equivalente a la altura de la "I" de "Innov".
- **Tamaño mínimo:** no reproducir por debajo de ~24px de alto (legibilidad del brush de "Arx" se degrada antes que la parte sans).
- **Sobre fondo claro:** versión estándar (`Innov` en `#131313` + `Arx` en gradiente).
- **Sobre fondo oscuro** (ej. superficie `#15122B`): `Innov` pasa a blanco (`#FFFFFF`); `Arx` conserva el gradiente sin cambios (ya tiene contraste propio sobre oscuro).
- **No hacer:**
  - No recolorear las paradas del gradiente.
  - No aplicar el gradiente a la palabra "Innov".
  - No aplicar un color plano a "Arx" (pierde la identidad dual estructura/energía).
  - No deformar, rotar ni añadir efectos (sombras duras, contornos) al logo.
  - No colocar el logo sobre fondos con patrones o brushstrokes que compitan con el gradiente de "Arx".

**Brushstrokes como recurso gráfico:** los trazos de pincel con el gradiente de marca (visibles en el logo, el catálogo y como fondo decorativo en el mockup de landing) son un elemento de identidad reutilizable — se usan como acento visual de fondo en hero sections y transiciones de sección, siempre con opacidad reducida (~15–30%) para no competir con el contenido. No son un patrón decorativo genérico: deben usar siempre el gradiente de marca definido en la sección 3.1.

## 7. Tokens listos para implementar

### 7.1 Tailwind CSS v4 (`@theme`)

```css
@theme {
  /* Color — gradiente de marca */
  --color-brand-blue: #1f5ef3;
  --color-brand-indigo: #5a51e8;
  --color-brand-purple: #9644dc;
  --color-brand-magenta: #c934c0;
  --color-brand-pink: #fc24a5;

  /* Color — neutrales */
  --color-ink: #131313;
  --color-text-secondary: #4a4a52;
  --color-text-subtle: #b8b8c2;
  --color-border: #e6e6ec;
  --color-surface-elevated: #efeff3;
  --color-bg: #f6f6f9;
  --color-bg-alt: #f8f7fd;
  --color-surface-dark: #15122b;
  --color-white: #ffffff;
  --color-overlay: rgba(21, 18, 43, 0.35);

  /* Color — semántico */
  --color-success: #12805c;

  /* Tipografía */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-display: clamp(2rem, calc(1.659rem + 1.705vw), 2.75rem);
  --text-h2: clamp(1.375rem, calc(1.318rem + 0.284vw), 1.5rem);
  --text-h3: clamp(1rem, calc(0.943rem + 0.284vw), 1.125rem);
  --text-body-lg: 1rem;
  --text-body: 1rem;
  --text-body-sm: 0.8rem;
  --text-caption: 0.7rem;
  --text-micro: 0.625rem;

  /* Layout responsivo */
  --container-max: 1120px;
  --space-gutter: 16px;
  --space-section-y: clamp(48px, calc(26.18px + 6.82vw), 96px);
  --header-height: 84px;
  --logo-width: 120px;
  --mobile-nav-width: 360px;
  --size-touch-target: 44px;
  --size-trust-icon: 64px;

  /* Capas */
  --z-hero-laptop: 1;
  --z-hero-dashboard: 2;
  --z-header: 10;

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(19, 19, 19, 0.04);
  --shadow-md: 0 4px 12px rgba(19, 19, 19, 0.06);
  --shadow-lg: 0 12px 32px rgba(19, 19, 19, 0.1);
  --shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25);
}

@media (min-width: 768px) {
  :root {
    --space-gutter: 24px;
  }
}

@media (min-width: 1024px) {
  :root {
    --space-gutter: 32px;
  }
}

/* Utilidad de gradiente (Tailwind v4 no genera gradientes multi-stop desde @theme) */
.bg-gradient-brand {
  background-image: linear-gradient(
    135deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%
  );
}
.text-gradient-brand {
  background-image: linear-gradient(
    90deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%
  );
  background-clip: text;
  color: transparent;
}
```

### 7.2 Variables CSS puras (sin Tailwind)

> En la implementación, las tres familias se cargan con `next/font/google` (ver `src/app/layout.tsx`), que expone cada una como variable CSS generada por Next (`--font-space-grotesk`, `--font-manrope`, `--font-ibm-plex-mono`). Por eso `--font-display`/`--font-body`/`--font-mono` en `src/styles/tokens.css` referencian esas variables en vez del nombre de familia literal que aparece abajo — el resultado tipográfico es el mismo, solo cambia el nivel de indirección.

```css
:root {
  /* Color — gradiente de marca */
  --color-brand-blue: #1f5ef3;
  --color-brand-indigo: #5a51e8;
  --color-brand-purple: #9644dc;
  --color-brand-magenta: #c934c0;
  --color-brand-pink: #fc24a5;
  --gradient-brand-x: linear-gradient(
    90deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%
  );
  --gradient-brand-diag: linear-gradient(
    135deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%
  );

  /* Color — neutrales */
  --color-ink: #131313;
  --color-text-secondary: #4a4a52;
  --color-text-subtle: #b8b8c2;
  --color-border: #e6e6ec;
  --color-surface-elevated: #efeff3;
  --color-bg: #f6f6f9;
  --color-bg-alt: #f8f7fd;
  --color-surface-dark: #15122b;
  --color-white: #ffffff;
  --color-overlay: rgba(21, 18, 43, 0.35);

  /* Color — semántico */
  --color-success: #12805c;

  /* Tipografía */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-display: clamp(2rem, calc(1.659rem + 1.705vw), 2.75rem);
  --text-h2: clamp(1.375rem, calc(1.318rem + 0.284vw), 1.5rem);
  --text-h3: clamp(1rem, calc(0.943rem + 0.284vw), 1.125rem);
  --text-body-lg: 1rem;
  --text-body: 1rem;
  --text-body-sm: 0.8rem;
  --text-caption: 0.7rem;
  --text-micro: 0.625rem;

  /* Layout responsivo */
  --container-max: 1120px;
  --space-gutter: 16px;
  --space-section-y: clamp(48px, calc(26.18px + 6.82vw), 96px);
  --header-height: 84px;
  --logo-width: 120px;
  --mobile-nav-width: 360px;
  --size-touch-target: 44px;
  --size-trust-icon: 64px;

  /* Espaciado */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;
  --space-10: 128px;

  /* Capas */
  --z-hero-laptop: 1;
  --z-hero-dashboard: 2;
  --z-header: 10;

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(19, 19, 19, 0.04);
  --shadow-md: 0 4px 12px rgba(19, 19, 19, 0.06);
  --shadow-lg: 0 12px 32px rgba(19, 19, 19, 0.1);
  --shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25);

  /* Movimiento */
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
  --duration-brush: 3500ms;
  --duration-image-animation: 3600ms;
  --delay-laptop: 1000ms;
  --delay-stagger: 250ms;
  --duration-hacker-text: 2500ms;
  --interval-hacker-text: 60ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

@media (min-width: 768px) {
  :root {
    --space-gutter: 24px;
  }
}

@media (min-width: 1024px) {
  :root {
    --space-gutter: 32px;
  }
}
```
