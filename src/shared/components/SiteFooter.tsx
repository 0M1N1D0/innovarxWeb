import Link from "next/link";
import styles from "./SiteFooter.module.css";

const FOOTER_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {/* Sobre fondo oscuro: "Innov" pasa a blanco, "Arx" conserva el gradiente — styles.md §6 */}
          <p className={styles.wordmark}>
            Innov<span className={styles.wordmarkAccent}>Arx</span>
          </p>
          <p className={styles.tagline}>
            Desarrollo web a medida, de landing page a plataforma completa.
          </p>
        </div>
        <nav aria-label="Enlaces del sitio">
          <ul className={styles.links}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* TODO: reemplazar por los datos de contacto reales de InnovArx */}
        <address className={styles.contact}>
          <p>[correo de contacto pendiente]</p>
          <p>[teléfono / WhatsApp pendiente]</p>
        </address>
      </div>
      <p className={styles.copyright}>© {year} InnovArx. Todos los derechos reservados.</p>
    </footer>
  );
}
