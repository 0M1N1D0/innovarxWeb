const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Letra mayúscula A–Z aleatoria (req-003 RNF "alfabeto del revoltijo"). */
export function randomLetter(): string {
  const index = Math.floor(Math.random() * ALPHABET.length);
  return ALPHABET.charAt(index);
}

// Barajado por clave aleatoria (Schwartzian transform) en vez de Fisher–Yates in-place:
// con `noUncheckedIndexedAccess` activo (tsconfig.json), un swap indexado tipa
// `number | undefined` en cada acceso y exige aserciones no-null. Ordenar por una clave
// aleatoria da la misma distribución uniforme sin acceso indexado.
export function shuffledIndices(count: number): number[] {
  return Array.from({ length: count }, (_, index) => ({ index, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ index }) => index);
}

/**
 * Para cada posición de `text` que no sea whitespace (RF-4), asigna un **turno** entero
 * `0..N-1` (barajado, RF-2) — no un instante en ms. El componente compara cada turno
 * contra un contador `iteration` que avanza una fracción por tick (mecánica clásica de
 * "scramble text"): en cuanto `rank < iteration`, esa posición queda fija (RF-3) y deja de
 * recibir `randomLetter()`. Como los turnos cubren `0..N-1` uniformemente, los fijados se
 * reparten en todo el ciclo — no hay ventana inicial "muda" como en el plan anterior
 * (`buildRevealPlan`, basado en instantes en ms con una ventana de asentamiento al final;
 * ver impl-003.md §11 para por qué se abandonó). Los índices de whitespace quedan en `-1`,
 * así que `rank < iteration` es `true` desde `iteration = 0` sin rama especial.
 */
export function buildRevealRanks(text: string): number[] {
  const revealableIndices: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    if (!/\s/.test(text.charAt(i))) revealableIndices.push(i);
  }

  const order = shuffledIndices(revealableIndices.length);
  const rankByIndex = new Map<number, number>();
  order.forEach((position, rank) => {
    const originalIndex = revealableIndices[position];
    if (originalIndex === undefined) return;
    rankByIndex.set(originalIndex, rank);
  });

  return Array.from({ length: text.length }, (_, i) => rankByIndex.get(i) ?? -1);
}
