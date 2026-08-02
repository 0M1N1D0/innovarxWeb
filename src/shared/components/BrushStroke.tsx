"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./BrushStroke.module.css";

interface BrushStrokeProps {
  className?: string;
  /** Milisegundos de espera antes de iniciar el pintado (RF-2). */
  delay?: number;
  /** Umbral de visibilidad del IntersectionObserver para considerar "entró en viewport". */
  threshold?: number;
  /**
   * Notifica cuando el pintado arranca (`true`) o cuando el ciclo se rearma al
   * salir del viewport (`false`) — ver spec 002 RF-2/RF-5. Opcional: los
   * consumidores que no encadenan nada a la brocha no la necesitan.
   */
  onPaintingChange?: (painting: boolean) => void;
}

// Primer y único "use client" del proyecto (ver architecture.md §5). Vive en la hoja: Hero y
// HomePage siguen siendo Server Components, solo importan y renderizan este componente.
//
// Puramente decorativo (RF-1): tamaño y posición son responsabilidad del consumidor vía
// `className` — este componente no expone props de medidas.
export function BrushStroke({
  className,
  delay = 0,
  threshold = 0.35,
  onPaintingChange,
}: BrushStrokeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // prefers-reduced-motion: la garantía real vive en el CSS (@media en
    // BrushStroke.module.css), que muestra el trazo completo sin animar pase lo que
    // pase con esta clase. Este short-circuit solo evita observar de más.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let paintTimer: ReturnType<typeof setTimeout> | undefined;

    // RF-3/RF-4 vía histéresis con dos umbrales:
    // - Entra (>= threshold) y no está pintado todavía → arranca el timer de `delay`.
    // - Sale por completo (ratio 0 / !isIntersecting) → se rearma para repetir el ciclo.
    // Un cruce parcial del umbral no dispara ni rearma nada — evita parpadeos en
    // scrolls cortos/erráticos.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (paintTimer) return;
          paintTimer = setTimeout(() => {
            setIsVisible(true);
            // Spec 002 RF-2 (rev.): el consumidor se engancha al arranque del
            // pintado, no a su fin — laptop/dashboard entran en simultáneo con
            // la brocha en vez de esperar a que termine.
            onPaintingChange?.(true);
            paintTimer = undefined;
          }, delay);
        } else if (!entry.isIntersecting) {
          if (paintTimer) {
            clearTimeout(paintTimer);
            paintTimer = undefined;
          }
          setIsVisible(false);
          // Rearme del ciclo (spec 002 RF-5): avisa al consumidor que ya no
          // hay pintado vigente, para que también reponga su propio estado.
          onPaintingChange?.(false);
        }
      },
      { threshold: [0, threshold] },
    );

    observer.observe(el);

    return () => {
      if (paintTimer) clearTimeout(paintTimer);
      observer.disconnect();
    };
  }, [delay, threshold, onPaintingChange]);

  return (
    <span ref={ref} aria-hidden="true" className={`${styles.wrapper} ${className ?? ""}`}>
      <Image
        src="/images/brush-stroke-large.png"
        alt=""
        width={1200}
        height={486}
        priority
        className={`${styles.stroke} ${isVisible ? styles.isVisible : ""}`}
      />
    </span>
  );
}
