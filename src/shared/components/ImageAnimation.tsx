"use client";

import Image from "next/image";
import { useEffect, type CSSProperties } from "react";
import { useViewportCycle } from "@/shared/hooks/useViewportCycle";
import styles from "./ImageAnimation.module.css";

type Direction = "diagonal" | "left-to-right" | "top-to-bottom";

const DIRECTION_CLASS: Record<Direction, string> = {
  diagonal: styles.diagonal ?? "",
  "left-to-right": styles.leftToRight ?? "",
  "top-to-bottom": styles.topToBottom ?? "",
};

interface ImageAnimationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  /** Tamaño/posición del consumidor (el componente no impone ninguno). */
  className?: string;
  /** Ángulo y eje del barrido de máscara — sin default sensato, siempre explícito. */
  direction: Direction;
  /** Si además del barrido, la imagen entra con un `translateY` de `--space-3` a `0`. */
  fade?: boolean;
  /** Valor/expresión CSS (`"3500ms"`, `"var(--duration-brush)"`, `calc(...)`). Se asigna
   * directo a `animation-duration` — no se parsea en JS, es una animación CSS pura. */
  duration?: string;
  /** Valor/expresión CSS para `animation-delay`, mismo criterio que `duration`. */
  delay?: string;
  /** Modo controlado: si se pasa (incluso `false`), el componente no observa su propio
   * viewport — reacciona solo a este valor. Sin este prop, se auto-observa. */
  active?: boolean;
  /** Notifica cuándo arranca/rearma el ciclo, controlado o no. */
  onRevealChange?: (active: boolean) => void;
  /** Umbral del observer — solo aplica en modo no controlado. */
  threshold?: number;
}

// "image-animation" (ia-docs/global/styles.md): barrido de máscara + revelado opcional con
// desplazamiento de entrada. Generaliza dos variantes hoy separadas: el "pintado" diagonal
// de `BrushStroke` (spec 001, solo barrido) y el revelado de laptop/dashboard del Hero
// (spec 002, barrido + `translateY`) — una sola animación parametrizada por `direction` y
// `fade`.
//
// Modo no controlado (default): se auto-observa vía `useViewportCycle` y arranca sola al
// entrar en viewport (como hacía `BrushStroke`). Modo controlado (`active` explícito): no
// instala observer propio (`useViewportCycle({ enabled: false })`) — un padre le pasa el
// estado, como `HeroVisual` encadena laptop/dashboard al arranque de la brocha.
export function ImageAnimation({
  src,
  alt,
  width,
  height,
  priority,
  className,
  direction,
  fade = false,
  duration,
  delay,
  active,
  onRevealChange,
  threshold = 0.35,
}: ImageAnimationProps) {
  const isControlled = active !== undefined;
  const { ref, active: cycleActive } = useViewportCycle<HTMLSpanElement>({
    threshold,
    enabled: !isControlled,
  });
  const resolvedActive = isControlled ? active : cycleActive;

  useEffect(() => {
    onRevealChange?.(resolvedActive);
  }, [resolvedActive, onRevealChange]);

  const style: CSSProperties = {};
  if (duration) style.animationDuration = duration;
  if (delay) style.animationDelay = delay;

  return (
    <span ref={ref} aria-hidden="true" className={`${styles.wrapper} ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={style}
        className={[
          styles.image,
          DIRECTION_CLASS[direction],
          fade ? styles.fade : "",
          resolvedActive ? styles.isActive : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </span>
  );
}
