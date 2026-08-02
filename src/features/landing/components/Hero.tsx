import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroVisual } from "./HeroVisual";
import styles from "./Hero.module.css";

// Solo los IDs quedan en código: el orden y la existencia de los tres bloques es
// estructura, no copy. El texto vive en messages/<locale>.json → landing.hero.trust.
const TRUST_ITEM_IDS = ["security", "performance", "support"] as const;

export function Hero() {
  const t = useTranslations("landing.hero");
  const tCommon = useTranslations("common");

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <HeroEyebrow text={t("eyebrow")} />
          {t.rich("title", {
            accent: (chunks) => <span className={styles.accent}>{chunks}</span>,
          })}
        </h1>
        <p className={styles.subcopy}>{t("subcopy")}</p>
        <div className={styles.actions}>
          <Button href="#servicios" variant="primary">
            {t("ctaServices")}
          </Button>
          <Button href="#contacto" variant="secondary">
            {tCommon("cta.quoteProject")}
          </Button>
        </div>
        <ul className={styles.trust}>
          {TRUST_ITEM_IDS.map((id) => (
            <li key={id}>
              <p className={styles.trustTitle}>{t(`trust.${id}.title`)}</p>
              <p className={styles.trustDescription}>{t(`trust.${id}.description`)}</p>
            </li>
          ))}
        </ul>
      </div>
      <HeroVisual />
    </div>
  );
}
