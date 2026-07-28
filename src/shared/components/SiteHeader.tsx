import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import styles from "./SiteHeader.module.css";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Proceso" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink} aria-label="InnovArx — inicio">
          <Image src="/logo-innovarx.jpg" alt="InnovArx" width={160} height={80} priority />
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button href="#contacto" variant="primary">
          Cotizar proyecto →
        </Button>
      </div>
    </header>
  );
}
