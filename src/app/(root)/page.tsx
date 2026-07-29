import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

// Fallback visible si el meta-refresh de layout.tsx está bloqueado (algunos lectores
// de pantalla, políticas corporativas). Sin CSS propio a propósito: no hay nada que
// tokenizar en una página que nadie debería ver normalmente.
//
// Los dos textos van hardcodeados a propósito: esta página no tiene locale, no puede
// usar el catálogo de mensajes de next-intl (ver architecture.md §6).
export default function RootPage() {
  return (
    <ul>
      {routing.locales.map((locale) => (
        <li key={locale}>
          <a href={`/${locale}`} hrefLang={locale} lang={locale}>
            {locale === "es" ? "Ir al sitio en español" : "Go to the English site"}
          </a>
        </li>
      ))}
    </ul>
  );
}
