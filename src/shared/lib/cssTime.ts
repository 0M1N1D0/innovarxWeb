// Parser de valores CSS <time> (ms/s) leídos vía `getComputedStyle` en runtime.
//
// Existe porque `parseFloat` a secas sobre un token de tiempo es un bug latente, no una
// elección de estilo: el minificador de CSS (Lightning CSS, vía Turbopack) normaliza las
// unidades de tiempo al valor más corto — `3500ms` se sirve al navegador como `3.5s`. Un
// consumidor que hace `parseFloat("3.5s")` obtiene `3.5`, no `3500`; el token cambió de
// unidad sin que el código lo supiera. Todo consumo de un token de tiempo desde JS debe
// pasar por acá (ver ia-docs/global/styles.md §5.4).
//
// Verificado contra los valores reales servidos por el dev server: "3.5s" → 3500,
// "60ms" → 60, ".15s" → 150, "1s" → 1000.
export function cssTimeToMs(value: string, fallback: number): number {
  const trimmed = value.trim();
  const amount = parseFloat(trimmed);
  // `amount <= 0` cubre el otro modo de fallo silencioso: un `0` (o un valor no parseable,
  // que da NaN) produciría una división por cero en cualquier cálculo de `duration/interval`
  // río abajo — el mismo síntoma ("nada se anima") que este helper existe para prevenir.
  if (!Number.isFinite(amount) || amount <= 0) return fallback;
  // "ms" se comprueba primero: toda unidad de milisegundos termina también en "s".
  if (trimmed.endsWith("ms")) return amount;
  if (trimmed.endsWith("s")) return amount * 1000;
  return fallback; // sin unidad no es un <time> válido en CSS
}
