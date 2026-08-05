import Image from "next/image";
import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/shared/lib/nav-items";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const locale = useLocale();
  const t = useTranslations("siteHeader");
  const tCommon = useTranslations("common");
  const links = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: tCommon(`nav.${item.key}`),
  }));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* `next/link` normal con href construido a mano, no el `Link` de
            @/i18n/navigation: ese `Link` es un Client Component (llama a `useLocale()`
            de `use-intl` vía Context) y exigiría `NextIntlClientProvider` — ver
            src/i18n/navigation.ts. */}
        <NextLink href={`/${locale}`} className={styles.logoLink} aria-label={t("logoLabel")}>
          <Image
            src="/images/logo-innovarx.jpg"
            alt="InnovArx"
            fill
            sizes="(min-width: 768px) 120px, 30vw"
            className={styles.logoImage}
          />
        </NextLink>
        <nav className={styles.nav} aria-label={t("navLabel")}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <NextLink href={link.href}>{link.label}</NextLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.desktopActions}>
          <LocaleSwitcher />
          <Button href="#contacto" variant="primary">
            {tCommon("cta.quoteProject")}
          </Button>
        </div>
        <div className={styles.mobileActions}>
          <LocaleSwitcher />
          <MobileNav
            links={links}
            localeSwitcher={<LocaleSwitcher />}
            cta={
              <Button href="#contacto" variant="primary">
                {tCommon("cta.quoteProject")}
              </Button>
            }
            navLabel={t("navLabel")}
            openLabel={t("mobileNav.open")}
            closeLabel={t("mobileNav.close")}
          />
        </div>
      </div>
    </header>
  );
}
