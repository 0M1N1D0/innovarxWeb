import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/shared/lib/nav-items";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const locale = useLocale();
  const t = useTranslations("siteHeader");
  const tCommon = useTranslations("common");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* `next/link` normal con href construido a mano, no el `Link` de
            @/i18n/navigation: ese `Link` es un Client Component (llama a `useLocale()`
            de `use-intl` vía Context) y exigiría `NextIntlClientProvider` — ver
            src/i18n/navigation.ts. */}
        <NextLink href={`/${locale}`} className={styles.logoLink} aria-label={t("logoLabel")}>
          <Image src="/logo-innovarx.jpg" alt="InnovArx" width={160} height={80} priority />
        </NextLink>
        <nav className={styles.nav} aria-label={t("navLabel")}>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NextLink href={item.href}>{tCommon(`nav.${item.key}`)}</NextLink>
              </li>
            ))}
          </ul>
        </nav>
        <LocaleSwitcher />
        <Button href="#contacto" variant="primary">
          {tCommon("cta.quoteProject")}
        </Button>
      </div>
    </header>
  );
}
