export type DeliveryUnit = "weeks" | "months";

/**
 * Rango de entrega estructurado. Deliberadamente NO es un string preformateado como
 * "1 – 2 semanas": eso mete rango, guion y sustantivo flexionado en un solo blob que
 * ningún otro idioma puede reutilizar. El formato es responsabilidad de la vista
 * (ver ServiceLevelCard, que resuelve el mensaje según `unit`).
 */
export interface DeliveryTime {
  min: number;
  max: number;
  unit: DeliveryUnit;
}

export interface ServiceLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  deliveryTime: DeliveryTime;
  popular?: boolean;
}
