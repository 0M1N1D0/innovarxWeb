# 001 — Pincelada animada reutilizable (`BrushStroke`)

## 1. Contexto y objetivo

En la captura de referencia del hero (`ia-docs/captura_hero.png`) aparece una mancha/pincelada
con el gradiente de marca detrás de la laptop. Al escribir este spec era solo parte de una imagen
estática de referencia: no existía ningún componente ni asset del trazo en el repo. **Ya
implementado** — el asset vive en `public/images/brush-stroke-large.png` y el componente en
`src/shared/components/BrushStroke.tsx`, montado en la columna derecha del `Hero` (que en la
misma entrega pasó de una columna centrada a dos columnas, texto a la izquierda). La laptop y el
mockup de app de la captura quedan fuera de esta entrega — se añaden después, por delante del
`BrushStroke`, en el mismo `.visual` que ya lo contiene.

Objetivo: extraer esa mancha a un componente reutilizable y **animado**, de forma que se vea
como si una brocha invisible la fuera pintando en tiempo real (no se dibuja ninguna brocha, solo
el trazo revelándose progresivamente), reutilizable en otras secciones del sitio variando tamaño
y posición.

## 2. Requerimientos funcionales

- **RF-1.** Componente reutilizable y puramente decorativo, colocable detrás de otros elementos
  (ej. la laptop del hero) mediante z-index/posicionamiento del consumidor.
- **RF-2.** Animación de "pintado" que se dispara al **entrar en viewport**, con un retraso de
  ~1s antes de arrancar (le da tiempo al usuario de ubicar la sección antes de que empiece).
  Cuando el Hero es la primera sección visible al cargar la página, este mismo mecanismo cubre
  el caso "se pinta al cargar" sin necesitar un disparador aparte.
- **RF-3.** La animación **se re-dispara** cada vez que el componente vuelve a entrar en
  pantalla: si el usuario hace scroll hacia abajo hasta que el Hero desaparece y luego vuelve a
  hacer scroll hacia arriba, la pincelada se pinta de nuevo desde cero. El estado en reposo
  (fuera de viewport) es "sin pintar"; el estado final del ciclo es la mancha completa visible.
- **RF-4.** No debe haber parpadeo ni animaciones a medias en scrolls cortos/erráticos: el
  componente solo se rearma para repetir la animación cuando salió por completo de la pantalla,
  no en cada cruce parcial del umbral de visibilidad.
- **RF-5.** Tamaño y posición son responsabilidad del consumidor (vía `className`/CSS del
  componente que lo use), no props del propio `BrushStroke`.

## 3. Requerimientos del asset (bloqueante para implementar)

- Se usará un **PNG con canal alfa** (fondo transparente) de la mancha — no un SVG. Lo aporta el
  usuario; no existe todavía en el repo.
- Recortado ajustado al bounding box del trazo, sin márgenes blancos/sólidos alrededor.
- Exportado a suficiente resolución (≥2x el tamaño de despliegue más grande previsto) para no
  pixelar al escalar.
- Ubicación: `public/images/brush-stroke-large.png` (sigue la convención ya establecida para
  imágenes del sitio).

Sin este archivo, el componente no puede implementarse.

**Resuelto.** El usuario aportó `imagen-brocha-2.png` (1536×1024, alfa real verificado —
`imagen-brocha-1.png` quedó sin usar, se deja en el repo por si se necesita como variante). El
bounding box real del trazo (medido decodificando el PNG) era x 53→1535, y 177→765, con ~180px
de margen transparente arriba y ~270px abajo. Se recortó a ese bbox con un margen de respiro de
10px por lado y se redimensionó a 1200×486 (~2× el ancho de despliegue en el Hero), quedando en
`public/images/brush-stroke-large.png` — 574 KB, frente a 2.49 MB del original. Sin
`pngquant`/`oxipng` disponibles en la máquina, la compresión se hizo con un encoder PNG propio
(filtro adaptativo por línea + `zlib` nivel 9); es un PNG straight, no WebP (`sips` de esta
máquina no soporta escribir WebP).

## 4. Enfoque técnico propuesto

- La imagen del trazo se pinta con un `mask-image` cuyo borde se anima a lo largo del eje del
  trazo (`mask-position`/`mask-size` en `@keyframes`). Esto revela progresivamente el PNG ya
  existente, produciendo la lectura de "brocha invisible pintando" sin dibujar ninguna brocha.
- El disparo y re-disparo de la animación (RF-2/RF-3/RF-4) se controlan con un
  `IntersectionObserver` que alterna una clase de estado (`is-visible` / reposo) sobre el
  elemento; el `@keyframes` corre cuando la clase se aplica.
- No se introduce GSAP/Framer Motion ni ninguna librería de animación: `tech-stack.md` no tiene
  tomada esa decisión todavía, y este efecto no la amerita — CSS + un observer bastan.
- Se evaluó y se descarta `animation-timeline: view()` (scroll-driven animations, 100% CSS): el
  soporte de navegador aún es desigual y exigiría un fallback, lo que suma más complejidad de la
  que ahorra frente al `IntersectionObserver`.
- **Sentido del barrido** (a pedido del usuario, sin exponer una prop — sigue fuera de alcance
  por §9): pinta de derecha a izquierda (cabeza gruesa → cola fina). El ángulo del gradiente de
  máscara y el sentido de `mask-position` están acoplados — invertir solo uno invierte también
  qué estado es "reposo" y cuál "pintado" (rompe RF-3), así que giran juntos. `mask-size` y el
  ancho de la banda de fundido del gradiente también están acoplados entre sí: con el elemento
  ocupando una fracción `1/N` del gradiente (`mask-size: N00%`), la banda de fundido debe caber
  dentro de esa fracción para que reposo y final sean 100% transparente/opaco — con `N=3` y una
  banda de 20 puntos porcentuales quedaba corta y el fotograma final terminaba con la cabeza del
  trazo a ~75% de opacidad; con `N=4` deja margen. Detalle en el comentario de
  `BrushStroke.module.css`.

## 5. Impacto arquitectónico — primer Client Component del proyecto

Este es el punto que más se aparta del estado actual del código y debe quedar explícito, no
enterrado en la implementación:

- `IntersectionObserver` es una API de navegador, por lo que `BrushStroke` necesita
  `"use client"`. Hoy el proyecto tiene **cero** Client Components, y tanto `CLAUDE.md` como
  `architecture.md` tratan eso como una decisión consciente ("el app aún tiene cero
  `use client` después de i18n"), no un accidente que haya que preservar a toda costa.
- Mitigación: el `"use client"` se aplica en la hoja (`BrushStroke` mismo), nunca en `Hero` ni en
  ningún contenedor — `Hero` y el resto de la página siguen siendo Server Components, siguiendo
  la regla de "empujar la frontera de cliente lo más abajo posible".
- **No** obliga a introducir `NextIntlClientProvider`: el componente es puramente decorativo, no
  consume el catálogo de mensajes. El provider sigue postergado hasta que exista el primer
  Client Component que sí necesite traducir texto.
- Compatible con la rama de export estático (`architecture.md` §8): es JavaScript que corre en
  el cliente, no una feature server-only (no usa Route Handlers, `cookies()`/`headers()`, etc.).

## 6. Ubicación y contrato del componente

- `src/shared/components/BrushStroke.tsx` + `src/shared/components/BrushStroke.module.css`. Va
  en `shared/` porque se reutiliza entre features, y las features nunca se importan entre sí.
- El componente es dueño de **forma + animación** únicamente; el consumidor le pasa una
  `className` para definir tamaño y posición desde su propio CSS Module — evita props de
  medidas arbitrarias y respeta la regla de "sin valores literales sueltos, todo vía tokens".
- Props opcionales sugeridas:
  - `delay?: number` — milisegundos de espera antes de iniciar el pintado (por defecto ~1000ms).
  - `threshold?: number` — umbral de visibilidad que pasa al `IntersectionObserver` para
    considerar "entró en viewport".

## 7. Accesibilidad

- Elemento puramente decorativo: `aria-hidden="true"` y, si se usa `<img>`/`next/image`,
  `alt=""`.
- `prefers-reduced-motion: reduce` → se muestra directamente el estado final (mancha completa,
  sin animar) y **no** se vuelve a disparar en cada scroll. No es opcional: repetir una
  animación en cada cruce de scroll es exactamente el caso de uso para el que existe esta media
  query.

## 8. Dependencias y deuda previa

- `ia-docs/global/styles.md` **no tiene tokens de motion** (duración/easing) todavía. Por la
  regla de `CLAUDE.md` ("si un valor no existe como token, se agrega primero a `styles.md`, no
  se inventa en CSS"), antes de escribir el `.module.css` de `BrushStroke` hay que añadir a
  §7.2 tokens como `--duration-*` y `--ease-*`.
- El asset PNG (sección 3) es un bloqueante externo: sin él no se puede implementar ni probar
  visualmente el componente.

## 9. Fuera de alcance

- Variantes de forma/trazo distintas (solo se cubre el trazo grande de la captura del hero).
- Cambiar el color o gradiente del trazo por variante.
- Controlar la dirección en la que "pinta" la brocha invisible.
- Sincronizar el avance de la animación con la posición del scroll (aquí el scroll solo
  dispara el inicio/reinicio; no controla el progreso cuadro a cuadro).

## 10. Criterios de aceptación

- [x] Existe `public/images/brush-stroke-large.png` con canal alfa, recortado a su bounding box.
- [x] `styles.md` §7.2 incluye tokens de duración/easing antes de que exista CSS que los use.
- [ ] `BrushStroke` se puede montar en `Hero` y en al menos otra sección variando solo tamaño y
      posición vía `className`, sin tocar el componente en sí. **Deferido a propósito**: en esta
      entrega el usuario pidió montarlo solo en el `Hero` — la laptop y el mockup de app llegan
      después, delante del `BrushStroke`, en el mismo `.visual`. El componente ya cumple el
      contrato (tamaño/posición 100% vía `className`, sin props de medidas), así que montarlo en
      una segunda sección cuando corresponda no debería requerir tocarlo.
- [x] Al cargar la página con el Hero visible, la mancha se pinta ~1s después del load. Verificado
      por inspección de código (el `setTimeout(delay)` con `delay` por defecto 1000 en
      `BrushStroke.tsx`) y del CSS compilado servido por `next dev` (la regla `@keyframes paint` y
      la clase `.isVisible` llegan al navegador correctamente). No se pudo verificar con captura
      de pantalla real: este entorno no tiene `chromium-cli`/Playwright instalados ni la extensión
      de Chrome conectada, y `osascript` no tiene permiso de Accesibilidad para automatizar
      Safari. Recomendado: una pasada visual manual (`npm run dev` + los pasos de la sección
      "Verificación" del plan) antes de dar esto por definitivamente cerrado.
- [x] Al hacer scroll hasta perder el Hero de vista por completo y volver a subir, la animación se
      repite desde cero — verificado por inspección de la lógica del observer (rearma solo en
      `!entry.isIntersecting`), no por captura visual (mismas limitaciones del punto anterior).
- [x] Scrolls parciales/erráticos que no sacan el componente completamente de pantalla no
      reinician ni cortan la animación a medias — verificado por inspección de la lógica del
      observer (un cruce parcial del umbral no entra en ninguna de las dos ramas que tocan
      `paintTimer`/`isVisible`), no por captura visual.
- [x] Con `prefers-reduced-motion: reduce` activo, la mancha aparece completa de inmediato, sin
      animación ni repetición por scroll — verificado en el CSS compilado: el bloque
      `@media (prefers-reduced-motion: reduce)` llega al navegador con `mask-image: none` y
      `animation: none`.
- [x] `Hero` y `HomePage` siguen siendo Server Components; el único `"use client"` nuevo es
      `BrushStroke` — `npm run build` confirma `/es` y `/en` como SSG (●), no dinámicas.
- [x] `npm run build:export` sigue funcionando sin errores tras agregar el componente.
