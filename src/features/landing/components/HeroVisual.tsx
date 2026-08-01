"use client";

import Image from "next/image";
import { useState } from "react";
import { BrushStroke } from "@/shared/components/BrushStroke";
import styles from "./HeroVisual.module.css";

// Hoja cliente de la columna visual del Hero (spec 002). Reemplaza al bloque
// que antes montaba `BrushStroke` directo dentro de `Hero`: la frontera
// "use client" no sube — `Hero` y `HomePage` siguen siendo Server Components,
// solo importan y renderizan este componente.
//
// Orquesta las tres capas por delante de la brocha: laptop y dashboard
// arrancan su entrada únicamente cuando `BrushStroke` termina de pintarse
// (RF-2), escalonadas vía `--delay-stagger` en CSS (RF-3).
export function HeroVisual() {
  const [painted, setPainted] = useState(false);

  return (
    <div className={styles.visual}>
      <BrushStroke className={styles.brush} onPaintedChange={setPainted} />
      <Image
        src="/images/laptop-hero.png"
        alt=""
        aria-hidden="true"
        width={1400}
        height={1098}
        className={`${styles.laptop} ${painted ? styles.isRevealed : ""}`}
      />
      <Image
        src="/images/app-dashboard-hero.png"
        alt=""
        aria-hidden="true"
        width={293}
        height={595}
        className={`${styles.dashboard} ${painted ? styles.isRevealed : ""}`}
      />
    </div>
  );
}
