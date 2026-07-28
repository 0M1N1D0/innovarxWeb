import type { ServiceLevel } from "../types/service-level";
import styles from "./ServiceLevelCard.module.css";

interface ServiceLevelCardProps {
  serviceLevel: ServiceLevel;
}

export function ServiceLevelCard({ serviceLevel }: ServiceLevelCardProps) {
  return (
    <li className={styles.card}>
      {serviceLevel.popular && <span className={styles.badge}>Popular</span>}
      <span className={styles.level}>
        Nivel {String(serviceLevel.level).padStart(2, "0")} / 05
      </span>
      <h3 className={styles.name}>{serviceLevel.name}</h3>
      <p className={styles.description}>{serviceLevel.description}</p>
      <p className={styles.delivery}>Entrega: {serviceLevel.deliveryTime}</p>
    </li>
  );
}
