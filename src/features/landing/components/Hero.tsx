import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import { HackerText } from "@/shared/components/HackerText";
import { HeroVisual } from "./HeroVisual";
import styles from "./Hero.module.css";

export function Hero() {
  const t = useTranslations("landing.hero");
  const tCommon = useTranslations("common");

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <HackerText text={t("eyebrow")} className={styles.eyebrow} />
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
      </div>
      <HeroVisual />
    </div>
  );
}
