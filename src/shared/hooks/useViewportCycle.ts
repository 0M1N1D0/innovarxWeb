"use client";

import { useEffect, useRef, useState } from "react";

interface UseViewportCycleOptions {
  /** Milisegundos de espera antes de activar tras entrar en viewport. */
  delay?: number;
  /** Umbral de visibilidad del IntersectionObserver para considerar "entró en viewport". */
  threshold?: number;
}

interface UseViewportCycleResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  active: boolean;
}

// Extraído de BrushStroke.tsx (spec 001 RF-2/RF-3/RF-4): histéresis de dos umbrales sobre
// IntersectionObserver para disparar/re-disparar un ciclo de animación sin parpadeo en
// scrolls parciales o erráticos. `BrushStroke` y `HeroEyebrow` (spec 003) lo comparten —
// primer archivo de `shared/hooks/`, carpeta ya prevista en architecture.md §3.
export function useViewportCycle<T extends HTMLElement>({
  delay = 0,
  threshold = 0.35,
}: UseViewportCycleOptions = {}): UseViewportCycleResult<T> {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // prefers-reduced-motion: la garantía real vive en el CSS/JS de cada consumidor, que
    // muestra el estado final sin animar pase lo que pase con esta clase. Este
    // short-circuit solo evita observar de más.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Vía histéresis con dos umbrales:
    // - Entra (>= threshold) y no está activo todavía → arranca el timer de `delay`.
    // - Sale por completo (ratio 0 / !isIntersecting) → se rearma para repetir el ciclo.
    // Un cruce parcial del umbral no dispara ni rearma nada — evita parpadeos en
    // scrolls cortos/erráticos.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (timer) return;
          timer = setTimeout(() => {
            setActive(true);
            timer = undefined;
          }, delay);
        } else if (!entry.isIntersecting) {
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          setActive(false);
        }
      },
      { threshold: [0, threshold] },
    );

    observer.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, threshold]);

  return { ref, active };
}
