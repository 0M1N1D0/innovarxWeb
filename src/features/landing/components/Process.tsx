import { useTranslations } from "next-intl";
import styles from "./Process.module.css";

// Solo los IDs y el orden quedan en código; el texto vive en
// messages/<locale>.json → landing.process.steps. El número visible ("01", "02"...)
// es presentación, se deriva del índice — no vive en el catálogo.
const STEP_IDS = ["quote", "proposal", "delivery"] as const;

export function Process() {
  const t = useTranslations("landing.process");

  return (
    <div className={styles.process}>
      <p className={styles.eyebrow}>{t("eyebrow")}</p>
      <h2 className={styles.title}>{t("title")}</h2>
      <ol className={styles.steps}>
        {STEP_IDS.map((id, index) => (
          <li key={id} className={styles.step}>
            <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={styles.stepTitle}>{t(`steps.${id}.title`)}</h3>
            <p className={styles.stepDescription}>{t(`steps.${id}.description`)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
