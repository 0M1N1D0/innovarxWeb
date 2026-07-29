import type { Locale } from "next-intl";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { routing } from "@/i18n/routing";
import styles from "./LocaleSwitcher.module.css";

// Etiqueta visible de cada idioma, siempre en su propio idioma (nunca traducida): un
// usuario que no lee español debe poder reconocer "EN" sin depender del locale activo.
const LOCALE_LABELS: Record<Locale, string> = { es: "ES", en: "EN" };

// Server Component a propósito (ver architecture.md §5): dos <Link> sin estado ni
// efectos no necesitan "use client". `useLocale` (de "next-intl", no de
// "@/i18n/navigation") funciona síncronamente en el servidor. El sitio entero
// conserva cero componentes cliente.
//
// Se usa `next/link` con href construido a mano (`/${locale}`) en vez del `Link` de
// @/i18n/navigation: ese `Link` es un Client Component (BaseLink llama a
// `useLocale()` de `use-intl` vía Context) y exigiría `NextIntlClientProvider`, que
// el proyecto omite a propósito — ver src/i18n/navigation.ts.
//
// TODO: cuando existan rutas más allá de "/" (servicios, contacto), este componente
// pasa a "use client" y usa `usePathname()` de @/i18n/navigation para conservar la
// ruta activa al cambiar de idioma — hoy "/" es la única página, así que no hace falta.
export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const t = useTranslations("localeSwitcher");

  return (
    <nav className={styles.switcher} aria-label={t("label")}>
      <ul className={styles.list}>
        {routing.locales.map((locale) => (
          <li key={locale}>
            <NextLink
              href={`/${locale}`}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === activeLocale ? "true" : undefined}
              className={
                locale === activeLocale ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {LOCALE_LABELS[locale]}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
