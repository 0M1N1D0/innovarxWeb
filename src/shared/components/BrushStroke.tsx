"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useViewportCycle } from "@/shared/hooks/useViewportCycle";
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

// Primer "use client" del proyecto (ver architecture.md §5). Vive en la hoja: Hero y
// HomePage siguen siendo Server Components, solo importan y renderizan este componente.
// El observer de viewport vive en `useViewportCycle` (shared/hooks), compartido con
// `HeroEyebrow` (spec 003).
//
// Puramente decorativo (RF-1): tamaño y posición son responsabilidad del consumidor vía
// `className` — este componente no expone props de medidas.
export function BrushStroke({
  className,
  delay = 0,
  threshold = 0.35,
  onPaintingChange,
}: BrushStrokeProps) {
  const { ref, active } = useViewportCycle<HTMLSpanElement>({ delay, threshold });

  // Spec 002 RF-2 (rev.)/RF-5: el consumidor se engancha al arranque del pintado
  // (`active=true`), no a su fin, y se entera del rearme del ciclo (`active=false`)
  // cuando el componente vuelve a salir del viewport por completo.
  useEffect(() => {
    onPaintingChange?.(active);
  }, [active, onPaintingChange]);

  return (
    <span ref={ref} aria-hidden="true" className={`${styles.wrapper} ${className ?? ""}`}>
      <Image
        src="/images/brush-stroke-large.png"
        alt=""
        width={1200}
        height={486}
        priority
        className={`${styles.stroke} ${active ? styles.isVisible : ""}`}
      />
    </span>
  );
}
