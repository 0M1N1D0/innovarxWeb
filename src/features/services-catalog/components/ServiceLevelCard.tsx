import { useTranslations } from "next-intl";
import type { ServiceLevel } from "../types/service-level";
import styles from "./ServiceLevelCard.module.css";

interface ServiceLevelCardProps {
  serviceLevel: ServiceLevel;
  total: number;
}

export function ServiceLevelCard({ serviceLevel, total }: ServiceLevelCardProps) {
  const t = useTranslations("servicesCatalog.card");
  const { min, max, unit } = serviceLevel.deliveryTime;
  const delivery =
    unit === "weeks" ? t("deliveryWeeks", { min, max }) : t("deliveryMonths", { min, max });

  return (
    <li className={styles.card}>
      {serviceLevel.popular && <span className={styles.badge}>{t("popular")}</span>}
      <span className={styles.level}>
        {t("levelIndicator", {
          current: String(serviceLevel.level).padStart(2, "0"),
          total: String(total).padStart(2, "0"),
        })}
      </span>
      <h3 className={styles.name}>{serviceLevel.name}</h3>
      <p className={styles.description}>{serviceLevel.description}</p>
      <p className={styles.delivery}>{delivery}</p>
    </li>
  );
}
