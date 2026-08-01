import { useTranslations } from "next-intl";
import { BrushStroke } from "@/shared/components/BrushStroke";
import { Button } from "@/shared/components/Button";
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
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 className={styles.title}>
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
      {/* Contexto de apilamiento para la columna visual: la laptop y el mockup de app
          (próxima entrega) se montan aquí, después del BrushStroke, para quedar por
          delante — ver ia-docs/specs/001-brush-animated-large/requirements.md. */}
      <div className={styles.visual}>
        <BrushStroke className={styles.brush} />
      </div>
    </div>
  );
}
