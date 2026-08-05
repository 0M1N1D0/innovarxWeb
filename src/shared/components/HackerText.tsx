"use client";

import { useEffect, useState } from "react";
import { useViewportCycle } from "@/shared/hooks/useViewportCycle";
import { cssTimeToMs } from "@/shared/lib/cssTime";
import { buildRevealRanks, randomLetter, DEFAULT_ALPHABET } from "@/shared/lib/scramble";
import styles from "./HackerText.module.css";

interface HackerTextProps {
  /** Texto a revelar. Se resuelve por el Server Component consumidor (ej. `useTranslations`
   * en `Hero`) y llega ya traducido — este componente nunca importa el catálogo de mensajes. */
  text: string;
  /** Clase para el estilo visual del texto (tipografía, color, layout) — este componente no
   * impone ninguno, solo anima el contenido. */
  className?: string;
  /** Duración total del ciclo en ms. Default: lee `--duration-hacker-text` del nodo. */
  duration?: number;
  /** Cadencia de re-tirada de letras en ms. Default: lee `--interval-hacker-text` del nodo. */
  interval?: number;
  /** Alfabeto del revoltijo. Default `DEFAULT_ALPHABET` (A–Z mayúsculas). */
  alphabet?: string;
  /** Milisegundos de espera tras entrar en viewport antes de arrancar el ciclo. */
  delay?: number;
  /** Umbral de visibilidad del `IntersectionObserver` para considerar "entró en viewport". */
  threshold?: number;
}

// "hacker-text-animation" (ia-docs/global/styles.md): revoltijo de letras que se van
// fijando en orden aleatorio hasta revelar `text` — mecánica clásica de "scramble text": un
// contador `iteration` avanza una fracción por tick, y cada posición se fija en cuanto su
// turno barajado (`buildRevealRanks`) queda por debajo del contador. Generalización de
// `HeroEyebrow` (spec 003) — mismo mecanismo, ahora con `text`, duración, intervalo y
// alfabeto como parámetros en vez de estar implícitos en el eyebrow del Hero.
//
// Disparo/re-disparo vía `useViewportCycle`, compartido con `ImageAnimation`.
export function HackerText({
  text,
  className,
  duration: durationProp,
  interval: intervalProp,
  alphabet = DEFAULT_ALPHABET,
  delay = 0,
  threshold = 0.35,
}: HackerTextProps) {
  const { ref, active } = useViewportCycle<HTMLSpanElement>({ delay, threshold });
  // Nace con `text` completo (estado de reposo = frase legible, sin salto de hidratación).
  // El estado vive en esta hoja — sus re-renders no alcanzan al árbol del consumidor.
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    // Con reduced-motion el estado de reposo ya es `text` resuelto — el efecto ni siquiera
    // arranca, así que no hay nada que revertir.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Los tokens se leen del propio nodo en vez de duplicarse como constantes en TS —
    // salvo que el consumidor pase un override explícito por prop. `cssTimeToMs` (no
    // `parseFloat` directo) porque el minificador sirve estos tokens normalizados a
    // segundos ("2500ms" → "2.5s") — ver impl-003.md §12.
    const computed = getComputedStyle(el);
    const duration =
      durationProp ?? cssTimeToMs(computed.getPropertyValue("--duration-hacker-text"), 2500);
    const interval =
      intervalProp ?? cssTimeToMs(computed.getPropertyValue("--interval-hacker-text"), 60);
    const ranks = buildRevealRanks(text);
    const total = ranks.reduce((count, rank) => (rank >= 0 ? count + 1 : count), 0);
    if (total === 0) return;

    // Incremento por tick: `iteration` debe recorrer los `total` turnos exactamente en
    // `duration` ms, a razón de un tick cada `interval` ms.
    const step = total / (duration / interval);
    let iteration = 0;

    const timer = setInterval(() => {
      iteration += step;
      setDisplayedText(
        text
          .split("")
          .map((char, i) =>
            char === " " || (ranks[i] ?? -1) < iteration ? char : randomLetter(alphabet),
          )
          .join(""),
      );

      if (iteration >= total) {
        clearInterval(timer);
        setDisplayedText(text); // cierre exacto — nunca queda una tirada de más
      }
    }, interval);

    return () => {
      clearInterval(timer);
      // Si el ciclo se corta a mitad (rearme por salida de viewport), nada queda colgado
      // en una letra aleatoria.
      setDisplayedText(text);
    };
  }, [active, text, ref, alphabet, durationProp, intervalProp]);

  return (
    <span ref={ref} className={className}>
      <span className={styles.srOnly}>{text}</span>
      {/* `aria-hidden` porque el nombre accesible real lo aporta el span .srOnly de
          arriba, que nunca se anima. */}
      <span aria-hidden="true">{displayedText}</span>
    </span>
  );
}
