import { Button } from "@/shared/components/Button";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <div className={styles.cta}>
      <h2 className={styles.title}>¿Listo para empezar tu proyecto?</h2>
      <p className={styles.subcopy}>
        Transformemos tu idea en una solución digital que haga crecer tu negocio.
      </p>
      <div className={styles.actions}>
        {/* TODO: enlazar al canal de contacto real (mailto, WhatsApp o formulario)
            cuando se implemente la feature `contact` — ver architecture.md §6. */}
        <Button href="#" variant="ghost">
          Cotizar mi proyecto →
        </Button>
      </div>
    </div>
  );
}
