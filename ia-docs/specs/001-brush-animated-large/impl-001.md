# 001 — Pincelada animada reutilizable (`BrushStroke`) — Implementación

## 1. Estado

Implementado y commiteado en `25fc68c` ("brocha Hero"). Cubre el contrato completo de
`requirements.md` §2–§7 con una sola omisión deliberada: el componente solo está montado en el
`Hero` (criterio de aceptación §10 marcado como "deferido a propósito" — la laptop y el mockup de
app de la captura de referencia llegan en una entrega posterior, delante del `BrushStroke`, en el
mismo `.visual`). No hubo verificación visual con captura de pantalla real (sin
`chromium-cli`/Playwright ni permiso de Accesibilidad para automatizar Safari en esta máquina); lo
documentado abajo está verificado por inspección de código y del CSS/HTML servido por `next dev`.

## 2. Archivos de la entrega

| Archivo                                           | Rol                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/shared/components/BrushStroke.tsx`           | Nuevo. El componente: observer + estado + `next/image`.                              |
| `src/shared/components/BrushStroke.module.css`    | Nuevo. Máscara, `@keyframes`, `prefers-reduced-motion`.                              |
| `public/images/brush-stroke-large.png`            | Nuevo. Asset recortado a bbox, 1200×486, 574 KB.                                     |
| `public/images/imagen-brocha-1.png`               | Nuevo, sin usar. Variante descartada, queda de respaldo.                             |
| `src/features/landing/components/Hero.tsx`        | Modificado. Pasa de 1 a 2 columnas; monta `BrushStroke`.                             |
| `src/features/landing/components/Hero.module.css` | Modificado. Grid de 2 columnas, `.content`/`.visual`/`.brush`.                       |
| `src/styles/tokens.css`                           | Modificado. Tokens de motion (§8).                                                   |
| `src/styles/globals.css`                          | Modificado. `overflow-x: clip` en `body`.                                            |
| `ia-docs/global/styles.md`                        | Modificado. §5.4 "Movimiento".                                                       |
| `ia-docs/global/architecture.md`                  | Modificado. §5, caso concreto de `BrushStroke` como primer Client Component.         |
| `CLAUDE.md`                                       | Modificado. Nota sobre el primer `"use client"`.                                     |
| `src/shared/components/SiteHeader.tsx`            | Modificado incidental. Corrige ruta del logo a `/images/logo-innovarx.jpg`.          |
| `src/shared/components/LocaleSwitcher.tsx`        | Modificado incidental. Comentario actualizado (ya no dice "cero Client Components"). |

## 3. El componente

`BrushStroke.tsx:20` — contrato final de props, los tres opcionales:

```ts
interface BrushStrokeProps {
  className?: string;
  delay?: number; // default 1000
  threshold?: number; // default 0.35
}
```

`threshold` se consume dos veces con roles distintos (`BrushStroke.tsx:46,60`): como umbral de
"contado como visible" en la condición `entry.intersectionRatio >= threshold`, y como el segundo
valor de la lista `{ threshold: [0, threshold] }` que se le pasa al constructor del
`IntersectionObserver` — esa lista le pide al navegador que dispare el callback en dos puntos
(0% y el umbral elegido) en vez de en cada píxel de scroll, que es lo que permite distinguir
"salió del todo" (ratio 0) de "cruzó el umbral" sin recalcular el ratio a mano.

El wrapper es un `<span>` (`BrushStroke.tsx:72`), no un `<div>`: el componente es puramente
decorativo e inline dentro de `.visual`, y `styles.wrapper` (`BrushStroke.module.css:1-4`) le pone
`display: block; line-height: 0` para que no arrastre el espaciado de línea propio de un elemento
inline — un `<div>` habría necesitado el mismo reset sin ganar nada semántico.

`next/image` con `priority` (`BrushStroke.tsx:73-80`): el asset vive dentro del `Hero`, que es el
contenido above-the-fold en `/es` y `/en`; `priority` le dice a Next que lo precargue en vez de
esperar al lazy-loading por defecto, igual que ya hace el logo en `SiteHeader.tsx`.

## 4. La máscara

`BrushStroke.module.css:27-34` revela el PNG con un `mask-image` en gradiente lineal:

```css
mask-image: linear-gradient(248deg, #000 0%, #000 38%, transparent 62%);
mask-size: 400% 400%;
mask-position: 0% 0%; /* reposo */
```

`#000`/`transparent` aquí son canal alfa de la máscara (qué tan visible es cada píxel del PNG
debajo), no color pintado en pantalla — por eso no cuentan como el literal hex que `CLAUDE.md`
prohíbe en stylesheets (esa regla es sobre color visible consumido vía `var(--token)`).

El ángulo `248deg` y el sentido en que `@keyframes paint` desliza `mask-position` (de `0% 0%` a
`100% 100%`, `BrushStroke.module.css:41-50`) están acoplados a propósito: el gradiente traza el
mismo eje que el trazo del PNG (~68° medido en el asset, +180° porque el sentido de barrido pedido
es cabeza gruesa → cola fina, derecha a izquierda). Invertir solo el ángulo o solo el sentido de
`mask-position` invierte cuál extremo es "reposo" (sin pintar) y cuál es "pintado" (mancha
completa), rompiendo RF-3 (el estado en reposo dejaría de ser "sin pintar").

`mask-size: 400% 400%` con banda de fundido `0%–38%/62%–100%` (no el `300%`/`35–55%` que
proponía `requirements.md` §4): con el elemento ocupando `1/N` del gradiente (`N00%`), la banda de
fundido tiene que caber dentro de esa fracción para que los dos extremos de la animación
(`mask-position: 0% 0%` y `100% 100%`) caigan de lleno en zona 100% sólida o 100% transparente. Con
`N=3` y una banda de 20 puntos porcentuales quedaba corta — el fotograma final dejaba la cabeza del
trazo en ~75% de opacidad en vez de 100%. `N=4` con banda de 38%/62% (24 puntos de margen a cada
lado) resuelve esa cuenta.

## 5. Disparo y re-disparo

El observer (`BrushStroke.tsx:41-61`) implementa la histéresis de RF-2/RF-3/RF-4 con dos ramas
sobre las mismas entries, sin `else` final:

```ts
if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
  if (paintTimer) return; // ya hay un timer corriendo: no reinicia
  paintTimer = setTimeout(() => {
    setIsVisible(true);
    paintTimer = undefined;
  }, delay);
} else if (!entry.isIntersecting) {
  if (paintTimer) {
    clearTimeout(paintTimer);
    paintTimer = undefined;
  }
  setIsVisible(false); // rearma para el próximo ciclo
}
```

- **RF-2** (retraso ~1s al entrar en viewport): rama 1, `setTimeout(delay)` con default 1000ms.
- **RF-3** (re-dispara al volver a entrar): rama 2 pone `isVisible` en `false` únicamente cuando
  `!entry.isIntersecting` (ratio 0, salió por completo) — al reingresar, la rama 1 vuelve a
  arrancar el timer desde cero, y como el estado de reposo del CSS es `mask-position: 0% 0%`
  (§4), la mancha vuelve a "desaparecer" antes de repintarse.
- **RF-4** (sin parpadeo en scrolls parciales): un cruce parcial del umbral —`isIntersecting` true
  pero `intersectionRatio < threshold`, o cualquier estado que no sea "entró superando threshold"
  ni "salió del todo"— no cae en ninguna de las dos ramas (no hay `else` final), así que no toca
  `paintTimer` ni `isVisible`. El guard `if (paintTimer) return` en la rama 1 cubre el caso
  restante: reingresos repetidos mientras el timer ya está en curso no lo reinician.

El `IntersectionObserver` se construye con `{ threshold: [0, threshold] }` (`BrushStroke.tsx:60`)
precisamente para que el navegador dispare el callback en esos dos puntos exactos (0% y el umbral)
en vez de en cada fracción de scroll.

## 6. Reduced motion

Dos capas, deliberadamente redundantes (`requirements.md` §7):

1. **CSS — la garantía real** (`BrushStroke.module.css:55-64`): bajo
   `@media (prefers-reduced-motion: reduce)`, `mask-image: none` (PNG completo siempre visible,
   sin máscara) y `animation: none` en `.isVisible`. Esto es lo que efectivamente cumple el
   criterio de aceptación pase lo que pase con la clase que le ponga React.
2. **JS — solo ahorro de trabajo** (`BrushStroke.tsx:31-32`): si `matchMedia(...).matches` es
   true, el `useEffect` retorna antes de crear el `IntersectionObserver`. No es la garantía de
   accesibilidad (esa vive en el CSS); es evitar observar/objetar estado que de todos modos el CSS
   va a anular.

El orden importa: si el corte viviera solo en JS y hubiera algún bug en la detección de
`matchMedia`, el usuario con `reduce` vería la animación completa. Con el CSS como fuente de
verdad, ese modo de fallo no existe.

## 7. Cambios colaterales que el spec no anticipaba

- **`Hero` pasó de 1 columna centrada a grid de 2 columnas** (`Hero.module.css:1-11`): necesario
  para darle al `BrushStroke` una columna propia (`.visual`) distinta de la columna de texto
  (`.content`), colapsando de vuelta a 1 columna en `max-width: 900px`.
- **`.brush` al 130% de ancho, `max-width: none`** (`Hero.module.css:20-24`): el trazo se
  diseñó para sangrar fuera de los límites de su propia columna (lectura más orgánica, cubre más
  espacio detrás de donde irá la laptop), no para quedar contenido en el grid.
- **`overflow-x: clip` en `body`** (`globals.css`): consecuencia directa de lo anterior — sin
  recortar el desborde horizontal, el `.brush` al 130% generaría scroll horizontal en la página.
  Se usa `clip`, no `hidden`, porque `hidden` crea un nuevo contenedor de scroll que rompe
  `position: sticky` en `SiteHeader`; `clip` recorta sin ese efecto secundario.
- **`isolation: isolate` en `.visual`** (`Hero.module.css:13-18`): crea un contexto de
  apilamiento propio para la columna visual, reservado para cuando la laptop y el mockup de app
  se monten ahí mismo por delante del `BrushStroke` — evita que sus futuros `z-index` compitan
  con el header sticky.

## 8. Tokens y docs tocados

`tokens.css:87-92` agrega motion, documentado en `styles.md` §5.4:

```css
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 600ms;
--duration-brush: 1800ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

`--duration-brush` (1800ms) es el único usado hoy (`.isVisible` en `BrushStroke.module.css:38`);
los demás quedan disponibles para la próxima UI que necesite transiciones de hover/layout. El
retraso de disparo (~1s, RF-2) **no** es un token — es el valor por defecto de la prop `delay`,
una decisión de comportamiento del componente, no una constante de diseño reutilizable.

`architecture.md` §5 y `CLAUDE.md` quedaron actualizados para dejar de afirmar "el proyecto tiene
cero Client Components" y en su lugar señalar a `BrushStroke` como el primero, con la justificación
de por qué es la excepción correcta a la regla de Server Components por defecto (ver también §5 de
`requirements.md`, ya resuelto en el código: la frontera queda en la hoja, `Hero`/`HomePage` siguen
siendo Server Components).

## 9. Desvíos respecto de la propuesta técnica (§4 de `requirements.md`)

- Se confirma el enfoque propuesto: `mask-image` animado por `@keyframes` + `IntersectionObserver`
  para disparo/re-disparo, sin GSAP/Framer Motion, sin `animation-timeline: view()`. Ninguna
  librería de animación entró al `package.json` por esto.
- Los números concretos de la máscara **no** son los del borrador: la propuesta hablaba de
  `mask-size: 300%` con banda de fundido `35%–55%`; el valor que efectivamente quedó en el código
  es `400%` con banda `38%–62%` (ver §4 para la aritmética de por qué `300%` no alcanzaba).
- El sentido de barrido (derecha a izquierda, cabeza gruesa → cola fina) se implementó tal como lo
  pidió el usuario en el spec, sin exponerlo como prop — sigue fuera de alcance por §9 de
  `requirements.md`.

## 10. Trazabilidad RF → código

| Requisito                                                  | Dónde se cumple                                                                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| RF-1 (reutilizable, decorativo, detrás de otros elementos) | `BrushStroke.tsx:20,72` (sin lógica de negocio, `aria-hidden`); posicionamiento vía `className` del consumidor, `Hero.tsx:45` |
| RF-2 (pintado al entrar en viewport, delay ~1s)            | `BrushStroke.tsx:46-51`                                                                                                       |
| RF-3 (re-dispara al reingresar)                            | `BrushStroke.tsx:52-58` + reposo `mask-position: 0% 0%` en `BrushStroke.module.css:33-34`                                     |
| RF-4 (sin parpadeo en scrolls parciales/erráticos)         | Ausencia de rama `else` en `BrushStroke.tsx:41-61` (§5 arriba)                                                                |
| RF-5 (tamaño/posición responsabilidad del consumidor)      | `BrushStroke.tsx:7-13` (sin props de medidas); `Hero.module.css:20-24` (`.brush`)                                             |
| §7 accesibilidad (`aria-hidden`, `alt=""`)                 | `BrushStroke.tsx:72,75`                                                                                                       |
| §7 `prefers-reduced-motion`                                | `BrushStroke.module.css:55-64` (CSS, garantía real) + `BrushStroke.tsx:31-32` (JS, atajo) — ver §6                            |

## 11. Pendientes / deuda

- **Verificación visual manual pendiente**: todo lo de arriba está verificado por inspección de
  código y CSS/HTML compilado (`next dev`), no por captura de pantalla real — este entorno no
  tiene `chromium-cli`/Playwright instalados ni permiso de Accesibilidad para automatizar Safari
  vía `osascript`. Recomendado antes de cerrar el spec del todo: una pasada con `npm run dev`,
  cargando el Hero, haciendo scroll hasta perderlo de vista y volviendo a subir, y alternando
  `prefers-reduced-motion` en las dev tools.
- **Segundo montaje deferido**: el criterio de aceptación de `requirements.md` §10 que pide
  montar `BrushStroke` en una segunda sección quedó explícitamente diferido — llega junto con la
  laptop/mockup de app en `.visual`. El contrato del componente (tamaño/posición 100% vía
  `className`) ya está pensado para que ese montaje no requiera tocar `BrushStroke.tsx`/`.css`.
- **`public/images/imagen-brocha-1.png`** (2.49 MB) quedó en el repo sin usar, como variante de
  respaldo — no se referencia desde ningún componente.
- **El PSD/PNG fuente aportado por el usuario** (`imagen-brocha-2.png`, 1536×1024, del que se
  recortó `brush-stroke-large.png`) no quedó versionado en `public/images/` — solo el resultado ya
  recortado y comprimido.
