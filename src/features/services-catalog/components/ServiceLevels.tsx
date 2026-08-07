import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getServiceLevels } from "../services/service-levels.service";
import { ServiceLevelCard } from "./ServiceLevelCard";
import { ServiceLevelSteps } from "./ServiceLevelSteps";
import styles from "./ServiceLevels.module.css";

interface ServiceLevelsProps {
  locale: Locale;
}

export async function ServiceLevels({ locale }: ServiceLevelsProps) {
  const [t, serviceLevels] = await Promise.all([
    getTranslations({ locale, namespace: "servicesCatalog" }),
    getServiceLevels(locale),
  ]);

  return (
    <div className={styles.wrapper}>
      <p className={styles.eyebrow}>{t("eyebrow")}</p>
      {/* servicesCatalog.title deletrea el conteo ("Cinco niveles"/"Five levels") a mano
          en cada idioma — ICU no puede deletrear números. Si se añade un sexto nivel,
          el titular de ambos catálogos se actualiza a mano. */}
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.intro}>{t("intro")}</p>
      <ServiceLevelSteps serviceLevels={serviceLevels} />
      <ul className={styles.grid}>
        {serviceLevels.map((serviceLevel) => (
          <ServiceLevelCard
            key={serviceLevel.id}
            serviceLevel={serviceLevel}
            total={serviceLevels.length}
          />
        ))}
      </ul>
    </div>
  );
}
