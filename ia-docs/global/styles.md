# Guía de estilo visual — InnovArx

> **Estado:** fuente única de verdad para el diseño visual del frontend.
> Cualquier color, tipografía o medida que se use en el desarrollo debe salir de este documento. Si algo no está aquí, se decide y se agrega aquí primero — no se improvisa directamente en el código.

## 1. Origen de esta guía

Este documento se construyó auditando los tres únicos activos de marca existentes en el repositorio, extrayendo valores exactos (no aproximaciones visuales) de sus archivos fuente:

| Activo | Qué aportó |
|---|---|
| `logo-innovarx.jpg` | El gradiente de marca exacto (muestreado píxel a píxel) y el concepto de identidad (estructura + energía). |
| `Catalogo_Servicios_Web_InnovArx.pdf` | Las tres familias tipográficas reales embebidas en el PDF, la escala de tamaños usada, y la paleta neutra/semántica declarada en los operadores de color del propio documento. |
| `Landing page moderna para agencia digital.png` | Cómo se aplica la identidad en un layout web real: superficies, tintes de fondo, banda oscura, jerarquía de botones. |

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

| Parada | Hex | Posición | Uso |
|---|---|---|---|
| Azul | `#1F5EF3` | 0% | Inicio del gradiente, enlaces, iconos de acento |
| Índigo | `#5A51E8` | ~30% | Botones primarios (tono dominante en CTAs) |
| Púrpura | `#9644DC` | ~55% | Centro del gradiente |
| Magenta | `#C934C0` | ~75% | Transición hacia el acento |
| Rosa | `#FC24A5` | 100% | Final del gradiente, acentos puntuales, badges |

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

| Token | Hex | Uso |
|---|---|---|
| Tinta (ink) | `#131313` | Texto principal, titulares, la mitad "Innov" del logo |
| Texto secundario | `#4A4A52` | Párrafos, descripciones, texto de apoyo |
| Texto sutil | `#B8B8C2` | Placeholders, iconos deshabilitados, marcas ✕ de "no incluido" |
| Borde | `#E6E6EC` | Bordes de tarjetas, separadores |
| Superficie elevada | `#EFEFF3` | Fondos de tarjetas sobre `bg`, chips, inputs |
| Fondo | `#F6F6F9` | Fondo de página en secciones neutras |
| Blanco | `#FFFFFF` | Fondo de página principal, texto sobre superficies oscuras |

### 3.3 Superficies adicionales (del mockup de landing)

| Token | Hex | Uso |
|---|---|---|
| Fondo lavanda | `#F8F7FD` | Fondo de secciones alternas (tinte sutil, no plano `#F6F6F9`) |
| Superficie oscura | `#15122B` | Banda de CTA final, fondos de mockups de producto, footer |

### 3.4 Semántico

| Token | Hex | Uso |
|---|---|---|
| Éxito / incluido | `#12805C` | Marcas ✓ en listas de características, confirmaciones |

> El catálogo no declara colores de error/advertencia — al necesitarse, elegir tonos que mantengan el mismo nivel de saturación y luminosidad que el verde de éxito (evitar rojos/amarillos puros que choquen con el gradiente frío-a-cálido de marca).

### 3.5 Contraste (WCAG) — verificado

| Combinación | Ratio | Veredicto |
|---|---|---|
| `#131313` sobre `#FFFFFF` | 18.6:1 | AAA — texto de cualquier tamaño |
| `#4A4A52` sobre `#F6F6F9` | 8.1:1 | AAA — texto de cualquier tamaño |
| `#FFFFFF` sobre `#15122B` | 18.2:1 | AAA — texto de cualquier tamaño |
| `#12805C` sobre `#FFFFFF` | 4.9:1 | AA — texto de cualquier tamaño |
| `#FFFFFF` sobre `#1F5EF3` (azul) | 5.3:1 | AA — texto de cualquier tamaño |
| `#FFFFFF` sobre `#5A51E8` (índigo) | 5.6:1 | AA — texto de cualquier tamaño |
| `#FFFFFF` sobre `#9644DC` (púrpura) | 5.1:1 | AA — texto de cualquier tamaño |
| `#FFFFFF` sobre `#C934C0` (magenta) | 4.4:1 | **Solo texto grande (≥18.66px bold o ≥24px)** |
| `#FFFFFF` sobre `#FC24A5` (rosa) | 3.5:1 | **Solo texto grande** — no usar para párrafos ni etiquetas pequeñas |
| `#B8B8C2` sobre `#F6F6F9` | 1.8:1 | **Decorativo únicamente** — nunca portar texto legible |

Regla práctica: texto blanco sobre el **gradiente completo** en `135deg` es seguro en su mitad azul/índigo/púrpura; si un botón o banda usa el extremo magenta/rosa como fondo sólido, el texto debe ser de tamaño grande (≥18.66px bold / ≥24px) o llevar un ink oscuro en vez de blanco.

## 4. Tipografía

### 4.1 Familias

| Familia | Pesos | Rol |
|---|---|---|
| **Space Grotesk** | SemiBold, Bold | Titulares y display (H1–H3) |
| **Manrope** | Regular, Medium, SemiBold | Cuerpo de texto, UI, botones, párrafos |
| **IBM Plex Mono** | Regular, SemiBold | Eyebrows/etiquetas en mayúsculas, precios, datos, badges |

> ⚠️ **`DejaVu Sans` y `DejaVu Sans Mono` aparecen embebidas en el PDF pero NO son fuentes de marca.** Son el fallback automático que usa el generador del documento para glifos (como acentos: á, é, í, ó, ú, ñ) que las fuentes reales no cubrían en ese momento. No usar DejaVu en ninguna implementación — sustituir siempre por Space Grotesk / Manrope / IBM Plex Mono, que sí soportan tildes y eñe correctamente en sus versiones de Google Fonts.

Import de Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### 4.2 Escala

Tamaños medidos en el PDF (puntos, contexto impreso) traducidos a una escala web en `rem` que conserva las mismas proporciones relativas:

| Nivel | Fuente PDF (pt) | Web (rem / px) | Familia | Peso | Uso |
|---|---|---|---|---|---|
| Display | 44 | 2.75rem / 44px | Space Grotesk | SemiBold | H1 de hero |
| H2 | 24 | 1.5rem / 24px | Space Grotesk | SemiBold | Títulos de sección |
| H3 | 17.33 | 1.125rem / 18px | Space Grotesk | SemiBold/Bold | Subtítulos, títulos de tarjeta |
| Body-lg | 16 | 1rem / 16px | Manrope | Regular/Medium | Párrafo destacado, subcopy de hero |
| Body | 14 | 0.875rem / 14px | Manrope | Regular | Párrafo estándar |
| Body-sm | 12.8 | 0.8rem / 12.8px | Manrope | Medium | Texto de UI (botones, nav) |
| Caption | 11.2 | 0.7rem / 11.2px | Manrope / IBM Plex Mono | Regular/SemiBold | Metadatos, precios secundarios |
| Micro | 9–10.8 | 0.6–0.68rem | IBM Plex Mono | Regular/SemiBold | Eyebrows, badges, timestamps |

### 4.3 Line-height y letter-spacing

| Nivel | Line-height | Letter-spacing |
|---|---|---|
| Display / H2 / H3 (Space Grotesk) | 1.1–1.2 | -0.01em (ajuste óptico leve) |
| Body / Body-lg / Body-sm (Manrope) | 1.5–1.6 | 0 |
| Caption / Micro en IBM Plex Mono | 1.4 | **0.08–0.12em**, siempre en mayúsculas (`text-transform: uppercase`) |

El tracking amplio + mayúsculas en IBM Plex Mono es una firma consistente del catálogo para etiquetas tipo eyebrow ("SERVICIOS · WEB", "NIVELES DE SERVICIO") — mantenerlo siempre que se use esta familia para etiquetas cortas.

## 5. Espaciado, radios y sombras

### 5.1 Espaciado

Escala base de 4px:

```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

### 5.2 Radios

Observados en el mockup de landing:

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | 8px | Inputs, chips pequeños |
| `radius-md` | 12px | Tarjetas de servicio, iconos contenedores |
| `radius-lg` | 16px | Tarjetas grandes, secciones destacadas |
| `radius-pill` | 999px | Botones, badges ("POPULAR"), navegación |

### 5.3 Sombras

El mockup usa sombras suaves y muy difusas, sin bordes duros, coherentes con un fondo predominantemente blanco:

```
shadow-sm:  0 1px 2px rgba(19, 19, 19, 0.04)
shadow-md:  0 4px 12px rgba(19, 19, 19, 0.06)
shadow-lg:  0 12px 32px rgba(19, 19, 19, 0.10)
shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25)   /* halo de color para CTAs con gradiente */
```

### 5.4 Movimiento

Introducido para `BrushStroke` (`ia-docs/specs/001-brush-animated-large/requirements.md`), primer
componente animado del sitio. Duraciones cortas para micro-interacciones (hover, transiciones de
UI); `--duration-brush` es un caso aparte, calibrado para que el "pintado" del trazo se lea como
un gesto deliberado, no un parpadeo.

| Token | Valor | Uso |
|---|---|---|
| `duration-fast` | 150ms | Hover, focus, transiciones de UI puntuales |
| `duration-base` | 300ms | Transiciones de UI por defecto |
| `duration-slow` | 600ms | Transiciones de layout más notorias |
| `duration-brush` | 4000ms | Ciclo completo del "pintado" de `BrushStroke` |
| `delay-stagger` | 250ms | Retardo entre laptop y dashboard al entrar en el Hero |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas — arranque rápido, llegada suave |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Transiciones simétricas (aparece y desaparece) |

El retraso de ~0.5s antes de que `BrushStroke` arranque (RF-2 del spec 001) no es un token: es un
valor por defecto de la prop `delay` del componente, no una constante de hoja de estilos.

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
  --color-brand-blue: #1F5EF3;
  --color-brand-indigo: #5A51E8;
  --color-brand-purple: #9644DC;
  --color-brand-magenta: #C934C0;
  --color-brand-pink: #FC24A5;

  /* Color — neutrales */
  --color-ink: #131313;
  --color-text-secondary: #4A4A52;
  --color-text-subtle: #B8B8C2;
  --color-border: #E6E6EC;
  --color-surface-elevated: #EFEFF3;
  --color-bg: #F6F6F9;
  --color-bg-alt: #F8F7FD;
  --color-surface-dark: #15122B;
  --color-white: #FFFFFF;

  /* Color — semántico */
  --color-success: #12805C;

  /* Tipografía */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-display: 2.75rem;
  --text-h2: 1.5rem;
  --text-h3: 1.125rem;
  --text-body-lg: 1rem;
  --text-body: 0.875rem;
  --text-body-sm: 0.8rem;
  --text-caption: 0.7rem;
  --text-micro: 0.625rem;

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(19, 19, 19, 0.04);
  --shadow-md: 0 4px 12px rgba(19, 19, 19, 0.06);
  --shadow-lg: 0 12px 32px rgba(19, 19, 19, 0.10);
  --shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25);
}

/* Utilidad de gradiente (Tailwind v4 no genera gradientes multi-stop desde @theme) */
.bg-gradient-brand {
  background-image: linear-gradient(135deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%);
}
.text-gradient-brand {
  background-image: linear-gradient(90deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%);
  background-clip: text;
  color: transparent;
}
```

### 7.2 Variables CSS puras (sin Tailwind)

> En la implementación, las tres familias se cargan con `next/font/google` (ver `src/app/layout.tsx`), que expone cada una como variable CSS generada por Next (`--font-space-grotesk`, `--font-manrope`, `--font-ibm-plex-mono`). Por eso `--font-display`/`--font-body`/`--font-mono` en `src/styles/tokens.css` referencian esas variables en vez del nombre de familia literal que aparece abajo — el resultado tipográfico es el mismo, solo cambia el nivel de indirección.

```css
:root {
  /* Color — gradiente de marca */
  --color-brand-blue: #1F5EF3;
  --color-brand-indigo: #5A51E8;
  --color-brand-purple: #9644DC;
  --color-brand-magenta: #C934C0;
  --color-brand-pink: #FC24A5;
  --gradient-brand-x: linear-gradient(90deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%);
  --gradient-brand-diag: linear-gradient(135deg,
    var(--color-brand-blue) 0%,
    var(--color-brand-indigo) 25%,
    var(--color-brand-purple) 50%,
    var(--color-brand-magenta) 75%,
    var(--color-brand-pink) 100%);

  /* Color — neutrales */
  --color-ink: #131313;
  --color-text-secondary: #4A4A52;
  --color-text-subtle: #B8B8C2;
  --color-border: #E6E6EC;
  --color-surface-elevated: #EFEFF3;
  --color-bg: #F6F6F9;
  --color-bg-alt: #F8F7FD;
  --color-surface-dark: #15122B;
  --color-white: #FFFFFF;

  /* Color — semántico */
  --color-success: #12805C;

  /* Tipografía */
  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-display: 2.75rem;
  --text-h2: 1.5rem;
  --text-h3: 1.125rem;
  --text-body-lg: 1rem;
  --text-body: 0.875rem;
  --text-body-sm: 0.8rem;
  --text-caption: 0.7rem;
  --text-micro: 0.625rem;

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

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(19, 19, 19, 0.04);
  --shadow-md: 0 4px 12px rgba(19, 19, 19, 0.06);
  --shadow-lg: 0 12px 32px rgba(19, 19, 19, 0.10);
  --shadow-brand: 0 8px 24px rgba(90, 81, 232, 0.25);

  /* Movimiento */
  --duration-fast: 150ms;
  --duration-base: 300ms;
  --duration-slow: 600ms;
  --duration-brush: 4000ms;
  --delay-stagger: 250ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```
