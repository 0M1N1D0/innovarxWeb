import type messages from "@/messages/es.json";
import type { routing } from "@/i18n/routing";

// Augmenta el módulo `next-intl` para que `useTranslations`/`getTranslations` tipen
// contra las claves reales del catálogo. `es.json` es el catálogo canónico (ver
// tech-stack.md §2): una clave que falte en `en.json` no la detecta `tsc`, solo el
// aviso en consola de next-intl en desarrollo.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
