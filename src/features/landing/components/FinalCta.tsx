import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/Button";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  const t = useTranslations("landing.finalCta");

  return (
    <div className={styles.cta}>
      <h2 className={styles.title}>{t("title")}</h2>
      <p className={styles.subcopy}>{t("subcopy")}</p>
      <div className={styles.actions}>
        {/* TODO: enlazar al canal de contacto real (mailto, WhatsApp o formulario)
            cuando se implemente la feature `contact` — ver architecture.md §6. */}
        <Button href="#" variant="ghost">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
