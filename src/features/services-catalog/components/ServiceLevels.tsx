import { getServiceLevels } from "../services/service-levels.service";
import { ServiceLevelCard } from "./ServiceLevelCard";
import styles from "./ServiceLevels.module.css";

export async function ServiceLevels() {
  const serviceLevels = await getServiceLevels();

  return (
    <div className={styles.wrapper}>
      <p className={styles.eyebrow}>Nuestros servicios</p>
      <h2 className={styles.title}>Cinco niveles para cada etapa de tu proyecto</h2>
      <p className={styles.intro}>
        Cada nivel incluye todo lo del anterior. Elige el punto de partida según el alcance de tu
        proyecto — siempre puedes escalar más adelante.
      </p>
      <ul className={styles.grid}>
        {serviceLevels.map((serviceLevel) => (
          <ServiceLevelCard key={serviceLevel.id} serviceLevel={serviceLevel} />
        ))}
      </ul>
    </div>
  );
}
