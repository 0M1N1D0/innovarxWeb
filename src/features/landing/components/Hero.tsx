import { Button } from "@/shared/components/Button";
import styles from "./Hero.module.css";

const TRUST_ITEMS = [
  { title: "Seguridad", description: "SSL, backups y mejores prácticas." },
  { title: "Rendimiento", description: "Sitios rápidos y optimizados." },
  { title: "Soporte", description: "Acompañamiento continuo." },
];

export function Hero() {
  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>Desarrollo web a medida</p>
      <h1 className={styles.title}>
        Desarrollo web <span className={styles.accent}>a medida</span>, de landing page a
        plataforma completa.
      </h1>
      <p className={styles.subcopy}>
        Creamos experiencias digitales rápidas, seguras y escalables que convierten visitantes en
        clientes.
      </p>
      <div className={styles.actions}>
        <Button href="#servicios" variant="primary">
          Ver servicios →
        </Button>
        <Button href="#contacto" variant="secondary">
          Cotizar proyecto →
        </Button>
      </div>
      <ul className={styles.trust}>
        {TRUST_ITEMS.map((item) => (
          <li key={item.title}>
            <p className={styles.trustTitle}>{item.title}</p>
            <p className={styles.trustDescription}>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
