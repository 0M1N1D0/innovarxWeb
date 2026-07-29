import Link from "next/link";
import { useTranslations } from "next-intl";
import { NAV_ITEMS } from "@/shared/lib/nav-items";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const t = useTranslations("siteFooter");
  const tCommon = useTranslations("common");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {/* Sobre fondo oscuro: "Innov" pasa a blanco, "Arx" conserva el gradiente — styles.md §6 */}
          <p className={styles.wordmark}>
            Innov<span className={styles.wordmarkAccent}>Arx</span>
          </p>
          <p className={styles.tagline}>{tCommon("brand.tagline")}</p>
        </div>
        <nav aria-label={t("linksLabel")}>
          <ul className={styles.links}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{tCommon(`nav.${item.key}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* TODO: reemplazar por los datos de contacto reales de InnovArx — no traducir,
            son marcadores pendientes de dato real, no copy. */}
        <address className={styles.contact}>
          <p>[correo de contacto pendiente]</p>
          <p>[teléfono / WhatsApp pendiente]</p>
        </address>
      </div>
      <p className={styles.copyright}>{t("copyright", { year: String(year) })}</p>
    </footer>
  );
}
