import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Sin proxy/middleware, el prefijo es obligatorio en ambos locales y la detección
  // por navegador queda desactivada — decisión explícita, ver
  // ia-docs/global/architecture.md §6/§8. `localeDetection`/`localeCookie` normalmente
  // los consulta el middleware; se dejan explícitos aquí como documentación de intento,
  // aunque sin middleware no hay nada que los lea.
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});

// Mapeo a los códigos que espera Open Graph (og:locale). Vive junto a la lista de
// locales para que añadir un idioma falle en compilación si falta su código OG.
export const OG_LOCALES = {
  es: "es_MX",
  en: "en_US",
} as const satisfies Record<(typeof routing.locales)[number], string>;
