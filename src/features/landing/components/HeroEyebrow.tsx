"use client";

import { useEffect, useState } from "react";
import { useViewportCycle } from "@/shared/hooks/useViewportCycle";
import { cssTimeToMs } from "@/shared/lib/cssTime";
import { buildRevealRanks, randomLetter } from "@/shared/lib/scramble";
import styles from "./HeroEyebrow.module.css";

interface HeroEyebrowProps {
  text: string;
}

// Client Component hoja (spec 003): revoltijo de letras A–Z que se van fijando en orden
// aleatorio hasta resolver `text` — mecánica clásica de "scramble text": un contador
// `iteration` avanza una fracción por tick, y cada posición se fija en cuanto su turno
// barajado queda por debajo del contador. El disparo/re-disparo reutiliza
// `useViewportCycle` (mismo mecanismo que BrushStroke) para arrancar en simultáneo con el
// ciclo del Hero.
//
// `text` llega por prop ya resuelto por `Hero` (Server Component, vía useTranslations) —
// este componente nunca importa next-intl ni el catálogo de mensajes, lo que mantiene
// `NextIntlClientProvider` fuera del proyecto (ver architecture.md §5).
export function HeroEyebrow({ text }: HeroEyebrowProps) {
  const { ref, active } = useViewportCycle<HTMLSpanElement>({ threshold: 0.35 });
  // Nace con `text` completo (RF-8: sin texto roto antes de hidratar, ni en el estado de
  // reposo). El estado vive en esta hoja — sus re-renders no alcanzan al árbol del Hero.
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    // RF §5: con reduced-motion el estado de reposo ya es `text` resuelto — el efecto ni
    // siquiera arranca, así que no hay nada que revertir.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // Los tokens se leen del propio nodo en vez de duplicarse como constantes en TS:
    // duplicar un valor de CSS en un timer de JS crea una segunda fuente de verdad que
    // se desincroniza en silencio si el token cambia (ya pasó una vez con
    // --duration-brush, ver impl-003.md §4 paso 5). `cssTimeToMs` (no `parseFloat` directo)
    // porque el minificador sirve estos tokens normalizados a segundos ("3500ms" →
    // "3.5s") — ver impl-003.md §12.
    const computed = getComputedStyle(el);
    const duration = cssTimeToMs(computed.getPropertyValue("--duration-scramble"), 3500);
    const interval = cssTimeToMs(computed.getPropertyValue("--interval-scramble"), 60);
    const ranks = buildRevealRanks(text);
    const total = ranks.reduce((count, rank) => (rank >= 0 ? count + 1 : count), 0);
    if (total === 0) return;

    // Incremento por tick: `iteration` debe recorrer los `total` turnos exactamente en
    // `duration` ms, a razón de un tick cada `interval` ms — equivalente al `1/3` fijo del
    // efecto "scramble text" clásico, pero derivado del texto/tokens en vez de hardcodeado.
    const step = total / (duration / interval);
    let iteration = 0;

    const timer = setInterval(() => {
      iteration += step;
      setDisplayedText(
        text
          .split("")
          .map((char, i) => (char === " " || (ranks[i] ?? -1) < iteration ? char : randomLetter()))
          .join(""),
      );

      if (iteration >= total) {
        clearInterval(timer);
        setDisplayedText(text); // cierre exacto — nunca queda una tirada de más
      }
    }, interval);

    return () => {
      clearInterval(timer);
      // RF-8: si el ciclo se corta a mitad (rearme por salida de viewport), nada queda
      // colgado en una letra aleatoria.
      setDisplayedText(text);
    };
  }, [active, text, ref]);

  return (
    <span ref={ref} className={styles.eyebrow}>
      <span className={styles.srOnly}>{text}</span>
      {/* `aria-hidden` porque el nombre accesible real lo aporta el span .srOnly de
          arriba, que nunca se anima. */}
      <span aria-hidden="true">{displayedText}</span>
    </span>
  );
}
