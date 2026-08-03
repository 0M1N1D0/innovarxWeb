// Default histórico de spec 003 (RNF "alfabeto del revoltijo"): mayúsculas A–Z, sin
// dígitos/símbolos, coherente con `text-transform: uppercase` del eyebrow original.
// `HackerText` (componente reutilizable, spec 003 generalizada) lo expone como prop
// `alphabet` opcional — este export es tanto el valor por defecto como la referencia para
// cualquier otro consumidor que quiera reproducirlo.
export const DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Letra aleatoria de `alphabet` (default A–Z mayúsculas, ver `DEFAULT_ALPHABET`). */
export function randomLetter(alphabet: string = DEFAULT_ALPHABET): string {
  const index = Math.floor(Math.random() * alphabet.length);
  return alphabet.charAt(index);
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
