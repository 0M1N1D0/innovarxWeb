"use client";

import { useState } from "react";
import { ImageAnimation } from "@/shared/components/ImageAnimation";
import styles from "./HeroVisual.module.css";

// Hoja cliente de la columna visual del Hero (spec 002). La frontera "use client" no sube —
// `Hero` y `HomePage` siguen siendo Server Components, solo importan y renderizan este
// componente.
//
// Orquesta las tres capas de `image-animation` (ia-docs/global/styles.md): la brocha se
// auto-observa (modo no controlado) y avisa por `onRevealChange` cuándo arranca su pintado;
// laptop y dashboard están en modo controlado (`active={painting}`) para entrar en
// simultáneo con la brocha (RF-2 rev. de spec 002), escalonados entre sí vía `--delay-
// stagger` (RF-3) en el prop `delay` de cada uno.
export function HeroVisual() {
  const [painting, setPainting] = useState(false);

  return (
    <div className={styles.visual}>
      <ImageAnimation
        src="/images/brush-stroke-large.png"
        alt=""
        width={1200}
        height={486}
        direction="diagonal"
        duration="var(--duration-brush)"
        className={styles.brush}
        onRevealChange={setPainting}
      />
      <ImageAnimation
        src="/images/laptop-hero.png"
        alt=""
        width={1000}
        height={784}
        priority
        direction="left-to-right"
        fade
        duration="var(--duration-image-animation)"
        delay="var(--delay-laptop)"
        className={styles.laptop}
        active={painting}
      />
      <ImageAnimation
        src="/images/app-dashboard-hero.png"
        alt=""
        width={293}
        height={595}
        direction="top-to-bottom"
        fade
        duration="var(--duration-image-animation)"
        delay="calc(var(--delay-laptop) + var(--delay-stagger))"
        className={styles.dashboard}
        active={painting}
      />
    </div>
  );
}
