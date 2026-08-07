import type { ServiceLevel } from "../types/service-level";
import styles from "./ServiceLevelSteps.module.css";

interface ServiceLevelStepsProps {
  serviceLevels: ServiceLevel[];
}

/**
 * Riel decorativo de progreso (01–05) que se alinea sobre la grilla de tarjetas desde `lg`.
 * `aria-hidden`: duplica visualmente el `levelIndicator` que cada `ServiceLevelCard` ya
 * anuncia ("Nivel 01 / 05"), así que no aporta información nueva a lectores de pantalla.
 * Bajo 1024px se oculta por completo (ver ServiceLevelSteps.module.css) porque las tarjetas
 * dejan de estar en 5 columnas y los círculos ya no pueden alinearse con ellas.
 */
export function ServiceLevelSteps({ serviceLevels }: ServiceLevelStepsProps) {
  return (
    <ol className={styles.steps} aria-hidden="true">
      {serviceLevels.map((serviceLevel) => (
        <li key={serviceLevel.id} className={styles.step}>
          <span className={styles.number}>{String(serviceLevel.level).padStart(2, "0")}</span>
        </li>
      ))}
    </ol>
  );
}
